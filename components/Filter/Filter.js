require('./Filter.less')
const template = require('./Filter.pug')
const {
  StateObserverComponent
} = require('../../lib/StateObserver')

class Filter extends StateObserverComponent {
  constructor () {
    super()
    this.populateData({
      stateFilter: 'filter'
    })
    this.on('dataUpdated', this.dataUpdated.bind(this))
    this.render()
  }

  render () {
    super.render()
    const $input = this.querySelector('input')
    $input.addEventListener('blur', this.edited.bind(this))
    $input.addEventListener('keyup', this.keyup.bind(this))
    const $btnClear = this.querySelector('.btn-clear')
    if ($btnClear)
      $btnClear.addEventListener('click', this.clear.bind(this))
    this.$input = $input
  }

  clear (event) {
    event.stopPropagation()
    const update = { filter: '' }
    this.stateUpdate(update)
  }

  dataUpdated (unevent) {
    this.render()
    console.log(unevent)
    if (unevent.origin !== this)
      return
    let re
    if (this.data.filter === '') {
      re = /.*/
    } else {
      const reOperators = /[|\\{}()[\]^$+*?.]/g
      re = new RegExp(this.data.filter.replace(reOperators, '\\$&'))
    }
    this.instancesTrigger({
      type: 'filter',
      data: { re }
    })
  }

  keyup (event) {
    if (event.keyCode !== 13) // enter
      return
    this.edited()
  }

  edited () {
    const update = { filter: this.$input.value }
    this.stateUpdate(update)
  }
}

Filter.prototype.template = template

module.exports = Filter
