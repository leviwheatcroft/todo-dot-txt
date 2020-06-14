
function set (obj, path, value) {
  const mutated = { ...obj }
  let cursor = mutated
  if (!Array.isArray(path))
    // eslint-disable-next-line no-param-reassign
    path = path.split('.')
  path.forEach((s, idx) => {
    cursor[s] = idx === path.length - 1 ? value : { ...cursor[s] }
    cursor = cursor[s]
  })
  return mutated
}

function wrap (obj) {
  let result = obj
  function wrappedSet (path, value) {
    result = set(result, path, value)
    wrappedSet.result = result
    return obj
  }
  wrappedSet.result = result
  return wrappedSet
}

module.exports = {
  wrap,
  set
}
