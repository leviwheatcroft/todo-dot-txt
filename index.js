// require('milligram/dist/milligram.css')
require('./less/index.less')
require('./components')
const {
  domLoaded
} = require('./lib/events')
const {
  Storage
} = require('./controllers')
const {
  instancesDispatchEvent
} = require('./lib/StateObserver')

console.log('loaded')
// eslint-disable-next-line no-new
new Storage()
instancesDispatchEvent(domLoaded)
