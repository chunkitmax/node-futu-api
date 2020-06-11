import * as Proto from './proto/proto';
import WebSocket from './ws';

export { Proto }

export type FutuConfig = {
  // server
  ip?: string
  port?: number
  recvNotify?: boolean
  // user
  userID: number
  pwdMd5: string
  // account
  account?: {
    market?: Proto.Trd_Common.TrdMarket
    env?: Proto.Trd_Common.TrdEnv
    accType?: Proto.Trd_Common.TrdAccType
  }
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
  account: {
    market: Proto.Trd_Common.TrdMarket.TrdMarket_HK,
    env: Proto.Trd_Common.TrdEnv.TrdEnv_Real,
    accType: Proto.Trd_Common.TrdAccType.TrdAccType_Cash
  },
  // websocket
  isSSL: false,
  wsKey: null,
  reqTimeout: 10000
}

type AutoFilled<T> = Omit<T,
  'header' |
  'packetID' |
  'userID'
>

type MayOptional<T> = (keyof T extends never? void : T)

export default class Futu extends WebSocket {

  constructor(config: FutuConfig) {
    super(Object.assign({}, DefaultConfig, config))
  }

  public get ready() {
    return super.ready
  }

  public close() {
    super.close()
  }

  public async initWebSocket(req: MayOptional<AutoFilled<Proto.InitWebSocket.IC2S>>): Promise<Proto.InitWebSocket.IS2C> {
    return super.request('InitWebSocket', req)
  }

  public async initConnect(req: MayOptional<AutoFilled<Proto.InitConnect.IC2S>>): Promise<Proto.InitConnect.IS2C> {
    return super.request('InitConnect', req)
  }

  public async getGlobalState(req: MayOptional<AutoFilled<Proto.GetGlobalState.IC2S>>): Promise<Proto.GetGlobalState.IS2C> {
    return super.request('GetGlobalState', req)
  }

  public async notify(): Promise<Proto.Notify.IS2C> {
    return super.request('Notify')
  }

  public async keepAlive(req: MayOptional<AutoFilled<Proto.KeepAlive.IC2S>>): Promise<Proto.KeepAlive.IS2C> {
    return super.request('KeepAlive', req)
  }

  public async getUserInfo(req: MayOptional<AutoFilled<Proto.GetUserInfo.IC2S>>): Promise<Proto.GetUserInfo.IS2C> {
    return super.request('GetUserInfo', req)
  }

  public async getDelayStatistics(req: MayOptional<AutoFilled<Proto.GetDelayStatistics.IC2S>>): Promise<Proto.GetDelayStatistics.IS2C> {
    return super.request('GetDelayStatistics', req)
  }

  public async qotSub(req: MayOptional<AutoFilled<Proto.Qot_Sub.IC2S>>): Promise<Proto.Qot_Sub.IS2C> {
    return super.request('Qot_Sub', req)
  }

  public async qotRegQotPush(req: MayOptional<AutoFilled<Proto.Qot_RegQotPush.IC2S>>): Promise<Proto.Qot_RegQotPush.IS2C> {
    return super.request('Qot_RegQotPush', req)
  }

  public async qotGetSubInfo(req: MayOptional<AutoFilled<Proto.Qot_GetSubInfo.IC2S>>): Promise<Proto.Qot_GetSubInfo.IS2C> {
    return super.request('Qot_GetSubInfo', req)
  }

  public async qotGetBasicQot(req: MayOptional<AutoFilled<Proto.Qot_GetBasicQot.IC2S>>): Promise<Proto.Qot_GetBasicQot.IS2C> {
    return super.request('Qot_GetBasicQot', req)
  }

  public async qotUpdateBasicQot(): Promise<Proto.Qot_UpdateBasicQot.IS2C> {
    return super.request('Qot_UpdateBasicQot')
  }

  public async qotGetKL(req: MayOptional<AutoFilled<Proto.Qot_GetKL.IC2S>>): Promise<Proto.Qot_GetKL.IS2C> {
    return super.request('Qot_GetKL', req)
  }

  public async qotUpdateKL(): Promise<Proto.Qot_UpdateKL.IS2C> {
    return super.request('Qot_UpdateKL')
  }

  public async qotGetRT(req: MayOptional<AutoFilled<Proto.Qot_GetRT.IC2S>>): Promise<Proto.Qot_GetRT.IS2C> {
    return super.request('Qot_GetRT', req)
  }

  public async qotUpdateRT(): Promise<Proto.Qot_UpdateRT.IS2C> {
    return super.request('Qot_UpdateRT')
  }

  public async qotGetTicker(req: MayOptional<AutoFilled<Proto.Qot_GetTicker.IC2S>>): Promise<Proto.Qot_GetTicker.IS2C> {
    return super.request('Qot_GetTicker', req)
  }

  public async qotUpdateTicker(): Promise<Proto.Qot_UpdateTicker.IS2C> {
    return super.request('Qot_UpdateTicker')
  }

  public async qotGetOrderBook(req: MayOptional<AutoFilled<Proto.Qot_GetOrderBook.IC2S>>): Promise<Proto.Qot_GetOrderBook.IS2C> {
    return super.request('Qot_GetOrderBook', req)
  }

  public async qotUpdateOrderBook(): Promise<Proto.Qot_UpdateOrderBook.IS2C> {
    return super.request('Qot_UpdateOrderBook')
  }

  public async qotGetBroker(req: MayOptional<AutoFilled<Proto.Qot_GetBroker.IC2S>>): Promise<Proto.Qot_GetBroker.IS2C> {
    return super.request('Qot_GetBroker', req)
  }

  public async qotUpdateBroker(): Promise<Proto.Qot_UpdateBroker.IS2C> {
    return super.request('Qot_UpdateBroker')
  }

  public async qotGetOrderDetail(req: MayOptional<AutoFilled<Proto.Qot_GetOrderDetail.IC2S>>): Promise<Proto.Qot_GetOrderDetail.IS2C> {
    return super.request('Qot_GetOrderDetail', req)
  }

  public async qotUpdateOrderDetail(): Promise<Proto.Qot_UpdateOrderDetail.IS2C> {
    return super.request('Qot_UpdateOrderDetail')
  }

  public async qotUpdatePriceReminder(): Promise<Proto.Qot_UpdatePriceReminder.IS2C> {
    return super.request('Qot_UpdatePriceReminder')
  }

  public async qotGetHistoryKL(req: MayOptional<AutoFilled<Proto.Qot_GetHistoryKL.IC2S>>): Promise<Proto.Qot_GetHistoryKL.IS2C> {
    return super.request('Qot_GetHistoryKL', req)
  }

  public async qotGetHistoryKLPoints(req: MayOptional<AutoFilled<Proto.Qot_GetHistoryKLPoints.IC2S>>): Promise<Proto.Qot_GetHistoryKLPoints.IS2C> {
    return super.request('Qot_GetHistoryKLPoints', req)
  }

  public async qotGetRehab(req: MayOptional<AutoFilled<Proto.Qot_GetRehab.IC2S>>): Promise<Proto.Qot_GetRehab.IS2C> {
    return super.request('Qot_GetRehab', req)
  }

  public async qotRequestHistoryKL(req: MayOptional<AutoFilled<Proto.Qot_RequestHistoryKL.IC2S>>): Promise<Proto.Qot_RequestHistoryKL.IS2C> {
    return super.request('Qot_RequestHistoryKL', req)
  }

  public async qotRequestHistoryKLQuota(req: MayOptional<AutoFilled<Proto.Qot_RequestHistoryKLQuota.IC2S>>): Promise<Proto.Qot_RequestHistoryKLQuota.IS2C> {
    return super.request('Qot_RequestHistoryKLQuota', req)
  }

  public async qotRequestRehab(req: MayOptional<AutoFilled<Proto.Qot_RequestRehab.IC2S>>): Promise<Proto.Qot_RequestRehab.IS2C> {
    return super.request('Qot_RequestRehab', req)
  }

  public async qotGetTradeDate(req: MayOptional<AutoFilled<Proto.Qot_GetTradeDate.IC2S>>): Promise<Proto.Qot_GetTradeDate.IS2C> {
    return super.request('Qot_GetTradeDate', req)
  }

  public async qotGetSuspend(req: MayOptional<AutoFilled<Proto.Qot_GetSuspend.IC2S>>): Promise<Proto.Qot_GetSuspend.IS2C> {
    return super.request('Qot_GetSuspend', req)
  }

  public async qotGetStaticInfo(req: MayOptional<AutoFilled<Proto.Qot_GetStaticInfo.IC2S>>): Promise<Proto.Qot_GetStaticInfo.IS2C> {
    return super.request('Qot_GetStaticInfo', req)
  }

  public async qotGetSecuritySnapshot(req: MayOptional<AutoFilled<Proto.Qot_GetSecuritySnapshot.IC2S>>): Promise<Proto.Qot_GetSecuritySnapshot.IS2C> {
    return super.request('Qot_GetSecuritySnapshot', req)
  }

  public async qotGetPlateSet(req: MayOptional<AutoFilled<Proto.Qot_GetPlateSet.IC2S>>): Promise<Proto.Qot_GetPlateSet.IS2C> {
    return super.request('Qot_GetPlateSet', req)
  }

  public async qotGetPlateSecurity(req: MayOptional<AutoFilled<Proto.Qot_GetPlateSecurity.IC2S>>): Promise<Proto.Qot_GetPlateSecurity.IS2C> {
    return super.request('Qot_GetPlateSecurity', req)
  }

  public async qotGetReference(req: MayOptional<AutoFilled<Proto.Qot_GetReference.IC2S>>): Promise<Proto.Qot_GetReference.IS2C> {
    return super.request('Qot_GetReference', req)
  }

  public async qotGetOwnerPlate(req: MayOptional<AutoFilled<Proto.Qot_GetOwnerPlate.IC2S>>): Promise<Proto.Qot_GetOwnerPlate.IS2C> {
    return super.request('Qot_GetOwnerPlate', req)
  }

  public async qotGetHoldingChangeList(req: MayOptional<AutoFilled<Proto.Qot_GetHoldingChangeList.IC2S>>): Promise<Proto.Qot_GetHoldingChangeList.IS2C> {
    return super.request('Qot_GetHoldingChangeList', req)
  }

  public async qotGetOptionChain(req: MayOptional<AutoFilled<Proto.Qot_GetOptionChain.IC2S>>): Promise<Proto.Qot_GetOptionChain.IS2C> {
    return super.request('Qot_GetOptionChain', req)
  }

  public async qotGetWarrant(req: MayOptional<AutoFilled<Proto.Qot_GetWarrant.IC2S>>): Promise<Proto.Qot_GetWarrant.IS2C> {
    return super.request('Qot_GetWarrant', req)
  }

  public async qotGetCapitalFlow(req: MayOptional<AutoFilled<Proto.Qot_GetCapitalFlow.IC2S>>): Promise<Proto.Qot_GetCapitalFlow.IS2C> {
    return super.request('Qot_GetCapitalFlow', req)
  }

  public async qotGetCapitalDistribution(req: MayOptional<AutoFilled<Proto.Qot_GetCapitalDistribution.IC2S>>): Promise<Proto.Qot_GetCapitalDistribution.IS2C> {
    return super.request('Qot_GetCapitalDistribution', req)
  }

  public async qotGetUserSecurity(req: MayOptional<AutoFilled<Proto.Qot_GetUserSecurity.IC2S>>): Promise<Proto.Qot_GetUserSecurity.IS2C> {
    return super.request('Qot_GetUserSecurity', req)
  }

  public async qotModifyUserSecurity(req: MayOptional<AutoFilled<Proto.Qot_ModifyUserSecurity.IC2S>>): Promise<Proto.Qot_ModifyUserSecurity.IS2C> {
    return super.request('Qot_ModifyUserSecurity', req)
  }

  public async qotStockFilter(req: MayOptional<AutoFilled<Proto.Qot_StockFilter.IC2S>>): Promise<Proto.Qot_StockFilter.IS2C> {
    return super.request('Qot_StockFilter', req)
  }

  public async qotGetCodeChange(req: MayOptional<AutoFilled<Proto.Qot_GetCodeChange.IC2S>>): Promise<Proto.Qot_GetCodeChange.IS2C> {
    return super.request('Qot_GetCodeChange', req)
  }

  public async qotGetIpoList(req: MayOptional<AutoFilled<Proto.Qot_GetIpoList.IC2S>>): Promise<Proto.Qot_GetIpoList.IS2C> {
    return super.request('Qot_GetIpoList', req)
  }

  public async qotGetFutureInfo(req: MayOptional<AutoFilled<Proto.Qot_GetFutureInfo.IC2S>>): Promise<Proto.Qot_GetFutureInfo.IS2C> {
    return super.request('Qot_GetFutureInfo', req)
  }

  public async qotRequestTradeDate(req: MayOptional<AutoFilled<Proto.Qot_RequestTradeDate.IC2S>>): Promise<Proto.Qot_RequestTradeDate.IS2C> {
    return super.request('Qot_RequestTradeDate', req)
  }

  public async qotSetPriceReminder(req: MayOptional<AutoFilled<Proto.Qot_SetPriceReminder.IC2S>>): Promise<Proto.Qot_SetPriceReminder.IS2C> {
    return super.request('Qot_SetPriceReminder', req)
  }

  public async qotGetPriceReminder(req: MayOptional<AutoFilled<Proto.Qot_GetPriceReminder.IC2S>>): Promise<Proto.Qot_GetPriceReminder.IS2C> {
    return super.request('Qot_GetPriceReminder', req)
  }

  public async qotGetUserSecurityGroup(req: MayOptional<AutoFilled<Proto.Qot_GetUserSecurityGroup.IC2S>>): Promise<Proto.Qot_GetUserSecurityGroup.IS2C> {
    return super.request('Qot_GetUserSecurityGroup', req)
  }

  public async trdGetAccList(req: MayOptional<AutoFilled<Proto.Trd_GetAccList.IC2S>>): Promise<Proto.Trd_GetAccList.IS2C> {
    return super.request('Trd_GetAccList', req)
  }

  public async trdUnlockTrade(req: MayOptional<AutoFilled<Proto.Trd_UnlockTrade.IC2S>>): Promise<Proto.Trd_UnlockTrade.IS2C> {
    return super.request('Trd_UnlockTrade', req)
  }

  public async trdSubAccPush(req: MayOptional<AutoFilled<Proto.Trd_SubAccPush.IC2S>>): Promise<Proto.Trd_SubAccPush.IS2C> {
    return super.request('Trd_SubAccPush', req)
  }

  public async trdGetFunds(req: MayOptional<AutoFilled<Proto.Trd_GetFunds.IC2S>>): Promise<Proto.Trd_GetFunds.IS2C> {
    return super.request('Trd_GetFunds', req)
  }

  public async trdGetPositionList(req: MayOptional<AutoFilled<Proto.Trd_GetPositionList.IC2S>>): Promise<Proto.Trd_GetPositionList.IS2C> {
    return super.request('Trd_GetPositionList', req)
  }

  public async trdGetMaxTrdQtys(req: MayOptional<AutoFilled<Proto.Trd_GetMaxTrdQtys.IC2S>>): Promise<Proto.Trd_GetMaxTrdQtys.IS2C> {
    return super.request('Trd_GetMaxTrdQtys', req)
  }

  public async trdGetOrderList(req: MayOptional<AutoFilled<Proto.Trd_GetOrderList.IC2S>>): Promise<Proto.Trd_GetOrderList.IS2C> {
    return super.request('Trd_GetOrderList', req)
  }

  public async trdPlaceOrder(req: MayOptional<AutoFilled<Proto.Trd_PlaceOrder.IC2S>>): Promise<Proto.Trd_PlaceOrder.IS2C> {
    return super.request('Trd_PlaceOrder', req)
  }

  public async trdModifyOrder(req: MayOptional<AutoFilled<Proto.Trd_ModifyOrder.IC2S>>): Promise<Proto.Trd_ModifyOrder.IS2C> {
    return super.request('Trd_ModifyOrder', req)
  }

  public async trdUpdateOrder(): Promise<Proto.Trd_UpdateOrder.IS2C> {
    return super.request('Trd_UpdateOrder')
  }

  public async trdGetOrderFillList(req: MayOptional<AutoFilled<Proto.Trd_GetOrderFillList.IC2S>>): Promise<Proto.Trd_GetOrderFillList.IS2C> {
    return super.request('Trd_GetOrderFillList', req)
  }

  public async trdUpdateOrderFill(): Promise<Proto.Trd_UpdateOrderFill.IS2C> {
    return super.request('Trd_UpdateOrderFill')
  }

  public async trdGetHistoryOrderList(req: MayOptional<AutoFilled<Proto.Trd_GetHistoryOrderList.IC2S>>): Promise<Proto.Trd_GetHistoryOrderList.IS2C> {
    return super.request('Trd_GetHistoryOrderList', req)
  }

  public async trdGetHistoryOrderFillList(req: MayOptional<AutoFilled<Proto.Trd_GetHistoryOrderFillList.IC2S>>): Promise<Proto.Trd_GetHistoryOrderFillList.IS2C> {
    return super.request('Trd_GetHistoryOrderFillList', req)
  }

}

if (require.main === module) {
  (async () => {
    const ft = new Futu(require('../../futu_config.json'))

    const targetSec = {
      code: 'YMmain',
      market: Proto.Qot_Common.QotMarket.QotMarket_US_Security
    }
    await ft.ready
    ft.on<Proto.Qot_Common.Ticker>(Proto.Qot_Common.SubType.SubType_Ticker, targetSec, data => {
      console.log('push', data)
    })

    console.log(await ft.trdGetFunds({
      currency: Proto.Trd_Common.Currency.Currency_HKD
    }))
    console.log(await ft.trdGetAccList())
    // const order = await ft.trdPlaceOrder({
    //   code: '00700',
    //   orderType: Proto.Trd_Common.OrderType.OrderType_AbsoluteLimit,
    //   qty: 100,
    //   trdSide: Proto.Trd_Common.TrdSide.TrdSide_Buy,
    //   price: 1.0,
    //   secMarket: Proto.Trd_Common.TrdSecMarket.TrdSecMarket_HK
    // })
    // console.log(order)
    await ft.qotSub({
      isSubOrUnSub: true,
      isRegOrUnRegPush: true,
      subTypeList: [Proto.Qot_Common.SubType.SubType_Ticker],
      regPushRehabTypeList: [Proto.Qot_Common.RehabType.RehabType_Forward],
      securityList: [targetSec]
    })
    await new Promise(resolve => setTimeout(resolve, 60000))
    await ft.qotSub({
      isSubOrUnSub: false,
      isUnsubAll: true
    })
  })()
}