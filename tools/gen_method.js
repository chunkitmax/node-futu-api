const Fs = require('fs')
const ProtoName2Id = require('../src/proto/protoid.json')
const Proto = require('../src/proto/proto')

const content = `
import * as Proto from './proto/proto';
import Socket from './socket';

export default class ProtoMethods {

  protected socket: Socket

  constructor(socket: Socket) {
    this.socket = socket
  }

  // TODO: hard-coded
  protected translateUpdateProto(subType: Proto.Qot_Common.SubType): string|undefined {
    switch (subType) {
      case Proto.Qot_Common.SubType.SubType_Basic:
        return 'Qot_UpdateBasicQot'
      case Proto.Qot_Common.SubType.SubType_Broker:
        return 'Qot_UpdateBroker'
      case Proto.Qot_Common.SubType.SubType_OrderBook:
        return 'SubType_OrderBook'
      case Proto.Qot_Common.SubType.SubType_RT:
        return 'Qot_UpdateRT'
      case Proto.Qot_Common.SubType.SubType_Ticker:
        return 'Qot_UpdateTicker'
      case Proto.Qot_Common.SubType.SubType_KL_1Min:
      case Proto.Qot_Common.SubType.SubType_KL_3Min:
      case Proto.Qot_Common.SubType.SubType_KL_5Min:
      case Proto.Qot_Common.SubType.SubType_KL_15Min:
      case Proto.Qot_Common.SubType.SubType_KL_30Min:
      case Proto.Qot_Common.SubType.SubType_KL_60Min:
      case Proto.Qot_Common.SubType.SubType_KL_Day:
      case Proto.Qot_Common.SubType.SubType_KL_Week:
      case Proto.Qot_Common.SubType.SubType_KL_Month:
      case Proto.Qot_Common.SubType.SubType_KL_Qurater:
      case Proto.Qot_Common.SubType.SubType_KL_Year:
        return 'Qot_UpdateKL'
      case Proto.Qot_Common.SubType.SubType_None:
      case Proto.Qot_Common.SubType.SubType_OrderDetail:
        return undefined
    }
  }
  ${
    Object.keys(ProtoName2Id).map(name =>
      [name[0].toLowerCase() + name.slice(1).replace('_', ''), name]
    ).reduce((a, [name, oriName]) => {
      if (Proto[oriName] && Proto[oriName].C2S) {
        if (['qot_regqotpush', 'qot_sub'].includes(oriName.toLowerCase())) {
          a.push(`
  public ${name}(${Proto[oriName].C2S? `params: Proto.${oriName}.IC2S` : ''}, ...callbacks: ((s2c: any) => void)[]): Promise<Proto.${oriName}.IS2C> {
    if (params.${oriName.toLowerCase() === 'qot_sub'? 'isRegOrUnRegPush' : 'isRegOrUnReg'}) {
      if (params.subTypeList && params.subTypeList.length === callbacks.length || callbacks.length === 1) {
        params.subTypeList!.forEach((subType, i) => {
          let updateProtoName = this.translateUpdateProto(subType)
          if (updateProtoName) {
            if (callbacks.length === 1) {
              this.socket.subNotify(updateProtoName, callbacks[0])
            } else {
              this.socket.subNotify(updateProtoName, callbacks[i])
            }
          }
        })
      }
    } else if (params.${oriName.toLowerCase() === 'qot_sub'? 'isRegOrUnRegPush' : 'isRegOrUnReg'} === false${oriName.toLowerCase() === 'qot_sub'? ` || params.isSubOrUnSub === false) {
      if (params.isUnsubAll) {
        this.socket.unsubAll()
      } else` : `) {`}
      if (params.subTypeList) {
        params.subTypeList!.forEach((subType, i) => {
          let updateProtoName = this.translateUpdateProto(subType)
          if (updateProtoName) {
            this.socket.unsubNotify(updateProtoName)
          }
        })
      }
    }
    return this.socket.send('${oriName}', params)
  }
      `
          )
        } else {
          a.push(`
  public ${name}(${Proto[oriName].C2S? `params: Proto.${oriName}.IC2S` : ''}): Promise<Proto.${oriName}.IS2C> {
    return this.socket.send('${oriName}', params)
  }
      `
          )
        }
      }
      return a
    }, []).join('\n')
  }
  public unknownProto(protoIdOrName: number|string, params: any): Promise<any> {
    return this.socket.send(protoIdOrName, params)
  }

}
`
Fs.writeFileSync('./src/ProtoMethods.ts', content, 'utf8')
console.log('Finished!')
