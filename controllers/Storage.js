const storage = require('../lib/storage')
const {
  StateObserver
} = require('../lib/StateObserver')

class Storage extends StateObserver {
  constructor () {
    super()
    this.registry = []
    const registry = localStorage.getItem('tdt-registry')
    if (registry)
      this.registry = JSON.parse(registry)
    this.initializeStateObserver()
    this.subscribe('domLoaded', this.domLoaded.bind(this))
    this.subscribe('updateExistingTask', this.setTask.bind(this))
    this.subscribe('saveNewTask', this.setTask.bind(this))
    this.subscribe('importTasks', this.importTasks.bind(this))
    this.subscribe('purgeCompleted', this.purgeCompleted.bind(this))
    this.subscribe('taskToggleComplete', this.setTask.bind(this))
  }

  domLoaded () {
    const state = {
      contexts: [],
      projects: [],
      lists: ['todo'],
      tasks: {},
      tasksMeta: {}
    }
    storage.getAll().forEach((t) => {
      state.contexts.push(...t.contexts || [])
      state.projects.push(...t.projects || [])
      state.lists.push(t.list || 'todo')
      state.tasks[t.id] = t
      state.tasksMeta[t.id] = { id: t.id }
    })
    Object.entries(state).forEach(([key, array]) => {
      if (!Array.isArray(array))
        return
      state[key] = array.filter((i, idx) => array.indexOf(i) === idx)
    })
    this.publish({
      type: 'storageLoaded',
      modifier (s) {
        Object.assign(s, state)
        return s
      }
    })
  }

  importTasks () {
    Object.entries(this.states[0].tasks).filter(([id]) => {
      if (this.states[0].tasksMeta[id].newTask)
        return false
      return !this.registry.includes(id)
    })
      .forEach(([id, task]) => {
        localStorage.setItem(id, JSON.stringify(task))
        this.registry.push(id)
      })
    localStorage.setItem('tdt-registry', JSON.stringify(this.registry))
  }

  purgeCompleted () {
    const removed = this.registry.filter((id) => !this.states[0].tasks[id])
    removed.forEach((id) => {
      localStorage.removeItem(id)
    })
    this.registry = this.registry.filter((id) => !removed.includes(id))
    localStorage.setItem('tdt-registry', JSON.stringify(this.registry))
  }

  setTask (advent) {
    const { data: { id } } = advent
    const task = this.states[0].tasks[id]
    if (!this.registry.includes(id)) {
      this.registry.push(id)
      localStorage.setItem('tdt-registry', JSON.stringify(this.registry))
    }
    localStorage.setItem(task.id, JSON.stringify(task))
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

Storage.prototype.controllerName = 'Storage'

module.exports = Storage
