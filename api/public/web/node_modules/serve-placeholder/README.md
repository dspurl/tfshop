# ♡ serve-placeholder

> Connect/Express middleware to respond with better placeholders based on request instead of 404 page

[![Standard JS][standard-src]][standard-href]
[![david dm][david-src]][david-href]
[![codecov][codecov-src]][codecov-href]
[![circleci][circleci-src]][circleci-href]

[![npm version][npm-v-src]][npm-v-href]
[![npm downloads][npm-dt-src]][npm-dt-href]
[![package phobia][packagephobia-src]][packagephobia-href]

## Why?

**💵 Rendering 404 errors is costly**

- Each 404 error for assets means a new SSR request that adds extra loads to the server and increases crash chances.

**👌 Graceful Responses**

- Sometimes, we can send better responses alongside with 404 code instead of nothing. For example, for images, we send a fallback transparent 1x1 image.

**🔍 SEO Friendly**

- Don't allow indexing invalid URLs with ugly html pages.
- Remove extra SSR loads when assets like `robots.txt` or `favicon.ico` doesn't exist.

## Usage

Install package:

```bash
npm install serve-placeholder
```

OR

```bash
yarn add serve-placeholder
```

Import and use middleware:

```js
const placeholder = require('serve-placeholder')
// import placeholder from 'serve-placeholder'

// [regular middleware such as serve-static]

// Response with appreciate placeholders
app.use(placeholder())
//app.use(placeholder({ /* options */ }))

// [global error handler]
```

## Options

### `handlers`

A mapping from file extensions to the handler. Extensions should start with *dot* like `.js`.

You can disable any of the handlers by setting the value to `null`

If the value of a handler is set to `false`, middleware will be ignored for that extension.

### `statusCode`

- Default: `404`

Sets `statusCode` for all handled responses. Set to `false` to disable overriding statusCode.

### `skipUnknown`

- Default: `false`

Skip middleware when no handler is defined for the current request.

Please note that if this option is set to `true`, then `default` handler will be disabled!

### `placeholders`

- Type: `Object`

A mapping from handler to placeholder. Values can be `String` or `Buffer`. You can disable any of the placeholders by setting the value to `false`.

### `mimes`

- Type: `Object`

A mapping from handler to the mime type. Mime type will be set as `Content-Type` header. You can disable sending any of the mimes by setting the value to `false`.

### `noCache`

- Default: `true`

Set headers to prevent accidentally caching 404 resources.

When enabled, these headers will be sent:

```js
{
  'cache-control': 'no-cache, no-store, must-revalidate',
  'expires': '0',
  'pragma': 'no-cache'
}
```

## Defaults

These are [default handlers](./src/defaults.js). You can override every of them using provided options.

Handler    | Extensions             | Mime type                |  Placeholder
-----------|------------------------|--------------------------|-------------------
`default`  | any unknown extension  | -                        | -
`css`      | `.css`                 | `text/css`               | `/* style not found */`
`html`     | `.html`, `.htm`        | `text/html`              | `<!-- page not found -->`
`js`       | `.js`                  | `application/javascript` | `/* script not found */`
`json`     | `.json`                | `application/json`       | `{}`
`map`      | `.map`                 | `application/json`       | [empty sourcemap v3 json]
`plain`    | `.txt`, `.text`, `.md` | `text/plain`             | [empty]
`image`    | `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`, `.bmp`, `.ico` | `image/gif` | [transparent 1x1 image]

## License

MIT. Made with 💖  by [Nuxt.js](https://nuxtjs.org) team!

<!-- Refs -->
[standard-src]: https://flat.badgen.net/badge/code%20style/standard/green
[standard-href]: https://standardjs.com

[npm-v-src]: https://flat.badgen.net/npm/v/serve-placeholder/latest
[npm-v-href]: https://npmjs.com/package/serve-placeholder

[npm-dt-src]: https://flat.badgen.net/npm/dt/serve-placeholder
[npm-dt-href]: https://npmjs.com/package/serve-placeholder

[packagephobia-src]: https://flat.badgen.net/packagephobia/install/serve-placeholder
[packagephobia-href]: https://packagephobia.now.sh/result?p=serve-placeholder

[david-src]: https://flat.badgen.net/david/dep/nuxt/serve-placeholder
[david-href]: https://david-dm.org/nuxt/serve-placeholder

[codecov-src]: https://flat.badgen.net/codecov/c/github/nuxt/serve-placeholder/master
[codecov-href]: https://codecov.io/gh/nuxt/serve-placeholder

[circleci-src]: https://flat.badgen.net/circleci/github/nuxt/serve-placeholder/master
[circleci-href]: https://circleci.com/gh/nuxt/serve-placeholder
