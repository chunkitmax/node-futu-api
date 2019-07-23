import HexSha1 from 'hex-sha1'
import Net from 'net'
import * as $protobuf from 'protobufjs'

import * as Proto from './proto/proto'
import ProtoName2Id from './proto/protoid.json'

const ProtoId2Name: { [key: number]: string } = {}
Object.entries(ProtoName2Id as Object).forEach(([k, v]) => {
  ProtoId2Name[v] = k
})

let id = 1

export default class Socket {
  
  private ip: string
  private port: number
  private id: number
  private name: string
  private requestId: number

  private isConnected: boolean
  private isHandStopped: boolean

  private root: { [key: string]: any }

  private cacheResponseCallback: { [key: number]: (buffer: $protobuf.Reader|Uint8Array) => any }
  private cacheNotifyCallback: { [key: number]: (protoId: number) => any }

  private header: { [key: string]: string|number|Buffer|any } | null

  private reconnectTimer: NodeJS.Timeout|undefined

  private socket: Net.Socket
  private recvBuffer: Buffer

  private initPromise: Promise<void>|undefined

  constructor(ip: string, port: number) {
    this.ip = ip
    this.port = port
    this.id = id++
    this.name = `Socket(${this.id})`
    this.isConnected = false
    this.requestId = 1000
    this.isHandStopped = false
    this.root = Proto

    this.cacheResponseCallback = {}
    this.cacheNotifyCallback = {}
    this.header = null
    this.recvBuffer = Buffer.allocUnsafe(0)

    this.socket = new Net.Socket()
    this.socket.setTimeout(1000*30)
    this.socket.setKeepAlive(true)
      this.socket.on('error', (data) => {
      console.error(`${this.name} on error: ${data}`)
      this.socket.destroy()
      this.isConnected = false
    })
    this.socket.on('timeout', (e: any) => {
      console.error(`${this.name} on timeout.`, e)
      this.socket.destroy()
      this.isConnected = false
    })
    this.socket.on('close', () => {
      if (this.isHandStopped) return
      const errMsg = `${this.name} on closed and retry connect on 5 seconds.`
      console.error(errMsg)
      this.isConnected = false
      // 5s後重連
      if (this.reconnectTimer) return
      this.reconnectTimer = setTimeout(() => {
        this.init()
      }, 5000)
    })
    this.socket.on('data', (data) => {
      this.recvBuffer = Buffer.concat([this.recvBuffer, data])
      this.parseData()
    })

    this.init()
  }

  public async init(): Promise<void> {
    if (this.isConnected || this.initPromise !== undefined) {
      return
    }
    this.initPromise = this.connect()
    console.info('socket inited')
  }

  public waitForInit(): Promise<void> {
    return this.initPromise!
  }

  private async connect(): Promise<void> {
    this.isHandStopped = false
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = undefined
    }
    await new Promise(resolve => {
      this.socket.connect({
        port: this.port,
        host: this.ip
      })
      this.isConnected = true
      resolve()
    })
  }

  public async close() {
    if (!this.isHandStopped) {
      this.socket.end()
      this.socket.destroy()
      this.isHandStopped = true
      console.info('手動關閉 socket 。')
    }
  }

  public subNotify(protoId: number, callback: (protoId: number) => any) {
    this.cacheNotifyCallback[protoId] = callback
  }
  public unsubNotify(protoId: number) {
    this.cacheNotifyCallback[protoId]
  }

  public async send(protoName: string, msg: any): Promise<any|null> {
    if (!this.isConnected) {
      console.warn(`${this.name} 尚未連接，無法發送請求。`)
      return null
    }
    const protoId = (ProtoName2Id as any)[protoName] as number
    if (!protoId) {
      console.warn(`找不到對應的協議Id:${protoName}`)
      return null
    }
    // 請求序列號，自增
    if (this.requestId > 1000000) {
      this.requestId = 1000
    }
    const requestId = this.requestId++

    const request = this.root[protoName].Request
    const response = this.root[protoName].Response

    // 處理請求數據
    const reqBuffer = request.encode(request.create({
      c2s: msg,
    })).finish()
    const sha1 = HexSha1(reqBuffer)
    const sha1Buffer = new Uint8Array(20).map((_, index) => Number(`0x${sha1.substr(index * 2, 2)}`))
    console.debug('Request:')
    console.group()
    console.debug(`${protoName}(${protoId}) ${requestId}`)
    console.time(`${protoName}(${protoId}) ${requestId}`) // TODO: 
    console.groupEnd()
    const buffer = Buffer.concat([
      Buffer.from('FT'), // 包頭起始標志，固定為「FT」
      Buffer.from(new Uint32Array([protoId]).buffer), // 協議ID
      Buffer.from(new Uint8Array([0]).buffer), // 協議格式類型，0為Protobuf格式，1為Json格式
      Buffer.from(new Uint8Array([0]).buffer), // 協議版本，用於迭代兼容, 目前填0
      Buffer.from(new Uint32Array([requestId]).buffer), // 包序列號，用於對應請求包和回包, 要求遞增
      Buffer.from(new Uint32Array([reqBuffer.length]).buffer), // 包體長度
      Buffer.from(sha1Buffer.buffer), // 包體原始數據(解密後)的SHA1哈希值
      Buffer.from(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]).buffer), // 保留8字節擴展
      reqBuffer,
    ])
    // 發送請求，處理回調
    this.socket.write(buffer)
    return await new Promise((resolve, reject) => {
      this.cacheResponseCallback[requestId] = (responseBuffer) => {
        const result = response.decode(responseBuffer).toJSON()
        if (result.retType === 0) {
          return resolve(result.s2c)
        }
        const errMsg = `服務器返回結果失敗,request:${protoName}(${protoId}),retType:${result.retType},reqId:${requestId},errMsg:${result.retMsg}`
        console.error(errMsg)
        return reject(new Error(errMsg))
      }
    })
  }

  private parseData() {
    const headerLen = 44; // 包頭長度
    let bodyBuffer = null; // 包體buffer
    let bodyLen = 0; // 包體長度
    let reqId = null; // 請求序列號
    let protoId = null; // 請求協議Id
    let bodySha1 = null; // 包體sha1
    // 先處理包頭
    if (!this.header && this.recvBuffer.length >= headerLen) {
      let recvSha1 = new Array(21).join('0').split('').map((item, index) => {
        let str = this.recvBuffer.readUInt8(16 + index).toString(16)
        if (str.length === 1) str = `0${str}`
        return str
      })
      let recvSha1Str = recvSha1.join('')
      this.header = {
        // 包頭起始標志，固定為「FT」
        szHeaderFlag: String.fromCharCode(this.recvBuffer.readUInt8(0)) + String.fromCharCode(this.recvBuffer.readUInt8(1)),
        nProtoID: this.recvBuffer.readUInt32LE(2), // 協議ID
        nProtoFmtType: this.recvBuffer.readUInt8(6), // 協議格式類型，0為Protobuf格式，1為Json格式
        nProtoVer: this.recvBuffer.readUInt8(7), // 協議版本，用於迭代兼容
        nSerialNo: this.recvBuffer.readUInt32LE(8), // 包序列號
        nBodyLen: this.recvBuffer.readUInt32LE(12), // 包體長度
        arrBodySHA1: recvSha1Str, // 包體原數據(解密後)的SHA1哈希值
        arrReserved: this.recvBuffer.slice(36, 44), // 保留8字節擴展
      }
      if (this.header.szHeaderFlag !== 'FT') {
        throw new Error('接收的包頭數據格式錯誤')
      }

      console.debug(`Response: ${ProtoId2Name[this.header.nProtoID]}(${this.header.nProtoID}) ${this.header.nSerialNo}`)
      console.group()
      console.debug(`reqId:${this.header.nSerialNo}, bodyLen:${this.header.nBodyLen}`)
      console.timeEnd(`${ProtoId2Name[this.header.nProtoID]}(${this.header.nProtoID}) ${this.header.nSerialNo}`)
    }

    // 已經接收指定包體長度的全部數據，切割包體buffer
    if (this.header && this.recvBuffer.length >= this.header.nBodyLen + headerLen) {
      reqId = this.header.nSerialNo
      protoId = this.header.nProtoID
      bodyLen = this.header.nBodyLen
      bodySha1 = this.header.arrBodySHA1
      this.header = null

      bodyBuffer = this.recvBuffer.slice(44, bodyLen + headerLen)
      this.recvBuffer = this.recvBuffer.slice(bodyLen + headerLen)

      const sha1 = HexSha1(bodyBuffer)
      if (sha1 !== bodySha1) {
        throw new Error(`接收的包體sha1加密錯誤：${bodySha1},本地sha1：${sha1}`)
      }
      // 交給回調處理包體數據
      if (this.cacheResponseCallback[reqId]) {
        this.cacheResponseCallback[reqId](bodyBuffer)
        delete this.cacheResponseCallback[reqId]
      }
      // 通知模塊
      if (this.cacheNotifyCallback[protoId]) {
        try {
          // 加載proto協議文件
          const protoName = ProtoId2Name[protoId]
          const response = this.root[protoName].Response
          const result = response.decode(bodyBuffer).toJSON()
          this.cacheNotifyCallback[protoId](result.s2c)
        } catch (e) {
          const errMsg = `通知回調執行錯誤，response:${ProtoId2Name[protoId]}(${protoId}),reqId:${reqId},bodyLen:${bodyLen}，堆棧：${e.stack}`
          console.error(errMsg)
          throw new Error(errMsg)
        }
      }
      if (this.recvBuffer.length > headerLen) this.parseData()
    }
    console.groupEnd()
  }
}