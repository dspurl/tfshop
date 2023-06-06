# Workbox Unofficial CDN

[![automated](https://flat.badgen.net/badge/publish/automated/green)](#)
[![circle ci](https://flat.badgen.net/circleci/github/nuxt-community/workbox-cdn)](https://circleci.com/gh/nuxt-community/workbox-cdn)
[![npm version](https://flat.badgen.net/npm/v/workbox-cdn)](https://www.npmjs.com/package/workbox-cdn)
[![npm downloads](https://flat.badgen.net/npm/dt/workbox-cdn)](https://www.npmjs.com/package/workbox-cdn)
[![install size](https://flat.badgen.net/packagephobia/install/workbox-cdn)](https://packagephobia.now.sh/result?p=workbox-cdn)
[![](https://data.jsdelivr.com/v1/package/npm/workbox-cdn/badge)](https://www.jsdelivr.com/package/npm/workbox-cdn)

[Workbox](https://github.com/GoogleChrome/workbox) Unofficial CDN and standalone NPM package.

## Why?

- Having public usage/download stats
- The `local` type costs `~8M` install size for `workbox-cli` package vs `< 1Mb` of this package
- Default workbox CDN is hosted on `storage.googleapis.com` which is sometimes unavailable

## Usage

Add a call to `workbox.setConfig({modulePathPrefix: '...'})` to your service worker to use hosted workbox libraries.

See https://goo.gl/Fo9gPX for further documentation.

You have two options:

### Option 1: JSDelivr

Use `https://cdn.jsdelivr.net/npm/workbox-cdn/workbox/workbox-sw.js`

### Option 2: NPM Package

Install `workbox-cdn` package with `yarn add workbox-cdn` or `npm i workbox-cdn` and integrate it with your own build system or serve contents of `workbox` dir

## License

```
Copyright 2018 Google LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
