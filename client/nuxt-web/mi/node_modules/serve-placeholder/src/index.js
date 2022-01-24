const path = require('path')
const defu = require('defu')

const defaults = require('./defaults')

module.exports = function createServePlaceholder (_options) {
  // Assign default options
  const options = defu(_options, defaults)

  return function servePlaceholderMiddleware (req, res, next) {
    // If response already sent, skip
    if (res.writableEnded) {
      return
    }
    // Get url from req object
    const url = req.url.split('?')[0]

    // Get ext of requst url
    const ext = path.extname(url)

    // Try to find a handler based on ext
    let handler = options.handlers[ext]

    // Skip middleware is handler is explictly set to false
    if (handler === false) {
      return next()
    }

    // In case of no handler guessed
    if (typeof handler === 'undefined') {
      if (options.skipUnknown) {
        // Skip this middleware
        return next()
      } else {
        // Use 'default' handler
        handler = 'default'
      }
    }

    // Set statusCode
    if (options.statusCode) {
      res.statusCode = options.statusCode
    }

    // Try to set appreciate mime type based on handler
    const mime = options.mimes[handler]
    if (mime) {
      res.setHeader('Content-Type', mime)
    }

    // Prevent caching
    if (options.noCache) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate') // HTTP 1.1
      res.setHeader('Pragma', 'no-cache') // HTTP 1.0
      res.setHeader('Expires', '0') // Proxies
    }

    // Try to find placeholder based on handler
    const placeholder = options.placeholders[handler]

    // Send placeholder and end response
    res.end(placeholder)
  }
}
