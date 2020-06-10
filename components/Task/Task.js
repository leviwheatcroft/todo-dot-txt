require('./Task.less')
const template = require('./Task.pug')
const {
  dataUpdated,
  newTask,
  filter
} = require('../../lib/events')
const {
  StateObserverComponent
} = require('../../lib/StateObserver')

class Task extends StateObserverComponent {
  constructor () {
    super()
    this.addEventListener(dataUpdated, this.render.bind(this))
    this.addEventListener(newTask, this.newTask.bind(this))
    this.addEventListener(filter, this.filter.bind(this))
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

    const [re] = event.data
    console.log('filter', this)
    console.log('re', re)
    console.log('test', re.test(this.data.task.raw))
    if (re.test(this.data.task.raw))
      this.unhide()
    else
      this.hide()
  }
}

Task.prototype.template = template

module.exports = Task
