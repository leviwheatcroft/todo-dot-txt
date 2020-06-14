const parseTask = require('../lib/parseTask')

module.exports = function updateExistingTask (advent, { update }) {
  if (advent.type !== 'updateExistingTask')
    return

  const { data: { id, raw } } = advent
  const task = {
    id,
    ...parseTask(raw)
  }
  update(['tasks', id], task)
}
