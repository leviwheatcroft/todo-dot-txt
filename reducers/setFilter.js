module.exports = function setFilter (advent, { update }) {
  if (advent.type !== 'setFilter')
    return

  const { data: { textFilter, re } } = advent
  const reOperators = /[|\\{}()[\]^$+*?.]/g
  const _re = re || new RegExp(textFilter.replace(reOperators, '\\$&'), 'i')
  update(['filter', 'regExp'], _re)
  update(['filter', 'text'], textFilter)
}
