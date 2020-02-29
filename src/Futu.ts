import Assert from 'assert';

import * as Proto from './proto/proto';
import ProtoMethods from './ProtoMethods';
import Socket from './socket';

export { Proto }

const sleep = async (time: number) => new Promise(resolve =>
  setTimeout(resolve, time)
)

export interface FutuConfig {
  ip: string,
  port: number,
  userID: number,
  pwdMd5: string,
  market?: Proto.Trd_Common.TrdMarket,
  env?: Proto.Trd_Common.TrdEnv
}

export interface ConnectConfig {
  clientVer?: string|number,
  clientID?: string,
  recvNotify?: boolean
}

export default class Futu extends ProtoMethods {

  public userID: number
  public connID: number|Long|undefined
  public header: Proto.Trd_Common.ITrdHeader|undefined


  private market = Proto.Trd_Common.TrdMarket.TrdMarket_HK
  private env = Proto.Trd_Common.TrdEnv.TrdEnv_Real

  private initPromise: Promise<void>|undefined
  private pwdMd5: string

  private keepAliveTimer: NodeJS.Timeout|undefined
  private keepAliveInterval: number|undefined

  private connAESKey: string|undefined

  private protoReqTimestamps: { [key: string]: number[]|undefined } = {}

  // private socket: Socket

  constructor(config: FutuConfig, extendProtoName2Id: { [key: string]: number }={}) {
    super(new Socket(config.ip, config.port, extendProtoName2Id))

    this.market = config.market || this.market
    this.env = config.env || this.env

    this.userID = config.userID
    this.pwdMd5 = config.pwdMd5

    this.init()
  }

  private async init(): Promise<void> {
    if (this.initPromise) {
      return
    }
    this.initPromise = new Promise(async resolve => {
      await this.socket.waitForInit()
      await this._initConnect()
      console.info('initConnect finished')
      await this.execFreqGuard(30 * 1000, 10, 'trdUnlockTrade')
      await this.trdUnlockTrade({
        pwdMD5: this.pwdMd5,
        unlock: true
      })
      const accList = ((await this.trdGetAccList({
        userID: this.userID
      })).accList || []).filter(acc =>
        acc.trdMarketAuthList && acc.trdMarketAuthList.includes(this.market) &&
        acc.trdEnv === this.env
      )
      Assert(accList.length > 0)
      const { accID } = accList[0] // 獲取交易賬戶
      await this.setCommonTradeHeader(this.env, accID, this.market); // 設置為港股的真實環境
      resolve()
    })
  }

  public async waitForInit(): Promise<void> {
    Assert(this.initPromise)
    await this.initPromise
    console.info('futu inited')
  }

  public close() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer)
    }
    if (this.initPromise) {
      this.socket.close()
      this.initPromise = undefined
    }
  }

  private async _initConnect(_config?: ConnectConfig) {
    Proto.InitConnect.Request
    let config: ConnectConfig = {
      clientVer: 101,
      clientID: `client-${Date.now()%1000}`,
      recvNotify: true
    }
    if (_config) {
      config = Object.assign(config, _config)
    }
    if (typeof config.clientVer === 'string') {
      config.clientVer = config.clientVer.split('.')
        .map(parseInt)
        .reduce((a, v, i) => a += [100, 1][i]*v, 0)
    }
    await this.socket.waitForInit()
    const res = await this.socket.send(
      'InitConnect',
      config as Proto.InitConnect.IC2S
    ) as Proto.InitConnect.IS2C
    this.connID = res.connID
    this.connAESKey = res.connAESKey
    this.keepAliveInterval = res.keepAliveInterval
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer)
      this.keepAliveTimer = undefined
    }
    this.keepAliveTimer = setInterval(this._keepAlive.bind(this),
      1000*this.keepAliveInterval
    )
  }

  private setCommonTradeHeader(trdEnv = 1, accID: number|Long, trdMarket = 1) {
    this.market = trdMarket
    this.header = {
      trdEnv,
      accID,
      trdMarket
    }
  }

  private async execFreqGuard(
    interval: number,
    allowance: number,
    protoName: string
  ): Promise<void> {
    const execArray = this.protoReqTimestamps[protoName] || []
    const now = Date.now()
    while (execArray[0] && now - execArray[0] > interval) {
      execArray.shift()
    }
    if (execArray.length > allowance) {
      await sleep(interval - (now - execArray[0]))
    }
    execArray.push(Date.now())
    this.protoReqTimestamps[protoName] = execArray
    return
  }

  private async _keepAlive(): Promise<number> {
    const time = await this.socket.send('KeepAlive', {
      time: Math.round(Date.now() / 1000)
    })
    return time
  }
}