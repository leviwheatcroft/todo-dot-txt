require('./TeButtonSave.less')
const template = require('./TeButtonSave.pug')
const Component = require('../../lib/Component')

class TeButtonSave extends Component {
  constructor () {
    super()
    this.render()
  }

  // render () {
  //   super.render()
  //   const $buttonBar = this.querySelector('.buttonBar')
  //   $buttonBar.addEventListener('click', this._static.bind(this))
  // }
  //
  // _static (event) {
  //   event.stopPropagation()
  //   this.stateUpdate({
  //     [this.dataPaths.task]: { ...this.data.task, open: false }
  //   })
  // }
}

TeButtonSave.prototype.template = template

module.exports = TeButtonSave
