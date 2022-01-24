'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _playlistJs = require('./playlist.js');

/**
 * Returns a function that acts as the Enable/disable playlist function.
 *
 * @param {PlaylistLoader} loader - The master playlist loader
 * @param {String} playlistUri - uri of the playlist
 * @param {Function} changePlaylistFn - A function to be called after a
 * playlist's enabled-state has been changed. Will NOT be called if a
 * playlist's enabled-state is unchanged
 * @param {Boolean=} enable - Value to set the playlist enabled-state to
 * or if undefined returns the current enabled-state for the playlist
 * @return {Function} Function for setting/getting enabled
 */
var enableFunction = function enableFunction(loader, playlistUri, changePlaylistFn) {
  return function (enable) {
    var playlist = loader.master.playlists[playlistUri];
    var incompatible = (0, _playlistJs.isIncompatible)(playlist);
    var currentlyEnabled = (0, _playlistJs.isEnabled)(playlist);

    if (typeof enable === 'undefined') {
      return currentlyEnabled;
    }

    if (enable) {
      delete playlist.disabled;
    } else {
      playlist.disabled = true;
    }

    if (enable !== currentlyEnabled && !incompatible) {
      // Ensure the outside world knows about our changes
      changePlaylistFn();
      if (enable) {
        loader.trigger('renditionenabled');
      } else {
        loader.trigger('renditiondisabled');
      }
    }
    return enable;
  };
};

/**
 * The representation object encapsulates the publicly visible information
 * in a media playlist along with a setter/getter-type function (enabled)
 * for changing the enabled-state of a particular playlist entry
 *
 * @class Representation
 */

var Representation = function Representation(hlsHandler, playlist, id) {
  _classCallCheck(this, Representation);

  // Get a reference to a bound version of fastQualityChange_
  var fastChangeFunction = hlsHandler.masterPlaylistController_.fastQualityChange_.bind(hlsHandler.masterPlaylistController_);

  // some playlist attributes are optional
  if (playlist.attributes.RESOLUTION) {
    var resolution = playlist.attributes.RESOLUTION;

    this.width = resolution.width;
    this.height = resolution.height;
  }

  this.bandwidth = playlist.attributes.BANDWIDTH;

  // The id is simply the ordinality of the media playlist
  // within the master playlist
  this.id = id;

  // Partially-apply the enableFunction to create a playlist-
  // specific variant
  this.enabled = enableFunction(hlsHandler.playlists, playlist.uri, fastChangeFunction);
}

/**
 * A mixin function that adds the `representations` api to an instance
 * of the HlsHandler class
 * @param {HlsHandler} hlsHandler - An instance of HlsHandler to add the
 * representation API into
 */
;

var renditionSelectionMixin = function renditionSelectionMixin(hlsHandler) {
  var playlists = hlsHandler.playlists;

  // Add a single API-specific function to the HlsHandler instance
  hlsHandler.representations = function () {
    return playlists.master.playlists.filter(function (media) {
      return !(0, _playlistJs.isIncompatible)(media);
    }).map(function (e, i) {
      return new Representation(hlsHandler, e, e.uri);
    });
  };
};

exports['default'] = renditionSelectionMixin;
module.exports = exports['default'];