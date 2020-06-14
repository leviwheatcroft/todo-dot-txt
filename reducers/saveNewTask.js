const parseTask = require('../lib/parseTask')

module.exports = function saveNewTask (advent, { state, update }) {
  if (advent.type !== 'saveNewTask')
    return

  const { data: { id, raw } } = advent
  update(['tasks', id], {
    ...state.tasks[id],
    ...parseTask(raw)
  })
  update(['tasksMeta', id, 'newTask'], false)
}
