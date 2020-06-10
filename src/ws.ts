import Assert from 'assert';
import ByteBuffer from 'bytebuffer';
import Crypto from 'crypto';
import Fs from 'fs';
import L from 'loglevel';
import Path from 'path';
import ProtoBuf, { Message, Type, Writer } from 'protobufjs';
import { inspect } from 'util';
import Ws from 'ws';

import Futu, { FutuConfig } from './Futu';
import Proto from './proto/proto';
import ProtoId from './proto/protoid.json';

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

type FutuRequest = {
  c2s: any
}

type FutuResponse = {
  retType: number
  retMsg: string
  errCode: number
  s2c: any
}

enum WsApiCmd {
  Init = 1,
  OpenDisConnect
}

export default class WebSocket {

  private ws: Ws & {
    sendCmd: (id: number, buffer: Uint8Array) => Promise<ArrayBuffer>
  }

  private locks: {
    [reqId: number]: undefined|((err?: Error, data?: FutuRet) => void)
  } = {}

  private connID: number|Long|undefined
  private header: Proto.Trd_Common.ITrdHeader|undefined

  private reconnectTimer: NodeJS.Timeout|undefined
  private isLoggedIn = false
  private exitFlag = false

  private reqId = 1

  // TODO: handle push subscription

  constructor(private config: FutuConfig) {
    this.ws = this.setup()
    process.on('exit', () => { this.exitFlag = true; this.clean() })
    process.on('SIGINT', () => { this.exitFlag = true; this.clean() })
    process.on('SIGTERM', () => { this.exitFlag = true; this.clean() })
  }

  public get ready() {
    return this.isLoggedIn
  }

  private setup() {
    if (this.ws) {
      // @ts-ignore
      this.ws.onopen = this.ws.onmessage = this.ws.onerror = this.ws.onclose = null
    }
    this.ws = (new Ws(`${this.config.isSSL? 'wss' : 'ws'}://${this.config.ip}:${this.config.port}`)) as any
    this.ws.sendCmd = this.sendCmd.bind(this)
    this.ws.onopen = this.onOpen.bind(this)
    this.ws.onmessage = this.releaseLock.bind(this)
    this.ws.onerror = this.onError.bind(this)
    this.ws.onclose = this.onClose.bind(this)
    this.reconnectTimer = undefined
    return this.ws
  }

  private sendCmd(cmd: number, buffer: Uint8Array): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reqId = ++this.reqId
      // TODO: can setting many timeout cause performance issues?
      let timeoutTimer = setTimeout(() => {
        delete this.locks[reqId]
        return reject(new Error('Timeout'))
      }, this.config.reqTimeout)
      this.ws.send(this.pack(cmd, reqId, buffer).toArrayBuffer(), err => {
        if (!this.locks[reqId]) {
          if (err) return reject(err)
          const lock = (err?: Error, data?: FutuRet) => {
            if (timeoutTimer) clearTimeout(timeoutTimer)
            if (err) return reject(err)
            if (!data) {
              return reject(new Error('Return obj is undeifned'))
            } else if (data.error !== 0) {
              return reject(new Error(data.errMsg))
            } else if (data.sign.indexOf(HeadSign) === -1) {
              return reject(new Error('Wrong Header Flag'))
            } else {
              return resolve(data.data)
            }
          }
          this.locks[reqId] = lock
        }
      })
    })
  }

  protected request(name: keyof (typeof ProtoId), req?: any): Promise<any> {
    if (this.isLoggedIn) {
      const _req = Object.assign({}, req, {
        packetID: {
          connID: this.connID,
          serialNo: Date.now()
        } as Proto.Common.IPacketID,
        header: this.header,
        userID: this.config.userID
      })
      return this._request(name, _req)
    } else {
      throw new Error('Connection is not ready yet')
    }
  }

  private async _request(name: keyof (typeof ProtoId), req?: any): Promise<any> {
    const proto = Proto[name] as unknown as FutuProto
    Assert.ok(!proto.Request || req, 'Request obj is required')
    if (proto.Request) {
      if (proto.C2S) {
        const errMsg = proto.C2S.verify(req)
        if (errMsg) throw new Error(errMsg)
      } else {
        throw new Error('Invalid request obj')
      }
      const buffer = proto.Request.encode({
              c2s: req
            }).finish(),
            response = await this.ws.sendCmd(ProtoId[name], buffer)
      let retObj = proto.Response!.decode(new Uint8Array(response)) as any as FutuResponse
      if (retObj.errCode === 0 && retObj.retType !== -1) {
        return retObj.s2c
      } else {
        throw new Error(retObj.retMsg)
      }
    }
    throw new Error('Cannot send request to this api')
  }

  private async onOpen(e: Ws.OpenEvent) {
    if (this.ws) {
      this.clean(false)
      // TODO: setup (e.g. InitConnect)
      let keyMD5 = undefined
      if (this.config.wsKey) {
        // keyMD5 = Crypto.createHash('md5').update(this.config.wsKey).digest('hex')
        keyMD5 = this.config.wsKey
      }
      try {
        await this._request('InitWebSocket', {
          websocketKey: keyMD5
        } as Proto.InitWebSocket.IC2S)
        // TODO: useless (InitConnect on websocket causes api call failure afterwards)
        // get connID
        const { connID, keepAliveInterval } = (await this._request('InitConnect', {
          clientVer: 101,
          clientID: `client-${Date.now()%1000}`,
          recvNotify: this.config.recvNotify,
          pushProtoFmt: Proto.Common.ProtoFmt.ProtoFmt_Protobuf,
          packetEncAlgo: Proto.Common.PacketEncAlgo.PacketEncAlgo_None
        } as Proto.InitConnect.IC2S)) as Proto.InitConnect.IS2C
        this.connID = connID
        await new Promise(resolve => setTimeout(resolve, 2000))
        // unlock trade features
        await this._request('Trd_UnlockTrade', {
          pwdMD5: this.config.pwdMd5,
          unlock: true
        } as Proto.Trd_UnlockTrade.IC2S)
        // find account
        const { accList } = (await this._request('Trd_GetAccList', {
          userID: this.config.userID
        } as Proto.Trd_GetAccList.IC2S) as Proto.Trd_GetAccList.IS2C)
        if (!accList || accList.length === 0) throw new Error('Cannot get acc list')
        const matchedAcc = accList.find(acc =>
          acc.trdEnv === this.config.account.env! &&
          acc.trdMarketAuthList!.includes(this.config.account.market!) &&
          acc.accType === this.config.account.accType!
        )
        if (!matchedAcc) throw new Error('No matched account')
        // prepare header
        this.header = {
          trdEnv: this.config.account.env!,
          accID: matchedAcc.accID,
          trdMarket: this.config.account.market!
        }
        this.isLoggedIn = true
        L.info('Finish initialization')
      } catch (err) {
        L.error(err)
      }
    }
  }

  private onError(e: Ws.ErrorEvent) {
    if (this.exitFlag) {
      L.warn('Websocket disconnected')
    } else {
      L.error('Error occured', e)
      if (!this.reconnectTimer) {
        this.clean()
        this.reconnectTimer = setTimeout(() => this.setup(), 1000)
      }
    }
  }

  private onClose(_: Ws.CloseEvent) {
    if (this.exitFlag) {
      L.warn('Websocket disconnected')
    } else {
      L.error('Websocket disconnected')
      if (!this.reconnectTimer) {
        this.clean()
        this.reconnectTimer = setTimeout(() => this.setup(), 1000)
      }
    }
  }

  private releaseLock(msg: Ws.MessageEvent) {
    const { data } = msg
    if (data && data instanceof Buffer) {
      const ret = this.unpack(data)
      if (ret && ret.section && this.locks[ret.section]) {
        this.locks[ret.section]!(undefined, ret)
        delete this.locks[ret.section]
      } else if (ret.cmd === WsApiCmd.OpenDisConnect) {
        if (!this.exitFlag) {
          L.error('Disconnected (Cmd = 2)')
          if (!this.reconnectTimer) {
            this.clean()
            this.reconnectTimer = setTimeout(() => this.setup(), 1000)
          }
        }
      } else {
        console.log(inspect(ret, { depth: 3 }))
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

  private unpack(data: Buffer) {
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

  private clean(close=true) {
    const closeError = new Error('Closing websocket connection')
    Object.values(this.locks).forEach(lock => lock!(closeError))
    this.locks = []
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }
    if (close) {
      try {
        this.ws.close()
      } finally {}
    }
    this.isLoggedIn = false
  }

}