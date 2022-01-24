![get-port-please](https://user-images.githubusercontent.com/904724/101664848-9bc16380-3a4c-11eb-9e3a-faad60c86b2e.png)

# get-port-please

> Get an available TCP port to listen

[![npm](https://img.shields.io/npm/dt/get-port-please.svg?style=flat-square)](https://npmjs.com/package/get-port-please)
[![npm (scoped with tag)](https://img.shields.io/npm/v/get-port-please/latest.svg?style=flat-square)](https://npmjs.com/package/get-port-please)

## Usage

Install package:

```bash
yarn add get-port-please
# or
or npm install get-port-please
```

```js
const { getPort } = require('get-port-please')
// or
import { getPort } from 'get-port-please'
```

```ts
function getPort(options?: GetPortOptions): Promise<number>
```

Try sequence is: port > ports > memo > random

## Options

```ts
interface GetPortOptions {
  name?: string

  random?: boolean
  port?: number
  ports?: number[]
  host?: string

  memoDir?: string
  memoName?: string
}
```

### `name`

Unique name for port memorizing. Default is `default`.

### `random`

If enabled, `port` and `ports` will be ignored. Default is `false`.

### `port`

First port to check. Default is `process.env.PORT || 3000`

### `ports`

Alternative ports to check. Default is `[4000, 5000, 6000, 7000]`

### `host`

The host to check. Default is `process.env.HOST || '0.0.0.0'`

### `memoDir` / `memoName`

Options passed to [fs-memo](https://github.com/unjs/fs-memo)

- Default dir: `node_modules/get-port/dist`
- Defalt name: `.get-port`

## License

MIT
