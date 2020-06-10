/* eslint-disable global-require */
const components = {
  'tdt-task': require('./Task'),
  'tdt-root': require('./Root'),
  'tdt-list': require('./List'),
  'tdt-task-static': require('./TaskStatic'),
  'tdt-task-editable': require('./TaskEditable'),
  'tdt-task-new': require('./TaskNew'),
  'tdt-button-save': require('./TeButtonSave'),
  'tdt-button-due': require('./TeButtonDue'),
  'tdt-tools': require('./Tools'),
  'tdt-nav-bar': require('./NavBar'),
  'tdt-filter': require('./Filter')
}

Object.entries(components).forEach(([elementName, component]) => {
  customElements.define(elementName, component)
})
