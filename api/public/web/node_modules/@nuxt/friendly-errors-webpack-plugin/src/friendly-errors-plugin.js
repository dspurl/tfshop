'use strict'

const transformErrors = require('./core/transformErrors')
const formatErrors = require('./core/formatErrors')
const reporters = require('./reporters')
const utils = require('./utils')
const { titles } = require('./utils/log')

const concat = utils.concat
const uniqueBy = utils.uniqueBy

const defaultTransformers = [
  require('./transformers/babelSyntax'),
  require('./transformers/moduleNotFound'),
  require('./transformers/esLintError')
]

const defaultFormatters = [
  require('./formatters/moduleNotFound'),
  require('./formatters/eslintError'),
  require('./formatters/defaultError')
]

const logLevels = {
  'INFO': 0,
  'WARNING': 1,
  'ERROR': 2,
  'SILENT': 3
}

class FriendlyErrorsWebpackPlugin {
  constructor (options) {
    options = options || {}
    this.compilationSuccessInfo = options.compilationSuccessInfo || {}
    this.onErrors = options.onErrors
    this.shouldClearConsole = options.clearConsole == null ? true : Boolean(options.clearConsole)
    this.logLevel = logLevels[(options.logLevel || 'info').toUpperCase()]
    this.formatters = concat(defaultFormatters, options.additionalFormatters)
    this.transformers = concat(defaultTransformers, options.additionalTransformers)
    this.previousEndTimes = {}

    let reporter = options.reporter || 'base'
    if (typeof reporter === 'string') {
      reporter = new (require(reporters[reporter] || reporter))()
    }
    this.reporter = reporter
  }

  apply (compiler) {
    const doneFn = stats => {
      this.clearConsole()

      const hasErrors = stats.hasErrors()
      const hasWarnings = stats.hasWarnings()

      let cleared = false

      if (!hasErrors && !hasWarnings && this.logLevel < 1) {
        cleared = this.clearConsole()
        this.displaySuccess(stats)
        return
      }

      if (hasWarnings && this.logLevel < 2) {
        cleared = this.clearConsole()
        this.displayErrors(extractErrorsFromStats(stats, 'warnings'), 'warn')
      }

      if (hasErrors && this.logLevel < 3) {
        cleared || this.clearConsole()
        this.displayErrors(extractErrorsFromStats(stats, 'errors'), 'error')
      }
    }

    const invalidFn = () => {
      this.clearConsole()
      this.reporter.info('WAIT', 'Compiling...')
    }

    if (compiler.hooks) {
      const plugin = { name: 'FriendlyErrorsWebpackPlugin' }

      compiler.hooks.done.tap(plugin, doneFn)
      compiler.hooks.invalid.tap(plugin, invalidFn)
    } else {
      compiler.plugin('done', doneFn)
      compiler.plugin('invalid', invalidFn)
    }
  }

  clearConsole () {
    if (this.shouldClearConsole) {
      this.reporter.clearConsole()
    }
    return true
  }

  displaySuccess (stats) {
    const time = isMultiStats(stats) ? this.getMultiStatsCompileTime(stats) : this.getStatsCompileTime(stats)
    this.reporter.success('DONE', 'Compiled successfully in ' + time + 'ms')

    if (this.compilationSuccessInfo.messages) {
      this.compilationSuccessInfo.messages.forEach(message => this.reporter.info(message))
    }
    if (this.compilationSuccessInfo.notes) {
      this.reporter.log()
      this.compilationSuccessInfo.notes.forEach(note => this.reporter.note(note))
    }
  }

  displayErrors (errors, severity) {
    const processedErrors = transformErrors(errors, this.transformers)

    const topErrors = getMaxSeverityErrors(processedErrors)
    const nbErrors = topErrors.length

    const subtitle = severity === 'error'
      ? `Failed to compile with ${nbErrors} ${titles[severity]}s`
      : `Compiled with ${nbErrors} ${titles[severity]}s`
    this.reporter[severity](severity.toUpperCase(), subtitle)

    if (this.onErrors) {
      this.onErrors(severity, topErrors)
    }

    formatErrors(topErrors, this.formatters, severity)
      .forEach(chunk => {
        this.reporter[severity].apply(this.reporter, [].concat(chunk))
      })
  }

  getStatsCompileTime (stats, statsIndex) {
    // When we have multi compilations but only one of them is rebuilt, we need to skip the
    // unchanged compilers to report the true rebuild time.
    if (statsIndex !== undefined) {
      if (this.previousEndTimes[statsIndex] === stats.endTime) {
        return 0
      }

      this.previousEndTimes[statsIndex] = stats.endTime
    }

    return stats.endTime - stats.startTime
  }

  getMultiStatsCompileTime (stats) {
    // Webpack multi compilations run in parallel so using the longest duration.
    // https://webpack.github.io/docs/configuration.html#multiple-configurations
    return stats.stats
      .reduce((time, stats, index) => Math.max(time, this.getStatsCompileTime(stats, index)), 0)
  }
}

function extractErrorsFromStats (stats, type) {
  let errors = []
  if (isMultiStats(stats)) {
    errors = stats.stats
      .reduce((errors, stats) => errors.concat(extractErrorsFromStats(stats, type)), [])
  } else {
    if (Array.isArray(stats.compilation.children)) {
      for (const child of stats.compilation.children) {
        const childStats = child.getStats()
        errors.push.apply(errors, extractErrorsFromStats(childStats, type))
      }
    }
    errors.push.apply(errors, stats.compilation[type])
  }
  // Dedupe to avoid showing the same error many times when multiple
  // compilers depend on the same module.
  return uniqueBy(errors, error => error.message)
}

function isMultiStats (stats) {
  return stats.stats
}

function getMaxSeverityErrors (errors) {
  const maxSeverity = getMaxInt(errors, 'severity')
  return errors.filter(e => e.severity === maxSeverity)
}

function getMaxInt (collection, propertyName) {
  return collection.reduce((res, curr) => {
    return curr[propertyName] > res ? curr[propertyName] : res
  }, 0)
}

module.exports = FriendlyErrorsWebpackPlugin
