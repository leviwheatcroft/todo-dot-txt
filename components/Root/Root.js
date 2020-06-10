require('./Root.less')
const template = require('./Root.pug')
const {
  StateObserverComponent
} = require('../../lib/StateObserver')
const {
  storageLoaded
} = require('../../lib/events')

class Root extends StateObserverComponent {
  constructor () {
    super()
    this.populateData({
      stateTasks: 'tasks',
      stateLists: 'lists'
    })
    this.addEventListener(storageLoaded, this.storageLoaded.bind(this))
  }

  storageLoaded () {
    this.render()
  }
}

Root.prototype.template = template

module.exports = Root
