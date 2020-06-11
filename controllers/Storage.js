const storage = require('../lib/storage')
const {
  isArray
} = require('../lib/typeGuards')
const {
  isTaskData
} = require('../lib/typeGuards')
const {
  StateObserver
} = require('../lib/StateObserver')

module.exports = class Storage extends StateObserver {
  constructor () {
    super()
    this.registry = []
    const registry = localStorage.getItem('tdt-registry')
    if (registry)
      this.registry = JSON.parse(registry)
    this.on('domLoaded', this.domLoaded.bind(this))
    this.on('stateUpdated', this.stateUpdated.bind(this))
  }

  stateUpdated (event) {
    if (event.origin === this)
      return
    if (!this.isUpdated('tasks'))
      return
    Object.entries(this.states[0].tasks).forEach(([id, task]) => {
      if (task === this.states[1].tasks[id])
        return
      this.setTask(task)
    })
    Object.keys(this.states[1].tasks).forEach((id) => {
      if (!this.states[0].tasks[id])
        this.removeTask(id)
    })
  }

  domLoaded () {
    const state = {
      contexts: [],
      projects: [],
      lists: ['todo'],
      tasks: {}
    }
    storage.getAll().forEach((t) => {
      state.contexts.push(...t.contexts)
      state.projects.push(...t.projects)
      state.lists.push(t.list || 'todo')
      state.tasks[t.id] = t
    })
    Object.entries(state).forEach(([key, array]) => {
      if (!isArray(array))
        return
      state[key] = array.filter((i, idx) => array.indexOf(i) === idx)
    })
    this.stateUpdate(state)
    this.instancesTrigger({ type: 'storageLoaded' })
  }

  setTask (taskData) {
    if (!isTaskData(taskData))
      throw new RangeError('task must be taskData like')
    if (!this.registry.includes(taskData.id)) {
      this.registry.push(taskData.id)
      localStorage.setItem('tdt-registry', JSON.stringify(this.registry))
    }
    localStorage.setItem(taskData.id, JSON.stringify(taskData))
  }

  getTask (id) {
    return JSON.parse(localStorage.getItem(id))
  }

  getAllTasks () {
    const tasks = []
    this.registry.forEach((i) => tasks.push(this.get(i)))
    return tasks
  }

  removeTask (id) {
    localStorage.removeItem(id)
    this.registry = this.registry.filter((val) => val !== id)
    localStorage.setItem('tdt-registry', JSON.stringify(this.registry))
  }
}
