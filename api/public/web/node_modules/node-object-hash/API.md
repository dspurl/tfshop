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

