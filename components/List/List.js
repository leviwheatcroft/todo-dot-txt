require('./List.less')
const template = require('./List.pug')
const {
  StateObserverComponent
} = require('../../lib/StateObserver')

class List extends StateObserverComponent {
  constructor () {
    super()
    this.populateData({ stateTasks: 'tasks' })
    this.on('dataUpdated', this.tasksAdded.bind(this))
    this.on('dataUpdated', this.tasksRemoved.bind(this))
    this.render()
  }

  render () {
    super.render()
  }

  tasksAdded () {
    const current = Object.keys(this.states[0].tasks)
    const previous = Object.keys(this.states[1].tasks)
    if (current.length <= previous.length)
      return
    // delete first task, will be task > taskNew
    this.querySelector('tdt-task').remove()
    // append fresh new task
    this.insertAdjacentHTML(
      'afterbegin',
      '<tdt-task data-new-task></tdt-task>'
    )
    const $newTask = this.querySelector('tdt-task')
    current.filter((id) => !previous.includes(id)).forEach((id) => {
      $newTask.insertAdjacentHTML(
        'afterend',
        `
          <tdt-task
            data-state-task= "tasks.${id}"
          >
          </tdt-task>
        `
      )
    })
  }

  tasksRemoved () {
    const current = Object.keys(this.states[0].tasks)
    const previous = Object.keys(this.states[1].tasks)
    if (current.length >= previous.length)
      return
    const removed = previous.filter((id) => !current.includes(id))
    this.querySelectorAll('tdt-task').forEach(($task) => {
      if (
        $task.data.task &&
        removed.includes($task.data.task.id)
      )
        $task.remove()
    })
  }
}

List.prototype.template = template

module.exports = List
