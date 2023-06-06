'use strict'

const { colors, clearConsole } = require('../utils/log')
const consola = require('consola')

class ConsolaReporter {
  constructor () {
    this.enabled = true
    this.consola = consola.withTag('friendly-errors')
    this.initLevels()
  }

  enable () {
    this.enabled = true
  }

  log () {
    if (this.enabled) {
      this.consola.log.apply(this.consola, arguments)
    }
  }

  initLevels () {
    for (const level of Object.keys(colors)) {
      this[level] = (title, message) => {
        if (!this.enabled) return
        if (title === 'WAIT') return

        if (message === undefined) {
          this.consola.log(title)
          return
        }
        (this.consola[level] || this.consola.log)(message)
      }
    }
  }

  clearConsole () {
    if (this.enabled) {
      clearConsole()
    }
  }
}

module.exports = ConsolaReporter
