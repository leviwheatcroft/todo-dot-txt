
require('./List.less')
const template = require('./List.pug')
const {
  StateObserver
} = require('../../lib/StateObserver')
const {
  Component
} = require('../../lib/Component')

class List extends Component {
  constructor () {
    super()
    this.populateData()
    this.populateData({
      resolverFilter (s) { return s.filter },
      resolverOptions (s) { return s.options },
      resolverTasks (s) { return s.tasks },
      resolverTasksMeta (s) { return s.tasksMeta }
    })
    this.subscribe('dataUpdated', this.dataUpdated.bind(this))
    this.newTask() // will trigger dataUpdated & render
  }

  newTask () {
    this.publish('taskCreateNew', { list: this.data.list })
  }

  dataUpdated () {
    this.render({ resolvedTasks: this.resolveTasks() })
  }

  resolveTasks () {
    const {
      tasks,
      tasksMeta,
      filter,
      options: {
        sortBy,
        sortOrder,
        sortPriorityAlways,
        sortCompletedLast
      }
    } = this.data
    const sortDirection = sortOrder === 'ascending' ? 1 : -1
    const filtered = Object.values(this.data.tasks)
      .filter(({ list }) => list === this.data.list)
      .filter(({ id, raw }) => {
        if (filter.regExp.test(raw))
          return true
        if (tasksMeta[id].newTask)
          return true
        return false
      })
      .map(({ id }) => id)
    const fileOrder = filtered
    const ordered = fileOrder.sort((a, b) => {
      a = { ...tasks[a], ...tasksMeta[a] }
      b = { ...tasks[b], ...tasksMeta[b] }
      // newTask always goes first
      // eslint-disable-next-line eqeqeq
      if (a.newTask != b.newTask) {
        // true & false evalate to 1 & 0, but undefined is NaN
        const newTask = (a.newTask || false) - (b.newTask || false)
        if (newTask)
          return newTask * -1 * sortDirection
      }
      if (a.newTask)
        return -1 * sortDirection
      if (b.newTask)
        return 1 * sortDirection
      if (sortPriorityAlways) {
        // 'z' is code 122, '{' is code 123
        let priorityA = a.priority || '{'
        priorityA = priorityA.toLowerCase().charCodeAt(0)
        let priorityB = b.priority || '{'
        priorityB = priorityB.toLowerCase().charCodeAt(0)
        const priority = priorityA - priorityB
        if (priority)
          return priority
      }
      if (sortCompletedLast) {
        // true & false evalate to 1 & 0, but undefined is NaN
        const completed = (a.complete || false) - (b.complete || false)
        if (completed)
          return completed
      }
      if (sortBy === 'file')
        return fileOrder.indexOf(a.id) - fileOrder.indexOf(b.id)
      return 0
    })
    if (sortOrder === 'descending')
      ordered.reverse()
    const resolvedTasks = Object.fromEntries(
      ordered.map((id) => [id, { ...tasks[id], ...tasksMeta[id] }])
    )
    return resolvedTasks
  }

  // tasksAdded () {
  //   const current = Object.keys(this.states[0].tasks)
  //   const previous = Object.keys(this.states[1].tasks)
  //   if (current.length <= previous.length)
  //     return
  //   // delete first task, will be task > taskNew
  //   this.querySelector('tdt-task').remove()
  //   // append fresh new task
  //   this.insertAdjacentHTML(
  //     'afterbegin',
  //     '<tdt-task data-new-task></tdt-task>'
  //   )
  //   const $newTask = this.querySelector('tdt-task')
  //   current.filter((id) => !previous.includes(id)).forEach((id) => {
  //     $newTask.insertAdjacentHTML(
  //       'afterend',
  //       `
  //         <tdt-task
  //           data-state-task= "tasks.${id}"
  //         >
  //         </tdt-task>
  //       `
  //     )
  //   })
  // }
  //
  // tasksRemoved () {
  //   const current = Object.keys(this.states[0].tasks)
  //   const previous = Object.keys(this.states[1].tasks)
  //   if (current.length >= previous.length)
  //     return
  //   const removed = previous.filter((id) => !current.includes(id))
  //   this.querySelectorAll('tdt-task').forEach(($task) => {
  //     if (
  //       $task.data.task &&
  //       removed.includes($task.data.task.id)
  //     )
  //       $task.remove()
  //   })
  // }
}

List.prototype.template = template

StateObserver.extend(List)

module.exports = List
