'use strict';

const { EVENT, PLUGIN } = require('./constants.js');

const debug = require('./common.js').debug;
const matches = require('./common.js').matches;
const normaliseOptions = require('./config.js');
const shouldAddResourceHints = require('./resource-hints.js').shouldAddResourceHints;
const addInitialChunkResourceHints = require('./initial-chunk-resource-hints.js');
const addAsyncChunkResourceHints = require('./async-chunk-resource-hints.js');
const elements = require('./elements.js');
const customAttributes = require('./custom-attributes.js');

const debugEvent = msg => debug(`${EVENT}: ${msg}`);

const falsySafeConcat = arrays =>
  arrays.reduce(
    (combined, array) => array ? combined.concat(array) : combined,
    []
  );

const getHtmlWebpackOptions = pluginArgs =>
  (pluginArgs && pluginArgs.plugin && pluginArgs.plugin.options)
    ? pluginArgs.plugin.options
    : {};

const getCompilationOptions = compilation =>
  (compilation && compilation.options) ? compilation.options : {};

class ScriptExtHtmlWebpackPlugin {
  constructor (options) {
    this.options = normaliseOptions(options);
  }

  apply (compiler) {
    const compile = this.compilationCallback.bind(this);
    const emit = this.emitCallback.bind(this);
    if (compiler.hooks) {
      compiler.hooks.compilation.tap(PLUGIN, compile);
      compiler.hooks.emit.tap(PLUGIN, emit);
    } else {
      compiler.plugin('compilation', compile);
      compiler.plugin('emit', emit);
    }
  }

  compilationCallback (compilation) {
    const alterAssetTags = this.alterAssetTagsCallback.bind(this, compilation);
    if (compilation.hooks) {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(PLUGIN, alterAssetTags);
    } else {
      compilation.plugin(EVENT, alterAssetTags);
    }
  }

  alterAssetTagsCallback (compilation, pluginArgs, callback) {
    const options = this.options;
    try {
      options.htmlWebpackOptions = getHtmlWebpackOptions(pluginArgs);
      options.compilationOptions = getCompilationOptions(compilation);
      debugEvent('starting');
      if (elements.shouldUpdate(options)) {
        debugEvent('replacing <head> <script> elements');
        pluginArgs.head = elements.update(compilation.assets, options, pluginArgs.head);
        debugEvent('replacing <body> <script> elements');
        pluginArgs.body = elements.update(compilation.assets, options, pluginArgs.body);
      }
      if (shouldAddResourceHints(options)) {
        debugEvent('adding resource hints');
        pluginArgs.head = falsySafeConcat([
          pluginArgs.head,
          addInitialChunkResourceHints(options, pluginArgs.head),
          addInitialChunkResourceHints(options, pluginArgs.body),
          addAsyncChunkResourceHints(compilation.chunks, options)
        ]);
      }
      if (customAttributes.shouldAdd(options)) {
        debugEvent('adding custom attribues to <head> <script> elements');
        pluginArgs.head = customAttributes.add(options, pluginArgs.head);
        debugEvent('adding custom attributes to <body> <script> elements');
        pluginArgs.body = customAttributes.add(options, pluginArgs.body);
      }
      debugEvent('completed');
      if (callback) {
        callback(null, pluginArgs);
      }
    } catch (err) {
      if (callback) {
        callback(err);
      } else {
        compilation.errors.push(err);
      }
    }
  }

  emitCallback (compilation, callback) {
    const options = this.options;
    if (options.inline.test.length > 0 && options.removeInlinedAssets) {
      debug('emit: deleting assets');
      Object.keys(compilation.assets).forEach((assetName) => {
        if (matches(assetName, options.inline.test)) {
          debug(`emit: deleting asset '${assetName}'`);
          delete compilation.assets[assetName];
        }
      });
    }
    if (callback) {
      callback();
    }
  }
}

module.exports = ScriptExtHtmlWebpackPlugin;
