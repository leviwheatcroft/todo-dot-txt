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
  Object.values(state.lists)
    .forEach(({ id }) => {
      Object.values(state.tasks)
        .filter((task) => task.list === id)
        .sort((taskA, taskB) => taskA.lineNumber - taskB.lineNumber)
        .forEach((task, idx) => { task.lineNumber = idx })
    })
  update(['tasks'], tasks)
  update(['tasksMeta'], tasksMeta)
}
