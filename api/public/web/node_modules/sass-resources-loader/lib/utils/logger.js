"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _default = {
  log: function log() {
    var _console;

    for (var _len = arguments.length, output = new Array(_len), _key = 0; _key < _len; _key++) {
      output[_key] = arguments[_key];
    }

    var pettyOutput = [_chalk["default"].yellow('[sass-resources-loader]: ')].concat(output, '\n');

    (_console = console).log.apply(_console, _toConsumableArray(pettyOutput));
  },
  debug: function debug() {
    if (__DEBUG__) this.log.apply(this, arguments);
  },
  error: function error() {
    var _console2;

    for (var _len2 = arguments.length, output = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      output[_key2] = arguments[_key2];
    }

    var errorOutput = [_chalk["default"].red('[sass-resources-loader]: ')].concat(output, '\n');

    (_console2 = console).log.apply(_console2, _toConsumableArray(errorOutput));
  }
};
exports["default"] = _default;