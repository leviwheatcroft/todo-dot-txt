// require('milligram/dist/milligram.css')
require('./less/index.less')
require('./components')
const {
  Storage
} = require('./controllers')
const {
  instancesTrigger
} = require('./lib/StateObserver')

console.log('loaded')
// eslint-disable-next-line no-new
new Storage()

instancesTrigger({ type: 'domLoaded' })
