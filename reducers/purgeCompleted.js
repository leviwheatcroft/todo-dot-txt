module.exports = function purgeCompleted (advent, { state, update }) {
  if (advent.type !== 'purgeCompleted')
    return

  const tasks = { ...state.tasks }
  const tasksMeta = { ...state.tasksMeta }
  Object.entries(state.tasks).forEach(([id, task]) => {
    if (!task.complete)
      return
    delete tasks[id]
    delete tasksMeta[id]
  })
  update(['tasks'], tasks)
  update(['tasksMeta'], tasksMeta)
}
