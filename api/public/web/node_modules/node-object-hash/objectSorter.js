// / <reference types="node" />
'use strict';

/**
 * Guesses object's type
 * @memberOf module:node-object-hash/objectSorter
 * @inner
 * @private
 * @param {Object} obj Object to guess type
 * @return {string} Object type
 * @example
 * var a = [];
 * _guessObjectType(a) === 'array'; // true
 */
function _guessObjectType(obj) {
  if (obj === null) {
    return 'null';
  }

  switch (obj.constructor && obj.constructor.name) {
  case 'Array':
  case 'Int8Array':
  case 'Uint8Array':
  case 'Uint8ClampedArray':
  case 'Int16Array':
  case 'Uint16Array':
  case 'Int32Array':
  case 'Uint32Array':
  case 'Float32Array':
  case 'Float64Array':
  case 'Buffer':
    return 'array';
  case 'Map':
    return 'map';
  case 'Set':
    return 'set';
  case 'Date':
    return 'date';
  case 'String':
    return 'string';
  case 'Number':
    return 'number';
  case 'Boolean':
    return 'boolean';
  case 'Object':
    return 'object';
  default:
    return 'unknown';
  }
}

/**
 * Guesses variable type
 * @memberOf module:node-object-hash/objectSorter
 * @inner
 * @private
 * @param {*} obj Variable to guess type
 * @return {string} Variable type
 * @example
 * var a = '';
 * _guessType(a) === 'string'; // true
 */
function _guessType(obj) {
  var type = typeof obj;

  return type !== 'object' ? type : _guessObjectType(obj);
}

/**
 * Creates object sorter function
 * @memberOf module:node-object-hash/objectSorter
 * @inner
 * @private
 * @param {Object} [options] Sorter options
 * @param {boolean} [options.coerce=true] Performs type coercion
 * @param {boolean} [options.sort=true] Performs array, object, etc. sorting
 * @return {module:node-object-hash/objectSorter~makeObjectSorter~objectToString}
 * Object sorting function
 * @example
 * // with coercion
 * var sorter = makeObjectSorter({coerce: true, sort: false});
 * sorter(1) === "1"; // true
 * // with sort
 * var sorter = makeObjectSorter({coerce: false, sort: true});
 * sorter([2, 3, 1]) === [1, 2, 3]; // true
 */
function makeObjectSorter(options) {
  options = options || {};
  var coerce = typeof options.coerce === 'undefined' ? true : options.coerce;
  var sort = typeof options.sort === 'undefined' ? true : options.sort;
  var stringifier = {};

  stringifier.string = function sortString(obj) {
    if (coerce) {
      return obj;
    }
    return '<:s>:' + obj;
  };

  stringifier.number = function sortNumber(obj) {
    if (coerce) {
      return obj.toString();
    }
    return '<:n>:' + obj;
  };

  stringifier.boolean = function sortBoolean(obj) {
    if (coerce) {
      return obj.valueOf() ? '1' : '0';
    }
    return obj.valueOf() ? '<:b>:true' : '<:b>:false';
  };

  stringifier.symbol = function sortSymbol() {
    return '<:smbl>';
  };

  stringifier.undefined = function sortUndefined() {
    if (coerce) {
      return '';
    }
    return '<:undf>';
  };

  stringifier.null = function sortNull() {
    if (coerce) {
      return '';
    }
    return '<:null>';
  };

  stringifier.function = function sortFunction(obj) {
    if (coerce) {
      return obj.name + '=>' + obj.toString();
    }
    return '<:func>:' + obj.name + '=>' + obj.toString();
  };

  stringifier.array = function sortArray(obj) {
    var item;
    var itemType;
    var result = [];

    for (var i = 0; i < obj.length; i++) {
      item = obj[i];
      itemType = _guessType(item);
      result.push(stringifier[itemType](item));
    }

    return sort ? '[' + result.sort().toString() + ']' : '[' + result.toString() + ']';
  };

  stringifier.set = function sortSet(obj) {
    return stringifier.array(Array.from(obj));
  };

  stringifier.date = function sortDate(obj) {
    var dateStr = obj.toISOString();

    if (coerce) {
      return dateStr;
    }
    return '<:date>:' + dateStr;
  };

  stringifier.object = function sortObject(obj) {
    var keys = sort ? Object.keys(obj).sort() : Object.keys(obj);
    var objArray = [];
    var key;
    var value;
    var valueType;
    var i;

    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      value = obj[key];
      valueType = _guessType(value);
      objArray.push(key + ':' + stringifier[valueType](value));
    }
    return '{' + objArray.toString() + '}';
  };

  stringifier.map = function sortMap(obj) {
    var arr = Array.from(obj);
    var key;
    var value;
    var item;
    var i;

    for (i = 0; i < arr.length; i++) {
      item = arr[i];
      key = item[0];
      value = item[1];
      item = [stringifier[_guessType(key)](key), stringifier[_guessType(value)](value)];
      arr[i] = item;
    }

    return sort ? '[' + arr.sort().join(';') + ']' : '[' + arr.join(';') + ']';
  };

  stringifier.unknown = function unknownToString(obj) {
    var constructorName = obj.constructor ? obj.constructor.name : 'unknonw';
    var objectName = typeof obj.toString === 'function' ? obj.toString() : 'unknown';

    return '<:' + constructorName + '>:' + objectName;
  };

  /**
   * Object sorting function
   * @private
   * @param {Object} obj Object to sort
   * @return {string} Sorted string
   */
  function objectToString(obj) {
    return stringifier[_guessType(obj)](obj);
  }

  return objectToString;
}

/**
 * Object sorter module.
 * It provides object sorter function constructor.
 * @module node-object-hash/objectSorter
 * @type {module:node-object-hash/objectSorter~makeObjectSorter~objectToString}
 */
module.exports = makeObjectSorter;
