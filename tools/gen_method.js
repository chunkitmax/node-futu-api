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
  ${
    Object.keys(ProtoName2Id).map(name => 
      [name[0].toLowerCase() + name.slice(1).replace('_', ''), name]
    ).reduce((a, [name, oriName]) => {
      if (Proto[oriName] && Proto[oriName].C2S) {
        a.push(`
  public ${name}(${Proto[oriName].C2S? `params: Proto.${oriName}.IC2S` : ''}): Promise<Proto.${oriName}.IS2C> {
    return this.socket.send('${oriName}', params)
  }
      `
        )
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
