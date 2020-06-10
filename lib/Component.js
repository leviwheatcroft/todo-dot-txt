const icons = require('./icons')
const classnames = require('./classnames')

const globals = {
  icons,
  classnames: classnames.asString
}

module.exports = class Component extends HTMLElement {
  constructor () {
    super()
    if (typeof this.template !== 'function')
      throw new RangeError('template must be a function')
  }

  classnames (...list) {
    const _classnames = classnames.asArray(...list)
    // eslint-disable-next-line no-restricted-syntax
    for (const classname of this.classList.values()) {
      const idx = _classnames.indexOf(classname)
      if (idx === -1)
        this.classList.remove(classname)
      else
        delete _classnames[idx]
    }
    if (_classnames.length)
      this.classList.add(..._classnames)
  }

  // connectedCallback () {
  //   this.render()
  // }

  hide (hideIf = true) {
    if (!hideIf)
      return
    if (this.isHidden === true)
      return
    this.classList.add('hide')
  }

  unhide (unhideIf = true) {
    if (!unhideIf)
      return
    if (this.isHidden === false)
      return
    this.classList.remove('hide')
  }

  dispatchEvent (eventName, options = {}) {
    if (eventName instanceof Event) {
      super.dispatchEvent(eventName)
      return
    }
    const event = new Event(eventName, options)
    event.origin = this
    event.data = options.data
    super.dispatchEvent(event)
  }

  render (locals = {}) {
    locals.content = ''
    // walk up the prototype chain
    let prototype = Object.getPrototypeOf(this)
    // stop once you get to the Component class
    while (prototype !== Component.prototype) {
      // render template if it belongs to that particular prototype
      // eslint-disable-next-line no-prototype-builtins
      if (prototype.hasOwnProperty('template'))
        locals.content = prototype.template({ ...locals, ...globals })
      prototype = Object.getPrototypeOf(prototype)
    }

    this.innerHTML = locals.content
  }
}
