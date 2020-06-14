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
    this.subscribe('applyFilter', this.applyFilter.bind(this))
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

  applyFilter (advent) {
    const { data: { re } } = advent
    this.render()
    this.publish({
      type: 'filtered',
      modifier (s) {
        const tasks = {}
        Object.values(s.tasks).forEach((task) => {
          const hide = !re.test(task.raw)
          if (hide === task.hide)
            tasks[task.id] = task
          else
            tasks[task.id] = { ...task, hide }
        })
        s.tasks = tasks
        return s
      }
    })
  }

  clear (event) {
    event.stopPropagation()
    const update = { filter: '' }
    this.stateUpdate(update)
  }

  keyup (event) {
    if (event.keyCode !== 13) // enter
      return
    this.edited()
  }

  edited () {
    let re
    const filter = this.$input.value
    if (filter) {
      re = /.*/
    } else {
      const reOperators = /[|\\{}()[\]^$+*?.]/g
      re = new RegExp(filter.replace(reOperators, '\\$&'))
    }
    this.publish({
      type: 'applyFilter',
      filter,
      data: { re }
    })
  }
}

Filter.prototype.template = template

StateObserver.extend(Filter)

module.exports = Filter
