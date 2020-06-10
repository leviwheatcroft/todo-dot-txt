require('./TaskStatic.less')
const template = require('./TaskStatic.pug')
const {
  StateObserverComponent
} = require('../../lib/StateObserver')

class TaskStatic extends StateObserverComponent {
  constructor () {
    super()
    // this.addEventListener('dataUpdated', this.render.bind(this))
    this.addEventListener('click', this._editable.bind(this))
    this.render()
  }

  render () {
    super.render()
    const $completeCheckbox = this.querySelector('.completeCheckbox')
    $completeCheckbox.addEventListener('click', this._toggleComplete.bind(this))
    this.querySelectorAll('.tag').forEach(($tag) => {
      $tag.addEventListener('click', this.filterByTag.bind(this, $tag))
    })
  }

  filterByTag ($tag, event) {
    event.stopPropagation()

    let filter
    if ($tag.classList.contains('tag-priority'))
      filter = `(${$tag.dataset.priority})`
    else if ($tag.classList.contains('tag-project'))
      filter = `+${$tag.dataset.project}`
    else if ($tag.classList.contains('tag-context'))
      filter = `@${$tag.dataset.context}`
    else if ($tag.classList.contains('tag-value'))
      filter = `${$tag.dataset.key}:${$tag.dataset.value}`

    const update = { filter }
    this.stateUpdate(update)
    const reOperators = /[|\\{}()[\]^$+*?.]/g
    const re = new RegExp(filter.replace(reOperators, '\\$&'))
    this.instancesDispatchEvent(filter, re)
  }

  _editable (event) {
    event.stopPropagation()
    this.stateUpdate({
      [this.dataPaths.task]: { ...this.data.task, open: true }
    })
  }

  _toggleComplete (event) {
    event.stopPropagation()
    const update = {
      [`${this.dataPaths.task}.complete`]: !this.data.task.complete
    }
    this.stateUpdate(update)
  }
}

TaskStatic.prototype.template = template

module.exports = TaskStatic
