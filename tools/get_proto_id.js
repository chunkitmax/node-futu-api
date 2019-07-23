const Fs = require('fs')
const Assert = require('assert')
const Axios = require('axios')
const Cheerio = require('cheerio')

if (require.main === module) {
  // const constantPy = Fs.readFileSync('./py-futu-api/futu/common/constant.py', 'utf8')
  // let targetClass = constantPy.split('class').filter(v => v.trim().startsWith('ProtoId'))
  // Assert(targetClass.length === 1)
  // targetClass = targetClass[0]
  // let targetLines = targetClass.split(/\n+/).slice(1).map(v => v.trim()).filter(v => /^[a-zA-Z]/.test(v))
  // let json = targetLines.reduce((a, v) => {
  //   let splitItems = v.split(/[^a-zA-Z_0-9 ]/).map(v => v.trim())
  //   if (splitItems[1].length && !isNaN(splitItems[1])) {
  //     a[splitItems[0]] = parseInt(splitItems[1])
  //   }
  //   return a
  // }, {})
  // Fs.writeFileSync('./src/proto/protoid.json', JSON.stringify(json, null, 4), 'utf8')

  (async () => {
    let { data } = await Axios.get('https://futunnopen.github.io/futu-api-doc/protocol/intro.html')
    let $ = Cheerio.load(data.replace(/\n+/, ''))
    let json = $('table').first().find('tbody tr').map((i, tr) => {
      return {k: $($(tr).children('td').get(1)).text().split('.')[0], v: parseInt($($(tr).children('td').get(0)).text())}
    }).toArray().reduce((a, {k, v}) => {
      a[k] = v
      return a
    }, {})
    console.log(json)
    Fs.writeFileSync('./src/proto/protoid.json', JSON.stringify(json, null, 4), 'utf8')
  })()
}