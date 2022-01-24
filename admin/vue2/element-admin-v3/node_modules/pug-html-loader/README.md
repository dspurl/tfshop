# Pug HTML loader for webpack

## Installation

`npm install pug-html-loader`

## Usage

In your sources:

``` javascript
var html = require('./file.pug')
// => returns file.pug content as html compiled string
```

In your webpack.config.js  file:

```javascript
module.exports = {
  // your config settings ...
  rules: [
    // your modules...
    loaders: [{
      include: /\.pug/,
      loader: ['raw-loader', 'pug-html-loader'],
      options: {
        // options to pass to the compiler same as: https://pugjs.org/api/reference.html
        data: {} // set of data to pass to the pug render.
      }
    }]
  ]
};
```

## Using it with html-loader

`pug-html-loader` encode to content to a string variable to avoid it and pass the string content to the loader chain please use the following configuration:

```javascript
module.exports = {
  // your config settings ...
  module: [
    // your modules...
    rules: [{
      test: /\.pug/,
      loaders: ['html-loader', 'pug-html-loader'],
      options: {
        // options to pass to the compiler same as: https://pugjs.org/api/reference.html
        data: {} // set of data to pass to the pug render.
      }
    }]
  ]
};
```


Don't forget to polyfill `require` if you want to use it in node.
See `webpack` documentation.

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
