const middleware = {}

middleware['auth'] = require('..\\middleware\\auth.js')
middleware['auth'] = middleware['auth'].default || middleware['auth']

middleware['lang'] = require('..\\middleware\\lang.js')
middleware['lang'] = middleware['lang'].default || middleware['lang']

middleware['refreshToken'] = require('..\\middleware\\refreshToken.js')
middleware['refreshToken'] = middleware['refreshToken'].default || middleware['refreshToken']

middleware['terminal'] = require('..\\middleware\\terminal.js')
middleware['terminal'] = middleware['terminal'].default || middleware['terminal']

export default middleware
