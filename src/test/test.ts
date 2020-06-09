// import 'mocha';

// import Assert from 'assert';
// import Util from 'util';

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
// import UserConfig from '../../user_config.json';
// import Futu, { Proto } from '../Futu_';
// import { Qot_Common, Trd_Common } from '../proto/proto';

// const ft = new Futu(UserConfig);

// describe('Futu', () => {
//   before(async () => {
//     await ft.waitForInit()
//     Assert.notEqual(ft.userID, undefined)
//     Assert.notEqual(ft.connID, undefined)
//     Assert.notEqual(ft.header, undefined)
//   })
//   after(async () => {
//     await ft.close()
//     console.log('Test ends')
//   })

//   it('getGlobalState', async () => {
//     const res = await ft.getGlobalState({
//       userID: ft.userID
//     })
//     Assert.notEqual(Proto.GetGlobalState.S2C.verify(res), null)
//   })

//   it('qotGetStaticInfo', async () => {
//     const res = await ft.qotGetStaticInfo({
//       market: Qot_Common.QotMarket.QotMarket_HK_Security,
//       secType: Qot_Common.SecurityType.SecurityType_Warrant
//     })
//     Assert.notEqual(Proto.Qot_GetStaticInfo.S2C.verify(res), null)
//   })

//   it('qotGetTradeDate', async () => {
//     const res = await ft.qotGetTradeDate({
//       market: Qot_Common.QotMarket.QotMarket_HK_Security,
//       beginTime: '2018-01-01 00:00:00',
//       endTime: '2018-02-01 00:00:00'
//     })
//     Assert(res.tradeDateList)
//     Assert.equal(res.tradeDateList!.length, 23)
//   })

//   it('trdGetMaxTrdQtys', async () => {
//     const res = await ft.trdGetMaxTrdQtys({
//       header: ft.header!,
//       orderType: Trd_Common.OrderType.OrderType_Normal,
//       code: '00700',
//       price: 100000
//     });
//     Assert.notEqual(Proto.Trd_GetMaxTrdQtys.S2C.verify(res), null)
//   });

//   it('qotSub', async () => {
//     let rtList: boolean[] = [], tickerList: boolean[] = []
//     await ft.qotSub({
//         isSubOrUnSub: true,
//         isFirstPush: true,
//         subTypeList: [Qot_Common.SubType.SubType_Ticker, Qot_Common.SubType.SubType_RT],
//         isRegOrUnRegPush: true,
//         securityList: [{
//           code: 'YMmain',
//           market: Qot_Common.QotMarket.QotMarket_US_Security
//         }]
//       },
//       tickerData => tickerList.push(Proto.Qot_UpdateTicker.S2C.verify(tickerData) === null),
//       rtData => rtList.push(Proto.Qot_UpdateRT.S2C.verify(rtData) === null)
//     )
//     // unsubscribe after 1min according to the doc
//     await new Promise(resolve => setTimeout(resolve, 61000))
//     await ft.qotSub({
//       isSubOrUnSub: false,
//       subTypeList: [Qot_Common.SubType.SubType_Ticker],
//       isRegOrUnRegPush: false,
//       securityList: [{
//         code: 'YMmain',
//         market: Qot_Common.QotMarket.QotMarket_US_Security
//       }]
//     })
//     let tickerListLen = tickerList.length,
//         rtListLen = rtList.length
//     await new Promise(resolve => setTimeout(resolve, 3000))
//     await ft.qotSub({
//       isSubOrUnSub: false,
//       isRegOrUnRegPush: false,
//       isUnsubAll: true
//     })
//     let rtListLen2 = rtList.length
//     await new Promise(resolve => setTimeout(resolve, 3000))
//     Assert.equal(rtList.reduce((a: number, rt) => { if (rt) a++; return a; }, 0), 0)
//     Assert.equal(tickerList.reduce((a: number, ticker) => { if (ticker) a++; return a; }, 0), 0)
//     Assert.equal(tickerListLen, tickerList.length)
//     Assert.notEqual(rtListLen, rtListLen2)
//     Assert.equal(rtListLen2, rtList.length)
//   }).timeout(70000)

// })