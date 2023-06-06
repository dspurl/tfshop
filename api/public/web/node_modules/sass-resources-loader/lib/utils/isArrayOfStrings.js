"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(array) {
  return Array.isArray(array) && array.every(function (item) {
    return typeof item === 'string';
  });
};

exports["default"] = _default;