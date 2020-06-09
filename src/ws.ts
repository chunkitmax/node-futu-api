import Ws from 'ws'
import { FutuConfig } from './Futu'
import Path from 'path'
import Fs from 'fs'
import Assert from 'assert'
import L from 'loglevel'
import Proto from './proto/proto'
import ProtoId from './proto/protoid.json'
import ProtoBuf, { Type, Writer, Message } from 'protobufjs'
import ByteBuffer from 'bytebuffer'

// follow official code but doc does not mention this
const HeadSign = "ft-v1.0\0"
const HeadLength = 44

type FutuProto = {
  C2S?: typeof Message
  S2C?: typeof Message
  Request?: typeof Message
  Response?: typeof Message
}

type FutuRet = {
  sign: string
  cmd: number
  section: number
  error: number
  errMsg: string
  data: ArrayBuffer
}

export default class WebSocket {

  private ws: Ws & {
    sendCmd: (id: number, buffer: Uint8Array) => Promise<ArrayBuffer>
  }

  private locks: {
    [reqId: number]: (err?: Error, data?: FutuRet) => void
  } = {}

  private reconnectTimer: NodeJS.Timeout|undefined
  private exitFlag = false

  private reqId = 0

  // TODO: handle push subscription

  constructor(private config: FutuConfig) {
    this.ws = this.setup()
    process.on('exit', () => { this.exitFlag = true; this.clean() })
    process.on('SIGINT', () => { this.exitFlag = true; this.clean() })
    process.on('SIGTERM', () => { this.exitFlag = true; this.clean() })
  }

  private clean() {
    const closeError = new Error('Is shutting down...')
    Object.values(this.locks).forEach(lock => lock(closeError))
    this.locks = []
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }
    try {
      this.ws.close()
    } finally {}
  }

  private setup() {
    if (this.ws) {
      // @ts-ignore
      this.ws.onopen = this.ws.onmessage = this.ws.onerror = this.ws.onclose = null
    }
    this.ws = (new Ws(`${this.config.isSSL? 'wss' : 'ws'}://${this.config.ip}:${this.config.port}`)) as any
    this.ws.sendCmd = this.sendCmd.bind(this)
    this.ws.onopen = this.onOpen
    this.ws.onmessage = this.releaseLock.bind(this)
    this.ws.onerror = this.onError
    this.ws.onclose = this.onClose
    this.reconnectTimer = undefined
    return this.ws
  }

  private sendCmd(id: number, buffer: Uint8Array): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reqId = ++this.reqId
      this.ws.send(this.pack(id, reqId, buffer), err => {
        if (err) return reject(err)
        // TODO: can setting many timeout cause performance issues?
        let timeoutTimer = setTimeout(() => {
          delete this.locks[reqId]
          return reject(new Error('Timeout'))
        }, this.config.reqTimeout)
        const lock = (err?: Error, data?: FutuRet) => {
          if (timeoutTimer) clearTimeout(timeoutTimer)
          if (err) return reject(err)
          // not sure what the errCode and errMsg would if error occurred
          //   header structure is different from the one on api doc
          if (!data) {
            return reject(new Error('Return obj is undeifned'))
          } else if (data.sign.indexOf(HeadSign) === -1) {
            return reject(new Error('Wrong Header Flag'))
          } else {
            return resolve(data.data)
          }
        }
        this.locks[reqId] = lock
      })
    })
  }

  private releaseLock(msg: Ws.MessageEvent) {
    const { data } = msg
    if (data && data instanceof ArrayBuffer) {
      const ret = this.unpack(data)
      if (ret) {
        this.locks[ret.section](undefined, ret)
      }
    }
  }

  private pack(id: number, requestId: number, payload: Uint8Array) {
    const buf = new ByteBuffer()
    buf.writeUTF8String(HeadSign)
    buf.writeUint32(id)
    buf.writeUint64(requestId)
    buf.append(payload)
    buf.flip()
    return buf
  }

  private unpack(data: ArrayBuffer) {
    if (data instanceof ArrayBuffer) {
      var buf = new ByteBuffer(data.byteLength, false)
      // @ts-ignore
      let result: FutuRet = {}
      buf.append(data)
      buf.flip()
      result.sign = buf.readUTF8String(8)
      result.cmd = buf.readUint32()
      result.section = buf.readUint64().toNumber()
      result.error = buf.readInt32()
      //https://github.com/nodejs/node/issues/4775
      result.errMsg = buf.readUTF8String(20).replace(/\0/g, '')
      if (data.byteLength > HeadLength) {
        result.data = buf.readBytes(data.byteLength - HeadLength).toArrayBuffer()
      }
      return result
    }
    return null
  }

  protected request(name: keyof (typeof ProtoId), req?: any): any {
    const proto = Proto[name] as unknown as FutuProto
    Assert.ok(!proto.Request || req, 'Request obj is required')
    if (proto.Request) {
      if (!proto.C2S || !proto.C2S.verify(req)) {
        throw new Error('Invalid request obj')
      }
      const request = req as Type,
            buffer = request.encode({
              c2s: req
            }).finish()
      this.ws.send(buffer)
    } else {
      this.ws
    }
  }

  private onOpen(e: Ws.OpenEvent) {
    if (this.ws) {
      // TODO: setup (e.g. InitConnect)
    }
  }

  private onError(e: Ws.ErrorEvent) {
    L.error('Error occured', e)
    if (!this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => this.setup(), 1000)
    }
  }

  private onClose(e: Ws.CloseEvent) {
    if (this.exitFlag) {
      L.warn('Websocket disconnected')
    } else {
      L.error('Websocket disconnected')
      if (!this.reconnectTimer) {
        this.reconnectTimer = setTimeout(() => this.setup(), 1000)
      }
    }
  }

}