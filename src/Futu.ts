import Proto from './proto/proto'
import WebSocket from './ws'

export type FutuConfig = {
  ip?: string
  port?: number
  userID: number
  pwdMd5: string
  market?: Proto.Trd_Common.TrdMarket
  env?: Proto.Trd_Common.TrdEnv
  isSSL?: boolean
  reqTimeout?: number
}

const DefaultConfig = {
  ip: 'localhost',
  port: 33333,
  market: Proto.Trd_Common.TrdMarket.TrdMarket_HK,
  env: Proto.Trd_Common.TrdEnv.TrdEnv_Real,
  isSSL: false,
  reqTimeout: 10000
}

export default class Futu extends WebSocket {

  constructor(config: FutuConfig) {
    super(Object.assign({}, DefaultConfig, config))
  }

  public async initConnect(req: Proto.InitConnect.IC2S|Proto.InitConnect.Request): Promise<Proto.InitConnect.IS2C|Proto.InitConnect.Response> {
    return super.request('InitConnect', req)
  }

  public async getGlobalState(req: Proto.GetGlobalState.IC2S|Proto.GetGlobalState.Request): Promise<Proto.GetGlobalState.IS2C|Proto.GetGlobalState.Response> {
    return super.request('GetGlobalState', req)
  }

  public async notify(): Promise<Proto.Notify.IS2C|Proto.Notify.Response> {
    return super.request('Notify')
  }

  public async keepAlive(req: Proto.KeepAlive.IC2S|Proto.KeepAlive.Request): Promise<Proto.KeepAlive.IS2C|Proto.KeepAlive.Response> {
    return super.request('KeepAlive', req)
  }

  public async getUserInfo(req: Proto.GetUserInfo.IC2S|Proto.GetUserInfo.Request): Promise<Proto.GetUserInfo.IS2C|Proto.GetUserInfo.Response> {
    return super.request('GetUserInfo', req)
  }

  public async getDelayStatistics(req: Proto.GetDelayStatistics.IC2S|Proto.GetDelayStatistics.Request): Promise<Proto.GetDelayStatistics.IS2C|Proto.GetDelayStatistics.Response> {
    return super.request('GetDelayStatistics', req)
  }

  public async qotSub(req: Proto.Qot_Sub.IC2S|Proto.Qot_Sub.Request): Promise<Proto.Qot_Sub.IS2C|Proto.Qot_Sub.Response> {
    return super.request('Qot_Sub', req)
  }

  public async qotRegQotPush(req: Proto.Qot_RegQotPush.IC2S|Proto.Qot_RegQotPush.Request): Promise<Proto.Qot_RegQotPush.IS2C|Proto.Qot_RegQotPush.Response> {
    return super.request('Qot_RegQotPush', req)
  }

  public async qotGetSubInfo(req: Proto.Qot_GetSubInfo.IC2S|Proto.Qot_GetSubInfo.Request): Promise<Proto.Qot_GetSubInfo.IS2C|Proto.Qot_GetSubInfo.Response> {
    return super.request('Qot_GetSubInfo', req)
  }

  public async qotGetBasicQot(req: Proto.Qot_GetBasicQot.IC2S|Proto.Qot_GetBasicQot.Request): Promise<Proto.Qot_GetBasicQot.IS2C|Proto.Qot_GetBasicQot.Response> {
    return super.request('Qot_GetBasicQot', req)
  }

  public async qotUpdateBasicQot(): Promise<Proto.Qot_UpdateBasicQot.IS2C|Proto.Qot_UpdateBasicQot.Response> {
    return super.request('Qot_UpdateBasicQot')
  }

  public async qotGetKL(req: Proto.Qot_GetKL.IC2S|Proto.Qot_GetKL.Request): Promise<Proto.Qot_GetKL.IS2C|Proto.Qot_GetKL.Response> {
    return super.request('Qot_GetKL', req)
  }

  public async qotUpdateKL(): Promise<Proto.Qot_UpdateKL.IS2C|Proto.Qot_UpdateKL.Response> {
    return super.request('Qot_UpdateKL')
  }

  public async qotGetRT(req: Proto.Qot_GetRT.IC2S|Proto.Qot_GetRT.Request): Promise<Proto.Qot_GetRT.IS2C|Proto.Qot_GetRT.Response> {
    return super.request('Qot_GetRT', req)
  }

  public async qotUpdateRT(): Promise<Proto.Qot_UpdateRT.IS2C|Proto.Qot_UpdateRT.Response> {
    return super.request('Qot_UpdateRT')
  }

  public async qotGetTicker(req: Proto.Qot_GetTicker.IC2S|Proto.Qot_GetTicker.Request): Promise<Proto.Qot_GetTicker.IS2C|Proto.Qot_GetTicker.Response> {
    return super.request('Qot_GetTicker', req)
  }

  public async qotUpdateTicker(): Promise<Proto.Qot_UpdateTicker.IS2C|Proto.Qot_UpdateTicker.Response> {
    return super.request('Qot_UpdateTicker')
  }

  public async qotGetOrderBook(req: Proto.Qot_GetOrderBook.IC2S|Proto.Qot_GetOrderBook.Request): Promise<Proto.Qot_GetOrderBook.IS2C|Proto.Qot_GetOrderBook.Response> {
    return super.request('Qot_GetOrderBook', req)
  }

  public async qotUpdateOrderBook(): Promise<Proto.Qot_UpdateOrderBook.IS2C|Proto.Qot_UpdateOrderBook.Response> {
    return super.request('Qot_UpdateOrderBook')
  }

  public async qotGetBroker(req: Proto.Qot_GetBroker.IC2S|Proto.Qot_GetBroker.Request): Promise<Proto.Qot_GetBroker.IS2C|Proto.Qot_GetBroker.Response> {
    return super.request('Qot_GetBroker', req)
  }

  public async qotUpdateBroker(): Promise<Proto.Qot_UpdateBroker.IS2C|Proto.Qot_UpdateBroker.Response> {
    return super.request('Qot_UpdateBroker')
  }

  public async qotGetOrderDetail(req: Proto.Qot_GetOrderDetail.IC2S|Proto.Qot_GetOrderDetail.Request): Promise<Proto.Qot_GetOrderDetail.IS2C|Proto.Qot_GetOrderDetail.Response> {
    return super.request('Qot_GetOrderDetail', req)
  }

  public async qotUpdateOrderDetail(): Promise<Proto.Qot_UpdateOrderDetail.IS2C|Proto.Qot_UpdateOrderDetail.Response> {
    return super.request('Qot_UpdateOrderDetail')
  }

  public async qotUpdatePriceReminder(): Promise<Proto.Qot_UpdatePriceReminder.IS2C|Proto.Qot_UpdatePriceReminder.Response> {
    return super.request('Qot_UpdatePriceReminder')
  }

  public async qotGetHistoryKL(req: Proto.Qot_GetHistoryKL.IC2S|Proto.Qot_GetHistoryKL.Request): Promise<Proto.Qot_GetHistoryKL.IS2C|Proto.Qot_GetHistoryKL.Response> {
    return super.request('Qot_GetHistoryKL', req)
  }

  public async qotGetHistoryKLPoints(req: Proto.Qot_GetHistoryKLPoints.IC2S|Proto.Qot_GetHistoryKLPoints.Request): Promise<Proto.Qot_GetHistoryKLPoints.IS2C|Proto.Qot_GetHistoryKLPoints.Response> {
    return super.request('Qot_GetHistoryKLPoints', req)
  }

  public async qotGetRehab(req: Proto.Qot_GetRehab.IC2S|Proto.Qot_GetRehab.Request): Promise<Proto.Qot_GetRehab.IS2C|Proto.Qot_GetRehab.Response> {
    return super.request('Qot_GetRehab', req)
  }

  public async qotRequestHistoryKL(req: Proto.Qot_RequestHistoryKL.IC2S|Proto.Qot_RequestHistoryKL.Request): Promise<Proto.Qot_RequestHistoryKL.IS2C|Proto.Qot_RequestHistoryKL.Response> {
    return super.request('Qot_RequestHistoryKL', req)
  }

  public async qotRequestHistoryKLQuota(req: Proto.Qot_RequestHistoryKLQuota.IC2S|Proto.Qot_RequestHistoryKLQuota.Request): Promise<Proto.Qot_RequestHistoryKLQuota.IS2C|Proto.Qot_RequestHistoryKLQuota.Response> {
    return super.request('Qot_RequestHistoryKLQuota', req)
  }

  public async qotRequestRehab(req: Proto.Qot_RequestRehab.IC2S|Proto.Qot_RequestRehab.Request): Promise<Proto.Qot_RequestRehab.IS2C|Proto.Qot_RequestRehab.Response> {
    return super.request('Qot_RequestRehab', req)
  }

  public async qotGetTradeDate(req: Proto.Qot_GetTradeDate.IC2S|Proto.Qot_GetTradeDate.Request): Promise<Proto.Qot_GetTradeDate.IS2C|Proto.Qot_GetTradeDate.Response> {
    return super.request('Qot_GetTradeDate', req)
  }

  public async qotGetSuspend(req: Proto.Qot_GetSuspend.IC2S|Proto.Qot_GetSuspend.Request): Promise<Proto.Qot_GetSuspend.IS2C|Proto.Qot_GetSuspend.Response> {
    return super.request('Qot_GetSuspend', req)
  }

  public async qotGetStaticInfo(req: Proto.Qot_GetStaticInfo.IC2S|Proto.Qot_GetStaticInfo.Request): Promise<Proto.Qot_GetStaticInfo.IS2C|Proto.Qot_GetStaticInfo.Response> {
    return super.request('Qot_GetStaticInfo', req)
  }

  public async qotGetSecuritySnapshot(req: Proto.Qot_GetSecuritySnapshot.IC2S|Proto.Qot_GetSecuritySnapshot.Request): Promise<Proto.Qot_GetSecuritySnapshot.IS2C|Proto.Qot_GetSecuritySnapshot.Response> {
    return super.request('Qot_GetSecuritySnapshot', req)
  }

  public async qotGetPlateSet(req: Proto.Qot_GetPlateSet.IC2S|Proto.Qot_GetPlateSet.Request): Promise<Proto.Qot_GetPlateSet.IS2C|Proto.Qot_GetPlateSet.Response> {
    return super.request('Qot_GetPlateSet', req)
  }

  public async qotGetPlateSecurity(req: Proto.Qot_GetPlateSecurity.IC2S|Proto.Qot_GetPlateSecurity.Request): Promise<Proto.Qot_GetPlateSecurity.IS2C|Proto.Qot_GetPlateSecurity.Response> {
    return super.request('Qot_GetPlateSecurity', req)
  }

  public async qotGetReference(req: Proto.Qot_GetReference.IC2S|Proto.Qot_GetReference.Request): Promise<Proto.Qot_GetReference.IS2C|Proto.Qot_GetReference.Response> {
    return super.request('Qot_GetReference', req)
  }

  public async qotGetOwnerPlate(req: Proto.Qot_GetOwnerPlate.IC2S|Proto.Qot_GetOwnerPlate.Request): Promise<Proto.Qot_GetOwnerPlate.IS2C|Proto.Qot_GetOwnerPlate.Response> {
    return super.request('Qot_GetOwnerPlate', req)
  }

  public async qotGetHoldingChangeList(req: Proto.Qot_GetHoldingChangeList.IC2S|Proto.Qot_GetHoldingChangeList.Request): Promise<Proto.Qot_GetHoldingChangeList.IS2C|Proto.Qot_GetHoldingChangeList.Response> {
    return super.request('Qot_GetHoldingChangeList', req)
  }

  public async qotGetOptionChain(req: Proto.Qot_GetOptionChain.IC2S|Proto.Qot_GetOptionChain.Request): Promise<Proto.Qot_GetOptionChain.IS2C|Proto.Qot_GetOptionChain.Response> {
    return super.request('Qot_GetOptionChain', req)
  }

  public async qotGetWarrant(req: Proto.Qot_GetWarrant.IC2S|Proto.Qot_GetWarrant.Request): Promise<Proto.Qot_GetWarrant.IS2C|Proto.Qot_GetWarrant.Response> {
    return super.request('Qot_GetWarrant', req)
  }

  public async qotGetCapitalFlow(req: Proto.Qot_GetCapitalFlow.IC2S|Proto.Qot_GetCapitalFlow.Request): Promise<Proto.Qot_GetCapitalFlow.IS2C|Proto.Qot_GetCapitalFlow.Response> {
    return super.request('Qot_GetCapitalFlow', req)
  }

  public async qotGetCapitalDistribution(req: Proto.Qot_GetCapitalDistribution.IC2S|Proto.Qot_GetCapitalDistribution.Request): Promise<Proto.Qot_GetCapitalDistribution.IS2C|Proto.Qot_GetCapitalDistribution.Response> {
    return super.request('Qot_GetCapitalDistribution', req)
  }

  public async qotGetUserSecurity(req: Proto.Qot_GetUserSecurity.IC2S|Proto.Qot_GetUserSecurity.Request): Promise<Proto.Qot_GetUserSecurity.IS2C|Proto.Qot_GetUserSecurity.Response> {
    return super.request('Qot_GetUserSecurity', req)
  }

  public async qotModifyUserSecurity(req: Proto.Qot_ModifyUserSecurity.IC2S|Proto.Qot_ModifyUserSecurity.Request): Promise<Proto.Qot_ModifyUserSecurity.IS2C|Proto.Qot_ModifyUserSecurity.Response> {
    return super.request('Qot_ModifyUserSecurity', req)
  }

  public async qotStockFilter(req: Proto.Qot_StockFilter.IC2S|Proto.Qot_StockFilter.Request): Promise<Proto.Qot_StockFilter.IS2C|Proto.Qot_StockFilter.Response> {
    return super.request('Qot_StockFilter', req)
  }

  public async qotGetCodeChange(req: Proto.Qot_GetCodeChange.IC2S|Proto.Qot_GetCodeChange.Request): Promise<Proto.Qot_GetCodeChange.IS2C|Proto.Qot_GetCodeChange.Response> {
    return super.request('Qot_GetCodeChange', req)
  }

  public async qotGetIpoList(req: Proto.Qot_GetIpoList.IC2S|Proto.Qot_GetIpoList.Request): Promise<Proto.Qot_GetIpoList.IS2C|Proto.Qot_GetIpoList.Response> {
    return super.request('Qot_GetIpoList', req)
  }

  public async qotGetFutureInfo(req: Proto.Qot_GetFutureInfo.IC2S|Proto.Qot_GetFutureInfo.Request): Promise<Proto.Qot_GetFutureInfo.IS2C|Proto.Qot_GetFutureInfo.Response> {
    return super.request('Qot_GetFutureInfo', req)
  }

  public async qotRequestTradeDate(req: Proto.Qot_RequestTradeDate.IC2S|Proto.Qot_RequestTradeDate.Request): Promise<Proto.Qot_RequestTradeDate.IS2C|Proto.Qot_RequestTradeDate.Response> {
    return super.request('Qot_RequestTradeDate', req)
  }

  public async qotSetPriceReminder(req: Proto.Qot_SetPriceReminder.IC2S|Proto.Qot_SetPriceReminder.Request): Promise<Proto.Qot_SetPriceReminder.IS2C|Proto.Qot_SetPriceReminder.Response> {
    return super.request('Qot_SetPriceReminder', req)
  }

  public async qotGetPriceReminder(req: Proto.Qot_GetPriceReminder.IC2S|Proto.Qot_GetPriceReminder.Request): Promise<Proto.Qot_GetPriceReminder.IS2C|Proto.Qot_GetPriceReminder.Response> {
    return super.request('Qot_GetPriceReminder', req)
  }

  public async qotGetUserSecurityGroup(req: Proto.Qot_GetUserSecurityGroup.IC2S|Proto.Qot_GetUserSecurityGroup.Request): Promise<Proto.Qot_GetUserSecurityGroup.IS2C|Proto.Qot_GetUserSecurityGroup.Response> {
    return super.request('Qot_GetUserSecurityGroup', req)
  }

  public async trdGetAccList(req: Proto.Trd_GetAccList.IC2S|Proto.Trd_GetAccList.Request): Promise<Proto.Trd_GetAccList.IS2C|Proto.Trd_GetAccList.Response> {
    return super.request('Trd_GetAccList', req)
  }

  public async trdUnlockTrade(req: Proto.Trd_UnlockTrade.IC2S|Proto.Trd_UnlockTrade.Request): Promise<Proto.Trd_UnlockTrade.IS2C|Proto.Trd_UnlockTrade.Response> {
    return super.request('Trd_UnlockTrade', req)
  }

  public async trdSubAccPush(req: Proto.Trd_SubAccPush.IC2S|Proto.Trd_SubAccPush.Request): Promise<Proto.Trd_SubAccPush.IS2C|Proto.Trd_SubAccPush.Response> {
    return super.request('Trd_SubAccPush', req)
  }

  public async trdGetFunds(req: Proto.Trd_GetFunds.IC2S|Proto.Trd_GetFunds.Request): Promise<Proto.Trd_GetFunds.IS2C|Proto.Trd_GetFunds.Response> {
    return super.request('Trd_GetFunds', req)
  }

  public async trdGetPositionList(req: Proto.Trd_GetPositionList.IC2S|Proto.Trd_GetPositionList.Request): Promise<Proto.Trd_GetPositionList.IS2C|Proto.Trd_GetPositionList.Response> {
    return super.request('Trd_GetPositionList', req)
  }

  public async trdGetMaxTrdQtys(req: Proto.Trd_GetMaxTrdQtys.IC2S|Proto.Trd_GetMaxTrdQtys.Request): Promise<Proto.Trd_GetMaxTrdQtys.IS2C|Proto.Trd_GetMaxTrdQtys.Response> {
    return super.request('Trd_GetMaxTrdQtys', req)
  }

  public async trdGetOrderList(req: Proto.Trd_GetOrderList.IC2S|Proto.Trd_GetOrderList.Request): Promise<Proto.Trd_GetOrderList.IS2C|Proto.Trd_GetOrderList.Response> {
    return super.request('Trd_GetOrderList', req)
  }

  public async trdPlaceOrder(req: Proto.Trd_PlaceOrder.IC2S|Proto.Trd_PlaceOrder.Request): Promise<Proto.Trd_PlaceOrder.IS2C|Proto.Trd_PlaceOrder.Response> {
    return super.request('Trd_PlaceOrder', req)
  }

  public async trdModifyOrder(req: Proto.Trd_ModifyOrder.IC2S|Proto.Trd_ModifyOrder.Request): Promise<Proto.Trd_ModifyOrder.IS2C|Proto.Trd_ModifyOrder.Response> {
    return super.request('Trd_ModifyOrder', req)
  }

  public async trdUpdateOrder(): Promise<Proto.Trd_UpdateOrder.IS2C|Proto.Trd_UpdateOrder.Response> {
    return super.request('Trd_UpdateOrder')
  }

  public async trdGetOrderFillList(req: Proto.Trd_GetOrderFillList.IC2S|Proto.Trd_GetOrderFillList.Request): Promise<Proto.Trd_GetOrderFillList.IS2C|Proto.Trd_GetOrderFillList.Response> {
    return super.request('Trd_GetOrderFillList', req)
  }

  public async trdUpdateOrderFill(): Promise<Proto.Trd_UpdateOrderFill.IS2C|Proto.Trd_UpdateOrderFill.Response> {
    return super.request('Trd_UpdateOrderFill')
  }

  public async trdGetHistoryOrderList(req: Proto.Trd_GetHistoryOrderList.IC2S|Proto.Trd_GetHistoryOrderList.Request): Promise<Proto.Trd_GetHistoryOrderList.IS2C|Proto.Trd_GetHistoryOrderList.Response> {
    return super.request('Trd_GetHistoryOrderList', req)
  }

  public async trdGetHistoryOrderFillList(req: Proto.Trd_GetHistoryOrderFillList.IC2S|Proto.Trd_GetHistoryOrderFillList.Request): Promise<Proto.Trd_GetHistoryOrderFillList.IS2C|Proto.Trd_GetHistoryOrderFillList.Response> {
    return super.request('Trd_GetHistoryOrderFillList', req)
  }

}