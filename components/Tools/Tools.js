require('./Tools.less')
const template = require('./Tools.pug')
const LightBox = require('../LightBox')

class Tools extends LightBox {
  // constructor () {
  //   super()
  // }

  // render () {
  //   const locals = {
  //     lightboxTitle: this.lightboxTitle
  //   }
  //   super.render(locals)
  //   const $mask = this.querySelector('.lightbox-mask')
  //   $mask.addEventListener('click', this.close.bind(this))
  //   const $closeButton = this.querySelector('button.closeButton')
  //   $closeButton.addEventListener('click', this.close.bind(this))
  // }
}

Tools.prototype.lightboxTitle = 'Tools'
Tools.prototype.template = template

module.exports = Tools
