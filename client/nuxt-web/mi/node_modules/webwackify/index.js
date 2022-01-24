// By default assume browserify was used to bundle app. These arguments are passed to
// the module by browserify.
var bundleFn = arguments[3];
var sources = arguments[4];
var cache = arguments[5];
var stringify = JSON.stringify;
var webpack = false;

// webpackBootstrap
var webpackBootstrapFn = function(modules) {
  // The module cache
  var installedModules = {};

  // The require function
  function __webpack_require__(moduleId) {

    // Check if module is in cache
    if(installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };

    // Execute the module function
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }


  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;

  // expose the module cache
  __webpack_require__.c = installedModules;

  // define getter function for harmony exports
  __webpack_require__.d = function(exports, name, getter) {
    if(!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, {
        configurable: false,
        enumerable: true,
        get: getter
      });
    }
  };

  // getDefaultExport function for compatibility with non-harmony modules
  __webpack_require__.n = function(module) {
    var getter = module && module.__esModule ?
      function getDefault() { return module['default']; } :
      function getModuleExports() { return module; };

    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };

  // Object.prototype.hasOwnProperty.call
  __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

  // __webpack_public_path__
  __webpack_require__.p = "";

  // Load entry module and return exports
  return __webpack_require__(__webpack_require__.s = entryModule);
}

if (typeof bundleFn === 'undefined') {
  // Assume this was bundled with webpack and not browserify
  webpack = true;
  bundleFn = webpackBootstrapFn;
  sources = __webpack_modules__;
}

var bundleWithBrowserify = function(fn) {
  // with browserify we must find the module key ourselves
  var cacheKeys = Object.keys(cache);
  var fnModuleKey;

  for (var i = 0; i < cacheKeys.length; i++) {
    var cacheKey = cacheKeys[i];
    var cacheExports = cache[cacheKey].exports;

    // Using babel as a transpiler to use esmodule, the export will always
    // be an object with the default export as a property of it. To ensure
    // the existing api and babel esmodule exports are both supported we
    // check for both
    if (cacheExports === fn || cacheExports && cacheExports.default === fn) {
        fnModuleKey = cacheKey;
        break;
    }
  }

  // if we couldn't find one, lets make one
  if (!fnModuleKey) {
    fnModuleKey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);

    var fnModuleCache = {};

    for (var i = 0; i < cacheKeys.length; i++) {
      var cacheKey = cacheKeys[i];

      fnModuleCache[cacheKey] = cacheKey;
    }

    sources[fnModuleKey] = [
      'function(require,module,exports){' + fn + '(self); }',
      fnModuleCache
    ];
  }

  var entryKey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
  var entryCache = {};

  entryCache[fnModuleKey] = fnModuleKey;
  sources[entryKey] = [
    'function(require,module,exports){' +
    // try to call default if defined to also support babel esmodule exports
      'var f = require(' + stringify(fnModuleKey) + ');' +
      '(f.default ? f.default : f)(self);' +
    '}',
    entryCache
  ];

  return '(' + bundleFn + ')({'
        + Object.keys(sources).map(function(key) {
            return stringify(key) + ':['
                + sources[key][0] + ','
                + stringify(sources[key][1]) + ']';
        }).join(',')
        + '},{},[' + stringify(entryKey) + '])';
};

var bundleWithWebpack = function(fn, fnModuleId) {
  var devMode = typeof fnModuleId === 'string';
  var sourceStrings;

  if (devMode) {
    sourceStrings = {};
  } else {
    sourceStrings = [];
  }

  Object.keys(sources).forEach(function(sKey) {
    if (!sources[sKey]) {
      return;
    }
    sourceStrings[sKey] = sources[sKey].toString();
  });

  var fnModuleExports = __webpack_require__(fnModuleId);

  // Using babel as a transpiler to use esmodule, the export will always
  // be an object with the default export as a property of it. To ensure
  // the existing api and babel esmodule exports are both supported we
  // check for both
  if (!(fnModuleExports && (fnModuleExports === fn || fnModuleExports.default === fn))) {
    var fnSourceString = sourceStrings[fnModuleId];

    sourceStrings[fnModuleId] = fnSourceString.substring(0, fnSourceString.length - 1) +
                                '\n' + fn.name + '();\n}';
  }

  var modulesString;

  if (devMode) {
    // must escape quotes to support webpack loader options
    fnModuleId = stringify(fnModuleId);
    // dev mode in webpack4, modules are passed as an object
    var mappedSourceStrings = Object.keys(sourceStrings).map(function(sKey) {
      return stringify(sKey) + ':' + sourceStrings[sKey];
    });

    modulesString = '{' + mappedSourceStrings.join(',') + '}';
  } else {
    modulesString = '[' + sourceStrings.join(',') + ']';
  }

  return 'var fn = (' + bundleFn.toString().replace('entryModule', fnModuleId) + ')('
        + modulesString
        + ');\n'
        // not a function when calling a function from the current scope
        + '(typeof fn === "function") && fn(self);';

};

module.exports = function webwackify(fn, fnModuleId) {
  var src;

  if (webpack) {
    src = bundleWithWebpack(fn, fnModuleId);
  } else {
    src = bundleWithBrowserify(fn);
  }

  var blob = new Blob([src], { type: 'text/javascript' });
  var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
  var workerUrl = URL.createObjectURL(blob);
  var worker = new Worker(workerUrl);
  worker.objectURL = workerUrl;
  return worker;
};
