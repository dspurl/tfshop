'use strict'

const chalk = require('chalk')
const readline = require('readline')

const colors = {
  success: 'green',
  info: 'blue',
  note: 'white',
  warn: 'yellow',
  error: 'red'
}

const titles = {
  success: 'success',
  info: 'info',
  note: 'note',
  warn: 'warning',
  error: 'error'
}

function bgColor (level) {
  const color = textColor(level)
  return 'bg' + capitalizeFirstLetter(color)
}

function textColor (level) {
  return colors[level.toLowerCase()] || 'red'
}

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function formatTitle (severity, title) {
  return chalk[bgColor(severity)].black('', title, '')
}

function formatText (severity, message) {
  return chalk[textColor(severity)](message)
}

function clearConsole () {
  if (process.stdout.isTTY) {
    // Fill screen with blank lines. Then move to 0 (beginning of visible part) and clear it
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
  }
}

module.exports = {
  colors,
  titles,
  formatText,
  formatTitle,
  clearConsole
}
