// / <reference types="node" />
'use strict';

var crypto = require('crypto');
var objectSorter = require('./objectSorter');

/**
 * Node object hash API object
 * @typedef {Object} API
 * @memberOf module:node-object-hash
 * @inner
 * @property {Function} hash Returns object hash string (see {@link module:node-object-hash#hash})
 * @property {Function} sort Returns sorted object string (see {@link module:node-object-hash#sort})
 */

/**
 * Generates node-object-hash API object
 * @param {Object} [options] Library options
 * @param {boolean} [options.coerce=true] Performs type coercion
 * @param {boolean} [options.sort=true] Performs array, object, etc. sorting
 * @param {string} [options.alg=sha256] Default crypto algorithm to use (can be overridden)
 * @param {string} [options.enc=hex] Hash string encoding (can be overridden)
 * @return {module:node-object-hash~API} Node object hash API instance
 * @memberOf module:node-object-hash
 * @inner
 * @example
 * var apiConstructor = require('node-object-hash');
 * var hashSortCoerce = apiConstructor({sort:true, coerce:true});
 * // or
 * var hashSort = apiConstructor({sort:true, coerce:false});
 * // or
 * var hashCoerce = apiConstructor({sort:false, coerce:true});
 *
 * var objects = {
 *    a: {
 *      a: [{c: 2, a: 1, b: {a: 3, c: 2, b: 0}}],
 *      b: [1, 'a', {}, null],
 *    },
 *    b: {
 *      b: ['a', 1, {}, undefined],
 *      a: [{c: '2', b: {b: false, c: 2, a: '3'}, a: true}]
 *    },
 *    c: ['4', true, 0, 2, 3]
 * };
 * hashSortCoerce.hash(objects.a) === hashSortCoerce.hash(objects.b);
 * // returns true
 *
 * hashSortCoerce.sort(object.c);
 * // returns '[0,1,2,3,4]'
 */
function apiConstructor(options) {
  var defaults = options || {};
  var _sortObject;

  defaults.alg = defaults.alg || 'sha256';
  defaults.enc = defaults.enc || 'hex';

  _sortObject = objectSorter(options);

  /**
   * Creates sorted string from given object
   * @param {*} obj JS object to be sorted
   * @return {string} Sorted object string
   * @see {@link module:node-object-hash/objectSorter~makeObjectSorter~objectToString}
   * @memberOf module:node-object-hash
   * @instance
   * @public
   * @alias sort
   * @example
   * var apiConstructor = require('node-object-hash');
   * var sorter = apiConstructor({sort:true, coerce:true}).sort;
   *
   * sort({b: {b: 1, d: 'x'}, c: 2, a: [3, 5, 1]});
   * // "{a:[1,3,5],b:{b:1,d:x},c:2}"
   */
  function sortObject(obj) {
    return _sortObject(obj);
  }

  /**
   * Creates hash from given object
   * @param {*} obj JS object to hash
   * @param {Object} [opts] Options
   * @param {string} [opts.alg=sha256] Crypto algorithm to use
   * @param {string} [opts.enc=hex] Hash string encoding
   * @return {string} Object hash value
   * @memberOf module:node-object-hash
   * @instance
   * @public
   * @alias hash
   * @example
   * var apiConstructor = require('node-object-hash');
   * var hasher = apiConstructor({sort:true, coerce:true}).hash;
   *
   * hash({b: {b: 1, d: 'x'}, c: 2, a: [3, 5, 1]});
   * // "4c18ce0dcb1696b329c8568d94a9830da810437d8c9e6cecf5d969780335a26b"
   */
  function hashObject(obj, opts) {
    opts = opts || {};
    var alg = opts.alg || defaults.alg;
    var enc = opts.enc || defaults.enc;
    var sorted = sortObject(obj);

    return crypto
      .createHash(alg)
      .update(sorted)
      .digest(enc);
  }

  return {
    hash: hashObject,
    sortObject: sortObject,
    sort: sortObject
  };
}

/**
 * Node object hash module.
 * It provides a methods that return object hash or sorted object string.
 * @module node-object-hash
 * @type {module:node-object-hash~apiConstructor}
 */
module.exports = apiConstructor;
