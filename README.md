# node-futu-api
<a href="https://www.npmjs.com/package/futu-api">![npm](https://img.shields.io/npm/v/futu-api)</a><br/>
Open-source unofficial Futu Websocket API for Node.js

Tested on FutuOpenD Ver.2.17.1150 (on Ubuntu 18.04)

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

### Example:
```typescript
// TODO: Run FutuOpenD software first
//   Make sure websocket_port is set

import Futu, { Proto } from 'futu-api';
const { Qot_Common, Trd_Common } = Proto;

/**
 * type FutuConfig = {
      // server
      ip?: string           // default: 'localhost'
      port?: number         // default: 33333
      recvNotify?: boolean  // default: true

      // user
      userID: number
      pwdMd5: string

      // account
      accMarket?: Proto.Trd_Common.TrdMarket  // default: TrdMarket_HK
      accEnv?: Proto.Trd_Common.TrdEnv        // default: TrdEnv_Real
      accType?: Proto.Trd_Common.TrdAccType   // default:  TrdAccType_Cash

      // websocket
      isSSL?: boolean       // default: false
      wsKey?: string        // default: null
      reqTimeout?: number   // default: 10000
    }
*/

const FutuConfig = {
  userID: 1234,
  pwdMd5: "129619259239abcdef",
}

;(async function main() {
  // Init
  const ft = new Futu(FutuConfig)
  // wait for initialization to finish
  await ft.ready

  // Example 0: subscribe to trading account changes
  await this.ft.trdSubAccPush()
  ft.on(Qot_Common.SubType.SubType_Order, data => {
    console.log(
      'Security: ', data.code,
      ' Price: ', data.price,
      ' Qty: ', data.qty,
      ' Order Type: ', data.orderType
    )
  })

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


  // Example 3: place order
  // place order stock: HK.00700, price: 1.0, qty: 100
  let resp = await ft.trdPlaceOrder({
    trdSide: Trd_Common.TrdSide.TrdSide_Buy,
    code: '00700',
    price: 1.0,
    orderType: Trd_Common.OrderType.OrderType_AbsoluteLimit,
    qty: 100,
    secMarket: Trd_Common.TrdSecMarket.TrdSecMarket_HK
  })
  console.log(resp)


  // Example 4: get account list
  let accList = await ft.trdGetAccList()
  console.log(accList)


  // Example 5: subscription
  // subscribe to DJI futures (Ticker & Realtime data)
  let targetSecurity = {
    code: 'YMmain',
    market: Qot_Common.QotMarket.QotMarket_US_Security
  }
  ft.on(Qot_Common.SubType.SubType_Ticker, targetSecurity, data => {
    console.log('ticker: ', data.tickerList!.map(ticker => ticker.price))
  })
  ft.on(Qot_Common.SubType.SubType_RT, targetSecurity, data => {
    console.log('rt: ', data.rtList!.map(rt => rt.price))
  })
  await ft.qotSub({
    isSubOrUnSub: true,
    isRegOrUnRegPush: true,
    subTypeList: [
      Qot_Common.SubType.SubType_Ticker,
      Qot_Common.SubType.SubType_RT
    ],
    regPushRehabTypeList: [
      Qot_Common.RehabType.RehabType_Forward
    ],
    securityList: [targetSecurity]
  })
  // unsubscribe after 1min according to documentation
  await new Promise(resolve => setTimeout(resolve, 60500))
  // only unsubscribe to ticker
  await ft.qotSub({
    isSubOrUnSub: false,
    isRegOrUnRegPush: false,
    subTypeList: [
      Qot_Common.SubType.SubType_Ticker
    ],
    securityList: [targetSecurity]
  })
  // unsubscribe all
  await ft.qotSub({
    isSubOrUnSub: false,
    isRegOrUnRegPush: false,
    isUnsubAll: true // <----------------------------------- all
  })

  ft.close()
})()


// You can use "Subscibe" decorator instead of ft.on()
import { Subscribe } from 'futu-api';
class Example {

  @Subscribe(Qot_Common.SubType.SubType_Ticker, {
    code: 'YMmain',
    market: Qot_Common.QotMarket.QotMarket_US_Security
  })
  subscription(data: Proto.Qot_UpdateTicker.IS2C) {
    console.log('ticker: ', data.tickerList!.map(ticker => ticker.price))
  }

}
```

<br/><br/>
⚠️ Sometimes types on interface may be misleading due to backward compatibility. Please refer to those files if you have trouble about types. Those enums are most likely to be found in Qot_Common or Trd_Common
For example (Qot_GetStaticInfo.proto):
```protobuf
message C2S
{
  optional int32 market = 1; //Qot_Common.QotMarket,股票市場
  optional int32 secType = 2; //Qot_Common.SecurityType,股票類型
  repeated Qot_Common.Security securityList = 3; //股票，若該字段存在，忽略其他字段，只返回該字段股票的靜態信息
}
```
According to this declaration file, the output will be
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

## Test
```bash
# Require FutuOpenD software running
#   Make sure websocket_port is set
npm test
```