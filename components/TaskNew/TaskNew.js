const {
  v4: uuid
} = require('uuid')
const TaskEditable = require('../TaskEditable')

class TaskNew extends TaskEditable {
  save (event) {
    this.data.task = {
      id: uuid()
    }
    super.save(event)
  }

  taskOpened () {} // noop

  keyup (event) {
    if (event.keyCode === 13) { // enter key
      this.save(event)
    }
  }
}

module.exports = TaskNew
