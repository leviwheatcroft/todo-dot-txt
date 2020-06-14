/* eslint-disable global-require */
const {
  wrap
} = require('../lib/dotProp')

const _reducers = [
  require('./taskCreateNew'),
  require('./activateTask'),
  require('./deactivateTask'),
  require('./saveNewTask'),
  require('./updateExistingTask'),
  require('./setFilter'),
  require('./importTasks'),
  require('./purgeCompleted'),
  require('./taskToggleComplete')
]

module.exports = function reducers (state, advent) {
  // eslint-disable-next-line no-shadow
  return _reducers.reduce((state, reducer) => {
    const update = wrap(state)
    reducer(advent, { state, update })
    return update.result
  }, state)
}
