/* eslint-disable max-classes-per-file */

/**
 * a better way to react to state changes would be for components to register
 * listeners on the state object.
 * create the states array, then attach functions to it. It could maintain
 * arrays of listeners like:
 * {
 *   'tasks.e5dfc74e-edca-49b2-b75c-b2668ce8be44': [
 *     listener1
 *     listener2
 *    ]
 * }
 * then on a state update, it already has the dot prop reference like
 * 'tasks.e5dfc74e-edca-49b2-b75c-b2668ce8be44'
 *
 * this would be much more performant as it avoids the requirement for each
 * reactive component to assess whether it's data has updated.
 */

const get = require('lodash/get')
const immutable = require('object-path-immutable')
const {
  stateUpdated,
  dataUpdated
} = require('./events')
// const immutable = require('object-path-immutable')
const isPlainObject = require('./typeGuards')
const Component = require('./Component')
const initialState = require('./initialState')

const states = [initialState]
const instances = []

const stateMixins = {

  states,

  get (path, history = 0) {
    return get(states[history], path)
  },

  isUpdated (path) {
    return this.get(path) !== this.get(path, 1)
  },

  stateUpdate (update) {
    if (!isPlainObject)
      throw new RangeError('stateUpdate must be { path: value }')
    const state = immutable.wrap(this.states[0])
    Object.entries(update).forEach(([path, value]) => {
      state.set(path, value)
    })
    states.unshift(state.value())
    // console.log('stateUpdate parent:', this)
    // console.log('stateUpdate state:', update)
    // console.log('stateUpdate states:', this.states)
    // console.log('stateUpdate instances:', instances)
    this.instancesDispatchEvent(stateUpdated)
  },

  instancesDispatchEvent (eventName, ...data) {
    const event = new Event(eventName)
    event.data = data
    event.origin = this
    instances.forEach((i) => i.dispatchEvent(event))
  }
}

class StateObserverComponent extends Component {
  constructor () {
    super()
    instances.push(this)
    this.addEventListener(stateUpdated, this.stateUpdated.bind(this))
    this.populateData()
  }

  /**
    * disconnectedCallback ()
    * need to listen for disconnection, and discard from instances.
    * otherwise, the instances array would prevent this instance from being
    * garbage collected when disconnected from the dom, and it would continue
    * listening to & reacting to events
    */
  disconnectedCallback () {
    instances.splice(instances.indexOf(this), 1)
  }

  populateData (dataset = this.dataset) {
    const component = this
    const data = {}
    const dataPaths = {}
    const re = /state([A-Z])/
    Object.entries(dataset).forEach(([key, value]) => {
      if (re.test(key)) {
        const path = value
        const stateKey = key.replace(re, (_, p1) => p1.toLowerCase())
        dataPaths[stateKey] = path
        Object.defineProperty(data, stateKey, {
          get () {
            return component.get(path)
          },
          set (update) {
            this.stateUpdate(path, update)
          },
          enumerable: true,
          path
        })
      } else {
        Object.defineProperty(data, key, {
          value,
          configurable: true,
          writable: false,
          enumerable: true
        })
      }
    })
    this.data = data
    this.dataPaths = dataPaths
  }

  stateUpdated () {
    const updated = Object.entries(this.data).some(([key]) => {
      if (!this.dataPaths[key])
        return false
      return this.isUpdated(this.dataPaths[key])
    })
    if (!updated)
      return
    this.dispatchEvent(dataUpdated)
  }

  render (locals = {}) {
    Object.assign(
      locals,
      { state: this.states[0] },
      this.data
    )
    super.render(locals)
  }
}

Object.assign(StateObserverComponent.prototype, stateMixins)

class StateObserver extends EventTarget {
  constructor () {
    super()
    instances.push(this)
  }
}

Object.assign(StateObserver.prototype, stateMixins)

module.exports = {
  StateObserverComponent,
  StateObserver,
  instancesDispatchEvent: stateMixins.instancesDispatchEvent
}
