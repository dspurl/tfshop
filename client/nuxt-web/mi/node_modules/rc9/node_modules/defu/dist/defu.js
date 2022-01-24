'use strict';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function isObject(val) {
  return val !== null && _typeof(val) === 'object' && !Array.isArray(val);
}

function _defu(baseObj, defaults) {
  if (!isObject(baseObj)) {
    return _defu({}, defaults);
  }

  if (!isObject(defaults)) {
    return _defu(baseObj, {});
  }

  var obj = Object.assign({}, defaults);

  for (var key in baseObj) {
    if (key === '__proto__' || key === 'constructor') {
      continue;
    }

    var val = baseObj[key];

    if (val === null) {
      continue;
    }

    if (isObject(val) && isObject(obj[key])) {
      obj[key] = _defu(val, obj[key]);
    } else {
      obj[key] = val;
    }
  }

  return obj;
}

function defu() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args.reduce(_defu, {});
}

module.exports = defu;
