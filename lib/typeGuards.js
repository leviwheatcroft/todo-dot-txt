const isPlainObject = require('lodash/isPlainObject')

function isTaskData (value) {
  // re for uuid v4
  // https://stackoverflow.com/a/38191078/441930
  const re = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  if (!value.id)
    return false
  return re.test(value.id)
}

function isArray (value) {
  return Array.isArray(value)
}

module.exports = {
  isTaskData,
  isArray,
  isPlainObject
}
