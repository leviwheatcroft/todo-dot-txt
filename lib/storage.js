const {
  isTaskData
} = require('./typeGuards')

let registry = localStorage.getItem('tdt-registry')
if (registry)
  registry = JSON.parse(registry)
else
  registry = []

function set (taskData) {
  if (!isTaskData(taskData))
    throw new RangeError('task must be taskData like')
  if (!registry.includes(taskData.id)) {
    registry.push(taskData.id)
    localStorage.setItem('tdt-registry', JSON.stringify(registry))
  }
  localStorage.setItem(taskData.id, JSON.stringify(taskData))
}

function get (id) {
  return JSON.parse(localStorage.getItem(id))
}

function getAll () {
  const tasks = []
  registry.forEach((i) => tasks.push(get(i)))
  return tasks
}

function remove (id) {
  localStorage.remove(id)
  registry = registry.filter((val) => val !== id)
}

module.exports = {
  set,
  get,
  getAll,
  remove
}
