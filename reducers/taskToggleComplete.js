module.exports = function taskToggleComplete (advent, { state, update }) {
  if (advent.type !== 'taskToggleComplete')
    return

  const { data: { id } } = advent

  const task = { ...state.tasks[id] }

  task.complete = !task.complete
  if (task.complete)
    task.raw = ` x ${task.raw}`
  else
    task.raw = task.raw.replace(/\s?x\s?/i, '')

  update(['tasks', id], task)
}
