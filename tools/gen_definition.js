const ProtoName2Id = require('../src/proto/protoid.json')
const Proto = require('../src/proto/proto')

const content = Object.entries(ProtoName2Id).map(([key, value]) => `
  
`).join('')

console.log(content)
console.log('Finished!')
