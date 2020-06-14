module.exports = function setFilter (advent, { update }) {
  if (advent.type !== 'setFilter')
    return

  const { data: { textFilter } } = advent
  const reOperators = /[|\\{}()[\]^$+*?.]/g
  const re = new RegExp(textFilter.replace(reOperators, '\\$&'), 'i')
  update(['filter', 'regExp'], re)
  update(['filter', 'text'], textFilter)
}
