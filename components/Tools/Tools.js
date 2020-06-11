require('./Tools.less')
const template = require('./Tools.pug')
const LightBox = require('../LightBox')

class Tools extends LightBox {
  // constructor () {
  //   super()
  // }

  render () {
    super.render()
    const $btnPurge = this.querySelector('.btn-purge')
    $btnPurge.addEventListener('click', this.purge.bind(this))
  }

  purge () {
    const allTasks = Object.values(this.states[0].tasks)
    const completeTasks = allTasks.filter((t) => t.complete)
    const incompleteTasks = allTasks.filter((t) => !t.complete)
    const tasks = Object.fromEntries(incompleteTasks.map((t) => [t.id, t]))
    const update = { tasks }
    this.stateUpdate(update)
    this.instancesTrigger({
      type: 'purge',
      data: { completeTasks }
    })
    this.hide()
  }
}

Tools.prototype.lightboxTitle = 'Tools'
Tools.prototype.template = template

module.exports = Tools
