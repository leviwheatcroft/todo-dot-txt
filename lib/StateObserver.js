const advents = require('./advents')
const initialState = require('./initialState')
const reducers = require('../reducers')

const states = [initialState]
const instances = []

class StateObserver {
  /**
    * disconnectedCallback ()
    * need to listen for disconnection, and discard from instances.
    * otherwise, the instances array would prevent this instance from being
    * garbage collected when disconnected from the dom, and it would continue
    * listening to & reacting to events
    */
  disconnectedCallback () {
    delete instances[instances.indexOf(this)]
    // instances.splice(instances.indexOf(this), 1)
  }

  initializeStateObserver () {
    if (this.stateObserverInitialized)
      return
    instances.push(this)
    this.states = states
    this.resolvers = {}
    this.data = {}
    this.stateObserverInitialized = true
  }

  populateData (dataset = this.dataset) {
    this.initializeStateObserver()
    const stateObserver = this
    const re = /resolver([A-Z])/
    Object.entries(dataset).forEach(([key, value]) => {
      if (re.test(key)) {
        const resolver = value
        // eslint-disable-next-line no-param-reassign
        key = key.replace(re, (_, p1) => p1.toLowerCase())
        if (typeof resolver === 'function') {
          this.resolvers[key] = resolver
        } else if (typeof resolver === 'string') {
          const path = resolver.split('.')
          this.resolvers[key] = function pathResolver (state) {
            let resolved = state
            try {
              path.forEach((segment) => { resolved = resolved[segment] })
            } catch (err) { return undefined }
            return value
          }
        } else {
          throw new RangeError('bad resolver')
        }
        Object.defineProperty(this.data, key, {
          get () {
            return stateObserver.resolvers[key](stateObserver.states[0])
          },
          enumerable: true
        })
      } else {
        Object.defineProperty(this.data, key, {
          value,
          configurable: true,
          writable: false,
          enumerable: true
        })
      }
    })
  }

  isUpdated (key) {
    if (!this.resolvers[key])
      throw new RangeError('bad path')
    const current = this.resolvers[key](this.states[0])
    const previous = this.resolvers[key](this.states[1])
    return current !== previous
  }

  publish (advent, data) {
    const operationStart = Date.now()
    if (advent.modifier)
      console.log('deprecated advent', advent) // [todo] remove this
    if (
      typeof advent === 'string' ||
      Array.isArray(advent)
    )
      advent = { type: advent, data }
    advent.operationStart = operationStart
    advent.type = [].concat(advent.type)
    advent.type.forEach((t) => {
      if (!advents.includes(t))
        throw new RangeError(`bad Event Type: ${t}`)
    })
    let state = states[0]
    advent.type.forEach((type) => {
      state = reducers(state, { ...advent, type })
    })
    if (state === undefined)
      throw new RangeError('got undefined state')
    if (state !== states[0]) {
      states.unshift(state)
      advent.stateUpdated = true
    }

    if (advent.modifier) {
      state = { ...states[0] }
      advent.stateUpdated = true
      advent.modifier(state)
      states.unshift(state)
    }
    advent.origin = advent.origin || this
    instances.forEach((i) => {
      i.subscription(advent)
    })
  }

  subscription (advent) {
    if (!this.handlers)
      return
    const handlers = []
    // console.log(`subscription ${advent.type}`, this, advent)
    if (advent.stateUpdated) {
      const updated = Object.keys(this.resolvers).some((key) => {
        return this.isUpdated(key)
      })
      if (updated)
        handlers.push(...this.handlers.dataUpdated || [])
    }
    advent.type.forEach((type) => handlers.push(...this.handlers[type] || []))
    handlers.forEach((h) => h(advent))
    const recipient = `[${this.tagName || this.controllerName}]`
    const handlerNames = handlers.map((h) => h.name).join(',')
    const elapsed = `(${Date.now() - advent.operationStart}ms)`
    console.debug(`${recipient} ${advent.type} ${elapsed} [${handlerNames}]`)
  }

  // stateUpdate (update) {
  //   if (!isPlainObject)
  //     throw new RangeError('bad update')
  //   const state = immutable.wrap(this.states[0])
  //   Object.entries(update).forEach(([path, value]) => {
  //     state.set(path, value)
  //   })
  //   states.unshift(state.value())
  //   // console.log('stateUpdate parent:', this)
  //   // console.log('stateUpdate state:', update)
  //   // console.log('stateUpdate states:', this.states)
  //   // console.log('stateUpdate instances:', instances)
  //   this.instancesTrigger({
  //     type: 'stateUpdated',
  //     origin: this
  //   })
  // }
  //
  // instancesTrigger (unevent) {
  //   if (!events.includes(unevent.type))
  //     throw new RangeError(`Bad Event Type: ${unevent.type}`)
  //   if (!unevent.origin)
  //     unevent.origin = this
  //   instances.forEach((i) => i.trigger(unevent))
  // }

  subscribe (type, handler) {
    if (!advents.includes(type))
      throw new RangeError(`Bad Event Type: ${type}`)
    if (!this.handlers)
      this.handlers = {}
    if (!this.handlers[type])
      this.handlers[type] = []
    this.handlers[type].push(handler)
  }

  unsubscribe (type, handler) {
    this.handlers[type] = this.handlers[type].filter((h) => h !== handler)
  }

  // trigger (unevent) {
  //   if (
  //     (!this.handlers) ||
  //     (!this.handlers[unevent.type])
  //   )
  //     return
  //   this.handlers[unevent.type].forEach((h) => h(unevent))
  // }
  //
  // stateUpdated (unevent) {
  //
  // }

  // render (locals = {}) {
  //   Object.assign(
  //     locals,
  //     { state: this.states[0] },
  //     this.data
  //   )
  //   if (!super.render)
  //     console.log(this)
  //   super.render(locals)
  // }

  static extend (TargetClass) {
    Object.getOwnPropertyNames(StateObserver.prototype).forEach((name) => {
      if (
        name === 'constructor' ||
        name === 'render'
      )
        return
      TargetClass.prototype[name] = StateObserver.prototype[name]
    })
    Object.defineProperty(TargetClass.prototype, 'locals', {
      get () {
        // console.log('get', this)
        return {
          state: this.states[0],
          ...this.data
        }
      }
    })
  }
}

StateObserver.prototype.states = states

module.exports = {
  StateObserver,
  instancesTrigger: StateObserver.prototype.publish
}
