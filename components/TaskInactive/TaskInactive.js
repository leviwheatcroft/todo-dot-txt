require('./TaskInactive.less')
const template = require('./TaskInactive.pug')
const {
  StateObserver
} = require('../../lib/StateObserver')
const {
  Component
} = require('../../lib/Component')

class TaskInactive extends Component {
  constructor () {
    super()
    const { dataset: { id } } = this
    this.populateData({
      id,
      resolverTask: (s) => s.tasks[id],
      resolverTaskMeta: (s) => s.tasksMeta[id]
    })
    this.render()
  }

  render () {
    super.render()
    if (this.data.taskMeta.newTask) {
      const $input = this.querySelector('input')
      $input.addEventListener('click', this.activate.bind(this))
    } else {
      this.querySelector('.complete-checkbox')
        .addEventListener('click', this._toggleComplete.bind(this))
      this.querySelector('.description')
        .addEventListener('click', this.activate.bind(this))
      this.querySelectorAll('.tag').forEach(($tag) => {
        $tag.addEventListener('click', this.filterByTag.bind(this, $tag))
      })
    }
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
    const re = new RegExp(filter.replace(reOperators, '\\$&'), 'i')
    this.instancesTrigger({
      type: 'filter',
      data: { re }
    })
  }

  activate (event) {
    event.stopPropagation()
    this.publish({
      type: 'activateTask',
      data: { id: this.data.id }
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

TaskInactive.prototype.template = template

StateObserver.extend(TaskInactive)

module.exports = TaskInactive
