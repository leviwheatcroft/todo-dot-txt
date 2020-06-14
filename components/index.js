const TaskActive = require('./TaskActive')
const TaskInactive = require('./TaskInactive')
const Root = require('./Root')
const List = require('./List')
const Tools = require('./Tools')
const ToolsImport = require('./ToolsImport')
const NavBar = require('./NavBar')
const Filter = require('./Filter')

const components = {
  'tdt-task-active': TaskActive,
  'tdt-task-inactive': TaskInactive,
  'tdt-root': Root,
  'tdt-list': List,
  'tdt-tools': Tools,
  'tdt-tools-import': ToolsImport,
  'tdt-nav-bar': NavBar,
  'tdt-filter': Filter
}

Object.entries(components).forEach(([elementName, component]) => {
  customElements.define(elementName, component)
})
