import EventEmitter from 'events';
import Long from 'long';

import { Proto } from './futu';
import ProtoId from './proto/protoid.json';
import { ElementOf, MemberOf, valueof } from './types/ts';
import { OnPushListener } from './types/types';
import { ParameterError } from './utils/error';
import { ProtoName } from './utils/proto';

// extend SubType
declare module './futu' {
  export namespace Proto {
    export namespace Qot_Common {
      export enum SubType {
        SubType_Order = -1,
        SubType_OrderFill = -2
      }
    }
  }
}

export default class PushEmitter {

  public static _instance: PushEmitter|undefined

  protected emitter: EventEmitter.EventEmitter|undefined

  private _accID: number|Long|undefined

  constructor() {
    if (!PushEmitter._instance) {
      this.emitter = new EventEmitter()
      PushEmitter._instance = this
    }
  }

  protected set accID(id: number|Long) {
    this._accID = id
  }

  public close() {
    this.emitter?.removeAllListeners()
    PushEmitter._instance = undefined
  }


  public on(
    subType: Proto.Qot_Common.SubType.SubType_Order,
    listener: OnPushListener<Proto.Trd_Common.Order>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_OrderFill,
    listener: OnPushListener<Proto.Trd_Common.OrderFill>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_Ticker,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateTicker.IS2C>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_RT,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateRT.IS2C>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_Basic,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<ElementOf<MemberOf<Proto.Qot_UpdateBasicQot.S2C, 'basicQotList'>>>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_Broker,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateBroker.IS2C>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_OrderBook,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateOrderBook.IS2C>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_KL_1Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_KL_3Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_KL_5Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_KL_15Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_KL_30Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_KL_60Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_KL_Day,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_KL_Week,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_KL_Month,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_KL_Qurater,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_KL_Year,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_Order,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Trd_Common.Order>
  ): void
  public on(
    subType: Proto.Qot_Common.SubType.SubType_OrderFill,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Trd_Common.OrderFill>
  ): void
  public on(
    ...args: any[]
  ): void {
    let cmd = PushEmitter.translateSubType(args[0])
    if (typeof cmd === 'undefined') throw new ParameterError('Unknown SubType')
    var subType, identity, listener
    switch (args.length) {
      case 2: {
        var [subType, listener] = args
        this.emitter?.on(PushEmitter.translateAccID(cmd), listener)
        break
  }
      case 3: {
        var [subType, identity, listener] = args
        if (typeof identity === 'object' && Proto.Qot_Common.Security.verify(identity) === null) {
          this.emitter?.on(PushEmitter.translateSecurity(cmd, identity), listener)
        } else {
          throw new Error('Invalid security')
        }
        break
      }
      default: {
        throw new Error('Invalid arguments')
        break
      }
    }
  }


  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_Order,
    listener: OnPushListener<Proto.Trd_Common.Order>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_OrderFill,
    listener: OnPushListener<Proto.Trd_Common.OrderFill>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_Ticker,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateTicker.IS2C>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_RT,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateRT.IS2C>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_Basic,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<ElementOf<MemberOf<Proto.Qot_UpdateBasicQot.S2C, 'basicQotList'>>>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_Broker,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateBroker.IS2C>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_OrderBook,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateOrderBook.IS2C>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_1Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_3Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_5Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_15Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_30Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_60Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Day,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Week,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Month,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Qurater,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Year,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_Order,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Trd_Common.Order>
  ): void
  public addListener(
    subType: Proto.Qot_Common.SubType.SubType_OrderFill,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Trd_Common.OrderFill>
  ): void
  public addListener(
    ...args: any[]
  ): void {
    let cmd = PushEmitter.translateSubType(args[0])
    if (typeof cmd === 'undefined') throw new ParameterError('Unknown SubType')
    var subType, identity, listener
    switch (args.length) {
      case 2: {
        var [subType, listener] = args
        this.emitter?.addListener(PushEmitter.translateAccID(cmd), listener)
        break
  }
      case 3: {
        var [subType, identity, listener] = args
        if (typeof identity === 'object' && Proto.Qot_Common.Security.verify(identity) === null) {
          this.emitter?.addListener(PushEmitter.translateSecurity(cmd, identity), listener)
        } else {
          throw new Error('Invalid security')
        }
        break
      }
      default: {
        throw new Error('Invalid arguments')
        break
      }
    }
  }

  public once(
    subType: Proto.Qot_Common.SubType.SubType_Order,
    accID: number|Long,
    listener: OnPushListener<Proto.Trd_Common.Order>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_OrderFill,
    accID: number|Long,
    listener: OnPushListener<Proto.Trd_Common.OrderFill>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_Ticker,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateTicker.IS2C>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_RT,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateRT.IS2C>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_Basic,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<ElementOf<MemberOf<Proto.Qot_UpdateBasicQot.S2C, 'basicQotList'>>>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_Broker,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateBroker.IS2C>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_OrderBook,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateOrderBook.IS2C>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_KL_1Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_KL_3Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_KL_5Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_KL_15Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_KL_30Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_KL_60Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_KL_Day,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_KL_Week,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_KL_Month,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_KL_Qurater,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_KL_Year,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_Order,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Trd_Common.Order>
  ): void
  public once(
    subType: Proto.Qot_Common.SubType.SubType_OrderFill,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Trd_Common.OrderFill>
  ): void
  public once(
    ...args: any[]
  ): void {
    let cmd = PushEmitter.translateSubType(args[0])
    if (typeof cmd === 'undefined') throw new ParameterError('Unknown SubType')
    var subType, identity, listener
    switch (args.length) {
      case 2: {
        var [subType, listener] = args
        this.emitter?.once(PushEmitter.translateAccID(cmd), listener)
        break
  }
      case 3: {
        var [subType, identity, listener] = args
        if (typeof identity === 'object' && Proto.Qot_Common.Security.verify(identity) === null) {
          this.emitter?.once(PushEmitter.translateSecurity(cmd, identity), listener)
        } else {
          throw new Error('Invalid security')
        }
        break
      }
      default: {
        throw new Error('Invalid arguments')
        break
      }
    }
  }

  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_Order,
    accID: number|Long,
    listener: OnPushListener<Proto.Trd_Common.Order>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_OrderFill,
    accID: number|Long,
    listener: OnPushListener<Proto.Trd_Common.OrderFill>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_Ticker,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateTicker.IS2C>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_RT,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateRT.IS2C>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_Basic,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<ElementOf<MemberOf<Proto.Qot_UpdateBasicQot.S2C, 'basicQotList'>>>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_Broker,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateBroker.IS2C>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_OrderBook,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateOrderBook.IS2C>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_1Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_3Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_5Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_15Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_30Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_60Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Day,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Week,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Month,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Qurater,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Year,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_Order,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Trd_Common.Order>
  ): void
  public prependListener(
    subType: Proto.Qot_Common.SubType.SubType_OrderFill,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Trd_Common.OrderFill>
  ): void
  public prependListener(
    ...args: any[]
  ): void {
    let cmd = PushEmitter.translateSubType(args[0])
    if (typeof cmd === 'undefined') throw new ParameterError('Unknown SubType')
    var subType, identity, listener
    switch (args.length) {
      case 2: {
        var [subType, listener] = args
        this.emitter?.prependListener(PushEmitter.translateAccID(cmd), listener)
        break
      }
      case 3: {
        var [subType, identity, listener] = args
        if (typeof identity === 'object' && Proto.Qot_Common.Security.verify(identity) === null) {
          this.emitter?.prependListener(PushEmitter.translateSecurity(cmd, identity), listener)
        } else {
          throw new Error('Invalid security')
        }
        break
      }
      default: {
        throw new Error('Invalid arguments')
        break
      }
    }
  }

  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_Order,
    accID: number|Long,
    listener: OnPushListener<Proto.Trd_Common.Order>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_OrderFill,
    accID: number|Long,
    listener: OnPushListener<Proto.Trd_Common.OrderFill>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_Ticker,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateTicker.IS2C>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_RT,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateRT.IS2C>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_Basic,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<ElementOf<MemberOf<Proto.Qot_UpdateBasicQot.S2C, 'basicQotList'>>>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_Broker,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateBroker.IS2C>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_OrderBook,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateOrderBook.IS2C>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_1Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_3Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_5Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_15Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_30Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_60Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Day,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Week,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Month,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Qurater,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Year,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_Order,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Trd_Common.Order>
  ): void
  public prependOnceListener(
    subType: Proto.Qot_Common.SubType.SubType_OrderFill,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Trd_Common.OrderFill>
  ): void
  public prependOnceListener(
    ...args: any[]
  ): void {
    let cmd = PushEmitter.translateSubType(args[0])
    if (typeof cmd === 'undefined') throw new ParameterError('Unknown SubType')
    var subType, identity, listener
    switch (args.length) {
      case 2: {
        var [subType, listener] = args
        this.emitter?.prependOnceListener(PushEmitter.translateAccID(cmd), listener)
        break
      }
      case 3: {
        var [subType, identity, listener] = args
        if (typeof identity === 'object' && Proto.Qot_Common.Security.verify(identity) === null) {
          this.emitter?.prependOnceListener(PushEmitter.translateSecurity(cmd, identity), listener)
        } else {
          throw new Error('Invalid security')
        }
        break
      }
      default: {
        throw new Error('Invalid arguments')
        break
      }
    }
  }

  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_Order,
    accID: number|Long,
    listener: OnPushListener<Proto.Trd_Common.Order>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_OrderFill,
    accID: number|Long,
    listener: OnPushListener<Proto.Trd_Common.OrderFill>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_Ticker,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateTicker.IS2C>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_RT,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateRT.IS2C>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_Basic,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<ElementOf<MemberOf<Proto.Qot_UpdateBasicQot.S2C, 'basicQotList'>>>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_Broker,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateBroker.IS2C>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_OrderBook,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateOrderBook.IS2C>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_1Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_3Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_5Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_15Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_30Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_60Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Day,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Week,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Month,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Qurater,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_KL_Year,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_Order,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Trd_Common.Order>
  ): void
  public removeListener(
    subType: Proto.Qot_Common.SubType.SubType_OrderFill,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Trd_Common.OrderFill>
  ): void
  public removeListener(
    ...args: any[]
  ): void {
    let cmd = PushEmitter.translateSubType(args[0])
    if (typeof cmd === 'undefined') throw new ParameterError('Unknown SubType')
    var subType, identity, listener
    switch (args.length) {
      case 2: {
        var [subType, listener] = args
        this.emitter?.removeListener(PushEmitter.translateAccID(cmd), listener)
        break
      }
      case 3: {
        var [subType, identity, listener] = args
        if (typeof identity === 'object' && Proto.Qot_Common.Security.verify(identity) === null) {
          this.emitter?.removeListener(PushEmitter.translateSecurity(cmd, identity), listener)
        } else {
          throw new Error('Invalid security')
        }
        break
      }
      default: {
        throw new Error('Invalid arguments')
        break
      }
    }
  }

  public off(
    subType: Proto.Qot_Common.SubType.SubType_Order,
    accID: number|Long,
    listener: OnPushListener<Proto.Trd_Common.Order>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_OrderFill,
    accID: number|Long,
    listener: OnPushListener<Proto.Trd_Common.OrderFill>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_Ticker,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateTicker.IS2C>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_RT,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateRT.IS2C>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_Basic,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<ElementOf<MemberOf<Proto.Qot_UpdateBasicQot.S2C, 'basicQotList'>>>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_Broker,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateBroker.IS2C>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_OrderBook,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateOrderBook.IS2C>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_KL_1Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_KL_3Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_KL_5Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_KL_15Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_KL_30Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_KL_60Min,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_KL_Day,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_KL_Week,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_KL_Month,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_KL_Qurater,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_KL_Year,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Qot_UpdateKL.IS2C>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_Order,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Trd_Common.Order>
  ): void
  public off(
    subType: Proto.Qot_Common.SubType.SubType_OrderFill,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Trd_Common.OrderFill>
  ): void
  public off(
    ...args: any[]
  ): void {
    let cmd = PushEmitter.translateSubType(args[0])
    if (typeof cmd === 'undefined') throw new ParameterError('Unknown SubType')
    var subType, identity, listener
    switch (args.length) {
      case 2: {
        var [subType, listener] = args
        this.emitter?.off(PushEmitter.translateAccID(cmd), listener)
        break
      }
      case 3: {
        var [subType, identity, listener] = args
        if (typeof identity === 'object' && Proto.Qot_Common.Security.verify(identity) === null) {
          this.emitter?.off(PushEmitter.translateSecurity(cmd, identity), listener)
        } else {
          throw new Error('Invalid security')
        }
        break
      }
      default: {
        throw new Error('Invalid arguments')
        break
      }
    }
  }

  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_Order,
    accID: number|Long,
    listener: OnPushListener<Proto.Trd_Common.Order>
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_OrderFill,
    accID: number|Long,
    listener: OnPushListener<Proto.Trd_Common.OrderFill>
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_Ticker,
    security: Proto.Qot_Common.ISecurity,
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_RT,
    security: Proto.Qot_Common.ISecurity,
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_Basic,
    security: Proto.Qot_Common.ISecurity,
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_Broker,
    security: Proto.Qot_Common.ISecurity,
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_OrderBook,
    security: Proto.Qot_Common.ISecurity,
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_KL_1Min,
    security: Proto.Qot_Common.ISecurity,
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_KL_3Min,
    security: Proto.Qot_Common.ISecurity,
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_KL_5Min,
    security: Proto.Qot_Common.ISecurity,
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_KL_15Min,
    security: Proto.Qot_Common.ISecurity,
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_KL_30Min,
    security: Proto.Qot_Common.ISecurity,
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_KL_60Min,
    security: Proto.Qot_Common.ISecurity,
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_KL_Day,
    security: Proto.Qot_Common.ISecurity,
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_KL_Week,
    security: Proto.Qot_Common.ISecurity,
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_KL_Month,
    security: Proto.Qot_Common.ISecurity,
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_KL_Qurater,
    security: Proto.Qot_Common.ISecurity,
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_KL_Year,
    security: Proto.Qot_Common.ISecurity,
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_Order,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Trd_Common.Order>
  ): void
  public removeAllListeners(
    subType: Proto.Qot_Common.SubType.SubType_OrderFill,
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<Proto.Trd_Common.OrderFill>
  ): void
  public removeAllListeners(
    ...args: any[]
  ): void {
    if (args.length !== 2) throw new ParameterError('Should pass 2 arguments')
    const [subType, identity] = args
    let cmd = PushEmitter.translateSubType(subType)
    if (typeof cmd === 'undefined') throw new ParameterError('Unknown SubType')
    this.emitter?.removeAllListeners(
      (typeof identity === 'object' && Long.isLong(identity)
        ? PushEmitter.translateAccID
        : PushEmitter.translateSecurity)(cmd, identity)
    )
  }

  protected onPush(cmd: number, res: any) {
    try {
      if (res.security) {
        this.emitter?.emit(PushEmitter.translateSecurity(cmd, res.security), res)
      } else if (res.basicQotList) {
        ;(res.basicQotList as Proto.Qot_Common.BasicQot[]).forEach(qot => {
          this.emitter?.emit(PushEmitter.translateSecurity(cmd, qot.security), qot)
        })
      } else if (res.TrdHeader) {
        this.emitter?.emit(
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
    accID?: number|Long
  ) {
    if (accID === undefined) {
      accID = PushEmitter._instance?._accID
    }
    if (
      typeof accID === 'number' ||
      (typeof accID === 'object' && Long.isLong(accID))
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
    } else {
      throw new Error('Invalid accID')
    }
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
      case Proto.Qot_Common.SubType.SubType_Order:
        return ProtoId['Trd_UpdateOrder']
      case Proto.Qot_Common.SubType.SubType_OrderFill:
        return ProtoId['Trd_UpdateOrderFill']
      case Proto.Qot_Common.SubType.SubType_None:
      case Proto.Qot_Common.SubType.SubType_OrderDetail:
        return undefined
    }
  }

}