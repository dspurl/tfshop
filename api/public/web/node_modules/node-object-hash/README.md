# node-object-hash

Tiny and fast node.js object hash library with properties/arrays sorting to provide constant hashes.
It also provides a method that returns sorted object strings that can be used for object comparison without hashes.
One of the fastest among other analogues (see [benchmarks](#benchmarks)).

Hashes are built on top of node's crypto module
(so for using in browser use something like [browserify-crypto](https://github.com/crypto-browserify/crypto-browserify) or some kind of crypto functions polyfills). Or you can use only `objectSorter` ([source](https://github.com/SkeLLLa/node-object-hash/blob/master/objectSorter.js)) for getting your objects' string representation and compare or pass them to your own hash function.

[![node](https://img.shields.io/node/v/node-object-hash.svg?maxAge=21600&style=flat-square)](https://nodejs.org/download/release/latest)[![NPM](https://img.shields.io/npm/v/node-object-hash.svg?maxAge=21600&style=flat-square)](https://npmjs.org/package/node-object-hash)[![NPM Downloads](https://img.shields.io/npm/dt/node-object-hash.svg?maxAge=21600&style=flat-square)](https://npmjs.org/package/node-object-hash)[![npms.io Score](https://badges.npms.io/node-object-hash.svg?style=flat-square)](https://npms.io/search?q=node-object-hash)[![Build Status](https://img.shields.io/travis/SkeLLLa/node-object-hash.svg?maxAge=21600&branch=master&style=flat-square)](https://travis-ci.org/SkeLLLa/node-object-hash)[![Known Vulnerabilities](https://snyk.io/test/github/SkeLLLa/node-object-hash/badge.svg?maxAge=21600&style=flat-square)](https://snyk.io/test/github/skellla/node-object-hash)[![Coverage](https://api.codeclimate.com/v1/badges/199467889caf98d59690/test_coverage)](https://codeclimate.com/github/SkeLLLa/node-object-hash/test_coverage)[![Maintainability](https://api.codeclimate.com/v1/badges/199467889caf98d59690/maintainability)](https://codeclimate.com/github/SkeLLLa/node-object-hash/maintainability)[![Inline docs](http://inch-ci.org/github/SkeLLLa/node-object-hash.svg?branch=master&style=flat-square)](http://inch-ci.org/github/SkeLLLa/node-object-hash)[![Analytics](https://ga-beacon.appspot.com/UA-90571586-1/node-object-hash?pixel&useReferer)](https://github.com/igrigorik/ga-beacon)

# Installation

`npm i node-object-hash -S`

# Features
- Supports object property sorting for constant hashes for objects with same properties, but different order.
- Supports ES6 Maps and Sets.
- Supports type coercion (see table below)
- Supports all hashes and encodings of crypto library
- Supports large objects and arrays
- Very fast comparing to other libs (see [Benchmarks](#benchmarks) section)

## Type map

This map displays what types will have identical string representation (e.g. new Set([1, 2, 3]) and [1, 2, 3] will have
equal string representations and hashes.

| Initial type              | Mapped type  |
|---------------------------|--------------|
| Array ([])                | array        |
| ArrayObject (new Array()) |              |
| Int8Array                 |              |
| Uint8Array                |              |
| Uint8ClampedArray         |              |
| Int16Array                |              |
| Uint16Array               |              |
| Int32Array                |              |
| Uint32Array               |              |
| Float32Array              |              |
| Float64Array              |              |
| Buffer                    |              |
| Set                       |              |
| | |
| Map                       | array[array] |
| | |
| string ('') | string      | string       |
| String (new String())     |              |
| | |
| boolean (true)            | boolean      |
| Boolean (new Boolean())   |              |
| | |
| number (true)             | number       |
| Number (new Number())     |              |
| | |
| Date                      | date         |
| | |
| Symbol                    | symbol       |
| | |
| undefined                 | undefined    |
| | |
| null                      | null         |
| | |
| function                  | function     |
| | |
| Object ({})               | object       |
| Object (new Object())     |              |
| | |
| other                     | unknown      |


## Coercion map
| Initial "type" | Coerced type   | Example      |
|----------------|----------------|--------------|
| boolean        | string         | true -> 1    |
| number         | string         | '1' -> 1     |
| string         | string         | 'a' -> a     |
| null           | string (empty) | null ->      |
| undefined      | string (empty) | undefined -> |

# Changes

See [changelog](CHANGELOG.md)

# API overview

## Constructor `require('node-object-hash')([options])`

Returns preconfigured object with API

Parameters:
*  `options`:`object` - object with hasher config options
*  `options.coerce`:`boolean` - if true performs type coercion (default: `true`);
e.g. `hash(true) == hash('1') == hash(1)`, `hash(false) == hash('0') == hash(0)`
*  `options.sort`:`boolean` - if true performs sorting on objects, arrays, etc. (default: `true`);
*  `options.alg`:`string` - sets default hash algorithm (default: `'sha256'`); can be overridden in `hash` method;
*  `options.enc`:`string` - sets default hash encoding (default: `'hex'`); can be overridden in `hash` method;

## API methods

### `hash(object[, options])`

Returns hash string.
*  `object`:`*` object for calculating hash;
*  `options`:`object` object with options;
*  `options.alg`:`string` - hash algorithm (default: `'sha256'`);
*  `options.enc`:`string` - hash encoding (default: `'hex'`);

### `sort(object)`

Returns sorted string generated from object (can be used for object comparison)
*  `object`:`*` - object for sorting;

# Full API docs ([separate page](API.md))

## Modules

<dl>
<dt><a href="#module_node-object-hash/objectSorter">node-object-hash/objectSorter</a> : <code><a href="#module_node-object-hash/objectSorter..makeObjectSorter..objectToString">objectToString</a></code></dt>
<dd><p>Object sorter module.
It provides object sorter function constructor.</p>
</dd>
<dt><a href="#module_node-object-hash">node-object-hash</a> : <code><a href="#module_node-object-hash..apiConstructor">apiConstructor</a></code></dt>
<dd><p>Node object hash module.
It provides a methods that return object hash or sorted object string.</p>
</dd>
</dl>

<a name="module_node-object-hash/objectSorter"></a>

## node-object-hash/objectSorter : [<code>objectToString</code>](#module_node-object-hash/objectSorter..makeObjectSorter..objectToString)
Object sorter module.
It provides object sorter function constructor.


* [node-object-hash/objectSorter](#module_node-object-hash/objectSorter) : [<code>objectToString</code>](#module_node-object-hash/objectSorter..makeObjectSorter..objectToString)
    * [~_guessObjectType(obj)](#module_node-object-hash/objectSorter.._guessObjectType) ⇒ <code>string</code> ℗
    * [~_guessType(obj)](#module_node-object-hash/objectSorter.._guessType) ⇒ <code>string</code> ℗
    * [~makeObjectSorter([options])](#module_node-object-hash/objectSorter..makeObjectSorter) ⇒ [<code>objectToString</code>](#module_node-object-hash/objectSorter..makeObjectSorter..objectToString) ℗
        * [~objectToString(obj)](#module_node-object-hash/objectSorter..makeObjectSorter..objectToString) ⇒ <code>string</code> ℗

<a name="module_node-object-hash/objectSorter.._guessObjectType"></a>

### node-object-hash/objectSorter~_guessObjectType(obj) ⇒ <code>string</code> ℗
Guesses object's type

**Kind**: inner method of [<code>node-object-hash/objectSorter</code>](#module_node-object-hash/objectSorter)  
**Returns**: <code>string</code> - Object type  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | Object to guess type |

**Example**  
```js
var a = [];
_guessObjectType(a) === 'array'; // true
```
<a name="module_node-object-hash/objectSorter.._guessType"></a>

### node-object-hash/objectSorter~_guessType(obj) ⇒ <code>string</code> ℗
Guesses variable type

**Kind**: inner method of [<code>node-object-hash/objectSorter</code>](#module_node-object-hash/objectSorter)  
**Returns**: <code>string</code> - Variable type  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>\*</code> | Variable to guess type |

**Example**  
```js
var a = '';
_guessType(a) === 'string'; // true
```
<a name="module_node-object-hash/objectSorter..makeObjectSorter"></a>

### node-object-hash/objectSorter~makeObjectSorter([options]) ⇒ [<code>objectToString</code>](#module_node-object-hash/objectSorter..makeObjectSorter..objectToString) ℗
Creates object sorter function

**Kind**: inner method of [<code>node-object-hash/objectSorter</code>](#module_node-object-hash/objectSorter)  
**Returns**: [<code>objectToString</code>](#module_node-object-hash/objectSorter..makeObjectSorter..objectToString) - Object sorting function  
**Access**: private  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Sorter options |
| [options.coerce] | <code>boolean</code> | <code>true</code> | Performs type coercion |
| [options.sort] | <code>boolean</code> | <code>true</code> | Performs array, object, etc. sorting |

**Example**  
```js
// with coercion
var sorter = makeObjectSorter({coerce: true, sort: false});
sorter(1) === "1"; // true
// with sort
var sorter = makeObjectSorter({coerce: false, sort: true});
sorter([2, 3, 1]) === [1, 2, 3]; // true
```
<a name="module_node-object-hash/objectSorter..makeObjectSorter..objectToString"></a>

#### makeObjectSorter~objectToString(obj) ⇒ <code>string</code> ℗
Object sorting function

**Kind**: inner method of [<code>makeObjectSorter</code>](#module_node-object-hash/objectSorter..makeObjectSorter)  
**Returns**: <code>string</code> - Sorted string  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | Object to sort |

<a name="module_node-object-hash"></a>

## node-object-hash : [<code>apiConstructor</code>](#module_node-object-hash..apiConstructor)
Node object hash module.
It provides a methods that return object hash or sorted object string.


* [node-object-hash](#module_node-object-hash) : [<code>apiConstructor</code>](#module_node-object-hash..apiConstructor)
    * _instance_
        * [.sort(obj)](#module_node-object-hash+sort) ⇒ <code>string</code>
        * [.hash(obj, [opts])](#module_node-object-hash+hash) ⇒ <code>string</code>
    * _inner_
        * [~apiConstructor([options])](#module_node-object-hash..apiConstructor) ⇒ [<code>API</code>](#module_node-object-hash..API)
        * [~API](#module_node-object-hash..API) : <code>Object</code>

<a name="module_node-object-hash+sort"></a>

### node-object-hash.sort(obj) ⇒ <code>string</code>
Creates sorted string from given object

**Kind**: instance method of [<code>node-object-hash</code>](#module_node-object-hash)  
**Returns**: <code>string</code> - Sorted object string  
**Access**: public  
**See**: [objectToString](#module_node-object-hash/objectSorter..makeObjectSorter..objectToString)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>\*</code> | JS object to be sorted |

**Example**  
```js
var apiConstructor = require('node-object-hash');
var sorter = apiConstructor({sort:true, coerce:true}).sort;

sort({b: {b: 1, d: 'x'}, c: 2, a: [3, 5, 1]});
// "{a:[1,3,5],b:{b:1,d:x},c:2}"
```
<a name="module_node-object-hash+hash"></a>

### node-object-hash.hash(obj, [opts]) ⇒ <code>string</code>
Creates hash from given object

**Kind**: instance method of [<code>node-object-hash</code>](#module_node-object-hash)  
**Returns**: <code>string</code> - Object hash value  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| obj | <code>\*</code> |  | JS object to hash |
| [opts] | <code>Object</code> |  | Options |
| [opts.alg] | <code>string</code> | <code>&quot;sha256&quot;</code> | Crypto algorithm to use |
| [opts.enc] | <code>string</code> | <code>&quot;hex&quot;</code> | Hash string encoding |

**Example**  
```js
var apiConstructor = require('node-object-hash');
var hasher = apiConstructor({sort:true, coerce:true}).hash;

hash({b: {b: 1, d: 'x'}, c: 2, a: [3, 5, 1]});
// "4c18ce0dcb1696b329c8568d94a9830da810437d8c9e6cecf5d969780335a26b"
```
<a name="module_node-object-hash..apiConstructor"></a>

### node-object-hash~apiConstructor([options]) ⇒ [<code>API</code>](#module_node-object-hash..API)
Generates node-object-hash API object

**Kind**: inner method of [<code>node-object-hash</code>](#module_node-object-hash)  
**Returns**: [<code>API</code>](#module_node-object-hash..API) - Node object hash API instance  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Library options |
| [options.coerce] | <code>boolean</code> | <code>true</code> | Performs type coercion |
| [options.sort] | <code>boolean</code> | <code>true</code> | Performs array, object, etc. sorting |
| [options.alg] | <code>string</code> | <code>&quot;sha256&quot;</code> | Default crypto algorithm to use (can be overridden) |
| [options.enc] | <code>string</code> | <code>&quot;hex&quot;</code> | Hash string encoding (can be overridden) |

**Example**  
```js
var apiConstructor = require('node-object-hash');
var hashSortCoerce = apiConstructor({sort:true, coerce:true});
// or
var hashSort = apiConstructor({sort:true, coerce:false});
// or
var hashCoerce = apiConstructor({sort:false, coerce:true});

var objects = {
   a: {
     a: [{c: 2, a: 1, b: {a: 3, c: 2, b: 0}}],
     b: [1, 'a', {}, null],
   },
   b: {
     b: ['a', 1, {}, undefined],
     a: [{c: '2', b: {b: false, c: 2, a: '3'}, a: true}]
   },
   c: ['4', true, 0, 2, 3]
};
hashSortCoerce.hash(objects.a) === hashSortCoerce.hash(objects.b);
// returns true

hashSortCoerce.sort(object.c);
// returns '[0,1,2,3,4]'
```
<a name="module_node-object-hash..API"></a>

### node-object-hash~API : <code>Object</code>
Node object hash API object

**Kind**: inner typedef of [<code>node-object-hash</code>](#module_node-object-hash)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| hash | <code>function</code> | Returns object hash string (see [hash](#module_node-object-hash+hash)) |
| sort | <code>function</code> | Returns sorted object string (see [sort](#module_node-object-hash+sort)) |


# Requirements

## version \>=1.0.0
- `>=nodejs-0.10.0`

## version \>=0.1.0 && <1.0.0
- `>=nodejs-6.0.0`
- `>=nodejs-4.0.0` (requires to run node with `--harmony` flag)

## browsers
- nodejs `crypto` module for browsers (e.g. [browserify-crypto](https://github.com/crypto-browserify/crypto-browserify)).

# Example
```js
var hasher = require('node-object-hash');

var hashSortCoerce = hasher({sort:true, coerce:true});
// or
// var hashSortCoerce = hasher();
// or
// var hashSort = hasher({sort:true, coerce:false});
// or
// var hashCoerce = hasher({sort:false, coerce:true});

var objects = {
    a: {
      a: [{c: 2, a: 1, b: {a: 3, c: 2, b: 0}}],
      b: [1, 'a', {}, null],
    },
    b: {
      b: ['a', 1, {}, undefined],
      a: [{c: '2', b: {b: false, c: 2, a: '3'}, a: true}]
    },
    c: ['4', true, 0, 2, 3]
};

hashSortCoerce.hash(objects.a) === hashSortCoerce.hash(objects.b);
// returns true

hashSortCoerce.sort(object.c);
// returns '[0,1,2,3,4]'
```

For more examples you can see [tests file](https://github.com/SkeLLLa/node-object-hash/blob/master/test/hash2.js)
or try it out online at [runkit](https://runkit.com/skellla/node-object-hash-example)

# Benchmarks

Bench data - array of 100000 complex objects

## Usage

* `npm run bench` to run custom benchmark
* `npm run bench2` to run benchmark suite

## Results

### Custom benchmark ([code](bench/index.js))

| Library                               | Time (ms)  | Memory (Mb)        |
|---------------------------------------|------------|--------------------|
| node-object-hash-0.2.1                | 5813.575   | 34                 |
| node-object-hash-1.0.X                | 2805.581   | 27                 |
| node-object-hash-1.1.X (node v7)      | 2555.583   | 27                 |
| node-object-hash-1.2.X (node v7)      | 2390.752   | 28                 |
| object-hash-1.1.5  (node v7)          | 28115.553  | 39                 |
| object-hash-1.1.4                     | 534528.254 | 41                 |
| object-hash-1.1.3                     | ERROR      | Out of heap memory |
| hash-object-0.1.7                     | 9219.826   | 42                 |

### Benchmark suite module ([code](bench/bench.js))

| Library (node v7)      | Perf (ops/s) |
|------------------------|--------------|
| node-object-hash-0.2.1 | 540  ±1.34%  |
| node-object-hash-1.1.X | 844  ±2.51%  |
| node-object-hash-1.2.X | 1021 ±1.81%  |
| object-hash-1.1.5      | 106  ±0.88%  |
| hash-object-0.1.7      | 305  ±1.66%  |

| Library (node v10)     | Perf (ops/s) |
|------------------------|--------------|
| node-object-hash-0.X.X | 758  ±1.40%  |
| node-object-hash-1.4.X | 1266 ±1.44%  |
| object-hash-1.3.0      | 132  ±4.08%  |
| hash-object-0.1.7      | 378  ±1.36%  |

## Links

* [object-hash](https://www.npmjs.com/package/object-hash) - Slow, useful for browsers because it not uses node's crypto library
* [hash-object](https://www.npmjs.com/package/hash-object) - no ES6 types support

# License

ISC
