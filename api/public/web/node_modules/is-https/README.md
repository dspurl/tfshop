# is-https
> Check if the given request is HTTPS

[![npm](https://img.shields.io/npm/dt/is-https.svg?style=flat-square)](https://npmjs.com/package/is-https)
[![npm (scoped with tag)](https://img.shields.io/npm/v/is-https/latest.svg?style=flat-square)](https://npmjs.com/package/is-https)

## Usage

Install package:

```bash
yarn add is-https
# or
npm install is-https
```

```js
const isHTTPS = require('is-https')
// or
import isHTTPS from 'is-https'
```

```ts
function isHTTPS(req: IncomingMessage, trustProxy: Boolean = true): Boolean | undefined
```

## Behaviour

`isHTTPS` function tries to use 2 different methods for HTTPS detection:

- Test if `x-forwarded-proto` header contains `https`
  - Can be disabled by setting `trustProxy` argument to `false`
- Test if `req.connection.encrypted` is `true`

Returns either `true` or `false` based on checks or `undefined` if no check was reliable.

**TIP:** If you want to redirect users from `http` to `https`, it is better using `isHTTPS(req) === false` to avoid redirect loops.

## Related

- [redirect-ssl](https://www.npmjs.com/package/redirect-ssl) - Connect middleware to enforce HTTPS

## License

MIT
