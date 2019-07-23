import 'mocha';

import Assert from 'assert';
import Util from 'util';

import UserConfig from '../../user_config.json';
import Futu, { Proto } from '../Futu';

const ft = new Futu(UserConfig)

describe('Futu', () => {
  before(async () => {
    await ft.waitForInit()
    Assert.notEqual(ft.userID, undefined)
    Assert.notEqual(ft.connID, undefined)
    Assert.notEqual(ft.trdHeader, undefined)
  })
  after(async () => {
    await ft.close()
    console.log('Test ends')
  })

  it('getGlobalState', async () => {
    const res = await ft.getGlobalState({
      userID: ft.userID
    })
    Assert.notEqual(Proto.GetGlobalState.S2C.verify(res), null)
  })

  it('qotGetStaticInfo', async () => {
    const res = await ft.qotGetStaticInfo({
      market: Proto.Qot_Common.QotMarket.QotMarket_HK_Security,
      secType: Proto.Qot_Common.SecurityType.SecurityType_Warrant
    })
    Assert.notEqual(Proto.Qot_GetStaticInfo.S2C.verify(res), null)
  })

  it('trdGetMaxTrdQtys', async () => {
    const res = await ft.trdGetMaxTrdQtys({
      header: ft.trdHeader!,
      orderType: Proto.Trd_Common.OrderType.OrderType_Normal,
      code: '00700',
      price: 100000
    });
    Assert.notEqual(Proto.Trd_GetMaxTrdQtys.S2C.verify(res), null)
  });
})