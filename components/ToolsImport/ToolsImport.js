const {
  v4: uuid
} = require('uuid')
require('./ToolsImport.less')
const template = require('./ToolsImport.pug')
const LightBox = require('../LightBox')
const parseTask = require('../../lib/parseTask')

class ToolsImport extends LightBox {
  render () {
    super.render()
    const $btnImport = this.querySelector('.btn-import')
    $btnImport.addEventListener('click', this.showDialog.bind(this))
    const $inputImport = this.querySelector('.input-import')
    $inputImport.addEventListener('click', this.clickImport.bind(this))
    $inputImport.addEventListener('change', this.import.bind(this))
    this.$inputImport = $inputImport
  }

  showDialog (event) {
    event.stopPropagation()
    this.$inputImport.click()
  }

  clickImport (event) {
    event.stopPropagation()
  }

  async import () {
    this.hide()
    const content = await this.$inputImport.files[0].text()
    const tasks = {
      ...this.states[0].tasks
    }
    // easier to convert all line endings before splitting
    content.replace(/\r\n?/g, '\n').split(/\n/).forEach((raw) => {
      if (!raw.length)
        return
      const task = {
        id: uuid()
      }
      tasks[task.id] = parseTask(raw, { id: task.id })
    })
    this.publish({
      type: 'import',
      modifier (s) {
        s.tasks = tasks
        return tasks
      }
    })
  }
}

ToolsImport.prototype.lightboxTitle = 'Import Tasks'
ToolsImport.prototype.template = template

module.exports = ToolsImport
