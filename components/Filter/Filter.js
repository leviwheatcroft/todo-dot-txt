require('./Filter.less')
const template = require('./Filter.pug')
const {
  StateObserver
} = require('../../lib/StateObserver')
const {
  Component
} = require('../../lib/Component')

class Filter extends Component {
  constructor () {
    super()
    this.populateData({
      resolverFilter: (s) => s.filter
    })
    this.subscribe('dataUpdated', this.render.bind(this))
    this.render()
  }

  render () {
    super.render()
    const $input = this.querySelector('input')
    $input.addEventListener('blur', this.setFilter.bind(this))
    $input.addEventListener('keyup', this.keyup.bind(this))
    const $btnClear = this.querySelector('.btn-clear')
    if ($btnClear)
      $btnClear.addEventListener('click', this.clear.bind(this))
    this.$input = $input
  }

  setFilter () {
    const textFilter = this.$input.value
    this.publish('setFilter', { textFilter })
  }

  clear (event) {
    event.stopPropagation()
    this.publish('setFilter', { textFilter: '' })
  }

  keyup (event) {
    if (event.keyCode !== 13) // enter
      return
    this.setFilter()
  }
}

Filter.prototype.template = template

StateObserver.extend(Filter)

module.exports = Filter
