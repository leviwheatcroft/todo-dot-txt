/* eslint-disable consistent-return */

require('./TaskActive.less')
const template = require('./TaskActive.pug')

const {
  StateObserver
} = require('../../lib/StateObserver')
const {
  Component
} = require('../../lib/Component')

let firstPlaceholder = true

class TaskActive extends Component {
  constructor () {
    super()
    const { dataset: { id, list } } = this
    this.populateData({
      id,
      list,
      resolverTask: (s) => s.tasks[id],
      resolverTaskMeta: (s) => s.tasksMeta[id]
    })
    this.render()
  }

  render () {
    super.render({
      dateString: this.dateString,
      randomPlaceholder: this.randomPlaceholder
    })
    const $input = this.querySelector('.inputBar input')
    $input.addEventListener('keyup', this.keyup.bind(this))
    // $input.addEventListener('blur', this.save.bind(this))
    $input.focus()
    this.querySelector('.btn-save')
      .addEventListener('click', this.save.bind(this))
    this.querySelectorAll('.btn-group-select .btn').forEach(($btn) => {
      $btn.addEventListener('click', (event) => {
        event.stopPropagation()
        this.querySelector('.btn-group-select')
          .classList.add('active')
        this.querySelector(`.${event.target.dataset.select}`)
          .classList.add('active')
        event.target.querySelector('.setter').classList.add('active')
      })
    })
  }

  save (event) {
    event.stopPropagation()
    const {
      data: { id, list }
    } = this
    const raw = this.querySelector('.inputBar input').value
    if (raw === '')
      return this.publish('deactivateTask', { id })
    if (this.data.taskMeta.newTask) {
      this.publish(
        ['saveNewTask', 'deactivateTask', 'taskCreateNew'],
        { id, raw, list }
      )
    } else {
      this.publish(['updateExistingTask', 'deactivateTask'], { id, raw })
    }
  }

  keyup (event) {
    if (event.keyCode === 13) { // enter key
      return this.save(event)
    }
    this.hasChanges = true
  }

  randomPlaceholder () {
    if (
      (firstPlaceholder) ||
      (Math.random() < 0.97)
    ) {
      firstPlaceholder = false
      return '  ¯\\_(ツ)_/¯'
    }

    const placeholders = [
      'count pineapples',
      'purge flux capacitor +delorean',
      'win reddit @work',
      'finish TPS reports @work',
      'star todo-dot-txt on github (because it\'s pretty rad!)',
      'acquire red slimline stapler +dominate @work',
      'resolve "PC Load Error"',
      'abandon all hope @work',
      'trim nose hairs @bathroom',
      'download new car @home',
      'resolve existential crisis',
      'send resignation email'
    ]
    const random = Math.floor(Math.random() * placeholders.length)
    return placeholders[random]
  }

  dateString (plusDays = 0) {
    const now = new Date()
    const date = new Date(now.getTime() + (plusDays * 24 * 60 * 60 * 1000))
    return [
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ].join('-')
  }
}

TaskActive.prototype.template = template

StateObserver.extend(TaskActive)

module.exports = TaskActive
