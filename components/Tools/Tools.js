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
    const $btnImport = this.querySelector('.btn-import')
    $btnImport.addEventListener('click', this.import.bind(this))
  }

  import () {
    this.hide()
    document.querySelector('tdt-tools-import').unhide()
  }

  purge () {
    const allTasks = Object.values(this.states[0].tasks)
    const completeTasks = allTasks.filter((t) => t.complete)
    const incompleteTasks = allTasks.filter((t) => !t.complete)
    const tasks = Object.fromEntries(incompleteTasks.map((t) => [t.id, t]))
    this.publish({
      type: 'purge',
      modifier (s) {
        s.tasks = tasks
        return s
      },
      data: {
        completeTasks
      }
    })
    this.hide()
  }
}

Tools.prototype.lightboxTitle = 'Tools'
Tools.prototype.template = template

module.exports = Tools
