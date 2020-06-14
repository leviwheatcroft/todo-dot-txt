require('./NavBar.less')
const template = require('./NavBar.pug')
const {
  Component
} = require('../../lib/Component')

class NavBar extends Component {
  constructor () {
    super()
    this.render()
    const $btnTools = this.querySelector('.btn-tools')
    $btnTools.addEventListener('click', this.openTools.bind(this))
  }

  openTools () {
    const $tools = document.querySelector('tdt-tools')
    $tools.unhide()
  }
}

NavBar.prototype.template = template

module.exports = NavBar
