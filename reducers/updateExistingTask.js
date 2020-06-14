const parseTask = require('../lib/parseTask')

module.exports = function updateExistingTask (advent, { state, update }) {
  if (advent.type !== 'updateExistingTask')
    return

  const { data: { id, raw } } = advent
  const { list } = state.tasks[id]
  const task = {
    id,
    list,
    ...parseTask(raw)
  }
  update(['tasks', id], task)
}
