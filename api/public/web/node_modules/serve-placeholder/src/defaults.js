const EMPTY_GIF = Buffer.from('R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', 'base64')

module.exports = {
  statusCode: 404,

  skipUnknown: false,

  noCache: true,

  handlers: {
    // css
    '.css': 'css',
    // html
    '.html': 'html',
    '.htm': 'html',
    // image
    '.png': 'image',
    '.jpg': 'image',
    '.jpeg': 'image',
    '.gif': 'image',
    '.svg': 'image',
    '.webp': 'image',
    '.bmp': 'image',
    '.ico': 'image',
    // js
    '.js': 'js',
    // json
    '.json': 'json',
    // map
    '.map': 'map',
    // plain
    '.txt': 'plain',
    '.text': 'plain',
    '.md': 'plain'
  },

  placeholders: {
    css: '/* style not found */',
    default: undefined,
    html: '<!-- page not found -->',
    image: EMPTY_GIF,
    js: '/* script not found */',
    json: '{}',
    map: '{"version": "3", "sources": [], "mappings": "" }',
    plain: ''
  },

  mimes: {
    css: 'text/css',
    default: undefined,
    html: 'text/html',
    js: 'application/javascript',
    json: 'application/json',
    image: 'image/gif',
    map: 'application/json',
    plain: 'text/plain'
  }
}
