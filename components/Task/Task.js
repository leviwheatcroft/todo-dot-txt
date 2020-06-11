require('./Task.less')
const template = require('./Task.pug')
const {
  StateObserverComponent
} = require('../../lib/StateObserver')

class Task extends StateObserverComponent {
  constructor () {
    super()
    this.on('dataUpdated', this.render.bind(this))
    this.on('newTask', this.newTask.bind(this))
    this.on('filter', this.filter.bind(this))
    this.render()
  }

  newTask ({ data: { taskId } }) {
    this.removeAttribute('data-new-task')
    delete this.data.newTask
    this.populateData({ stateTask: `tasks.${taskId}` })
    this.render()
  }

  filter (event) {
    // don't filter new task
    if (!this.data.task)
      return

    const { data: { re } } = event
    if (re.test(this.data.task.raw))
      this.unhide()
    else
      this.hide()
  }
}

Task.prototype.template = template

module.exports = Task
