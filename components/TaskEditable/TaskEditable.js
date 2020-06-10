/* eslint-disable consistent-return */

require('./TaskEditable.less')
const template = require('./TaskEditable.pug')

const {
  StateObserverComponent
} = require('../../lib/StateObserver')
const parseTask = require('../../lib/parseTask')
const {
  taskOpened
} = require('../../lib/events')

let firstPlaceholder = true

class TaskEditable extends StateObserverComponent {
  constructor () {
    super()
    this.instancesDispatchEvent(taskOpened)
    this.addEventListener(taskOpened, this.taskOpened.bind(this))
    this.render()
  }

  render () {
    super.render({ randomPlaceholder: this.randomPlaceholder })
    const $input = this.querySelector('.inputBar input')
    $input.addEventListener('keyup', this.keyup.bind(this))
    const $buttonSave = this.querySelector('tdt-button-save')
    $buttonSave.addEventListener('click', this.save.bind(this))
    Object.assign(this, {
      $input,
      $buttonSave
    })
  }

  taskOpened ({ origin }) {
    if (origin === this)
      return
    if (this.hasChanges)
      return
    const update = { [`tasks.${this.data.task.id}.open`]: false }
    this.stateUpdate(update)
  }

  save (event) {
    event.stopPropagation()
    const task = parseTask(this.$input.value, this.data.task)
    task.open = false
    const update = { [`tasks.${this.data.task.id}`]: task }
    this.stateUpdate(update)
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
    // an easter egg to cheer up someones day!
    // I have a terrible sense of humour. Please give me some suggestions.
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
}

TaskEditable.prototype.template = template

module.exports = TaskEditable
