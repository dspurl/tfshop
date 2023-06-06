<p align="center"><img width="373px" height="168px" src="./assets/vue-i18n-loader.png" alt="Vue I18n Loader logo"></p>

<h1 align="center">@intlify/vue-i18n-loader</h1>

<p align="center">
  <a href="https://github.com/intlify/vue-i18n-loader/actions?query=workflow%3ATest"><img src="https://github.com/intlify/vue-i18n-loader/workflows/Test/badge.svg" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/@intlify/vue-i18n-loader"><img src="https://img.shields.io/npm/v/@intlify/vue-i18n-loader.svg" alt="npm"></a>
  <a href="https://devtoken.rocks/package/@intlify/vue-i18n-loader"><img src="https://badge.devtoken.rocks/@intlify/vue-i18n-loader" alt="@intlify/vue-i18n-loader Dev Token"/></a>
</p>

<p align="center">vue-i18n loader for custom blocks</p>

<br/>

## :cd: Installation

    $ npm i --save-dev @intlify/vue-i18n-loader

## :rocket: Usage

the below example that`App.vue` have `i18n` custom block:

### Basic

```vue
<template>
  <p>{{ $t('hello') }}</p>
</template>

<script>
export default {
  name: 'app',
  // ...
}
</script>

<i18n>
{
  "en": {
    "hello": "hello world!"
  },
  "ja": {
    "hello": "こんにちは、世界!"
  }
}
</i18n>
```

The locale messages defined at  `i18n` custom blocks are **json format default**.

### Source importing

you also can:

```vue
<i18n src="./myLang.json"></i18n>
```

```json5
// ./myLnag.json
{
  "en": {
    "hello": "hello world!"
  },
  "ja": {
    "hello": "こんにちは、世界!"
  }
}
```

### Locale definition

You can define locale messages for each locale with `locale` attr in single-file components:

```vue
<i18n locale="en">
{
  "hello": "hello world!"
}
</i18n>

<i18n locale="ja">
{
  "hello": "こんにちは、世界!"
}
</i18n>
```

The above defines two locales, which are merged at target single-file components.


### Locale Messages formatting

Besides json format, You can be used by specifying the following format in the `lang` attribute:

- yaml
- json5

example yaml foramt:

```vue
<i18n locale="en" lang="yaml">
  hello: "hello world!"
</i18n>

<i18n locale="ja" lang="yml">
  hello: "こんにちは、世界！"
</i18n>
```

example json5 format:

```vue
<i18n lang="json5">
{
  "en": {
    // comments
    "hello": "hello world!"
  }
}
</i18n>
```

### JavaScript

```javascript
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: {
      // ...
    },
    ja: {
      // ...
    }
  }
})
new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
```

### Webpack Config

`vue-loader` (v15 or later):

```javascript
// for vue.config.js (Vue CLI)
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@intlify/vue-i18n-loader')
  }
}
```

`vue-loader` (v15 or later):

```javascript
// for webpack.config.js (Without Vue CLI)
module.exports = {
  module: {
    rules: [
      {
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@intlify/vue-i18n-loader',
      },
    ]
  }
}
```

`vue-loader` (~v14.x):

```javascript
// for webpack config file
module.exports = {
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue',
      options: {
        loaders: {
          i18n: '@intlify/vue-i18n-loader'
        }
      }
    }]
  }
}
```

## :scroll: Changelog
Details changes for each release are documented in the [CHANGELOG.md](https://github.com/intlify/vue-i18n-loader/blob/master/CHANGELOG.md).

## :muscle: Contribution
Please make sure to read the [Contributing Guide](https://github.com/intlify/vue-i18n-loader/blob/master/.github/CONTRIBUTING.md) before making a pull request.

## :copyright: License

[MIT](http://opensource.org/licenses/MIT)
