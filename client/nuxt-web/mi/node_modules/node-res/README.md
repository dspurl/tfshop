# Node Res

> A facade over Node.js HTTP `res` object with no side-effects.

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Appveyor][appveyor-image]][appveyor-url]
[![Coveralls][coveralls-image]][coveralls-url]

<a href="http://res.cloudinary.com/adonisjs/image/upload/q_100/v1502279403/poppinss_z8uk2j.png">
<img src="http://res.cloudinary.com/adonisjs/image/upload/q_100/v1502279403/poppinss_z8uk2j.png" width="300px" align="right" vspace="20px" />
</a>

`node-res` is a simple module to make HTTP response in Node.js. It offers helpers to make it easier to set `headers`, define response statuses and properly parse response type to set appropriate headers.

For example:

```js
// content-type: plain/text
nodeRes.send(req, res, 'Hello world')

// content-type: application/json
nodeRes.send(req, res, { greeting: 'hello world' })
    
// content-type: text/html
nodeRes.send(req, res, '<h2> Hello world </h2>')
```

## See also

1. [node-req](https://npmjs.org/package/node-req)
2. [node-cookie](https://npmjs.org/package/node-cookie)

## Basic Example

```javascript
const http = require('http')
const nodeRes = require('node-res')

http.createServer(function (req, res) {
  
  // plain text
  nodeRes.send(req, res, "Hello world")

  // json
  nodeRes.json(req, res, {time:"now"})

  // jsonp
  nodeRes.jsonp(req, res, {time:"now"}, "callback")

}).listen(3000)

```

## API
<a name="module_Response"></a>

## Response
A simple IO module to make consistent HTTP response, without
worrying about underlying details.


* [Response](#module_Response)
    * [~getHeader(res, key)](#module_Response..getHeader) ⇒ <code>Array</code> \| <code>String</code>
    * [~header(res, key, value)](#module_Response..header) ⇒ <code>void</code>
    * [~append(res, key, value)](#module_Response..append) ⇒ <code>void</code>
    * [~status(res, code)](#module_Response..status) ⇒ <code>void</code>
    * [~safeHeader(res, key, value)](#module_Response..safeHeader) ⇒ <code>void</code>
    * [~removeHeader(res, key)](#module_Response..removeHeader) ⇒ <code>void</code>
    * [~write(res, body)](#module_Response..write) ⇒ <code>void</code>
    * [~end(res, [payload])](#module_Response..end) ⇒ <code>void</code>
    * [~send(req, res, body, [generateEtag])](#module_Response..send) ⇒ <code>void</code>
    * [~etag(res, body)](#module_Response..etag) ⇒ <code>void</code>
    * [~prepare(res, body)](#module_Response..prepare) ⇒ <code>String</code>
    * [~prepareJsonp(res, body, callbackFn)](#module_Response..prepareJsonp) ⇒ <code>String</code>
    * [~json(req, res, body, [generateEtag])](#module_Response..json) ⇒ <code>void</code>
    * [~jsonp(req, res, body, [callbackFn], [generateEtag])](#module_Response..jsonp) ⇒ <code>void</code>
    * [~location(res, url)](#module_Response..location) ⇒ <code>void</code>
    * [~redirect(req, res, url, [status])](#module_Response..redirect) ⇒ <code>void</code>
    * [~vary(res, field)](#module_Response..vary) ⇒ <code>void</code>
    * [~type(req, res, [charset])](#module_Response..type) ⇒ <code>void</code>
    * [~stream(res, body)](#module_Response..stream) ⇒ <code>Promise</code>

<a name="module_Response..getHeader"></a>

### Response~getHeader(res, key) ⇒ <code>Array</code> \| <code>String</code>
Returns the value of an existing header on
the response object

**Kind**: inner method of [<code>Response</code>](#module_Response)  
**Returns**: <code>Array</code> \| <code>String</code> - Return type depends upon the header existing value  

| Param | Type |
| --- | --- |
| res | <code>ServerResponse</code> | 
| key | <code>String</code> | 

**Example**  
```js
nodeRes.getHeader(res, 'Content-type')
```
<a name="module_Response..header"></a>

### Response~header(res, key, value) ⇒ <code>void</code>
Sets header on the response object. This method will wipe off
existing values. To append to existing values, use `append`.

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type |
| --- | --- |
| res | <code>http.ServerResponse</code> | 
| key | <code>String</code> | 
| value | <code>String</code> \| <code>Array</code> | 

**Example**  
```js
nodeRes.header(res, 'Content-type', 'application/json')

// or set an array of headers
nodeRes.header(res, 'Link', ['<http://localhost/>', '<http://localhost:3000/>'])
```
<a name="module_Response..append"></a>

### Response~append(res, key, value) ⇒ <code>void</code>
Appends value to the header existing values.

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type |
| --- | --- |
| res | <code>http.ServerResponse</code> | 
| key | <code>String</code> | 
| value | <code>String</code> \| <code>Array</code> | 

**Example**  
```js
nodeRes.append(res, 'Content-type', 'application/json')

// or append an array of headers
nodeRes.append(res, 'Link', ['<http://localhost/>', '<http://localhost:3000/>'])
```
<a name="module_Response..status"></a>

### Response~status(res, code) ⇒ <code>void</code>
Set status on the HTTP res object

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type |
| --- | --- |
| res | <code>http.ServerResponse</code> | 
| code | <code>Number</code> | 

**Example**  
```js
nodeRes.status(res, 200)
```
<a name="module_Response..safeHeader"></a>

### Response~safeHeader(res, key, value) ⇒ <code>void</code>
Sets the header on response object, only if it
does not exists.

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type |
| --- | --- |
| res | <code>http.ServerResponse</code> | 
| key | <code>String</code> | 
| value | <code>String</code> \| <code>Array</code> | 

**Example**  
```js
nodeRes.safeHeader(res, 'Content-type', 'application/json')
```
<a name="module_Response..removeHeader"></a>

### Response~removeHeader(res, key) ⇒ <code>void</code>
Removes the header from response

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type |
| --- | --- |
| res | <code>http.ServerResponse</code> | 
| key | <code>String</code> | 

**Example**  
```js
nodeRes.removeHeader(res, 'Content-type')
```
<a name="module_Response..write"></a>

### Response~write(res, body) ⇒ <code>void</code>
Write string or buffer to the response object.

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type |
| --- | --- |
| res | <code>http.ServerResponse</code> | 
| body | <code>String</code> \| <code>Buffer</code> | 

**Example**  
```js
nodeRes.write(res, 'Hello world')
```
<a name="module_Response..end"></a>

### Response~end(res, [payload]) ⇒ <code>void</code>
Explictly end HTTP response

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type |
| --- | --- |
| res | <code>http.ServerResponse</code> | 
| [payload] | <code>String</code> \| <code>Buffer</code> | 

**Example**  
```js
nodeRes.end(res, 'Hello world')
```
<a name="module_Response..send"></a>

### Response~send(req, res, body, [generateEtag]) ⇒ <code>void</code>
Send body as the HTTP response and end it. Also
this method will set the appropriate `Content-type`
and `Content-length`.

If body is set to null, this method will end the response
as 204.

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type | Default |
| --- | --- | --- |
| req | <code>http.ServerRequest</code> |  | 
| res | <code>http.ServerResponse</code> |  | 
| body | <code>String</code> \| <code>Buffer</code> \| <code>Object</code> \| <code>Stream</code> |  | 
| [generateEtag] | <code>Boolean</code> | <code>true</code> | 

**Example**  
```js
nodeRes.send(req, res, 'Hello world')

// or html
nodeRes.send(req, res, '<h2> Hello world </h2>')

// or JSON
nodeRes.send(req, res, { greeting: 'Hello world' })

// or Buffer
nodeRes.send(req, res, Buffer.from('Hello world', 'utf-8'))

// Ignore etag
nodeRes.send(req, res, 'Hello world', false)
```
<a name="module_Response..etag"></a>

### Response~etag(res, body) ⇒ <code>void</code>
Sets the Etag header for a given body chunk

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type |
| --- | --- |
| res | <code>http.ServerResponse</code> | 
| body | <code>String</code> \| <code>Buffer</code> | 

**Example**  
```js
nodeRes.etag(res, 'Hello world')
```
<a name="module_Response..prepare"></a>

### Response~prepare(res, body) ⇒ <code>String</code>
Prepares the response body by encoding it properly. Also
sets appropriate headers based upon the body content type.

This method is used internally by `send`, so you should
never use it when calling `send`.

It is helpful when you want to get the final payload and end the
response at a later stage.

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type |
| --- | --- |
| res | <code>http.ServerResponse</code> | 
| body | <code>Mixed</code> | 

**Example**  
```js
const chunk = nodeRes.prepare(res, '<h2> Hello </h2>')

if (chunk) {
  nodeRes.etag(res, chunk)

  if (nodeReq.fresh(req, res)) {
    chunk = null
    nodeRes.status(304)
  }

  nodeRes.end(chunk)
}
```
<a name="module_Response..prepareJsonp"></a>

### Response~prepareJsonp(res, body, callbackFn) ⇒ <code>String</code>
Prepares response for JSONP

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type |
| --- | --- |
| res | <code>http.ServerResponse</code> | 
| body | <code>Object</code> | 
| callbackFn | <code>String</code> | 

**Example**  
```js
const chunk = nodeRes.prepareJsonp(res, '<h2> Hello </h2>', 'callback')

if (chunk) {
  nodeRes.etag(res, chunk)

  if (nodeReq.fresh(req, res)) {
    chunk = null
    nodeRes.status(304)
  }

  nodeRes.end(chunk)
}
```
<a name="module_Response..json"></a>

### Response~json(req, res, body, [generateEtag]) ⇒ <code>void</code>
Returns the HTTP response with `Content-type`
set to `application/json`.

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type | Default |
| --- | --- | --- |
| req | <code>http.IncomingMessage</code> |  | 
| res | <code>http.ServerResponse</code> |  | 
| body | <code>Object</code> |  | 
| [generateEtag] | <code>Boolean</code> | <code>true</code> | 

**Example**  
```js
nodeRes.json(req, res, { name: 'virk' })
nodeRes.json(req, res, [ 'virk', 'joe' ])
```
<a name="module_Response..jsonp"></a>

### Response~jsonp(req, res, body, [callbackFn], [generateEtag]) ⇒ <code>void</code>
Make JSONP response with `Content-type` set to
`text/javascript`.

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type | Default |
| --- | --- | --- |
| req | <code>http.IncomingMessage</code> |  | 
| res | <code>http.ServerResponse</code> |  | 
| body | <code>Object</code> |  | 
| [callbackFn] | <code>String</code> | <code>&#x27;callback&#x27;</code> | 
| [generateEtag] | <code>Boolean</code> | <code>true</code> | 

**Example**  
```js
nodeRes.jsonp(req, res, { name: 'virk' }, 'callback')
```
<a name="module_Response..location"></a>

### Response~location(res, url) ⇒ <code>void</code>
Set `Location` header on the HTTP response.

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type |
| --- | --- |
| res | <code>http.ServerResponse</code> | 
| url | <code>String</code> | 

<a name="module_Response..redirect"></a>

### Response~redirect(req, res, url, [status]) ⇒ <code>void</code>
Redirect the HTTP request to the given url.

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type | Default |
| --- | --- | --- |
| req | <code>http.IncomingMessage</code> |  | 
| res | <code>http.ServerResponse</code> |  | 
| url | <code>String</code> |  | 
| [status] | <code>Number</code> | <code>302</code> | 

**Example**  
```js
nodeRes.redirect(req, res, '/')
```
<a name="module_Response..vary"></a>

### Response~vary(res, field) ⇒ <code>void</code>
Add vary header to the HTTP response.

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type |
| --- | --- |
| res | <code>http.ServerResponse</code> | 
| field | <code>String</code> | 

<a name="module_Response..type"></a>

### Response~type(req, res, [charset]) ⇒ <code>void</code>
Set content type header by looking up the actual
type and setting charset to utf8.

### Note
When defining custom charset, you must set pass the complete
content type, otherwise `false` will be set as the
content-type header.

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type |
| --- | --- |
| req | <code>http.IncomingMessage</code> | 
| res | <code>http.ServerResponse</code> | 
| [charset] | <code>String</code> | 

**Example**  
```js
nodeRes.type(res, 'html')

nodeRes.type(res, 'json')

nodeRes.type(res, 'text/html', 'ascii')
```
<a name="module_Response..stream"></a>

### Response~stream(res, body) ⇒ <code>Promise</code>
Pipe stream to the response. Also this method will make sure
to destroy the stream, if request gets cancelled.

The promise resolve when response finishes and rejects, when
stream raises errors.

**Kind**: inner method of [<code>Response</code>](#module_Response)  

| Param | Type |
| --- | --- |
| res | <code>Object</code> | 
| body | <code>Stream</code> | 

**Example**  
```js
Response.stream(res, fs.createReadStream('foo.txt'))

// handle stream errors
Response
  .stream(res, fs.createReadStream('foo.txt'))
  .catch((error) => {
  })
```

[appveyor-image]: https://img.shields.io/appveyor/ci/thetutlage/node-res/master.svg?style=flat-square
[appveyor-url]: https://ci.appveyor.com/project/thetutlage/node-res

[npm-image]: https://img.shields.io/npm/v/node-res.svg?style=flat-square
[npm-url]: https://npmjs.org/package/node-res

[travis-image]: https://img.shields.io/travis/poppinss/node-res/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/poppinss/node-res

[coveralls-image]: https://img.shields.io/coveralls/poppinss/node-res/develop.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/poppinss/node-res 
