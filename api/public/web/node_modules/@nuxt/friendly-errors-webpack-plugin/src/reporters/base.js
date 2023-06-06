'use strict'

const { colors, formatTitle, formatText, clearConsole } = require('../utils/log')
const chalk = require('chalk')
const stringWidth = require('string-width')

class BaseReporter {
  constructor () {
    this.enabled = true
    this.initLevels()
  }

  enable () {
    this.enabled = true
  }

  log () {
    if (this.enabled) {
      console.log.apply(console, arguments)
    }
  }

  initLevels () {
    for (const level of Object.keys(colors)) {
      this[level] = (title, message) => {
        if (!this.enabled) return

        if (message === undefined) {
          message = title
          this.log(message)
          return
        }

        title = formatTitle(level, title)
        message = formatText(level, message)
        if (process.env.NODE_ENV !== 'test') {
          message = this.appendTimestamp(title, message)
        }
        this.log(title, message)
        this.log()
      }
    }
  }

  appendTimestamp (title, message) {
    // Make timestamp appear at the end of the line
    const line = `${title} ${message}`
    const dateString = chalk.grey(new Date().toLocaleTimeString())
    let logSpace = process.stdout.columns - stringWidth(line) - stringWidth(dateString)
    if (logSpace <= 0) {
      logSpace = 10
    }
    return `${message}${' '.repeat(logSpace)}${dateString}`
  }

  clearConsole () {
    if (this.enabled) {
      clearConsole()
    }
  }
}

module.exports = BaseReporter
