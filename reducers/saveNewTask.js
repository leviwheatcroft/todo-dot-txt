const parseTask = require('../lib/parseTask')

module.exports = function saveNewTask (advent, { state, update }) {
  if (advent.type !== 'saveNewTask')
    return

  const { data: { id, raw, list } } = advent
  const lineNumber = Object.values(state.tasks)
    .filter((task) => {
      return (
        task.list === list &&
        !state.tasksMeta[task.id].newTask
      )
    })
    // eslint-disable-next-line no-shadow
    .reduce((lineNumber, task) => {
      return Math.max(lineNumber, task.lineNumber + 1)
    }, 0)
  update(['tasks', id], {
    ...state.tasks[id],
    ...parseTask(raw),
    lineNumber
  })
  update(['tasksMeta', id, 'newTask'], false)
}
