function classnamesAsArray (...list) {
  // eslint-disable-next-line no-shadow
  const classnames = []
  list.forEach((l) => {
    if (typeof l === 'string') {
      classnames.push(l)
    } else {
      Object.entries(l).forEach(([classname, bool]) => {
        if (bool)
          classnames.push(classname)
      })
    }
  })
  return classnames
}
function classnamesAsString (...list) {
  return classnamesAsArray(...list).join(' ')
}

module.exports = {
  asString: classnamesAsString,
  asArray: classnamesAsArray
}
