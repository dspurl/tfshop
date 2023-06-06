# :globe_with_meridians: @intlify/vue-i18n-extensions

[![CircleCI](https://circleci.com/gh/intlify/vue-i18n-extensions/tree/master.svg?style=svg)](https://circleci.com/gh/intlify/vue-i18n-extensions/tree/dev)
[![npm](https://img.shields.io/npm/v/@intlify/vue-i18n-extensions.svg)](https://www.npmjs.com/package/@intlify/vue-i18n-extensions)
[![vue-i18n-extensions Dev Token](https://badge.devtoken.rocks/vue-i18n-extensions)](https://devtoken.rocks/package/vue-i18n-extensions)

> Extensions for vue-i18n

This library exports the following extensions:

## :star: Features
- directive: `v-t` custom directive for server-side
- module: `v-t` custom directive compiler module for `vue-template-compiler` or `vue-loader` (`compilerModules` option)

## :cd: Installation

```sh
$ npm i --save-dev @intlify/vue-i18n-extensions
```

## :rocket: Extensions

### directive: `v-t` custom directive for server-side
This directive is `v-t` custom directive for server-side-rendering. You can specify it as [`directives` option](https://ssr.vuejs.org/en/api.html#directives) of `createRenderer` function.

The following example:

```javascript
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { createRenderer } from 'vue-server-renderer'
import { directive as t } from '@intlify/vue-i18n-extensions'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: {
      hello: 'hello'
    },
    ja: {
      hello: 'こんにちは'
    }
  }
})
const renderer = createRenderer({ directives: { t } })

const app = new Vue({
  i18n,
  render (h) {
    // <p v-t="'hello'"></p>
    return h('p', {
      directives: [{
        name: 't', rawName: 'v-t',
        value: ('hello'), expression: "'hello'"
      }]
    })
  }
})

renderer.renderToString(app, (err, html) => {
  console.log(html) // output -> '<p data-server-rendered="true">hello</p>'
})
```

### module: `v-t` custom directive compiler module
This module is `v-t` custom directive module for vue compiler. You can specify it as [`modules` option](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler#vue-template-compiler) of `vue-template-compiler`.

> :warning: NOTE: This extension is not isomorphic/universal codes. for Node.js environment only.

The following example that use `compile` function of `vue-template-compiler`:

```javascript
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { compile } from 'vue-template-compiler'
import { module } from '@intlify/vue-i18n-extensions'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: {
      hello: 'hello'
    },
    ja: {
      hello: 'こんにちは'
    }
  },
  missing: (locale, key) => {
    console.log(`translation missing: locale=${locale}, key=${key}`)
  }
})
const i18nModule = module(i18n)

const { ast, render } = compile(`<p v-t="'hello'"></p>`, { modules: [i18nModule] })
console.log(ast.i18n) // output -> 'hello'
console.log(render) // output -> `with(this){return _c('p',{domProps:{"textContent":_s("hello")}})}`
```

The following configration example of `vue-loader`:

```javascript
const Vue = require('vue')
const VueI18n = require('vue-i18n')
const i18nExtensions = require('@intlify/vue-i18n-extensions')
const messages = require('./locales.json')

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'ja',
  messages: messages
})

module.exports = {
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue',
      options: {
        compilerModules: [i18nExtensions.module(i18n)],
        // other vue-loader options go here
        loaders: {}
      }
    }]
  }
}
```

## :scroll: Changelog
Details changes for each release are documented in the [CHANGELOG.md](https://github.com/intlify/vue-i18n-extensions/blob/dev/CHANGELOG.md).


## :exclamation: Issues
Please make sure to read the [Issue Reporting Checklist](https://github.com/intlify/vue-i18n-extensions/blob/dev/CONTRIBUTING.md#issue-reporting-guidelines) before opening an issue. Issues not conforming to the guidelines may be closed immediately.


## :muscle: Contribution
Please make sure to read the [Contributing Guide](https://github.com/intlify/vue-i18n-extensions/blob/dev/CONTRIBUTING.md) before making a pull request.

## :copyright: License

[MIT](http://opensource.org/licenses/MIT)
