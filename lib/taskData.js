const {
  v4: uuid
} = require('uuid')
const storage = require('./storage')

module.exports = {
  set (data) {
    this.data = { ...this.data || {}, ...data }
  },

  post (data) {
    this.set(data)
    storage.set(this.data)
  },

  get (prop) {
    return this.data[prop]
  },

  uuid () {
    this.set({ id: uuid() })
  },

  parse (raw) {
    this.set({ raw })
  }
}
