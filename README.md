# Futu_Node_Api
<a href="https://www.npmjs.com/package/futu-api">![npm](https://img.shields.io/npm/v/futu-api)</a><br/>
This module automatically generates interfaces and class according to official release files.

## Install
```bash
npm install --save futu-api
```
or build locally
```bash
npm install
npm run build
```

## Usage
⚠️ Sometimes types on interface may be misleading because of poor definition in official protobuf files. Please refer to those files if you have trouble about types.
For example (Qot_GetStaticInfo.proto):
```protobuf
message C2S
{
  optional int32 market = 1; //Qot_Common.QotMarket,股票市場
  optional int32 secType = 2; //Qot_Common.SecurityType,股票類型
  repeated Qot_Common.Security securityList = 3; //股票，若該字段存在，忽略其他字段，只返回該字段股票的靜態信息
}
```
According to this definition file, the output will be
```typescript
interface IC2S {
  /** C2S market */
  market?: (number|null);
  /** C2S secType */
  secType?: (number|null);
  /** C2S securityList */
  securityList?: (Qot_Common.ISecurity[]|null);
}

/** correction */
interface IC2S {
  /** C2S market */
  market?: (Qot_Common.QotMarket|null);
  /** C2S secType */
  secType?: (Qot_Common.SecurityType|null);
  /** C2S securityList */
  securityList?: (Qot_Common.ISecurity[]|null);
}
```
However, this module generates files from those proto files even there are mistakes.

⚠️ Protocol Name to Id table is from [Futu-Api-Doc](https://futunnopen.github.io/futu-api-doc/protocol/intro.html) . Some protocols have some protobuf files on official [py-futu-api](https://github.com/FutunnOpen/py-futu-api/tree/v4.x/futu/common/pb) repo but hidden on the table. You may extend the lookup table by yourselves (See the example 5 below).

### Usage example:
```typescript
// TODO: Run FutuOpenD software first

import Futu, { Proto } from 'futu-api'
import UserConfig from '../user_config.json'
import { Qot_Common, Trd_Common } from '../proto/proto'

/**
 * UserConfig: FutuConfig
 *  {
      ip: string,
      port: number,
      userID: number,
      pwdMd5: string,
      market?: Trd_Common.TrdMarket, // default: first market option: HK
      env?: Trd_Common.TrdEnv  // default: real trading env
    }
  */

(async function main() {
  // extend the lookup table
  // add back protocol 'Qot_RequestHistoryKLQuota' with its protocol id
  let ft = new Futu(UserConfig, { 'Qot_RequestHistoryKLQuota': 3104 })
  // wait for initialization to finish
  await ft.waitForInit()


  // Example 1: get static info
  let staticInfo = await ft.qotGetStaticInfo({
    market: Qot_Common.QotMarket.QotMarket_HK_Security,
    secType: Qot_Common.SecurityType.SecurityType_Warrant
  })
  console.log(staticInfo)


  // Example 2: get snapshot of a list of securities.
  // we get snapshot of HK.00700 Tencent Holdings Ltd. here
  let snapshot = await ft.qotGetSecuritySnapshot({
    securityList: [{
      market: Qot_Common.QotMarket.QotMarket_HK_Security,
      code: '00700'
    }]
  })
  console.log(snapshot)


  /**
   * userID, connID in packetID and header are public member variables in class Futu
   */
  // Example 3: place order
  // place order stock: HK.00700, price: 1.0, qty: 100
  let resp = await ft.trdPlaceOrder({
    packetID: {
      connID: ft.connID!, // <------------------------------ connID
      serialNo: Date.now()
    },
    trdSide: Trd_Common.TrdSide.TrdSide_Buy,
    code: '00700',
    price: 1.0,
    orderType: Trd_Common.OrderType.OrderType_Normal,
    qty: 100,
    header: ft.header!, // <-------------------------------- header
    secMarket: Trd_Common.TrdSecMarket.TrdSecMarket_HK
  })
  console.log(resp)


  // Example 4: get account list
  let accList = await ft.trdGetAccList({
    userID: ft.userID // <---------------------------------- userID
  })
  console.log(accList)


  // Example 5: protocol passed to constructor
  // get protocol "Qot_RequestHistoryKL" quota
  let quota = await ft.unknownProto(3104, {
    bGetDetail: true
  } as Proto.Qot_RequestHistoryKLQuota.IC2S) as Proto.Qot_RequestHistoryKLQuota.IS2C
  console.log(quota)
  // or you can pass name or id
  quota = await ft.unknownProto('Qot_RequestHistoryKLQuota', {
    bGetDetail: true
  } as Proto.Qot_RequestHistoryKLQuota.IC2S) as Proto.Qot_RequestHistoryKLQuota.IS2C
  console.log(quota)


  // Example 6: subscription
  // subscribe to DJI futures (Ticker & Realtime data)
  await ft.qotSub({
      isSubOrUnSub: true,
      isFirstPush: true,
      isRegOrUnRegPush: true,
      subTypeList: [
        Qot_Common.SubType.SubType_Ticker, // <------------- 1
        Qot_Common.SubType.SubType_RT      // <------------- 2
      ],
      securityList: [{
        code: 'YMmain',
        market: Qot_Common.QotMarket.QotMarket_US_Security
      }]
    },
    // callback for ticker
    function (data: Proto.Qot_UpdateTicker.IS2C) { // <----- 1
      console.log(
        'ticker: ',
        data.tickerList!.map(ticker => ticker.price)
      )
    },
    // callback for rt
    function (data: Proto.Qot_UpdateRT.IS2C) { // <--------- 2
      console.log(
        'rt: ',
        data.rtList!.map(rt => rt.price)
      )
    }
  )
  // unsubscribe after 1min according to documentation
  await new Promise(resolve => setTimeout(resolve, 60500))
  // only unsubscribe to ticker
  await ft.qotSub({
    isSubOrUnSub: false,
    isRegOrUnRegPush: false,
    subTypeList: [Qot_Common.SubType.SubType_Ticker],
    securityList: [{
      code: 'YMmain',
      market: Qot_Common.QotMarket.QotMarket_US_Security
    }]
  })
  // unsubscribe all
  await ft.qotSub({
    isSubOrUnSub: false,
    isRegOrUnRegPush: false,
    isUnsubAll: true // <----------------------------------- all
  })

  await ft.close()
})()
```

## Test
```bash
# Require FutuOpenD software running
npm test
```