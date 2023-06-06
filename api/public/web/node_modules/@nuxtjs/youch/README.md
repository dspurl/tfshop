# Youch!
> Pretty error reporting for Node.js 🚀 (Modified for Nuxt.js & SSR Bundles)

<br />

<p>
    <img src="https://user-images.githubusercontent.com/5158436/28990900-0a4766f8-7997-11e7-9f0b-4336fa2e2e0b.png" style="width: 600px;" />
</p>

<br />

---

<br />

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url]
[![Appveyor][appveyor-image]][appveyor-url]

[![Gitter Channel][gitter-image]][gitter-url]
[![Trello][trello-image]][trello-url]
[![Patreon][patreon-image]][patreon-url]

Youch is inspired by [Whoops](https://filp.github.io/whoops) but with a modern design. Reading stack trace of the console slows you down from active development. Instead **Youch** print those errors in structured HTML to the browser.

## Features
1. HTML reporter
2. JSON reporter, if request accepts a json instead of text/html.
3. Sorted frames of error stack.

## Installation
```bash
npm i --save @nuxtjs/youch
```

## Basic Usage
Youch is used by [AdonisJs](http://adonisjs.com) and [Nuxt.js](https://nuxtjs.org), but it can be used by express or raw HTTP server as well.

```javascript
const Youch = require('@nuxtjs/youch')
const http = require('http')

http.createServer(function (req, res) {

  // PERFORM SOME ACTION
  if (error) {
    const youch = new Youch(error, req)

    youch
    .toHTML()
    .then((html) => {
      res.writeHead(200, {'content-type': 'text/html'})
      res.write(html)
      res.end()
    })
  }

}).listen(8000)
```

## Release History
Checkout [CHANGELOG.md](CHANGELOG.md) file for release history.

## Meta
Checkout [LICENSE.txt](LICENSE.txt) for license information
Harminder Virk (Aman) - [https://github.com/thetutlage](https://github.com/thetutlage)


[appveyor-image]: https://ci.appveyor.com/api/projects/status/github/nuxt/youch?branch=master&svg=true&passingText=Passing%20On%20Windows
[appveyor-url]: https://ci.appveyor.com/project/nuxt/youch

[npm-image]: https://img.shields.io/npm/v/@nuxtjs/youch.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@nuxtjs/youch

[travis-image]: https://img.shields.io/travis/nuxt/youch/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/nuxt/youch

[gitter-url]: https://gitter.im/adonisjs/adonis-framework
[gitter-image]: https://img.shields.io/badge/gitter-join%20us-1DCE73.svg?style=flat-square

[trello-url]: https://trello.com/b/yzpqCgdl/adonis-for-humans
[trello-image]: https://img.shields.io/badge/trello-roadmap-89609E.svg?style=flat-square

[patreon-url]: https://www.patreon.com/adonisframework
[patreon-image]: https://img.shields.io/badge/patreon-support%20AdonisJs-brightgreen.svg?style=flat-square

[npm-downloads]: https://img.shields.io/npm/dm/@nuxtjs/youch.svg?style=flat-square

