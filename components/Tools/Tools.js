require('./Tools.less')
const template = require('./Tools.pug')
const LightBox = require('../LightBox')

class Tools extends LightBox {
  // constructor () {
  //   super()
  // }

  render () {
    super.render()
    const $btnPurge = this.querySelector('.btn-purge')
    $btnPurge.addEventListener('click', this.purge.bind(this))
    const $btnImport = this.querySelector('.btn-import')
    $btnImport.addEventListener('click', this.import.bind(this))
  }

  import () {
    this.hide()
    document.querySelector('tdt-tools-import').unhide()
  }

  purge () {
    this.publish('purgeCompleted')
    this.hide()
  }
}

Tools.prototype.lightboxTitle = 'Tools'
Tools.prototype.template = template

module.exports = Tools
