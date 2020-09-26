import Long from 'long';

import { Proto } from '../futu';
import PushEmitter from '../push_emitter';
import { ElementOf, MemberOf } from '../types/ts';
import { OnPushListener } from '../types/types';
import { ParameterError } from '../utils/error';

interface PropertyDecorator<T> {
  configurable?: boolean;
  enumerable?: boolean;
  value?: (data: T) => void;
  writable?: boolean;
  get?(): any;
  set?(v: any): void;
}

type FuncDecorator<T> =
  (target: any, key: string, descriptor: PropertyDecorator<T>) => PropertyDecorator<T>

function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_Order,
): FuncDecorator<Proto.Trd_Common.Order>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_OrderFill,
): FuncDecorator<Proto.Trd_Common.OrderFill>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_Ticker,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<Proto.Qot_UpdateTicker.IS2C>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_RT,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<Proto.Qot_UpdateRT.IS2C>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_Basic,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<ElementOf<MemberOf<Proto.Qot_UpdateBasicQot.S2C, 'basicQotList'>>>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_Broker,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<Proto.Qot_UpdateBroker.IS2C>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_OrderBook,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<Proto.Qot_UpdateOrderBook.IS2C>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_KL_1Min,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<Proto.Qot_UpdateKL.IS2C>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_KL_3Min,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<Proto.Qot_UpdateKL.IS2C>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_KL_5Min,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<Proto.Qot_UpdateKL.IS2C>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_KL_15Min,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<Proto.Qot_UpdateKL.IS2C>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_KL_30Min,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<Proto.Qot_UpdateKL.IS2C>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_KL_60Min,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<Proto.Qot_UpdateKL.IS2C>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_KL_Day,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<Proto.Qot_UpdateKL.IS2C>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_KL_Week,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<Proto.Qot_UpdateKL.IS2C>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_KL_Month,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<Proto.Qot_UpdateKL.IS2C>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_KL_Qurater,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<Proto.Qot_UpdateKL.IS2C>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_KL_Year,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<Proto.Qot_UpdateKL.IS2C>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_Order,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<Proto.Trd_Common.Order>
function Subscribe(
  subType: Proto.Qot_Common.SubType.SubType_OrderFill,
  security: Proto.Qot_Common.ISecurity
): FuncDecorator<Proto.Trd_Common.OrderFill>
function Subscribe(
  ...args: any[]
): FuncDecorator<any> {
  return function (_: any, __: string, descriptor: PropertyDecorator<any>) {
    const [ subType, security ] = args,
          isTrdSubType = [
            Proto.Qot_Common.SubType.SubType_Order,
            Proto.Qot_Common.SubType.SubType_OrderFill
          ].includes(subType)
    if (typeof subType !== 'number') {
      throw new ParameterError('Invalid subType')
    } else if (isTrdSubType) {
      PushEmitter._instance!.on(subType, descriptor.value as OnPushListener<any>)
    } else if (typeof security !== 'object' && !isTrdSubType) {
      PushEmitter._instance!.on(subType, security, descriptor.value as OnPushListener<any>)
    } else {
      throw new ParameterError('Please provide target security')
    }
    return descriptor
  }
}

export default Subscribe