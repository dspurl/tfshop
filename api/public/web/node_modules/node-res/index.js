'use strict'

/*
 * node-res
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const mime = require('mime-types')
const etag = require('etag')
const vary = require('vary')
const onFinished = require('on-finished')
const destroy = require('destroy')

const methods = require('./methods')

const returnContentAndType = function (body) {
  /**
   * Return the body and it's type when
   * body is a string.
   */
  if (typeof (body) === 'string') {
    return {
      body,
      type: /^\s*</.test(body) ? 'text/html' : 'text/plain'
    }
  }

  /**
   * If body is a buffer, return the exact copy
   * and type as bin.
   */
  if (Buffer.isBuffer(body)) {
    return { body, type: 'application/octet-stream' }
  }

  /**
   * If body is a number or boolean. Convert it to
   * a string and return the type as text.
   */
  if (typeof (body) === 'number' || typeof (body) === 'boolean') {
    return { body: String(body), type: 'text/plain' }
  }

  /**
   * Otherwise check whether body is an object or not. If yes
   * stringify it and otherwise return the exact copy.
   */
  return typeof (body) === 'object'
    ? { body: JSON.stringify(body), type: 'application/json' }
    : { body }
}

/**
 * A simple IO module to make consistent HTTP response, without
 * worrying about underlying details.
 *
 * @module Response
 */
const Response = exports = module.exports = {}

/**
 * Copying all the descriptive methods to the response object.
 */
Response.descriptiveMethods = Object.keys(methods).map((method) => {
  Response[method] = function (req, res, body) {
    Response.status(res, methods[method])
    Response.send(req, res, body)
  }
  return method
})

/**
 * Returns the value of an existing header on
 * the response object
 *
 * @method getHeader
 *
 * @param  {ServerResponse}  res
 * @param  {String}  key
 *
 * @return {Array|String} Return type depends upon the header existing value
 *
 * @example
 * ```js
 * nodeRes.getHeader(res, 'Content-type')
 * ```
 */
Response.getHeader = function (res, key) {
  return res.getHeader(key)
}

/**
 * Sets header on the response object. This method will wipe off
 * existing values. To append to existing values, use `append`.
 *
 * @method header
 *
 * @param  {http.ServerResponse}         res
 * @param  {String}         key
 * @param  {String|Array}   value
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.header(res, 'Content-type', 'application/json')
 *
 * // or set an array of headers
 * nodeRes.header(res, 'Link', ['<http://localhost/>', '<http://localhost:3000/>'])
 * ```
 */
Response.header = function (res, key, value) {
  const values = Array.isArray(value) ? value.map(String) : value
  res.setHeader(key, values)
}

/**
 * Appends value to the header existing values.
 *
 * @method append
 *
 * @param  {http.ServerResponse}         res
 * @param  {String}         key
 * @param  {String|Array}   value
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.append(res, 'Content-type', 'application/json')
 *
 * // or append an array of headers
 * nodeRes.append(res, 'Link', ['<http://localhost/>', '<http://localhost:3000/>'])
 * ```
 */
Response.append = function (res, key, value) {
  const previousValue = Response.getHeader(res, key)

  const headers = previousValue
    ? (Array.isArray(previousValue) ? previousValue.concat(value) : [previousValue].concat(value))
    : value

  Response.header(res, key, headers)
}

/**
 * Set status on the HTTP res object
 *
 * @method status
 *
 * @param  {http.ServerResponse} res
 * @param  {Number} code
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.status(res, 200)
 * ```
 */
Response.status = function (res, code) {
  res.statusCode = code
}

/**
 * Sets the header on response object, only if it
 * does not exists.
 *
 * @method safeHeader
 *
 * @param  {http.ServerResponse}   res
 * @param  {String}                key
 * @param  {String|Array}          value
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.safeHeader(res, 'Content-type', 'application/json')
 * ```
 */
Response.safeHeader = function (res, key, value) {
  if (!res.getHeader(key)) {
    Response.header(res, key, value)
  }
}

/**
 * Removes the header from response
 *
 * @method removeHeader
 *
 * @param  {http.ServerResponse}     res
 * @param  {String}                  key
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.removeHeader(res, 'Content-type')
 * ```
 */
Response.removeHeader = function (res, key) {
  res.removeHeader(key)
}

/**
 * Write string or buffer to the response object.
 *
 * @method write
 *
 * @param  {http.ServerResponse}  res
 * @param  {String|Buffer}        body
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.write(res, 'Hello world')
 * ```
 */
Response.write = function (res, body) {
  res.write(body)
}

/**
 * Explictly end HTTP response
 *
 * @method end
 *
 * @param  {http.ServerResponse}         res
 * @param  {String|Buffer}               [payload]
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.end(res, 'Hello world')
 * ```
 */
Response.end = function (res, payload) {
  res.end(payload)
}

/**
 * Send body as the HTTP response and end it. Also
 * this method will set the appropriate `Content-type`
 * and `Content-length`.
 *
 * If body is set to null, this method will end the response
 * as 204.
 *
 * @method send
 *
 * @param  {http.ServerRequest}             req
 * @param  {http.ServerResponse}            res
 * @param  {String|Buffer|Object|Stream}    body
 * @param  {Boolean}                        [generateEtag = true]
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.send(req, res, 'Hello world')
 *
 * // or html
 * nodeRes.send(req, res, '<h2> Hello world </h2>')
 *
 * // or JSON
 * nodeRes.send(req, res, { greeting: 'Hello world' })
 *
 * // or Buffer
 * nodeRes.send(req, res, Buffer.from('Hello world', 'utf-8'))
 *
 * // Ignore etag
 * nodeRes.send(req, res, 'Hello world', false)
 * ```
 */
Response.send = function (req, res, body = null, generateEtag = true) {
  /**
   * Handle streams
   */
  if (body && typeof (body.pipe) === 'function') {
    Response
      .stream(res, body)
      .catch((error) => {
        Response.status(res, error.code === 'ENOENT' ? 404 : 500)
        Response.send(req, res, error.message, generateEtag)
      })
    return
  }

  const chunk = Response.prepare(res, body)

  if (chunk === null || req.method === 'HEAD') {
    Response.end(res)
    return
  }

  /**
   * Generate etag when instructured for
   */
  if (generateEtag) {
    Response.etag(res, chunk)
  }

  Response.end(res, chunk)
}

/**
 * Sets the Etag header for a given body chunk
 *
 * @method etag
 *
 * @param  {http.ServerResponse}         res
 * @param  {String|Buffer}               body
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.etag(res, 'Hello world')
 * ```
 */
Response.etag = function (res, body) {
  Response.header(res, 'ETag', etag(body))
}

/**
 * Prepares the response body by encoding it properly. Also
 * sets appropriate headers based upon the body content type.
 *
 * This method is used internally by `send`, so you should
 * never use it when calling `send`.
 *
 * It is helpful when you want to get the final payload and end the
 * response at a later stage.
 *
 * @method prepare
 *
 * @param  {http.ServerResponse}  res
 * @param  {Mixed}                body
 *
 * @return {String}
 *
 * @example
 * ```js
 * const chunk = nodeRes.prepare(res, '<h2> Hello </h2>')
 *
 * if (chunk) {
 *   nodeRes.etag(res, chunk)
 *
 *   if (nodeReq.fresh(req, res)) {
 *     chunk = null
 *     nodeRes.status(304)
 *   }
 *
 *   nodeRes.end(chunk)
 * }
 * ```
 */
Response.prepare = function (res, body) {
  if (body === null) {
    Response.status(res, 204)
    Response.removeHeader(res, 'Content-Type')
    Response.removeHeader(res, 'Content-Length')
    Response.removeHeader(res, 'Transfer-Encoding')
    return null
  }

  let { body: chunk, type } = returnContentAndType(body)

  /**
   * Remove unwanted headers when statuscode is 204 or 304
   */
  if (res.statusCode === 204 || res.statusCode === 304) {
    Response.removeHeader(res, 'Content-Type')
    Response.removeHeader(res, 'Content-Length')
    Response.removeHeader(res, 'Transfer-Encoding')
    return chunk
  }

  const headers = typeof res.getHeaders === 'function' ? res.getHeaders() : (res._headers || {})

  /**
   * Setting content type. Ideally we can use `Response.type`, which
   * sets the right charset too. But we will be doing extra
   * processing for no reasons.
   */
  if (type && !headers['content-type']) {
    Response.header(res, 'Content-Type', `${type}; charset=utf-8`)
  }

  /**
   * setting up content length as response header
   */
  if (chunk && !headers['content-length']) {
    Response.header(res, 'Content-Length', Buffer.byteLength(chunk))
  }

  return chunk
}

/**
 * Prepares response for JSONP
 *
 * @method prepareJsonp
 *
 * @param  {http.ServerResponse}       res
 * @param  {Object}                    body
 * @param  {String}                    callbackFn
 *
 * @return {String}
 *
 * @example
 * ```js
 * const chunk = nodeRes.prepareJsonp(res, '<h2> Hello </h2>', 'callback')
 *
 * if (chunk) {
 *   nodeRes.etag(res, chunk)
 *
 *   if (nodeReq.fresh(req, res)) {
 *     chunk = null
 *     nodeRes.status(304)
 *   }
 *
 *   nodeRes.end(chunk)
 * }
 * ```
 */
Response.prepareJsonp = function (res, body, callbackFn) {
  Response.header(res, 'X-Content-Type-Options', 'nosniff')
  Response.safeHeader(res, 'Content-Type', 'text/javascript; charset=utf-8')

  const parsedBody = JSON
    .stringify(body)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

  /**
   * setting up callbackFn on response body , typeof will make
   * sure not to throw error of client if callbackFn is not
   * a function
   */
  return '/**/ typeof ' + callbackFn + " === 'function' && " + callbackFn + '(' + parsedBody + ');'
}

/**
 * Returns the HTTP response with `Content-type`
 * set to `application/json`.
 *
 * @method json
 *
 * @param  {http.IncomingMessage}  req
 * @param  {http.ServerResponse}   res
 * @param  {Object}                body
 * @param  {Boolean}               [generateEtag = true]
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.json(req, res, { name: 'virk' })
 * nodeRes.json(req, res, [ 'virk', 'joe' ])
 * ```
 */
Response.json = function (req, res, body, generateEtag) {
  Response.safeHeader(res, 'Content-Type', 'application/json; charset=utf-8')
  Response.send(req, res, body, generateEtag)
}

/**
 * Make JSONP response with `Content-type` set to
 * `text/javascript`.
 *
 * @method jsonp
 *
 * @param  {http.IncomingMessage}   req
 * @param  {http.ServerResponse}    res
 * @param  {Object}                 body
 * @param  {String}                 [callbackFn = 'callback']
 * @param  {Boolean}                [generateEtag = true]
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.jsonp(req, res, { name: 'virk' }, 'callback')
 * ```
 */
Response.jsonp = function (req, res, body, callbackFn = 'callback', generateEtag) {
  Response.send(req, res, Response.prepareJsonp(res, body, callbackFn), generateEtag)
}

/**
 * Set `Location` header on the HTTP response.
 *
 * @method location
 *
 * @param  {http.ServerResponse} res
 * @param  {String}              url
 *
 * @return {void}
 */
Response.location = function (res, url) {
  Response.header(res, 'Location', url)
}

/**
 * Redirect the HTTP request to the given url.
 *
 * @method redirect
 *
 * @param  {http.IncomingMessage} req
 * @param  {http.ServerResponse}  res
 * @param  {String}               url
 * @param  {Number}              [status = 302]
 *
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.redirect(req, res, '/')
 * ```
 */
Response.redirect = function (req, res, url, status = 302) {
  const body = ''
  Response.status(res, status)
  Response.location(res, url)
  Response.send(req, res, body)
}

/**
 * Add vary header to the HTTP response.
 *
 * @method vary
 *
 * @param  {http.ServerResponse} res
 * @param  {String}              field
 *
 * @return {void}
 */
Response.vary = function (res, field) {
  vary(res, field)
}

/**
 * Set content type header by looking up the actual
 * type and setting charset to utf8.
 *
 * ### Note
 * When defining custom charset, you must set pass the complete
 * content type, otherwise `false` will be set as the
 * content-type header.
 *
 * @method type
 *
 * @param  {http.IncomingMessage} req
 * @param  {http.ServerResponse}  res
 * @param  {String}              [charset]
 * @return {void}
 *
 * @example
 * ```js
 * nodeRes.type(res, 'html')
 *
 * nodeRes.type(res, 'json')
 *
 * nodeRes.type(res, 'text/html', 'ascii')
 * ```
 */
Response.type = function (res, type, charset) {
  type = charset ? `${type}; charset=${charset}` : type
  Response.safeHeader(res, 'Content-Type', mime.contentType(type))
}

/**
 * Pipe stream to the response. Also this method will make sure
 * to destroy the stream, if request gets cancelled.
 *
 * The promise resolve when response finishes and rejects, when
 * stream raises errors.
 *
 * @method stream
 *
 * @param {Object} res
 * @param {Stream} body
 *
 * @returns {Promise}
 *
 * @example
 * ```js
 * Response.stream(res, fs.createReadStream('foo.txt'))
 *
 * // handle stream errors
 * Response
 *   .stream(res, fs.createReadStream('foo.txt'))
 *   .catch((error) => {
 *   })
 * ```
 */
Response.stream = function (res, body) {
  return new Promise((resolve, reject) => {
    if (typeof (body.pipe) !== 'function') {
      reject(new Error('Body is not a valid stream'))
      return
    }

    let finished = false

    /**
     * Error in stream
     */
    body.on('error', (error) => {
      if (finished) {
        return
      }

      finished = true
      destroy(body)

      reject(error)
    })

    /**
     * Consumed stream
     */
    body.on('end', resolve)

    /**
     * Written response
     */
    onFinished(res, function () {
      finished = true
      destroy(body)
    })

    /**
     * Pipe to res
     */
    body.pipe(res)
  })
}
