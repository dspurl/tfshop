const { resolve } = require('path')
const { readFileSync } = require('fs')
const connect = require('connect')
const serveStatic = require('serve-static')
const getPort = require('get-port-please')
const { json, end, header } = require('node-res')

const { parseStack } = require('./utils')
const SSE = require('./sse')

class LoadingUI {
  constructor (options) {
    this.options = options

    this._lastBroadcast = 0

    this.states = []
    this.allDone = true
    this.hasErrors = false

    this.serveIndex = this.serveIndex.bind(this)

    this._init()
  }

  _init () {
    // Create a connect middleware stack
    this.app = connect()

    // Create an SSE handler instance
    this.sse = new SSE()

    // Fix CORS
    this.app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      next()
    })

    // Subscribe to SSR channel
    this.app.use('/sse', (req, res) => this.sse.subscribe(req, res))

    // Serve state with JSON
    this.app.use('/json', (req, res) => json(req, res, this.state))

    // Load indexTemplate
    const distPath = resolve(__dirname, '../app-dist')
    this.indexTemplate = readFileSync(resolve(distPath, 'index.html'), 'utf-8')

    // Serve assets
    this.app.use('/assets', serveStatic(resolve(distPath, 'assets')))
  }

  async initAlt ({ url }) {
    if (this._server || this.options.baseURLAlt) {
      return
    }

    // Redirect users directly open this port
    this.app.use('/', (req, res) => {
      res.setHeader('Location', url)
      res.statusCode = 307
      res.end(url)
    })

    // Start listening on alternative port
    const port = await getPort({ random: true, name: 'nuxt_loading' })

    return new Promise((resolve, reject) => {
      this._server = this.app.listen(port, (err) => {
        if (err) { return reject(err) }
        this.options.baseURLAlt = `http://localhost:${port}`
        resolve()
      })
    })
  }

  close () {
    if (this._server) {
      return new Promise((resolve, reject) => {
        this._server.close((err) => {
          if (err) {
            return reject(err)
          }
          resolve()
        })
      })
    }
  }

  get state () {
    return {
      error: this.error,
      states: this.states,
      allDone: this.allDone,
      hasErrors: this.hasErrors
    }
  }

  setStates (states) {
    this.clearError()
    this.states = states
    this.allDone = this.states.every(state => state.progress === 0 || state.progress === 100)
    this.hasErrors = this.states.some(state => state.hasErrors === true)
    this.broadcastState()
  }

  setError (error) {
    this.clearStates(true)
    this.error = {
      description: error.toString(),
      stack: parseStack(error.stack).join('\n')
    }
    this.broadcastState()
  }

  clearError () {
    this.error = undefined
  }

  clearStates (hasErrors) {
    this.states = []
    this.allDone = false
    this.hasErrors = !!hasErrors
  }

  broadcastState () {
    const now = new Date()

    if ((now - this._lastBroadcast > 500) || this.allDone || this.hasErrors) {
      this.sse.broadcast('state', this.state)
      this._lastBroadcast = now
    }
  }

  serveIndex (req, res) {
    const html = this.indexTemplate
      .replace('__STATE__', JSON.stringify(this.state))
      .replace('__OPTIONS__', JSON.stringify(this.options))
      .replace(/__BASE_URL__/g, this.options.baseURL)

    header(res, 'Content-Type', 'text/html')
    end(res, html)
  }
}

module.exports = LoadingUI
