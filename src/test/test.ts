import 'mocha';

import Assert, { AssertionError } from 'assert';

// /** It is normal to have error on the next line
//  * because the user credential is not provided
//  * user_config.json format:
//  * {
//  *    "userID": 1234,
//  *    "pwdMd5": "129619259239abcdef",
//  *    "port": 11111,
//  *    "ip": "localhost"
//  * }
//  */
import UserConfig from '../../user_config.json';
import Futu from '../futu';
import { Qot_Common, Trd_Common } from '../proto/proto';

async function AssertShouldResolve<T>(block: (() => Promise<T>) | Promise<T>, message?: string): Promise<T> {
  try {
    if (typeof block === 'function') {
      return await block()
    } else if (block instanceof Promise) {
      return await block
    } else {
      throw new Error('Unknown parameter')
    }
  } catch (err) {
    throw new AssertionError({
      actual: err.toString(),
      expected: 'No rejection',
      operator: 'vs',
      message
    })
  }
}

const ft = new Futu(UserConfig)

describe('Futu', () => {
  before(async () => {
    await ft.ready
  })

  it('qotGetStaticInfo', async () => {
    let res = await AssertShouldResolve(ft.qotGetStaticInfo({
      market: Qot_Common.QotMarket.QotMarket_HK_Security,
      secType: Qot_Common.SecurityType.SecurityType_Warrant
    }), 'qotGetStaticInfo Failed')
    Assert.ok(res.staticInfoList)
  })

  it('qotGetTradeDate', async () => {
    let res = await AssertShouldResolve(ft.qotGetTradeDate({
      market: Qot_Common.QotMarket.QotMarket_HK_Security,
      beginTime: '2018-01-01 00:00:00',
      endTime: '2018-02-01 00:00:00'
    }), 'qotGetTradeDate Failed')
    Assert.ok(res.tradeDateList)
    Assert.deepEqual(res.tradeDateList!.length, 23)
  })

  it('qotGetSecuritySnapshot', async () => {
    const targetSecurity = {
      code: '00700',
      market: Qot_Common.QotMarket.QotMarket_HK_Security
    }
    let res = await AssertShouldResolve(ft.qotGetSecuritySnapshot({
      securityList: [targetSecurity]
    }), 'qotGetSecuritySnapshot Failed')
    Assert.ok(res.snapshotList)
    Assert.deepEqual(res.snapshotList!.length, 1)
    Assert.deepEqual(res.snapshotList![0].basic.security.code, targetSecurity.code)
    Assert.deepEqual(res.snapshotList![0].basic.security.market, targetSecurity.market)
  })

  it('qotRequestHistoryKL', async () => {
    const targetSecurity = {
      code: 'YMmain',
      market: Qot_Common.QotMarket.QotMarket_US_Security
    }
    let res = await AssertShouldResolve(ft.qotRequestHistoryKL({
      beginTime: '2020-01-01 00:00:00',
      endTime: '2020-01-10 00:00:00',
      klType: Qot_Common.KLType.KLType_Day,
      rehabType: Qot_Common.RehabType.RehabType_Forward,
      security: targetSecurity,
    }), 'qotRequestHistoryKL Failed')
    Assert.ok(res.klList)
    Assert.deepEqual(res.klList!.length, 7)
    Assert.ok(res.security)
    Assert.deepEqual(res.security.code, targetSecurity.code)
    Assert.deepEqual(res.security.market, targetSecurity.market)
  })

  it('trdGetMaxTrdQtys', async () => {
    let res = await AssertShouldResolve(ft.trdGetMaxTrdQtys({
      orderType: Trd_Common.OrderType.OrderType_Normal,
      code: '00700',
      price: 100000
    }), 'trdGetMaxTrdQtys Failed')
    Assert.ok(res.maxTrdQtys)
  })

  // do this test during trading hours
  //   otherwise, it won't pass because the order can't be placed
  it('trdPlaceOrder & trdModifyOrder', async () => {
    let orderID: number|Long
    {
      let res = await AssertShouldResolve(ft.trdPlaceOrder({
        code: '00700',
        orderType: Trd_Common.OrderType.OrderType_AbsoluteLimit,
        qty: 100,
        trdSide: Trd_Common.TrdSide.TrdSide_Buy,
        price: 1.0,
        secMarket: Trd_Common.TrdSecMarket.TrdSecMarket_HK
      }), 'trdPlaceOrder Failed')
      Assert.ok(res.orderID)
      orderID = res.orderID!
    }
    await new Promise(resolve => setTimeout(resolve, 100))
    {
      let res = await AssertShouldResolve(ft.trdModifyOrder({
        modifyOrderOp: Trd_Common.ModifyOrderOp.ModifyOrderOp_Delete,
        orderID
      }), 'trdModifyOrder Failed')
      Assert.ok(res.orderID)
    }
  })

  it('qotSub', async () => {
    let tickerCount = 0,
        rtCount = 0
    const targetSecurity = {
      code: 'YMmain',
      market: Qot_Common.QotMarket.QotMarket_US_Security
    }
    // listeners
    ft.on(Qot_Common.SubType.SubType_Ticker, targetSecurity, data => {
      Assert.deepEqual(data.security.code, targetSecurity.code)
      Assert.deepEqual(data.security.market, targetSecurity.market)
      ++tickerCount
    })
    ft.on(Qot_Common.SubType.SubType_RT, targetSecurity, data => {
      Assert.deepEqual(data.security.code, targetSecurity.code)
      Assert.deepEqual(data.security.market, targetSecurity.market)
      ++rtCount
    })
    // subscribe
    await AssertShouldResolve(ft.qotSub({
      isSubOrUnSub: true,
      isRegOrUnRegPush: true,
      subTypeList: [Qot_Common.SubType.SubType_Ticker, Qot_Common.SubType.SubType_RT],
      regPushRehabTypeList: [Qot_Common.RehabType.RehabType_Forward],
      securityList: [targetSecurity]
    }), 'qotSub Failed')
    // unsubscribe after 1min according to the doc
    await new Promise(resolve => setTimeout(resolve, 60500))
    // only unsubscribe for ticker
    await ft.qotSub({
      isSubOrUnSub: false,
      subTypeList: [Qot_Common.SubType.SubType_Ticker],
      isRegOrUnRegPush: false,
      securityList: [targetSecurity]
    })
    let tickerCountLap = tickerCount,
        rtCountLap = rtCount
    await new Promise(resolve => setTimeout(resolve, 3000))
    await ft.qotSub({
      isSubOrUnSub: false,
      isRegOrUnRegPush: false,
      isUnsubAll: true
    })
    let rtCountLap2 = rtCount
    await new Promise(resolve => setTimeout(resolve, 3000))
    Assert.ok(tickerCount > 0)
    Assert.ok(rtCount > 0)
    Assert.deepEqual(tickerCountLap, tickerCount)
    Assert.ok(rtCountLap < rtCount)
    Assert.ok(rtCountLap < rtCountLap2)
    Assert.deepEqual(rtCountLap2, rtCount)
  }).timeout(75000)

  after(async () => {
    ft.close()
  })
})