require('./LightBox.less')
const template = require('./LightBox.pug')
const Component = require('../../lib/Component')

class LightBox extends Component {
  constructor () {
    super()
    this.classList.add('hide')
    this.render()
  }

  render () {
    const locals = {
      lightboxTitle: this.lightboxTitle
    }
    super.render(locals)
    const $mask = this.querySelector('.lightbox-mask')
    $mask.addEventListener('click', this.hide.bind(this))
    const $closeButton = this.querySelector('button.close-button')
    $closeButton.addEventListener('click', this.hide.bind(this))
  }
}

LightBox.prototype.template = template

module.exports = LightBox
