Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports['default'] = function (_ref) {
  var template = _ref.template,
      t = _ref.types;

  var buildImport = template('Promise.resolve().then(() => MODULE)');

  return {
    inherits: _babelPluginSyntaxDynamicImport2['default'],

    visitor: {
      Import: function () {
        function Import(path) {
          var importArguments = path.parentPath.node.arguments;

          var _importArguments = _slicedToArray(importArguments, 1),
              importPath = _importArguments[0];

          var isString = t.isStringLiteral(importPath) || t.isTemplateLiteral(importPath);
          if (isString) {
            t.removeComments(importPath);
          }
          var SOURCE = isString ? importArguments : t.templateLiteral([t.templateElement({ raw: '', cooked: '' }), t.templateElement({ raw: '', cooked: '' }, true)], importArguments);
          var requireCall = t.callExpression(t.identifier('require'), [].concat(SOURCE));
          var newImport = buildImport({
            MODULE: t.callExpression(this.addHelper('interopRequireWildcard'), [requireCall])
          });
          path.parentPath.replaceWith(newImport);
        }

        return Import;
      }()
    }
  };
};

var _babelPluginSyntaxDynamicImport = require('babel-plugin-syntax-dynamic-import');

var _babelPluginSyntaxDynamicImport2 = _interopRequireDefault(_babelPluginSyntaxDynamicImport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

module.exports = exports['default'];