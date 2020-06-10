require('./TeButtonDue.less')
const template = require('./TeButtonDue.pug')
const Component = require('../../lib/Component')

class TeButtonDue extends Component {
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

TeButtonDue.prototype.template = template

module.exports = TeButtonDue
