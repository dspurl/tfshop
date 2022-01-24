'use strict'

/*
 * youch
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const Mustache = require('mustache')
const path = require('path')
const stackTrace = require('stack-trace')
const fs = require('fs')
const cookie = require('cookie')
const VIEW_PATH = '../resources/error.mustache'
const startingSlashRegex = /\\|\//

const viewTemplate = fs.readFileSync(path.join(__dirname, VIEW_PATH), 'utf-8')

class Youch {
  constructor (error, request, readSource, baseURL, addCol) {
    this.error = error
    this.request = request
    this.readSource = typeof readSource === 'function' ? readSource : this._readSource
    this.baseURL = baseURL || '/'
    this.addCol = addCol === undefined ? true : Boolean(addCol)

    this.codeContext = 5
    this._filterHeaders = ['cookie', 'connection']
    this._filterFrames = [
      /regenerator-runtime/,
      /babel-runtime/,
      /core-js\/library/
    ]
  }

  /**
   * Reads the source code for a given frame into frame.contents
   *
   * @param  {String} path
   * @return {Promise}
   */
  _readSource (frame) {
    return new Promise((resolve, reject) => {
      if(!frame.fileName) {
        return resolve()
      }
      fs.readFile(frame.fileName, 'utf-8', (error, contents) => {
        if (!error && contents) {
          frame.contents = contents
        }
        resolve()
      })
    })
  }

  /**
   * Returns source code for a given frame.
   *
   * @param  {Object} frame
   * @return {Promise}
   */
  _getFrameSource (frame) {
    return this.readSource(frame).then(()=> {
      if (!frame.contents) {
        return
      }

      const lines = frame.contents.split(/\r?\n/)
      const lineNumber = frame.getLineNumber()

      return {
        pre: lines.slice(Math.max(0, lineNumber - (this.codeContext + 1)), lineNumber - 1),
        line: lines[lineNumber - 1],
        post: lines.slice(lineNumber, lineNumber + this.codeContext)
      }
    })
  }

  /**
   * Parses the error stack and returns serialized
   * frames out of it.
   *
   * @return {Object}
   */
  _parseError () {
    const stack = stackTrace.parse(this.error)

    return Promise.all(stack.map((frame) => {
      if (this._isNode(frame)) {
        return Promise.resolve(frame)
      }
      return this._getFrameSource(frame).then((context) => {
        frame.context = context
        return frame
      })
    }))
    .then(stack => stack.filter(this._isVisible.bind(this)))
    .then(stack => {
      let hasInternal = false
      for (let frame of stack) {
        if (!this._isApp(frame) && !this._isNode(frame)) {
          hasInternal = true
          break
        }
      }
      return {stack, hasInternal}
    })
  }

  /**
   * Returns the context with code for a given
   * frame.
   *
   * @param  {Object}
   * @return {Object}
   */
  _getContext (frame) {
    if (!frame.context) {
      return {}
    }

    return {
      start: frame.getLineNumber() - (frame.context.pre || []).length,
      pre: frame.context.pre.join('\n'),
      line: frame.context.line,
      post: frame.context.post.join('\n'),
    }
  }

  /**
   * Returns classes to be used inside HTML when
   * displaying the frames list.
   *
   * @param  {Object}
   * @param  {Number}
   *
   * @return {String}
   */
  _getDisplayClasses (frame, index) {
    const classes = []
    if (index === 0) {
      classes.push('active')
    }

    if (!this._isApp(frame)) {
      classes.push('native-frame')
    }

    return classes.join(' ')
  }

  /**
   * Compiles the view using HTML
   *
   * @param  {String}
   * @param  {Object}
   *
   * @return {String}
   */
  _compileView (view, data) {
    return Mustache.render(view, data)
  }

  /**
   * Serializes frame to a usable error object.
   *
   * @param  {Object}
   *
   * @return {Object}
   */
  _serializeFrame (frame) {
    const relativeFileName = frame.getFileName().indexOf(process.cwd()) > -1
      ? frame.getFileName().replace(process.cwd(), '').replace(startingSlashRegex, '')
      : frame.getFileName()

    return {
      file: relativeFileName,
      method: frame.getFunctionName(),
      line: frame.getLineNumber(),
      column: frame.getColumnNumber(),
      context: this._getContext(frame),
      lang: this._getLang(frame),
      open: this._openURL(frame)
    }
  }

  _openURL(frame) {
    if (!frame.fullPath) {
      return
    }
    return this.baseURL + '__open-in-editor' +
      '?file=' + encodeURI(frame.fullPath || frame.fileName) +
       ':' + (frame.getLineNumber() || 0) +
       (this.addCol ? (':' + (frame.getColumnNumber() || 0)) : '')
  }

  /**
   * Returns whether frame belongs to nodejs
   * or not.
   *
   * @return {Boolean} [description]
   */
  _isNode (frame) {
    if (frame.isNative()) {
      return true
    }

    // const filename = frame.getFileName() || ''
    // return !path.isAbsolute(filename) && filename[0] !== '.'
    return false
  }

  /**
   * Returns whether code belongs to the app
   * or not.
   *
   * @return {Boolean} [description]
   */
  _isApp (frame) {
    if (this._isNode(frame)) {
      return false
    }
    return !~(frame.getFileName() || '').indexOf('node_modules' + path.sep)
  }

  /**
   * Returns whether frame should be visible
   * or not.
   *
   * @return {Boolean} [description]
   */
  _isVisible (frame) {
    return this._filterFrames.every(f => !f.test(frame.getFileName()))
  }

  _getLang(frame) {
    let name = frame.getFileName() || ''
    let lang = 'js'
    if(name.indexOf('.vue') !== -1) {
      lang = 'html'
    }
    return lang
  }

  /**
   * Serializes stack to Mustache friendly object to
   * be used within the view. Optionally can pass
   * a callback to customize the frames output.
   *
   * @param  {Object}
   * @param  {Function} [callback]
   *
   * @return {Object}
   */
  _serializeData (stack, callback) {
    callback = callback || this._serializeFrame.bind(this)
    return {
      message: this.error.message,
      name: this.error.name,
      status: this.error.status,
      frames: stack instanceof Array === true ? stack.filter((frame) => frame.getFileName()).map(callback) : []
    }
  }

  /**
   * Returns a serialized object with important
   * information.
   *
   * @return {Object}
   */
  _serializeRequest () {
    const headers = []

    Object.keys(this.request.headers).forEach((key) => {
      if (this._filterHeaders.indexOf(key) > -1) {
        return
      }
      headers.push({
        key: key.toUpperCase(),
        value: this.request.headers[key]
      })
    })

    const parsedCookies = cookie.parse(this.request.headers.cookie || '')
    const cookies = Object.keys(parsedCookies).map((key) => {
      return {key, value: parsedCookies[key]}
    })

    return {
      url: this.request.url,
      httpVersion: this.request.httpVersion,
      method: this.request.method,
      connection: this.request.headers.connection,
      headers: headers,
      cookies: cookies
    }
  }

  /**
   * Returns error stack as JSON.
   *
   * @return {Promise}
   */
  toJSON () {
    return new Promise((resolve, reject) => {
      this
      ._parseError()
      .then(({ stack, hasInternal }) => {
        resolve({
          error: this._serializeData(stack),
          hasInternal
        })
      })
      .catch(reject)
    })
  }

  /**
   * Returns HTML representation of the error stack
   * by parsing the stack into frames and getting
   * important info out of it.
   *
   * @return {Promise}
   */
  toHTML () {
    return new Promise((resolve, reject) => {
      this
      ._parseError()
      .then(({ stack, hasInternal }) => {
        const data = this._serializeData(stack, (frame, index) => {
          const serializedFrame = this._serializeFrame(frame)
          serializedFrame.classes = this._getDisplayClasses(frame, index)
          return serializedFrame
        })

        const request = this._serializeRequest()
        data.request = request
        data.hasInternal = hasInternal
        resolve(this._compileView(viewTemplate, data))
      })
      .catch(reject)
    })
  }
}

module.exports = Youch
