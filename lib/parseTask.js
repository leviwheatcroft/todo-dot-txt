/* eslint-disable no-cond-assign, prefer-destructuring */
function parseTask (raw) {
  const parsed = raw
  const task = { raw, parsed }
  complete(task)
  priority(task)
  project(task)
  context(task)
  url(task)
  values(task)
  return task
}

function complete (task) {
  const re = /^ ?x /i
  task.complete = re.test(task.raw)
  task.parsed = task.parsed.replace(re, '')
}

function priority (task) {
  const re = /\(([a-z])\) /ig
  const result = re.exec(task.raw)
  task.priority = false
  if (result)
    task.priority = result[1].toUpperCase()
  task.parsed = task.parsed.replace(re, '')
}

function project (task) {
  const re = /\+([\w-]*)( |$)/g
  task.projects = []
  let result
  while ((result = re.exec(task.raw)) !== null)
    task.projects.push(result[1])

  task.parsed = task.parsed.replace(re, '')
}

function context (task) {
  const re = /@([\w-]*)( |$)/g
  task.contexts = []
  let result
  while ((result = re.exec(task.raw)) !== null)
    task.contexts.push(result[1])

  task.parsed = task.parsed.replace(re, '')
}

function url (task) {
  const re = /https?:\/\/([^/]*)[^\s]*/g
  task.urls = {}
  let result
  while ((result = re.exec(task.raw)) !== null)
    task.urls[result[1]] = result[0]

  task.parsed = task.parsed.replace(re, '')
}

function values (task) {
  const re = /([^ :]+):([^ :]+)( |$)/g
  task.values = {}
  let result
  while ((result = re.exec(task.parsed)) !== null)
    task.values[result[1]] = result[2]
  task.parsed = task.parsed.replace(re, '')
}

module.exports = parseTask
