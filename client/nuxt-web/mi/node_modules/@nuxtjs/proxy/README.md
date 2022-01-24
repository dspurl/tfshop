# @nuxtjs/proxy

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![codecov][codecov-src]][codecov-href]
[![license][license-src]][license-href]

> Proxy support for nuxt server

[📖 **Release Notes**](./CHANGELOG.md)

## Features

✓ Path rewrites

✓ Host based router (useful for staging/test)

✓ Logs / Proxy Events

✓ WebSockets

✓ Auth / Cookie

✓ ...See [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) docs

⚠ Does not work in generated/static mode!

## Setup

1. Add `@nuxtjs/proxy` dependency to your project

```bash
yarn add @nuxtjs/proxy # or npm install @nuxtjs/proxy
```

2. Add `@nuxtjs/proxy` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    // Simple usage
    '@nuxtjs/proxy',

    // With options
    ['@nuxtjs/proxy', { pathRewrite: { '^/api' : '/api/v1' } }]
  ]
}
```

- Define as many as proxy middleware you want in `proxy` section of  `nuxt.config.js` (See [proxy](#proxy) section below)

## Options

- `changeOrigin` and `ws` options are enabled by default.

[optional] You can provide default options to all proxy targets by passing options to module options.

## `proxy`

You can provide proxy config using either object or array.

### Array Config

You can use [shorthand syntax](https://github.com/chimurai/http-proxy-middleware#shorthand) to configure proxy:

```js
{
  proxy: [
    // Proxies /foo to http://example.com/foo
    'http://example.com/foo',

    // Proxies /api/books/*/**.json to http://example.com:8000
    'http://example.com:8000/api/books/*/**.json',

    // You can also pass more options
    [ 'http://example.com/foo', { ws: false } ]
  ]
}
```

### Object Config

Keys are [context](https://github.com/chimurai/http-proxy-middleware#context-matching)

```js
{
  proxy: {
    // Simple proxy
    '/api': 'http://example.com',

    // With options
    '/api2': { target: 'http://example.com', ws: false },

    // Proxy to backend unix socket
    '/api3': {
      changeOrigin: false,
      target: { socketPath: '/var/run/http-sockets/backend.sock' }
    }
  }
}
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Nuxt Community

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/proxy/latest.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/@nuxtjs/proxy

[npm-downloads-src]: https://img.shields.io/npm/dt/@nuxtjs/proxy.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/proxy

[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-community/proxy-module.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/nuxt-community/proxy-module

[license-src]: https://img.shields.io/npm/l/@nuxtjs/proxy.svg?style=flat-square
[license-href]: https://npmjs.com/package/@nuxtjs/proxy
