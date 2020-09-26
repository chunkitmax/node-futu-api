import Subscribe from './decorators/subscribe';
import * as Proto from './proto/proto';
import WebSocket from './ws';

export { Proto, Subscribe }

export type FutuConfig = {
  // server
  ip?: string
  port?: number
  recvNotify?: boolean
  // user
  userID: number
  pwdMd5: string
  // account
  accMarket?: Proto.Trd_Common.TrdMarket
  accEnv?: Proto.Trd_Common.TrdEnv
  accType?: Proto.Trd_Common.TrdAccType
  // websocket
  isSSL?: boolean
  wsKey?: string
  reqTimeout?: number
}

const DefaultConfig = {
  // server
  ip: 'localhost',
  port: 33333,
  recvNotify: true,
  // no default user
  // account
  accMarket: Proto.Trd_Common.TrdMarket.TrdMarket_HK,
  accEnv: Proto.Trd_Common.TrdEnv.TrdEnv_Real,
  accType: Proto.Trd_Common.TrdAccType.TrdAccType_Cash,
  // websocket
  isSSL: false,
  wsKey: null,
  reqTimeout: 10000
}

type AutoFilled<T> = Omit<T,
  'header' |
  'packetID' |
  'userID' |
  'accIDList'
>

type MayOptional<T> = (keyof T extends never? void|undefined : T)

type ApiParam<T> = MayOptional<AutoFilled<T>>

export default class Futu extends WebSocket {

  constructor(config: FutuConfig, callback?: (ft: Futu) => void) {
    super(Object.assign({}, DefaultConfig, config), () => callback?.(this))
  }

  public get ready() {
    return super.ready
  }

  public close() {
    super.close()
  }

  public async getGlobalState(req: ApiParam<Proto.GetGlobalState.IC2S>): Promise<Proto.GetGlobalState.IS2C> {
    return super.request('GetGlobalState', req)
  }

  public async notify(): Promise<Proto.Notify.IS2C> {
    return super.request('Notify')
  }

  public async keepAlive(req: ApiParam<Proto.KeepAlive.IC2S>): Promise<Proto.KeepAlive.IS2C> {
    return super.request('KeepAlive', req)
  }

  public async getUserInfo(req: ApiParam<Proto.GetUserInfo.IC2S>): Promise<Proto.GetUserInfo.IS2C> {
    return super.request('GetUserInfo', req)
  }

  public async getDelayStatistics(req: ApiParam<Proto.GetDelayStatistics.IC2S>): Promise<Proto.GetDelayStatistics.IS2C> {
    return super.request('GetDelayStatistics', req)
  }

  public async qotSub(req: ApiParam<Proto.Qot_Sub.IC2S>): Promise<Proto.Qot_Sub.IS2C> {
    return super.request('Qot_Sub', req)
  }

  public async qotRegQotPush(req: ApiParam<Proto.Qot_RegQotPush.IC2S>): Promise<Proto.Qot_RegQotPush.IS2C> {
    return super.request('Qot_RegQotPush', req)
  }

  public async qotGetSubInfo(req: ApiParam<Proto.Qot_GetSubInfo.IC2S>): Promise<Proto.Qot_GetSubInfo.IS2C> {
    return super.request('Qot_GetSubInfo', req)
  }

  public async qotGetBasicQot(req: ApiParam<Proto.Qot_GetBasicQot.IC2S>): Promise<Proto.Qot_GetBasicQot.IS2C> {
    return super.request('Qot_GetBasicQot', req)
  }

  public async qotUpdateBasicQot(): Promise<Proto.Qot_UpdateBasicQot.IS2C> {
    return super.request('Qot_UpdateBasicQot')
  }

  public async qotGetKL(req: ApiParam<Proto.Qot_GetKL.IC2S>): Promise<Proto.Qot_GetKL.IS2C> {
    return super.request('Qot_GetKL', req)
  }

  public async qotUpdateKL(): Promise<Proto.Qot_UpdateKL.IS2C> {
    return super.request('Qot_UpdateKL')
  }

  public async qotGetRT(req: ApiParam<Proto.Qot_GetRT.IC2S>): Promise<Proto.Qot_GetRT.IS2C> {
    return super.request('Qot_GetRT', req)
  }

  public async qotUpdateRT(): Promise<Proto.Qot_UpdateRT.IS2C> {
    return super.request('Qot_UpdateRT')
  }

  public async qotGetTicker(req: ApiParam<Proto.Qot_GetTicker.IC2S>): Promise<Proto.Qot_GetTicker.IS2C> {
    return super.request('Qot_GetTicker', req)
  }

  public async qotUpdateTicker(): Promise<Proto.Qot_UpdateTicker.IS2C> {
    return super.request('Qot_UpdateTicker')
  }

  public async qotGetOrderBook(req: ApiParam<Proto.Qot_GetOrderBook.IC2S>): Promise<Proto.Qot_GetOrderBook.IS2C> {
    return super.request('Qot_GetOrderBook', req)
  }

  public async qotUpdateOrderBook(): Promise<Proto.Qot_UpdateOrderBook.IS2C> {
    return super.request('Qot_UpdateOrderBook')
  }

  public async qotGetBroker(req: ApiParam<Proto.Qot_GetBroker.IC2S>): Promise<Proto.Qot_GetBroker.IS2C> {
    return super.request('Qot_GetBroker', req)
  }

  public async qotUpdateBroker(): Promise<Proto.Qot_UpdateBroker.IS2C> {
    return super.request('Qot_UpdateBroker')
  }

  public async qotGetOrderDetail(req: ApiParam<Proto.Qot_GetOrderDetail.IC2S>): Promise<Proto.Qot_GetOrderDetail.IS2C> {
    return super.request('Qot_GetOrderDetail', req)
  }

  public async qotUpdateOrderDetail(): Promise<Proto.Qot_UpdateOrderDetail.IS2C> {
    return super.request('Qot_UpdateOrderDetail')
  }

  public async qotUpdatePriceReminder(): Promise<Proto.Qot_UpdatePriceReminder.IS2C> {
    return super.request('Qot_UpdatePriceReminder')
  }

  public async qotGetHistoryKL(req: ApiParam<Proto.Qot_GetHistoryKL.IC2S>): Promise<Proto.Qot_GetHistoryKL.IS2C> {
    return super.request('Qot_GetHistoryKL', req)
  }

  public async qotGetHistoryKLPoints(req: ApiParam<Proto.Qot_GetHistoryKLPoints.IC2S>): Promise<Proto.Qot_GetHistoryKLPoints.IS2C> {
    return super.request('Qot_GetHistoryKLPoints', req)
  }

  public async qotGetRehab(req: ApiParam<Proto.Qot_GetRehab.IC2S>): Promise<Proto.Qot_GetRehab.IS2C> {
    return super.request('Qot_GetRehab', req)
  }

  public async qotRequestHistoryKL(req: ApiParam<Proto.Qot_RequestHistoryKL.IC2S>): Promise<Proto.Qot_RequestHistoryKL.IS2C> {
    return super.request('Qot_RequestHistoryKL', req)
  }

  public async qotRequestHistoryKLQuota(req: ApiParam<Proto.Qot_RequestHistoryKLQuota.IC2S>): Promise<Proto.Qot_RequestHistoryKLQuota.IS2C> {
    return super.request('Qot_RequestHistoryKLQuota', req)
  }

  public async qotRequestRehab(req: ApiParam<Proto.Qot_RequestRehab.IC2S>): Promise<Proto.Qot_RequestRehab.IS2C> {
    return super.request('Qot_RequestRehab', req)
  }

  public async qotGetTradeDate(req: ApiParam<Proto.Qot_GetTradeDate.IC2S>): Promise<Proto.Qot_GetTradeDate.IS2C> {
    return super.request('Qot_GetTradeDate', req)
  }

  public async qotGetSuspend(req: ApiParam<Proto.Qot_GetSuspend.IC2S>): Promise<Proto.Qot_GetSuspend.IS2C> {
    return super.request('Qot_GetSuspend', req)
  }

  public async qotGetStaticInfo(req: ApiParam<Proto.Qot_GetStaticInfo.IC2S>): Promise<Proto.Qot_GetStaticInfo.IS2C> {
    return super.request('Qot_GetStaticInfo', req)
  }

  public async qotGetSecuritySnapshot(req: ApiParam<Proto.Qot_GetSecuritySnapshot.IC2S>): Promise<Proto.Qot_GetSecuritySnapshot.IS2C> {
    return super.request('Qot_GetSecuritySnapshot', req)
  }

  public async qotGetPlateSet(req: ApiParam<Proto.Qot_GetPlateSet.IC2S>): Promise<Proto.Qot_GetPlateSet.IS2C> {
    return super.request('Qot_GetPlateSet', req)
  }

  public async qotGetPlateSecurity(req: ApiParam<Proto.Qot_GetPlateSecurity.IC2S>): Promise<Proto.Qot_GetPlateSecurity.IS2C> {
    return super.request('Qot_GetPlateSecurity', req)
  }

  public async qotGetReference(req: ApiParam<Proto.Qot_GetReference.IC2S>): Promise<Proto.Qot_GetReference.IS2C> {
    return super.request('Qot_GetReference', req)
  }

  public async qotGetOwnerPlate(req: ApiParam<Proto.Qot_GetOwnerPlate.IC2S>): Promise<Proto.Qot_GetOwnerPlate.IS2C> {
    return super.request('Qot_GetOwnerPlate', req)
  }

  public async qotGetHoldingChangeList(req: ApiParam<Proto.Qot_GetHoldingChangeList.IC2S>): Promise<Proto.Qot_GetHoldingChangeList.IS2C> {
    return super.request('Qot_GetHoldingChangeList', req)
  }

  public async qotGetOptionChain(req: ApiParam<Proto.Qot_GetOptionChain.IC2S>): Promise<Proto.Qot_GetOptionChain.IS2C> {
    return super.request('Qot_GetOptionChain', req)
  }

  public async qotGetWarrant(req: ApiParam<Proto.Qot_GetWarrant.IC2S>): Promise<Proto.Qot_GetWarrant.IS2C> {
    return super.request('Qot_GetWarrant', req)
  }

  public async qotGetCapitalFlow(req: ApiParam<Proto.Qot_GetCapitalFlow.IC2S>): Promise<Proto.Qot_GetCapitalFlow.IS2C> {
    return super.request('Qot_GetCapitalFlow', req)
  }

  public async qotGetCapitalDistribution(req: ApiParam<Proto.Qot_GetCapitalDistribution.IC2S>): Promise<Proto.Qot_GetCapitalDistribution.IS2C> {
    return super.request('Qot_GetCapitalDistribution', req)
  }

  public async qotGetUserSecurity(req: ApiParam<Proto.Qot_GetUserSecurity.IC2S>): Promise<Proto.Qot_GetUserSecurity.IS2C> {
    return super.request('Qot_GetUserSecurity', req)
  }

  public async qotModifyUserSecurity(req: ApiParam<Proto.Qot_ModifyUserSecurity.IC2S>): Promise<Proto.Qot_ModifyUserSecurity.IS2C> {
    return super.request('Qot_ModifyUserSecurity', req)
  }

  public async qotStockFilter(req: ApiParam<Proto.Qot_StockFilter.IC2S>): Promise<Proto.Qot_StockFilter.IS2C> {
    return super.request('Qot_StockFilter', req)
  }

  public async qotGetCodeChange(req: ApiParam<Proto.Qot_GetCodeChange.IC2S>): Promise<Proto.Qot_GetCodeChange.IS2C> {
    return super.request('Qot_GetCodeChange', req)
  }

  public async qotGetIpoList(req: ApiParam<Proto.Qot_GetIpoList.IC2S>): Promise<Proto.Qot_GetIpoList.IS2C> {
    return super.request('Qot_GetIpoList', req)
  }

  public async qotGetFutureInfo(req: ApiParam<Proto.Qot_GetFutureInfo.IC2S>): Promise<Proto.Qot_GetFutureInfo.IS2C> {
    return super.request('Qot_GetFutureInfo', req)
  }

  public async qotRequestTradeDate(req: ApiParam<Proto.Qot_RequestTradeDate.IC2S>): Promise<Proto.Qot_RequestTradeDate.IS2C> {
    return super.request('Qot_RequestTradeDate', req)
  }

  public async qotSetPriceReminder(req: ApiParam<Proto.Qot_SetPriceReminder.IC2S>): Promise<Proto.Qot_SetPriceReminder.IS2C> {
    return super.request('Qot_SetPriceReminder', req)
  }

  public async qotGetPriceReminder(req: ApiParam<Proto.Qot_GetPriceReminder.IC2S>): Promise<Proto.Qot_GetPriceReminder.IS2C> {
    return super.request('Qot_GetPriceReminder', req)
  }

  public async qotGetUserSecurityGroup(req: ApiParam<Proto.Qot_GetUserSecurityGroup.IC2S>): Promise<Proto.Qot_GetUserSecurityGroup.IS2C> {
    return super.request('Qot_GetUserSecurityGroup', req)
  }

  public async qotGetMarketState(req: ApiParam<Proto.Qot_GetMarketState.IC2S>): Promise<Proto.Qot_GetMarketState.IS2C> {
    return super.request('Qot_GetMarketState', req)
  }

  public async trdGetAccList(req: ApiParam<Proto.Trd_GetAccList.IC2S>): Promise<Proto.Trd_GetAccList.IS2C> {
    return super.request('Trd_GetAccList', req)
  }

  public async trdUnlockTrade(req: ApiParam<Proto.Trd_UnlockTrade.IC2S>): Promise<Proto.Trd_UnlockTrade.IS2C> {
    return super.request('Trd_UnlockTrade', req)
  }

  public async trdSubAccPush(req: ApiParam<Proto.Trd_SubAccPush.IC2S>): Promise<Proto.Trd_SubAccPush.IS2C> {
    return super.request('Trd_SubAccPush', req)
  }

  public async trdGetFunds(req: ApiParam<Proto.Trd_GetFunds.IC2S>): Promise<Proto.Trd_GetFunds.IS2C> {
    return super.request('Trd_GetFunds', req)
  }

  public async trdGetPositionList(req: ApiParam<Proto.Trd_GetPositionList.IC2S>): Promise<Proto.Trd_GetPositionList.IS2C> {
    return super.request('Trd_GetPositionList', req)
  }

  public async trdGetMaxTrdQtys(req: ApiParam<Proto.Trd_GetMaxTrdQtys.IC2S>): Promise<Proto.Trd_GetMaxTrdQtys.IS2C> {
    return super.request('Trd_GetMaxTrdQtys', req)
  }

  public async trdGetOrderList(req: ApiParam<Proto.Trd_GetOrderList.IC2S>): Promise<Proto.Trd_GetOrderList.IS2C> {
    return super.request('Trd_GetOrderList', req)
  }

  public async trdPlaceOrder(req: ApiParam<Proto.Trd_PlaceOrder.IC2S>): Promise<Proto.Trd_PlaceOrder.IS2C> {
    return super.request('Trd_PlaceOrder', req)
  }

  public async trdModifyOrder(req: ApiParam<Proto.Trd_ModifyOrder.IC2S>): Promise<Proto.Trd_ModifyOrder.IS2C> {
    return super.request('Trd_ModifyOrder', req)
  }

  public async trdUpdateOrder(): Promise<Proto.Trd_UpdateOrder.IS2C> {
    return super.request('Trd_UpdateOrder')
  }

  public async trdGetOrderFillList(req: ApiParam<Proto.Trd_GetOrderFillList.IC2S>): Promise<Proto.Trd_GetOrderFillList.IS2C> {
    return super.request('Trd_GetOrderFillList', req)
  }

  public async trdUpdateOrderFill(): Promise<Proto.Trd_UpdateOrderFill.IS2C> {
    return super.request('Trd_UpdateOrderFill')
  }

  public async trdGetHistoryOrderList(req: ApiParam<Proto.Trd_GetHistoryOrderList.IC2S>): Promise<Proto.Trd_GetHistoryOrderList.IS2C> {
    return super.request('Trd_GetHistoryOrderList', req)
  }

  public async trdGetHistoryOrderFillList(req: ApiParam<Proto.Trd_GetHistoryOrderFillList.IC2S>): Promise<Proto.Trd_GetHistoryOrderFillList.IS2C> {
    return super.request('Trd_GetHistoryOrderFillList', req)
  }

}