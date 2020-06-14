require('./Root.less')
const template = require('./Root.pug')
const {
  StateObserver
} = require('../../lib/StateObserver')
const {
  Component
} = require('../../lib/Component')

class Root extends Component {
  constructor () {
    super()
    this.populateData({
      resolverTasks: (s) => s.tasks,
      resolverLists: (s) => s.lists
    })
    this.subscribe('storageLoaded', this.storageLoaded.bind(this))
  }

  storageLoaded () {
    this.render()
  }
}

StateObserver.extend(Root)

Root.prototype.template = template

module.exports = Root
