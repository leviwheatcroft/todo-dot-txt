const {
  v4: uuid
} = require('uuid')

const parseTask = require('../lib/parseTask')

module.exports = function importTasks (advent, { state, update }) {
  if (advent.type !== 'importTasks')
    return

  const { data: { lines, list } } = advent
  const tasks = Object.fromEntries(
    lines.map((raw, lineNumber) => {
      const id = uuid()
      return [
        id,
        {
          id,
          list,
          ...parseTask(raw),
          lineNumber
        }
      ]
    })
  )
  update(['tasks'], { ...state.tasks, ...tasks })
  const tasksMeta = Object.fromEntries(Object.keys(tasks).map((id) => [id, {}]))
  update(['tasksMeta'], { ...state.tasksMeta, ...tasksMeta })
}
