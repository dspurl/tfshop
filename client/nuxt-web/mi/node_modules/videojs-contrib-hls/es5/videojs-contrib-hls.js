/**
 * @file videojs-contrib-hls.js
 *
 * The main file for the HLS project.
 * License: https://github.com/videojs/videojs-contrib-hls/blob/master/LICENSE
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _globalDocument = require('global/document');

var _globalDocument2 = _interopRequireDefault(_globalDocument);

var _playlistLoader = require('./playlist-loader');

var _playlistLoader2 = _interopRequireDefault(_playlistLoader);

var _playlist = require('./playlist');

var _playlist2 = _interopRequireDefault(_playlist);

var _xhr = require('./xhr');

var _xhr2 = _interopRequireDefault(_xhr);

var _aesDecrypter = require('aes-decrypter');

var _binUtils = require('./bin-utils');

var _binUtils2 = _interopRequireDefault(_binUtils);

var _videojsContribMediaSources = require('videojs-contrib-media-sources');

var _m3u8Parser = require('m3u8-parser');

var _m3u8Parser2 = _interopRequireDefault(_m3u8Parser);

var _videoJs = require('video.js');

var _videoJs2 = _interopRequireDefault(_videoJs);

var _masterPlaylistController = require('./master-playlist-controller');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _renditionMixin = require('./rendition-mixin');

var _renditionMixin2 = _interopRequireDefault(_renditionMixin);

var _globalWindow = require('global/window');

var _globalWindow2 = _interopRequireDefault(_globalWindow);

var _playbackWatcher = require('./playback-watcher');

var _playbackWatcher2 = _interopRequireDefault(_playbackWatcher);

var _reloadSourceOnError = require('./reload-source-on-error');

var _reloadSourceOnError2 = _interopRequireDefault(_reloadSourceOnError);

var _playlistSelectorsJs = require('./playlist-selectors.js');

var Hls = {
  PlaylistLoader: _playlistLoader2['default'],
  Playlist: _playlist2['default'],
  Decrypter: _aesDecrypter.Decrypter,
  AsyncStream: _aesDecrypter.AsyncStream,
  decrypt: _aesDecrypter.decrypt,
  utils: _binUtils2['default'],

  STANDARD_PLAYLIST_SELECTOR: _playlistSelectorsJs.lastBandwidthSelector,
  INITIAL_PLAYLIST_SELECTOR: _playlistSelectorsJs.lowestBitrateCompatibleVariantSelector,
  comparePlaylistBandwidth: _playlistSelectorsJs.comparePlaylistBandwidth,
  comparePlaylistResolution: _playlistSelectorsJs.comparePlaylistResolution,

  xhr: (0, _xhr2['default'])()
};

// 0.5 MB/s
var INITIAL_BANDWIDTH = 4194304;

// Define getter/setters for config properites
['GOAL_BUFFER_LENGTH', 'MAX_GOAL_BUFFER_LENGTH', 'GOAL_BUFFER_LENGTH_RATE', 'BUFFER_LOW_WATER_LINE', 'MAX_BUFFER_LOW_WATER_LINE', 'BUFFER_LOW_WATER_LINE_RATE', 'BANDWIDTH_VARIANCE'].forEach(function (prop) {
  Object.defineProperty(Hls, prop, {
    get: function get() {
      _videoJs2['default'].log.warn('using Hls.' + prop + ' is UNSAFE be sure you know what you are doing');
      return _config2['default'][prop];
    },
    set: function set(value) {
      _videoJs2['default'].log.warn('using Hls.' + prop + ' is UNSAFE be sure you know what you are doing');

      if (typeof value !== 'number' || value < 0) {
        _videoJs2['default'].log.warn('value of Hls.' + prop + ' must be greater than or equal to 0');
        return;
      }

      _config2['default'][prop] = value;
    }
  });
});

/**
 * Updates the selectedIndex of the QualityLevelList when a mediachange happens in hls.
 *
 * @param {QualityLevelList} qualityLevels The QualityLevelList to update.
 * @param {PlaylistLoader} playlistLoader PlaylistLoader containing the new media info.
 * @function handleHlsMediaChange
 */
var handleHlsMediaChange = function handleHlsMediaChange(qualityLevels, playlistLoader) {
  var newPlaylist = playlistLoader.media();
  var selectedIndex = -1;

  for (var i = 0; i < qualityLevels.length; i++) {
    if (qualityLevels[i].id === newPlaylist.uri) {
      selectedIndex = i;
      break;
    }
  }

  qualityLevels.selectedIndex_ = selectedIndex;
  qualityLevels.trigger({
    selectedIndex: selectedIndex,
    type: 'change'
  });
};

/**
 * Adds quality levels to list once playlist metadata is available
 *
 * @param {QualityLevelList} qualityLevels The QualityLevelList to attach events to.
 * @param {Object} hls Hls object to listen to for media events.
 * @function handleHlsLoadedMetadata
 */
var handleHlsLoadedMetadata = function handleHlsLoadedMetadata(qualityLevels, hls) {
  hls.representations().forEach(function (rep) {
    qualityLevels.addQualityLevel(rep);
  });
  handleHlsMediaChange(qualityLevels, hls.playlists);
};

// HLS is a source handler, not a tech. Make sure attempts to use it
// as one do not cause exceptions.
Hls.canPlaySource = function () {
  return _videoJs2['default'].log.warn('HLS is no longer a tech. Please remove it from ' + 'your player\'s techOrder.');
};

/**
 * Whether the browser has built-in HLS support.
 */
Hls.supportsNativeHls = (function () {
  var video = _globalDocument2['default'].createElement('video');

  // native HLS is definitely not supported if HTML5 video isn't
  if (!_videoJs2['default'].getTech('Html5').isSupported()) {
    return false;
  }

  // HLS manifests can go by many mime-types
  var canPlay = [
  // Apple santioned
  'application/vnd.apple.mpegurl',
  // Apple sanctioned for backwards compatibility
  'audio/mpegurl',
  // Very common
  'audio/x-mpegurl',
  // Very common
  'application/x-mpegurl',
  // Included for completeness
  'video/x-mpegurl', 'video/mpegurl', 'application/mpegurl'];

  return canPlay.some(function (canItPlay) {
    return (/maybe|probably/i.test(video.canPlayType(canItPlay))
    );
  });
})();

/**
 * HLS is a source handler, not a tech. Make sure attempts to use it
 * as one do not cause exceptions.
 */
Hls.isSupported = function () {
  return _videoJs2['default'].log.warn('HLS is no longer a tech. Please remove it from ' + 'your player\'s techOrder.');
};

var Component = _videoJs2['default'].getComponent('Component');

/**
 * The Hls Handler object, where we orchestrate all of the parts
 * of HLS to interact with video.js
 *
 * @class HlsHandler
 * @extends videojs.Component
 * @param {Object} source the soruce object
 * @param {Tech} tech the parent tech object
 * @param {Object} options optional and required options
 */

var HlsHandler = (function (_Component) {
  _inherits(HlsHandler, _Component);

  function HlsHandler(source, tech, options) {
    var _this = this;

    _classCallCheck(this, HlsHandler);

    _get(Object.getPrototypeOf(HlsHandler.prototype), 'constructor', this).call(this, tech, options.hls);

    // tech.player() is deprecated but setup a reference to HLS for
    // backwards-compatibility
    if (tech.options_ && tech.options_.playerId) {
      var _player = (0, _videoJs2['default'])(tech.options_.playerId);

      if (!_player.hasOwnProperty('hls')) {
        Object.defineProperty(_player, 'hls', {
          get: function get() {
            _videoJs2['default'].log.warn('player.hls is deprecated. Use player.tech_.hls instead.');
            tech.trigger({ type: 'usage', name: 'hls-player-access' });
            return _this;
          }
        });
      }
    }

    this.tech_ = tech;
    this.source_ = source;
    this.stats = {};
    this.ignoreNextSeekingEvent_ = false;
    this.setOptions_();

    // overriding native HLS only works if audio tracks have been emulated
    // error early if we're misconfigured:
    if (this.options_.overrideNative && (tech.featuresNativeVideoTracks || tech.featuresNativeAudioTracks)) {
      throw new Error('Overriding native HLS requires emulated tracks. ' + 'See https://git.io/vMpjB');
    }

    // listen for fullscreenchange events for this player so that we
    // can adjust our quality selection quickly
    this.on(_globalDocument2['default'], ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'], function (event) {
      var fullscreenElement = _globalDocument2['default'].fullscreenElement || _globalDocument2['default'].webkitFullscreenElement || _globalDocument2['default'].mozFullScreenElement || _globalDocument2['default'].msFullscreenElement;

      if (fullscreenElement && fullscreenElement.contains(_this.tech_.el())) {
        _this.masterPlaylistController_.fastQualityChange_();
      }
    });

    this.on(this.tech_, 'seeking', function () {
      if (this.ignoreNextSeekingEvent_) {
        this.ignoreNextSeekingEvent_ = false;
        return;
      }

      this.setCurrentTime(this.tech_.currentTime());
    });
    this.on(this.tech_, 'error', function () {
      if (this.masterPlaylistController_) {
        this.masterPlaylistController_.pauseLoading();
      }
    });

    this.on(this.tech_, 'play', this.play);
  }

  /**
   * The Source Handler object, which informs video.js what additional
   * MIME types are supported and sets up playback. It is registered
   * automatically to the appropriate tech based on the capabilities of
   * the browser it is running in. It is not necessary to use or modify
   * this object in normal usage.
   */

  _createClass(HlsHandler, [{
    key: 'setOptions_',
    value: function setOptions_() {
      var _this2 = this;

      // defaults
      this.options_.withCredentials = this.options_.withCredentials || false;

      if (typeof this.options_.blacklistDuration !== 'number') {
        this.options_.blacklistDuration = 5 * 60;
      }

      // start playlist selection at a reasonable bandwidth for
      // broadband internet (0.5 MB/s) or mobile (0.0625 MB/s)
      if (typeof this.options_.bandwidth !== 'number') {
        this.options_.bandwidth = INITIAL_BANDWIDTH;
      }

      // If the bandwidth number is unchanged from the initial setting
      // then this takes precedence over the enableLowInitialPlaylist option
      this.options_.enableLowInitialPlaylist = this.options_.enableLowInitialPlaylist && this.options_.bandwidth === INITIAL_BANDWIDTH;

      // grab options passed to player.src
      ['withCredentials', 'bandwidth', 'handleManifestRedirects'].forEach(function (option) {
        if (typeof _this2.source_[option] !== 'undefined') {
          _this2.options_[option] = _this2.source_[option];
        }
      });

      this.bandwidth = this.options_.bandwidth;
    }

    /**
     * called when player.src gets called, handle a new source
     *
     * @param {Object} src the source object to handle
     */
  }, {
    key: 'src',
    value: function src(_src) {
      var _this3 = this;

      // do nothing if the src is falsey
      if (!_src) {
        return;
      }
      this.setOptions_();
      // add master playlist controller options
      this.options_.url = this.source_.src;
      this.options_.tech = this.tech_;
      this.options_.externHls = Hls;

      this.masterPlaylistController_ = new _masterPlaylistController.MasterPlaylistController(this.options_);
      this.playbackWatcher_ = new _playbackWatcher2['default'](_videoJs2['default'].mergeOptions(this.options_, {
        seekable: function seekable() {
          return _this3.seekable();
        }
      }));

      this.masterPlaylistController_.on('error', function () {
        var player = _videoJs2['default'].players[_this3.tech_.options_.playerId];

        player.error(_this3.masterPlaylistController_.error);
      });

      // `this` in selectPlaylist should be the HlsHandler for backwards
      // compatibility with < v2
      this.masterPlaylistController_.selectPlaylist = this.selectPlaylist ? this.selectPlaylist.bind(this) : Hls.STANDARD_PLAYLIST_SELECTOR.bind(this);

      this.masterPlaylistController_.selectInitialPlaylist = Hls.INITIAL_PLAYLIST_SELECTOR.bind(this);

      // re-expose some internal objects for backwards compatibility with < v2
      this.playlists = this.masterPlaylistController_.masterPlaylistLoader_;
      this.mediaSource = this.masterPlaylistController_.mediaSource;

      // Proxy assignment of some properties to the master playlist
      // controller. Using a custom property for backwards compatibility
      // with < v2
      Object.defineProperties(this, {
        selectPlaylist: {
          get: function get() {
            return this.masterPlaylistController_.selectPlaylist;
          },
          set: function set(selectPlaylist) {
            this.masterPlaylistController_.selectPlaylist = selectPlaylist.bind(this);
          }
        },
        throughput: {
          get: function get() {
            return this.masterPlaylistController_.mainSegmentLoader_.throughput.rate;
          },
          set: function set(throughput) {
            this.masterPlaylistController_.mainSegmentLoader_.throughput.rate = throughput;
            // By setting `count` to 1 the throughput value becomes the starting value
            // for the cumulative average
            this.masterPlaylistController_.mainSegmentLoader_.throughput.count = 1;
          }
        },
        bandwidth: {
          get: function get() {
            return this.masterPlaylistController_.mainSegmentLoader_.bandwidth;
          },
          set: function set(bandwidth) {
            this.masterPlaylistController_.mainSegmentLoader_.bandwidth = bandwidth;
            // setting the bandwidth manually resets the throughput counter
            // `count` is set to zero that current value of `rate` isn't included
            // in the cumulative average
            this.masterPlaylistController_.mainSegmentLoader_.throughput = {
              rate: 0,
              count: 0
            };
          }
        },
        /**
         * `systemBandwidth` is a combination of two serial processes bit-rates. The first
         * is the network bitrate provided by `bandwidth` and the second is the bitrate of
         * the entire process after that - decryption, transmuxing, and appending - provided
         * by `throughput`.
         *
         * Since the two process are serial, the overall system bandwidth is given by:
         *   sysBandwidth = 1 / (1 / bandwidth + 1 / throughput)
         */
        systemBandwidth: {
          get: function get() {
            var invBandwidth = 1 / (this.bandwidth || 1);
            var invThroughput = undefined;

            if (this.throughput > 0) {
              invThroughput = 1 / this.throughput;
            } else {
              invThroughput = 0;
            }

            var systemBitrate = Math.floor(1 / (invBandwidth + invThroughput));

            return systemBitrate;
          },
          set: function set() {
            _videoJs2['default'].log.error('The "systemBandwidth" property is read-only');
          }
        }
      });

      Object.defineProperties(this.stats, {
        bandwidth: {
          get: function get() {
            return _this3.bandwidth || 0;
          },
          enumerable: true
        },
        mediaRequests: {
          get: function get() {
            return _this3.masterPlaylistController_.mediaRequests_() || 0;
          },
          enumerable: true
        },
        mediaRequestsAborted: {
          get: function get() {
            return _this3.masterPlaylistController_.mediaRequestsAborted_() || 0;
          },
          enumerable: true
        },
        mediaRequestsTimedout: {
          get: function get() {
            return _this3.masterPlaylistController_.mediaRequestsTimedout_() || 0;
          },
          enumerable: true
        },
        mediaRequestsErrored: {
          get: function get() {
            return _this3.masterPlaylistController_.mediaRequestsErrored_() || 0;
          },
          enumerable: true
        },
        mediaTransferDuration: {
          get: function get() {
            return _this3.masterPlaylistController_.mediaTransferDuration_() || 0;
          },
          enumerable: true
        },
        mediaBytesTransferred: {
          get: function get() {
            return _this3.masterPlaylistController_.mediaBytesTransferred_() || 0;
          },
          enumerable: true
        },
        mediaSecondsLoaded: {
          get: function get() {
            return _this3.masterPlaylistController_.mediaSecondsLoaded_() || 0;
          },
          enumerable: true
        }
      });

      this.tech_.one('canplay', this.masterPlaylistController_.setupFirstPlay.bind(this.masterPlaylistController_));

      this.masterPlaylistController_.on('selectedinitialmedia', function () {
        // Add the manual rendition mix-in to HlsHandler
        (0, _renditionMixin2['default'])(_this3);
      });

      // the bandwidth of the primary segment loader is our best
      // estimate of overall bandwidth
      this.on(this.masterPlaylistController_, 'progress', function () {
        this.tech_.trigger('progress');
      });

      // In the live case, we need to ignore the very first `seeking` event since
      // that will be the result of the seek-to-live behavior
      this.on(this.masterPlaylistController_, 'firstplay', function () {
        this.ignoreNextSeekingEvent_ = true;
      });

      this.tech_.ready(function () {
        return _this3.setupQualityLevels_();
      });

      // do nothing if the tech has been disposed already
      // this can occur if someone sets the src in player.ready(), for instance
      if (!this.tech_.el()) {
        return;
      }

      this.tech_.src(_videoJs2['default'].URL.createObjectURL(this.masterPlaylistController_.mediaSource));
    }

    /**
     * Initializes the quality levels and sets listeners to update them.
     *
     * @method setupQualityLevels_
     * @private
     */
  }, {
    key: 'setupQualityLevels_',
    value: function setupQualityLevels_() {
      var _this4 = this;

      var player = _videoJs2['default'].players[this.tech_.options_.playerId];

      if (player && player.qualityLevels) {
        this.qualityLevels_ = player.qualityLevels();

        this.masterPlaylistController_.on('selectedinitialmedia', function () {
          handleHlsLoadedMetadata(_this4.qualityLevels_, _this4);
        });

        this.playlists.on('mediachange', function () {
          handleHlsMediaChange(_this4.qualityLevels_, _this4.playlists);
        });
      }
    }

    /**
     * Begin playing the video.
     */
  }, {
    key: 'play',
    value: function play() {
      this.masterPlaylistController_.play();
    }

    /**
     * a wrapper around the function in MasterPlaylistController
     */
  }, {
    key: 'setCurrentTime',
    value: function setCurrentTime(currentTime) {
      this.masterPlaylistController_.setCurrentTime(currentTime);
    }

    /**
     * a wrapper around the function in MasterPlaylistController
     */
  }, {
    key: 'duration',
    value: function duration() {
      return this.masterPlaylistController_.duration();
    }

    /**
     * a wrapper around the function in MasterPlaylistController
     */
  }, {
    key: 'seekable',
    value: function seekable() {
      return this.masterPlaylistController_.seekable();
    }

    /**
    * Abort all outstanding work and cleanup.
    */
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this.playbackWatcher_) {
        this.playbackWatcher_.dispose();
      }
      if (this.masterPlaylistController_) {
        this.masterPlaylistController_.dispose();
      }
      if (this.qualityLevels_) {
        this.qualityLevels_.dispose();
      }
      _get(Object.getPrototypeOf(HlsHandler.prototype), 'dispose', this).call(this);
    }
  }]);

  return HlsHandler;
})(Component);

var HlsSourceHandler = function HlsSourceHandler(mode) {
  return {
    canHandleSource: function canHandleSource(srcObj) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var localOptions = _videoJs2['default'].mergeOptions(_videoJs2['default'].options, options);

      // this forces video.js to skip this tech/mode if its not the one we have been
      // overriden to use, by returing that we cannot handle the source.
      if (localOptions.hls && localOptions.hls.mode && localOptions.hls.mode !== mode) {
        return false;
      }
      return HlsSourceHandler.canPlayType(srcObj.type, localOptions);
    },
    handleSource: function handleSource(source, tech) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var localOptions = _videoJs2['default'].mergeOptions(_videoJs2['default'].options, options, { hls: { mode: mode } });

      if (mode === 'flash') {
        // We need to trigger this asynchronously to give others the chance
        // to bind to the event when a source is set at player creation
        tech.setTimeout(function () {
          tech.trigger('loadstart');
        }, 1);
      }

      tech.hls = new HlsHandler(source, tech, localOptions);
      tech.hls.xhr = (0, _xhr2['default'])();

      tech.hls.src(source.src);
      return tech.hls;
    },
    canPlayType: function canPlayType(type) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var localOptions = _videoJs2['default'].mergeOptions(_videoJs2['default'].options, options);

      if (HlsSourceHandler.canPlayType(type, localOptions)) {
        return 'maybe';
      }
      return '';
    }
  };
};

HlsSourceHandler.canPlayType = function (type, options) {
  // No support for IE 10 or below
  if (_videoJs2['default'].browser.IE_VERSION && _videoJs2['default'].browser.IE_VERSION <= 10) {
    return false;
  }

  var mpegurlRE = /^(audio|video|application)\/(x-|vnd\.apple\.)?mpegurl/i;

  // favor native HLS support if it's available
  if (!options.hls.overrideNative && Hls.supportsNativeHls) {
    return false;
  }
  return mpegurlRE.test(type);
};

if (typeof _videoJs2['default'].MediaSource === 'undefined' || typeof _videoJs2['default'].URL === 'undefined') {
  _videoJs2['default'].MediaSource = _videojsContribMediaSources.MediaSource;
  _videoJs2['default'].URL = _videojsContribMediaSources.URL;
}

var flashTech = _videoJs2['default'].getTech('Flash');

// register source handlers with the appropriate techs
if (_videojsContribMediaSources.MediaSource.supportsNativeMediaSources()) {
  _videoJs2['default'].getTech('Html5').registerSourceHandler(HlsSourceHandler('html5'), 0);
}
if (_globalWindow2['default'].Uint8Array && flashTech) {
  flashTech.registerSourceHandler(HlsSourceHandler('flash'));
}

_videoJs2['default'].HlsHandler = HlsHandler;
_videoJs2['default'].HlsSourceHandler = HlsSourceHandler;
_videoJs2['default'].Hls = Hls;
if (!_videoJs2['default'].use) {
  _videoJs2['default'].registerComponent('Hls', Hls);
}
_videoJs2['default'].m3u8 = _m3u8Parser2['default'];
_videoJs2['default'].options.hls = _videoJs2['default'].options.hls || {};

if (_videoJs2['default'].registerPlugin) {
  _videoJs2['default'].registerPlugin('reloadSourceOnError', _reloadSourceOnError2['default']);
} else {
  _videoJs2['default'].plugin('reloadSourceOnError', _reloadSourceOnError2['default']);
}

module.exports = {
  Hls: Hls,
  HlsHandler: HlsHandler,
  HlsSourceHandler: HlsSourceHandler
};