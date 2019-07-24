
import * as Proto from './proto/proto';
import Socket from './socket';

export default class ProtoMethods {

  protected socket: Socket

  constructor(socket: Socket) {
    this.socket = socket
  }
  
  public initConnect(params: Proto.InitConnect.IC2S): Promise<Proto.InitConnect.IS2C> {
    return this.socket.send('InitConnect', params)
  }
      

  public getGlobalState(params: Proto.GetGlobalState.IC2S): Promise<Proto.GetGlobalState.IS2C> {
    return this.socket.send('GetGlobalState', params)
  }
      

  public keepAlive(params: Proto.KeepAlive.IC2S): Promise<Proto.KeepAlive.IS2C> {
    return this.socket.send('KeepAlive', params)
  }
      

  public trdGetAccList(params: Proto.Trd_GetAccList.IC2S): Promise<Proto.Trd_GetAccList.IS2C> {
    return this.socket.send('Trd_GetAccList', params)
  }
      

  public trdUnlockTrade(params: Proto.Trd_UnlockTrade.IC2S): Promise<Proto.Trd_UnlockTrade.IS2C> {
    return this.socket.send('Trd_UnlockTrade', params)
  }
      

  public trdSubAccPush(params: Proto.Trd_SubAccPush.IC2S): Promise<Proto.Trd_SubAccPush.IS2C> {
    return this.socket.send('Trd_SubAccPush', params)
  }
      

  public trdGetFunds(params: Proto.Trd_GetFunds.IC2S): Promise<Proto.Trd_GetFunds.IS2C> {
    return this.socket.send('Trd_GetFunds', params)
  }
      

  public trdGetPositionList(params: Proto.Trd_GetPositionList.IC2S): Promise<Proto.Trd_GetPositionList.IS2C> {
    return this.socket.send('Trd_GetPositionList', params)
  }
      

  public trdGetMaxTrdQtys(params: Proto.Trd_GetMaxTrdQtys.IC2S): Promise<Proto.Trd_GetMaxTrdQtys.IS2C> {
    return this.socket.send('Trd_GetMaxTrdQtys', params)
  }
      

  public trdGetOrderList(params: Proto.Trd_GetOrderList.IC2S): Promise<Proto.Trd_GetOrderList.IS2C> {
    return this.socket.send('Trd_GetOrderList', params)
  }
      

  public trdPlaceOrder(params: Proto.Trd_PlaceOrder.IC2S): Promise<Proto.Trd_PlaceOrder.IS2C> {
    return this.socket.send('Trd_PlaceOrder', params)
  }
      

  public trdModifyOrder(params: Proto.Trd_ModifyOrder.IC2S): Promise<Proto.Trd_ModifyOrder.IS2C> {
    return this.socket.send('Trd_ModifyOrder', params)
  }
      

  public trdGetOrderFillList(params: Proto.Trd_GetOrderFillList.IC2S): Promise<Proto.Trd_GetOrderFillList.IS2C> {
    return this.socket.send('Trd_GetOrderFillList', params)
  }
      

  public trdGetHistoryOrderList(params: Proto.Trd_GetHistoryOrderList.IC2S): Promise<Proto.Trd_GetHistoryOrderList.IS2C> {
    return this.socket.send('Trd_GetHistoryOrderList', params)
  }
      

  public trdGetHistoryOrderFillList(params: Proto.Trd_GetHistoryOrderFillList.IC2S): Promise<Proto.Trd_GetHistoryOrderFillList.IS2C> {
    return this.socket.send('Trd_GetHistoryOrderFillList', params)
  }
      

  public qotSub(params: Proto.Qot_Sub.IC2S): Promise<Proto.Qot_Sub.IS2C> {
    return this.socket.send('Qot_Sub', params)
  }
      

  public qotRegQotPush(params: Proto.Qot_RegQotPush.IC2S): Promise<Proto.Qot_RegQotPush.IS2C> {
    return this.socket.send('Qot_RegQotPush', params)
  }
      

  public qotGetSubInfo(params: Proto.Qot_GetSubInfo.IC2S): Promise<Proto.Qot_GetSubInfo.IS2C> {
    return this.socket.send('Qot_GetSubInfo', params)
  }
      

  public qotGetBasicQot(params: Proto.Qot_GetBasicQot.IC2S): Promise<Proto.Qot_GetBasicQot.IS2C> {
    return this.socket.send('Qot_GetBasicQot', params)
  }
      

  public qotGetKL(params: Proto.Qot_GetKL.IC2S): Promise<Proto.Qot_GetKL.IS2C> {
    return this.socket.send('Qot_GetKL', params)
  }
      

  public qotGetRT(params: Proto.Qot_GetRT.IC2S): Promise<Proto.Qot_GetRT.IS2C> {
    return this.socket.send('Qot_GetRT', params)
  }
      

  public qotGetTicker(params: Proto.Qot_GetTicker.IC2S): Promise<Proto.Qot_GetTicker.IS2C> {
    return this.socket.send('Qot_GetTicker', params)
  }
      

  public qotGetOrderBook(params: Proto.Qot_GetOrderBook.IC2S): Promise<Proto.Qot_GetOrderBook.IS2C> {
    return this.socket.send('Qot_GetOrderBook', params)
  }
      

  public qotGetBroker(params: Proto.Qot_GetBroker.IC2S): Promise<Proto.Qot_GetBroker.IS2C> {
    return this.socket.send('Qot_GetBroker', params)
  }
      

  public qotGetHistoryKL(params: Proto.Qot_GetHistoryKL.IC2S): Promise<Proto.Qot_GetHistoryKL.IS2C> {
    return this.socket.send('Qot_GetHistoryKL', params)
  }
      

  public qotGetHistoryKLPoints(params: Proto.Qot_GetHistoryKLPoints.IC2S): Promise<Proto.Qot_GetHistoryKLPoints.IS2C> {
    return this.socket.send('Qot_GetHistoryKLPoints', params)
  }
      

  public qotGetRehab(params: Proto.Qot_GetRehab.IC2S): Promise<Proto.Qot_GetRehab.IS2C> {
    return this.socket.send('Qot_GetRehab', params)
  }
      

  public qotRequestHistoryKL(params: Proto.Qot_RequestHistoryKL.IC2S): Promise<Proto.Qot_RequestHistoryKL.IS2C> {
    return this.socket.send('Qot_RequestHistoryKL', params)
  }
      

  public qotRequestRehab(params: Proto.Qot_RequestRehab.IC2S): Promise<Proto.Qot_RequestRehab.IS2C> {
    return this.socket.send('Qot_RequestRehab', params)
  }
      

  public qotGetTradeDate(params: Proto.Qot_GetTradeDate.IC2S): Promise<Proto.Qot_GetTradeDate.IS2C> {
    return this.socket.send('Qot_GetTradeDate', params)
  }
      

  public qotGetStaticInfo(params: Proto.Qot_GetStaticInfo.IC2S): Promise<Proto.Qot_GetStaticInfo.IS2C> {
    return this.socket.send('Qot_GetStaticInfo', params)
  }
      

  public qotGetSecuritySnapshot(params: Proto.Qot_GetSecuritySnapshot.IC2S): Promise<Proto.Qot_GetSecuritySnapshot.IS2C> {
    return this.socket.send('Qot_GetSecuritySnapshot', params)
  }
      

  public qotGetPlateSet(params: Proto.Qot_GetPlateSet.IC2S): Promise<Proto.Qot_GetPlateSet.IS2C> {
    return this.socket.send('Qot_GetPlateSet', params)
  }
      

  public qotGetPlateSecurity(params: Proto.Qot_GetPlateSecurity.IC2S): Promise<Proto.Qot_GetPlateSecurity.IS2C> {
    return this.socket.send('Qot_GetPlateSecurity', params)
  }
      

  public qotGetReference(params: Proto.Qot_GetReference.IC2S): Promise<Proto.Qot_GetReference.IS2C> {
    return this.socket.send('Qot_GetReference', params)
  }
      

  public qotGetOwnerPlate(params: Proto.Qot_GetOwnerPlate.IC2S): Promise<Proto.Qot_GetOwnerPlate.IS2C> {
    return this.socket.send('Qot_GetOwnerPlate', params)
  }
      

  public qotGetHoldingChangeList(params: Proto.Qot_GetHoldingChangeList.IC2S): Promise<Proto.Qot_GetHoldingChangeList.IS2C> {
    return this.socket.send('Qot_GetHoldingChangeList', params)
  }
      

  public qotGetOptionChain(params: Proto.Qot_GetOptionChain.IC2S): Promise<Proto.Qot_GetOptionChain.IS2C> {
    return this.socket.send('Qot_GetOptionChain', params)
  }
      

  public qotGetWarrant(params: Proto.Qot_GetWarrant.IC2S): Promise<Proto.Qot_GetWarrant.IS2C> {
    return this.socket.send('Qot_GetWarrant', params)
  }
      

  public qotGetCapitalFlow(params: Proto.Qot_GetCapitalFlow.IC2S): Promise<Proto.Qot_GetCapitalFlow.IS2C> {
    return this.socket.send('Qot_GetCapitalFlow', params)
  }
      

  public qotGetCapitalDistribution(params: Proto.Qot_GetCapitalDistribution.IC2S): Promise<Proto.Qot_GetCapitalDistribution.IS2C> {
    return this.socket.send('Qot_GetCapitalDistribution', params)
  }
      
  public unknownProto(protoIdOrName: number|string, params: any): Promise<any> {
    return this.socket.send(protoIdOrName, params)
  }

}
