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

    let textFilter
    let re = false
    if ($tag.classList.contains('tag-created-date')) {
      textFilter = $tag.dataset.createdDate
      re = new RegExp(`.{0,7}${$tag.dataset.createdDate}`)
    } else if ($tag.classList.contains('tag-priority')) {
      textFilter = `(${$tag.dataset.priority})`
    } else if ($tag.classList.contains('tag-project')) {
      textFilter = `+${$tag.dataset.project}`
    } else if ($tag.classList.contains('tag-context')) {
      textFilter = `@${$tag.dataset.context}`
    } else if ($tag.classList.contains('tag-value')) {
      textFilter = `${$tag.dataset.key}:${$tag.dataset.value}`
    }

    this.publish('setFilter', { textFilter, re })
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
    this.publish('taskToggleComplete', { id: this.data.id })
  }
}

TaskInactive.prototype.template = template

StateObserver.extend(TaskInactive)

module.exports = TaskInactive
