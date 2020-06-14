const {
  v4: uuid
} = require('uuid')

module.exports = function taskCreateNew (advent, { update }) {
  // debugger
  if (advent.type !== 'taskCreateNew')
    return

  const {
    data: { list }
  } = advent
  const id = uuid()
  update(['tasksMeta', id], {
    id,
    newTask: true
  })
  update(['tasks', id], {
    id,
    list
  })
}
