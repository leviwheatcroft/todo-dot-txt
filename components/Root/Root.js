require('./Root.less')
const template = require('./Root.pug')
const {
  StateObserverComponent
} = require('../../lib/StateObserver')

class Root extends StateObserverComponent {
  constructor () {
    super()
    this.populateData({
      stateTasks: 'tasks',
      stateLists: 'lists'
    })
    this.on('storageLoaded', this.storageLoaded.bind(this))
    console.log(this.handlers)
  }

  storageLoaded () {
    this.render()
  }
}

Root.prototype.template = template

module.exports = Root
