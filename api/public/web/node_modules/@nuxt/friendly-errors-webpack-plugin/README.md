# Friendly-errors-webpack-plugin

[![npm](https://img.shields.io/npm/v/@nuxtjs/friendly-errors-webpack-plugin.svg)](https://www.npmjs.com/package/@nuxtjs/friendly-errors-webpack-plugin)
[![Build Status](https://travis-ci.org/nuxt/friendly-errors-webpack-plugin.svg?branch=master)](https://travis-ci.org/nuxt/friendly-errors-webpack-plugin)
[![Build status](https://ci.appveyor.com/api/projects/status/hqi9g8u2e17epr2d?svg=true)](https://ci.appveyor.com/project/nuxt/friendly-errors-webpack-plugin/branch/master)

Friendly-errors-webpack-plugin recognizes certain classes of webpack
errors and cleans, aggregates and prioritizes them to provide a better
Developer Experience.

It is easy to add types of errors so if you would like to see more
errors get handled, please open a [PR](https://help.github.com/articles/creating-a-pull-request/)!

## Getting started

### Installation

```bash
npm install @nuxtjs/friendly-errors-webpack-plugin --save-dev
```

### Basic usage

Simply add `FriendlyErrorsWebpackPlugin` to the plugin section in your Webpack config.

```javascript
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

var webpackConfig = {
  // ...
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
  ],
  // ...
}
```

### Turn off errors

You need to turn off all error logging by setting your webpack config quiet option to true.

```javascript
app.use(require('webpack-dev-middleware')(compiler, {
  // ...
  logLevel: 'SILENT',
  // ...
}));
```

If you use the webpack-dev-server, there is a setting in webpack's ```devServer``` options:

```javascript
// webpack config root
{
  // ...
  devServer: {
    // ...
    quiet: true,
    // ...
  },
  // ...
}
```

If you use webpack-hot-middleware, that is done by setting the log option to `false`. You can do something sort of like this, depending upon your setup:

```javascript
app.use(require('webpack-hot-middleware')(compiler, {
  log: false
}));
```

_Thanks to [webpack-dashboard](https://github.com/FormidableLabs/webpack-dashboard) for this piece of info._

## Demo

### Build success

![success](http://i.imgur.com/MkUEhYz.gif)

### eslint-loader errors

![lint](http://i.imgur.com/xYRkldr.gif)

### babel-loader syntax errors

![babel](http://i.imgur.com/W59z8WF.gif)

### Module not found

![babel](http://i.imgur.com/OivW4As.gif)

## Options

You can pass options to the plugin:

```js
new FriendlyErrorsPlugin({
  compilationSuccessInfo: {
    messages: ['You application is running here http://localhost:3000'],
    notes: ['Some additional notes to be displayed upon successful compilation']
  },
  onErrors: function (severity, errors) {
    // You can listen to errors transformed and prioritized by the plugin
    // severity can be 'error' or 'warn'
  },
  // should the console be cleared between each compilation?
  // default is true
  clearConsole: true,

  // INFO:    all logs
  // WARNING: warnings and errors
  // ERROR:   only errors
  // SILENT:  no log
  logLevel: true,

  // base: default
  // consola: consola adapter
  // can also be npm package name or reporter object
  reporter: 'consola'

  // add formatters and transformers (see below)
  additionalFormatters: [],
  additionalTransformers: []
})
```

## Adding desktop notifications

The plugin has no native support for desktop notifications but it is easy
to add them thanks to [node-notifier](https://www.npmjs.com/package/node-notifier) for instance.

```js
var NotifierPlugin = require('friendly-errors-webpack-plugin');
var notifier = require('node-notifier');
var ICON = path.join(__dirname, 'icon.png');

new NotifierPlugin({
    onErrors: (severity, errors) => {
      if (severity !== 'error') {
        return;
      }
      const error = errors[0];
      notifier.notify({
        title: "Webpack error",
        message: severity + ': ' + error.name,
        subtitle: error.file || '',
        icon: ICON
      });
    }
  })
]
```

## API

### Transformers and formatters

Webpack's errors processing, is done in four phases:

1. Extract relevant info from webpack errors. This is done by the plugin [here](https://github.com/nuxt/friendly-errors-webpack-plugin/blob/master/src/core/extractWebpackError.js)
2. Apply transformers to all errors to identify and annotate well know errors and give them a priority
3. Get only top priority error or top priority warnings if no errors are thrown
4. Apply formatters to all annotated errors

You can add transformers and formatters. Please see [transformErrors](https://github.com/nuxt/friendly-errors-webpack-plugin/blob/master/src/core/transformErrors.js),
and [formatErrors](https://github.com/nuxt/friendly-errors-webpack-plugin/blob/master/src/core/formatErrors.js)
in the source code and take a look a the [default transformers](https://github.com/nuxt/friendly-errors-webpack-plugin/tree/master/src/transformers)
and the [default formatters](https://github.com/nuxt/friendly-errors-webpack-plugin/tree/master/src/formatters).

### Customize Reporters

Reporter is a class for generating output of errors messages, structure is:

1. Include following levels log methods: `success`, `info`, `note`, `warn`, `error`.
1. Include method `clearConsole` for clearing the terminal console.

You can take a look at source code as example [base reporter](https://github.com/nuxt/friendly-errors-webpack-plugin/blob/master/src/reporters/base.js)
