import EventEmitter from 'events';
import Long from 'long';

import { Proto } from './futu';
import ProtoId from './proto/protoid.json';
import { valueof } from './types/ts';
import { FutuRet, OnPushListener } from './types/types';
import { ParameterError } from './utils/error';
import { ProtoName } from './utils/proto';

export default class PushEmitter {

  protected emitter: EventEmitter

  constructor() {
    this.emitter = new EventEmitter()
  }

  public on<T extends object>(
    subType: Proto.Qot_Common.SubType,
    accID: number|Long,
    listener: OnPushListener<T>
  ): void
  public on<T extends object>(
    subType: Proto.Qot_Common.SubType,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<T>
  ): void
  public on(
    ...args: any[]
  ): void {
    if (args.length !== 3) throw new ParameterError('Should pass 3 arguments')
    const [subType, identity, listener] = args
    let cmd = PushEmitter.translateSubType(subType)
    if (typeof cmd === 'undefined') throw new ParameterError('Unknown SubType')
    this.emitter.on(
      (typeof identity === 'object' && Long.isLong(identity)
        ? PushEmitter.translateAccID
        : PushEmitter.translateSecurity)(cmd, identity),
      listener
    )
  }

  public addListener<T extends object>(
    subType: Proto.Qot_Common.SubType,
    accID: number|Long,
    listener: OnPushListener<T>
  ): void
  public addListener<T extends object>(
    subType: Proto.Qot_Common.SubType,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<T>
  ): void
  public addListener(
    ...args: any[]
  ): void {
    if (args.length !== 3) throw new ParameterError('Should pass 3 arguments')
    const [subType, identity, listener] = args
    let cmd = PushEmitter.translateSubType(subType)
    if (typeof cmd === 'undefined') throw new ParameterError('Unknown SubType')
    this.emitter.addListener(
      (typeof identity === 'object' && Long.isLong(identity)
        ? PushEmitter.translateAccID
        : PushEmitter.translateSecurity)(cmd, identity),
      listener
    )
  }

  public once<T extends object>(
    subType: Proto.Qot_Common.SubType,
    accID: number|Long,
    listener: OnPushListener<T>
  ): void
  public once<T extends object>(
    subType: Proto.Qot_Common.SubType,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<T>
  ): void
  public once(
    ...args: any[]
  ): void {
    if (args.length !== 3) throw new ParameterError('Should pass 3 arguments')
    const [subType, identity, listener] = args
    let cmd = PushEmitter.translateSubType(subType)
    if (typeof cmd === 'undefined') throw new ParameterError('Unknown SubType')
    this.emitter.once(
      (typeof identity === 'object' && Long.isLong(identity)
        ? PushEmitter.translateAccID
        : PushEmitter.translateSecurity)(cmd, identity),
      listener
    )
  }

  public prependListener<T extends object>(
    subType: Proto.Qot_Common.SubType,
    accID: number|Long,
    listener: OnPushListener<T>
  ): void
  public prependListener<T extends object>(
    subType: Proto.Qot_Common.SubType,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<T>
  ): void
  public prependListener(
    ...args: any[]
  ): void {
    if (args.length !== 3) throw new ParameterError('Should pass 3 arguments')
    const [subType, identity, listener] = args
    let cmd = PushEmitter.translateSubType(subType)
    if (typeof cmd === 'undefined') throw new ParameterError('Unknown SubType')
    this.emitter.prependListener(
      (typeof identity === 'object' && Long.isLong(identity)
        ? PushEmitter.translateAccID
        : PushEmitter.translateSecurity)(cmd, identity),
      listener
    )
  }

  public prependOnceListener<T extends object>(
    subType: Proto.Qot_Common.SubType,
    accID: number|Long,
    listener: OnPushListener<T>
  ): void
  public prependOnceListener<T extends object>(
    subType: Proto.Qot_Common.SubType,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<T>
  ): void
  public prependOnceListener(
    ...args: any[]
  ): void {
    if (args.length !== 3) throw new ParameterError('Should pass 3 arguments')
    const [subType, identity, listener] = args
    let cmd = PushEmitter.translateSubType(subType)
    if (typeof cmd === 'undefined') throw new ParameterError('Unknown SubType')
    this.emitter.prependOnceListener(
      (typeof identity === 'object' && Long.isLong(identity)
        ? PushEmitter.translateAccID
        : PushEmitter.translateSecurity)(cmd, identity),
      listener
    )
  }

  public removeListener<T extends object>(
    subType: Proto.Qot_Common.SubType,
    accID: number|Long,
    listener: OnPushListener<T>
  ): void
  public removeListener<T extends object>(
    subType: Proto.Qot_Common.SubType,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<T>
  ): void
  public removeListener(
    ...args: any[]
  ): void {
    if (args.length !== 3) throw new ParameterError('Should pass 3 arguments')
    const [subType, identity, listener] = args
    let cmd = PushEmitter.translateSubType(subType)
    if (typeof cmd === 'undefined') throw new ParameterError('Unknown SubType')
    this.emitter.removeListener(
      (typeof identity === 'object' && Long.isLong(identity)
        ? PushEmitter.translateAccID
        : PushEmitter.translateSecurity)(cmd, identity),
      listener
    )
  }

  public off<T extends object>(
    subType: Proto.Qot_Common.SubType,
    accID: number|Long,
    listener: OnPushListener<T>
  ): void
  public off<T extends object>(
    subType: Proto.Qot_Common.SubType,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<T>
  ): void
  public off(
    ...args: any[]
  ): void {
    if (args.length !== 3) throw new ParameterError('Should pass 3 arguments')
    const [subType, identity, listener] = args
    let cmd = PushEmitter.translateSubType(subType)
    if (typeof cmd === 'undefined') throw new ParameterError('Unknown SubType')
    this.emitter.off(
      (typeof identity === 'object' && Long.isLong(identity)
        ? PushEmitter.translateAccID
        : PushEmitter.translateSecurity)(cmd, identity),
      listener
    )
  }

  public removeAllListeners<T extends object>(
    subType: Proto.Qot_Common.SubType,
    accID: number|Long
  ): void
  public removeAllListeners<T extends object>(
    subType: Proto.Qot_Common.SubType,
    security: Proto.Qot_Common.ISecurity
  ): void
  public removeAllListeners(
    ...args: any[]
  ): void {
    if (args.length !== 2) throw new ParameterError('Should pass 2 arguments')
    const [subType, identity] = args
    let cmd = PushEmitter.translateSubType(subType)
    if (typeof cmd === 'undefined') throw new ParameterError('Unknown SubType')
    this.emitter.removeAllListeners(
      (typeof identity === 'object' && Long.isLong(identity)
        ? PushEmitter.translateAccID
        : PushEmitter.translateSecurity)(cmd, identity)
    )
  }

  public onPush(cmd: number, res: any) {
    try {
      if (res.security) {
        this.emitter.emit(PushEmitter.translateSecurity(cmd, res.security), res)
      } else if (res.basicQotList) {
        ;(res.basicQotList as Proto.Qot_Common.BasicQot[]).forEach(qot => {
          this.emitter.emit(PushEmitter.translateSecurity(cmd, qot.security), qot)
        })
      } else if (res.TrdHeader) {
        this.emitter.emit(
          PushEmitter.translateAccID(cmd, (res.TrdHeader as Proto.Trd_Common.TrdHeader).accID),
          res.order || res.orderFill
        )
      }
      // ignore if no match
    } catch (e) {}
  }

  public static translateSecurity(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    security: Proto.Qot_Common.ISecurity
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
    return `${cmd}_${security.code}_${security.market}`
  }

  public static translateAccID(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    accID: number|Long
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
    return `${cmd}_${Long.isLong(accID)? (accID as Long).toString() : accID}`
  }

  public static translateSubType(subType: Proto.Qot_Common.SubType): number|undefined {
    switch (subType) {
      case Proto.Qot_Common.SubType.SubType_Basic:
        return ProtoId['Qot_UpdateBasicQot']
      case Proto.Qot_Common.SubType.SubType_Broker:
        return ProtoId['Qot_UpdateBroker']
      case Proto.Qot_Common.SubType.SubType_OrderBook:
        return ProtoId['Qot_UpdateOrderBook']
      case Proto.Qot_Common.SubType.SubType_RT:
        return ProtoId['Qot_UpdateRT']
      case Proto.Qot_Common.SubType.SubType_Ticker:
        return ProtoId['Qot_UpdateTicker']
      case Proto.Qot_Common.SubType.SubType_KL_1Min:
      case Proto.Qot_Common.SubType.SubType_KL_3Min:
      case Proto.Qot_Common.SubType.SubType_KL_5Min:
      case Proto.Qot_Common.SubType.SubType_KL_15Min:
      case Proto.Qot_Common.SubType.SubType_KL_30Min:
      case Proto.Qot_Common.SubType.SubType_KL_60Min:
      case Proto.Qot_Common.SubType.SubType_KL_Day:
      case Proto.Qot_Common.SubType.SubType_KL_Week:
      case Proto.Qot_Common.SubType.SubType_KL_Month:
      case Proto.Qot_Common.SubType.SubType_KL_Qurater:
      case Proto.Qot_Common.SubType.SubType_KL_Year:
        return ProtoId['Qot_UpdateKL']
      case Proto.Qot_Common.SubType.SubType_None:
      case Proto.Qot_Common.SubType.SubType_OrderDetail:
        return undefined
    }
  }

}