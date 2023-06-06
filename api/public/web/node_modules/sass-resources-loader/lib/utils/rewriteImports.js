"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = rewriteImports;
exports.getRelativeImportPath = void 0;

var _path = _interopRequireDefault(require("path"));

var _logger = _interopRequireDefault(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var importRegexp = /@import\s+(?:'([^']+)'|"([^"]+)"|([^\s;]+))/g;

var getRelativeImportPath = function getRelativeImportPath(oldImportPath, absoluteImportPath, moduleContext) {
  // from node_modules
  if (/^~/.test(oldImportPath)) {
    return oldImportPath;
  }

  return _path["default"].relative(moduleContext, absoluteImportPath);
};

exports.getRelativeImportPath = getRelativeImportPath;

function rewriteImports(error, file, contents, moduleContext, callback) {
  if (error) {
    _logger["default"].debug('Resources: **not found**');

    return callback(error);
  }

  if (!/\.s[ac]ss$/i.test(file)) {
    return callback(null, contents);
  }

  var rewritten = contents.replace(importRegexp, function (entire, single, _double, unquoted) {
    var oldImportPath = single || _double || unquoted;

    var absoluteImportPath = _path["default"].join(_path["default"].dirname(file), oldImportPath);

    var relImportPath = getRelativeImportPath(oldImportPath, absoluteImportPath, moduleContext);
    var newImportPath = relImportPath.split(_path["default"].sep).join('/');

    _logger["default"].debug("Resources: @import of ".concat(oldImportPath, " changed to ").concat(newImportPath));

    var lastCharacter = entire[entire.length - 1];
    var quote = lastCharacter === "'" || lastCharacter === '"' ? lastCharacter : '';
    return "@import ".concat(quote).concat(newImportPath).concat(quote);
  });
  callback(null, rewritten);
  return undefined;
}