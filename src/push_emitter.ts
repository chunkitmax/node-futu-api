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
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    accID: number|Long,
    listener: OnPushListener<T>
  ): void
  public on<T extends object>(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<T>
  ): void
  public on(
    ...args: any[]
  ): void {
    if (args.length !== 3) throw new ParameterError('Should pass 3 arguments')
    if (typeof args[1] === 'object' && !Long.isLong(args[1])) {
      const [cmdOrName, security, listener] = args
      this.emitter.on(PushEmitter.translateSecurity(cmdOrName, security), listener)
    } else {
      const [cmdOrName, accID, listener] = args
      this.emitter.on(PushEmitter.translateAccID(cmdOrName, accID), listener)
    }
  }

  public addListener<T extends object>(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    accID: number|Long,
    listener: OnPushListener<T>
  ): void
  public addListener<T extends object>(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<T>
  ): void
  public addListener(
    ...args: any[]
  ): void {
    if (args.length !== 3) throw new ParameterError('Should pass 3 arguments')
    if (typeof args[1] === 'object' && !Long.isLong(args[1])) {
      const [cmdOrName, security, listener] = args
      this.emitter.addListener(PushEmitter.translateSecurity(cmdOrName, security), listener)
    } else {
      const [cmdOrName, accID, listener] = args
      this.emitter.addListener(PushEmitter.translateAccID(cmdOrName, accID), listener)
    }
  }

  public once<T extends object>(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    accID: number|Long,
    listener: OnPushListener<T>
  ): void
  public once<T extends object>(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<T>
  ): void
  public once(
    ...args: any[]
  ): void {
    if (args.length !== 3) throw new ParameterError('Should pass 3 arguments')
    if (typeof args[1] === 'object' && !Long.isLong(args[1])) {
      const [cmdOrName, security, listener] = args
      this.emitter.once(PushEmitter.translateSecurity(cmdOrName, security), listener)
    } else {
      const [cmdOrName, accID, listener] = args
      this.emitter.once(PushEmitter.translateAccID(cmdOrName, accID), listener)
    }
  }

  public prependListener<T extends object>(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    accID: number|Long,
    listener: OnPushListener<T>
  ): void
  public prependListener<T extends object>(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<T>
  ): void
  public prependListener(
    ...args: any[]
  ): void {
    if (args.length !== 3) throw new ParameterError('Should pass 3 arguments')
    if (typeof args[1] === 'object' && !Long.isLong(args[1])) {
      const [cmdOrName, security, listener] = args
      this.emitter.prependListener(PushEmitter.translateSecurity(cmdOrName, security), listener)
    } else {
      const [cmdOrName, accID, listener] = args
      this.emitter.prependListener(PushEmitter.translateAccID(cmdOrName, accID), listener)
    }
  }

  public prependOnceListener<T extends object>(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    accID: number|Long,
    listener: OnPushListener<T>
  ): void
  public prependOnceListener<T extends object>(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<T>
  ): void
  public prependOnceListener(
    ...args: any[]
  ): void {
    if (args.length !== 3) throw new ParameterError('Should pass 3 arguments')
    if (typeof args[1] === 'object' && !Long.isLong(args[1])) {
      const [cmdOrName, security, listener] = args
      this.emitter.prependOnceListener(PushEmitter.translateSecurity(cmdOrName, security), listener)
    } else {
      const [cmdOrName, accID, listener] = args
      this.emitter.prependOnceListener(PushEmitter.translateAccID(cmdOrName, accID), listener)
    }
  }

  public removeListener<T extends object>(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    accID: number|Long,
    listener: OnPushListener<T>
  ): void
  public removeListener<T extends object>(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<T>
  ): void
  public removeListener(
    ...args: any[]
  ): void {
    if (args.length !== 3) throw new ParameterError('Should pass 3 arguments')
    if (typeof args[1] === 'object' && !Long.isLong(args[1])) {
      const [cmdOrName, security, listener] = args
      this.emitter.removeListener(PushEmitter.translateSecurity(cmdOrName, security), listener)
    } else {
      const [cmdOrName, accID, listener] = args
      this.emitter.removeListener(PushEmitter.translateAccID(cmdOrName, accID), listener)
    }
  }

  public off<T extends object>(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    accID: number|Long,
    listener: OnPushListener<T>
  ): void
  public off<T extends object>(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    security: Proto.Qot_Common.ISecurity,
    listener: OnPushListener<T>
  ): void
  public off(
    ...args: any[]
  ): void {
    if (args.length !== 3) throw new ParameterError('Should pass 3 arguments')
    if (typeof args[1] === 'object' && !Long.isLong(args[1])) {
      const [cmdOrName, security, listener] = args
      this.emitter.off(PushEmitter.translateSecurity(cmdOrName, security), listener)
    } else {
      const [cmdOrName, accID, listener] = args
      this.emitter.off(PushEmitter.translateAccID(cmdOrName, accID), listener)
    }
  }

  public removeAllListeners<T extends object>(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    accID: number|Long
  ): void
  public removeAllListeners<T extends object>(
    cmdOrName: valueof<typeof ProtoId>|keyof (typeof ProtoId),
    security: Proto.Qot_Common.ISecurity
  ): void
  public removeAllListeners(
    ...args: any[]
  ): void {
    if (args.length !== 2) throw new ParameterError('Should pass 2 arguments')
    if (typeof args[1] === 'object' && !Long.isLong(args[1])) {
      const [cmdOrName, security] = args
      this.emitter.removeAllListeners(PushEmitter.translateSecurity(cmdOrName, security))
    } else {
      const [cmdOrName, accID] = args
      this.emitter.removeAllListeners(PushEmitter.translateAccID(cmdOrName, accID))
    }
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

}