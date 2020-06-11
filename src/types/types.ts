import { Message } from 'protobufjs';

export type FutuProto = {
  C2S?: typeof Message
  S2C?: typeof Message
  Request?: typeof Message
  Response?: typeof Message
}

export type FutuRet = {
  sign: string
  cmd: number
  section: number
  error: number
  errMsg: string
  data: ArrayBuffer
}

export type FutuRequest = {
  c2s: any
}

export type FutuResponse = {
  retType: number
  retMsg: string
  errCode: number
  s2c: any
}

export enum WsApiCmd {
  Init = 1,
  OpenDisConnect
}

export type OnPushListener<T> = (data: T) => Promise<void>|void|never