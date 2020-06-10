const {
  v4: uuid
} = require('uuid')
const {
  newTask
} = require('../../lib/events')
const TaskEditable = require('../TaskEditable')

class TaskNew extends TaskEditable {
  save (event) {
    this.data.task = { id: uuid() }
    super.save(event)
    this.dispatchEvent(newTask, {
      bubbles: true,
      data: {
        taskId: this.data.task.id
      }
    })
  }

  taskOpened () {} // noop

  keyup (event) {
    if (event.keyCode === 13) { // enter key
      this.save(event)
    }
  }
}

module.exports = TaskNew
