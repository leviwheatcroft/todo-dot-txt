module.exports = function activateTask (advent, { state, update }) {
  if (advent.type !== 'activateTask')
    return

  const { data: { id } } = advent

  Object.values(state.tasks).forEach((task) => {
    if (task.id === id)
      update(['tasksMeta', id, 'active'], true)
    else if (state.tasksMeta[task.id].active === true)
      update(['tasksMeta', task.id, 'active'], false)
  })
}
