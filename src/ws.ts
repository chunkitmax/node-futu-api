import './utils/object';

import Assert from 'assert';
import ByteBuffer from 'bytebuffer';
import L from 'loglevel';
import Ws from 'ws';

import { FutuConfig } from './futu';
import Proto from './proto/proto';
import ProtoId from './proto/protoid.json';
import PushEmitter from './push_emitter';
import { valueof } from './types/ts';
import { FutuProto, FutuResponse, FutuRet, OnPushListener, WsApiCmd } from './types/types';
import { FutuError, ParameterError, SystemError, TimeoutError } from './utils/error';
import InitPromise from './utils/init_promise';
import { ProtoName } from './utils/proto';

// follow official code but doc does not mention this
const HeadSign = "ft-v1.0\0"
const HeadLength = 44


export default class WebSocket extends PushEmitter {

  private ws: Ws & {
    sendCmd: (id: number, buffer: Uint8Array) => Promise<ArrayBuffer>
  }

  private locks: {
    [reqId: number]: undefined|((err?: Error, data?: FutuRet) => void)
  } = {}

  private onPushListeners: {
    [cmd: number]: undefined|{
      [stock: string]: OnPushListener<any>[]
    }
  } = {}

  private connID: number|Long|undefined
  private header: Proto.Trd_Common.ITrdHeader|undefined

  private reconnectTimer: NodeJS.Timeout|undefined
  private isLoggedIn = false
  private exitFlag = false

  private reqId = 1

  private initPromise: InitPromise

  constructor(private config: FutuConfig) {
    super()
    this.ws = this.setup()
    process.on('exit', () => { this.exitFlag = true; this.clean() })
    process.on('SIGINT', () => { this.exitFlag = true; this.clean() })
    process.on('SIGTERM', () => { this.exitFlag = true; this.clean() })
    this.initPromise = new InitPromise()
  }

  protected get ready() {
    return this.initPromise.isReady
  }

  protected addOnPushListener<T>(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    security: Proto.Qot_Common.Security,
    listener: OnPushListener<T>
  ) {
    let cmd: valueof<typeof ProtoId> = -1
    if (typeof cmdOrName === 'string') {
      if (Proto[cmdOrName]) {
        cmd = ProtoId[cmdOrName] as number
      } else if (!isNaN(parseInt(cmdOrName))) {
        cmd = parseInt(cmdOrName)
      } else {
        throw new ParameterError('Invalid cmd')
      }
    } else if (ProtoName[cmdOrName]) {
      cmd = cmdOrName
    } else {
      throw new ParameterError('Invalid cmd')
    }
    if (!this.onPushListeners[cmd]) {
      this.onPushListeners[cmd] = {
        [`${security.code}|${security.market}`]: [listener]
      }
    } else if (!this.onPushListeners[cmd]![`${security.code}|${security.market}`]) {
      this.onPushListeners[cmd]![`${security.code}|${security.market}`] = [listener]
    } else {
      this.onPushListeners[cmd]
    }
  }

  private setup() {
    if (this.ws) {
      // @ts-ignore
      this.ws.onopen = this.ws.onmessage = this.ws.onerror = this.ws.onclose = null
    }
    this.ws = <any>new Ws(
      `${this.config.isSSL? 'wss' : 'ws'}://${this.config.ip}:${this.config.port}`
    )
    this.ws.sendCmd = this.sendCmd.bind(this)
    this.ws.onopen = this.onOpen.bind(this)
    this.ws.onmessage = this.releaseLock.bind(this)
    this.ws.onerror = this.onError.bind(this)
    this.ws.onclose = this.onClose.bind(this)
    this.reconnectTimer = undefined
    return this.ws
  }

  public close() {
    this.exitFlag = true
    this.clean()
  }

  private sendCmd(cmd: number, buffer: Uint8Array): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reqId = ++this.reqId
      // will it cause performance issues?
      let timeoutTimer = setTimeout(() => {
        delete this.locks[reqId]
        return reject(new TimeoutError('Timeout'))
      }, this.config.reqTimeout)
      this.ws.send(this.pack(cmd, reqId, buffer).toArrayBuffer(), err => {
        if (!this.locks[reqId]) {
          if (err) return reject(err)
          const lock = (err?: Error, data?: FutuRet) => {
            if (timeoutTimer) clearTimeout(timeoutTimer)
            if (err) return reject(err)
            if (!data) {
              return reject(new FutuError('Return obj is undeifned'))
            } else if (data.error !== 0) {
              return reject(new FutuError(data.errMsg))
            } else if (data.sign.indexOf(HeadSign) === -1) {
              return reject(new FutuError('Wrong Header Flag'))
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
      throw new SystemError('Connection is not ready yet')
    }
  }

  private async _request(name: keyof (typeof ProtoId), req?: any): Promise<any> {
    const proto = Proto[name] as unknown as FutuProto
    Assert.ok(!proto.Request || req, 'Request obj is required')
    if (proto.Request) {
      if (proto.C2S) {
        const errMsg = proto.C2S.verify(req)
        if (errMsg) throw new ParameterError(errMsg)
      } else {
        throw new ParameterError('Cannot get C2S class by this name')
      }
      const buffer = proto.Request.encode({
              c2s: req
            }).finish(),
            response = await this.ws.sendCmd(ProtoId[name], buffer),
            retObj = <any>proto.Response!.decode(new Uint8Array(response)) as FutuResponse
      if (retObj.errCode === 0 && retObj.retType !== -1) {
        return retObj.s2c
      } else {
        throw new FutuError(retObj.retMsg)
      }
    }
    throw new ParameterError('Cannot get request class by this name')
  }

  private async onOpen(_: Ws.OpenEvent) {
    if (this.ws) {
      this.clean(false)
      let keyMD5 = undefined
      if (this.config.wsKey) {
        keyMD5 = this.config.wsKey
      }
      try {
        await this._request('InitWebSocket', {
          websocketKey: keyMD5
        } as Proto.InitWebSocket.IC2S)
        // unlock trade features
        await this._request('Trd_UnlockTrade', {
          pwdMD5: this.config.pwdMd5,
          unlock: true
        } as Proto.Trd_UnlockTrade.IC2S)
        // find account
        const { accList } = (await this._request('Trd_GetAccList', {
          userID: this.config.userID
        } as Proto.Trd_GetAccList.IC2S) as Proto.Trd_GetAccList.IS2C)
        if (!accList || accList.length === 0) throw new SystemError('Cannot get acc list')
        const matchedAcc = accList.find(acc =>
          acc.trdEnv === this.config.accEnv! &&
          acc.trdMarketAuthList!.includes(this.config.accMarket!) &&
          acc.accType === this.config.accType!
        )
        if (!matchedAcc) throw new SystemError('No matched account')
        // prepare header
        this.header = {
          trdEnv: this.config.accEnv!,
          accID: matchedAcc.accID,
          trdMarket: this.config.accMarket!
        }
        const { connID, qotLogined, trdLogined } = (await this._request('GetGlobalState', {
          userID: this.config.userID
        } as Proto.GetGlobalState.IC2S)) as Proto.GetGlobalState.IS2C
        if (!connID) throw new SystemError('Cannot get connID')
        this.connID = connID
        this.isLoggedIn = qotLogined && trdLogined
        if (!this.isLoggedIn) throw new SystemError('Either API for Quote and Trade is not permitted')
        await this.initPromise.resolve()
        L.info('Finish initialization')
      } catch (err) {
        L.error(err)
        this.exitFlag = true
        this.clean()
        // won't reconnect
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

  private _onPush(res: FutuRet) {
    const proto = Proto[ProtoName[res.cmd]] as unknown as FutuProto
    if (proto.Response) {
      const retObj = <any>proto.Response!.decode(new Uint8Array(res.data)) as FutuResponse
      if (retObj.errCode === 0 && retObj.retType !== -1) {
        return super.onPush(res.cmd, retObj.s2c)
      } else {
        throw new FutuError(retObj.retMsg)
      }
    } else {
      L.warn('Cannot decode this received msg', res)
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
      } else { // Push
        this._onPush(ret)
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
    const closeError = new SystemError('Closing websocket connection')
    Object.values(this.locks).forEach(lock => lock!(closeError))
    this.locks = []
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }
    if (super.emitter) {
      super.emitter.removeAllListeners()
    }
    if (close) {
      this.initPromise.reset()
      try {
        this.ws.close()
      } catch (e) {}
    }
    this.isLoggedIn = false
  }

}