require('./Filter.less')
const template = require('./Filter.pug')
const {
  StateObserverComponent
} = require('../../lib/StateObserver')
const {
  dataUpdated,
  filter
} = require('../../lib/events')

class Filter extends StateObserverComponent {
  constructor () {
    super()
    this.populateData({
      stateFilter: 'filter'
    })
    this.addEventListener(dataUpdated, this.dataUpdated.bind(this))
    this.render()
  }

  render () {
    super.render()
    const $input = this.querySelector('input')
    $input.addEventListener('blur', this.edited.bind(this))
    $input.addEventListener('keyup', this.keyup.bind(this))
    this.$input = $input
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

  dataUpdated (event) {
    console.log('filter event', event.origin)
    if (event.origin !== this) {
      this.render()
    } else {
    // if (
    //   (this.data.filter === '') &&
    //   (!this.isUpdated('filter'))
    // )
    //   return
      let re
      if (this.data.filter === '') {
        re = /.*/
      } else {
        const reOperators = /[|\\{}()[\]^$+*?.]/g
        re = new RegExp(this.data.filter.replace(reOperators, '\\$&'))
      }
      this.instancesDispatchEvent(filter, re)
    }
  }
}

Filter.prototype.template = template

module.exports = Filter
