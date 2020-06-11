require('./List.less')
const template = require('./List.pug')
const {
  StateObserverComponent
} = require('../../lib/StateObserver')

class List extends StateObserverComponent {
  constructor () {
    super()
    this.populateData({ stateTasks: 'tasks' })
    this.on('newTask', this.newTask.bind(this))
    this.render()
  }

  render () {
    super.render()
    this.newTask()
  }

  newTask (event) {
    if (event)
      event.stopPropagation()
    const html = `
      <tdt-task
        data-new-task
      ></tdt-task
    `
    this.insertAdjacentHTML('afterbegin', html)
  }
}

List.prototype.template = template

module.exports = List
