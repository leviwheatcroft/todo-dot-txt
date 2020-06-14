module.exports = function deactivateTask (advent, { update }) {
  if (advent.type !== 'deactivateTask')
    return

  const { data: { id } } = advent
  update(['tasksMeta', id, 'active'], false)
}
