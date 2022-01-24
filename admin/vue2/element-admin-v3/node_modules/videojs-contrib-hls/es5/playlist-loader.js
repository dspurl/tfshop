/**
 * @module playlist-loader
 *
 * @file A state machine that manages the loading, caching, and updating of
 * M3U8 playlists.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _resolveUrl = require('./resolve-url');

var _resolveUrl2 = _interopRequireDefault(_resolveUrl);

var _videoJs = require('video.js');

var _m3u8Parser = require('m3u8-parser');

var _m3u8Parser2 = _interopRequireDefault(_m3u8Parser);

var _globalWindow = require('global/window');

var _globalWindow2 = _interopRequireDefault(_globalWindow);

/**
 * Returns a new array of segments that is the result of merging
 * properties from an older list of segments onto an updated
 * list. No properties on the updated playlist will be overridden.
 *
 * @param {Array} original the outdated list of segments
 * @param {Array} update the updated list of segments
 * @param {Number=} offset the index of the first update
 * segment in the original segment list. For non-live playlists,
 * this should always be zero and does not need to be
 * specified. For live playlists, it should be the difference
 * between the media sequence numbers in the original and updated
 * playlists.
 * @return a list of merged segment objects
 */
var updateSegments = function updateSegments(original, update, offset) {
  var result = update.slice();

  offset = offset || 0;
  var length = Math.min(original.length, update.length + offset);

  for (var i = offset; i < length; i++) {
    result[i - offset] = (0, _videoJs.mergeOptions)(original[i], result[i - offset]);
  }
  return result;
};

exports.updateSegments = updateSegments;
var resolveSegmentUris = function resolveSegmentUris(segment, baseUri) {
  if (!segment.resolvedUri) {
    segment.resolvedUri = (0, _resolveUrl2['default'])(baseUri, segment.uri);
  }
  if (segment.key && !segment.key.resolvedUri) {
    segment.key.resolvedUri = (0, _resolveUrl2['default'])(baseUri, segment.key.uri);
  }
  if (segment.map && !segment.map.resolvedUri) {
    segment.map.resolvedUri = (0, _resolveUrl2['default'])(baseUri, segment.map.uri);
  }
};

exports.resolveSegmentUris = resolveSegmentUris;
/**
  * Returns a new master playlist that is the result of merging an
  * updated media playlist into the original version. If the
  * updated media playlist does not match any of the playlist
  * entries in the original master playlist, null is returned.
  *
  * @param {Object} master a parsed master M3U8 object
  * @param {Object} media a parsed media M3U8 object
  * @return {Object} a new object that represents the original
  * master playlist with the updated media playlist merged in, or
  * null if the merge produced no change.
  */
var updateMaster = function updateMaster(master, media) {
  var result = (0, _videoJs.mergeOptions)(master, {});
  var playlist = result.playlists.filter(function (p) {
    return p.uri === media.uri;
  })[0];

  if (!playlist) {
    return null;
  }

  // consider the playlist unchanged if the number of segments is equal and the media
  // sequence number is unchanged
  if (playlist.segments && media.segments && playlist.segments.length === media.segments.length && playlist.mediaSequence === media.mediaSequence) {
    return null;
  }

  var mergedPlaylist = (0, _videoJs.mergeOptions)(playlist, media);

  // if the update could overlap existing segment information, merge the two segment lists
  if (playlist.segments) {
    mergedPlaylist.segments = updateSegments(playlist.segments, media.segments, media.mediaSequence - playlist.mediaSequence);
  }

  // resolve any segment URIs to prevent us from having to do it later
  mergedPlaylist.segments.forEach(function (segment) {
    resolveSegmentUris(segment, mergedPlaylist.resolvedUri);
  });

  // TODO Right now in the playlists array there are two references to each playlist, one
  // that is referenced by index, and one by URI. The index reference may no longer be
  // necessary.
  for (var i = 0; i < result.playlists.length; i++) {
    if (result.playlists[i].uri === media.uri) {
      result.playlists[i] = mergedPlaylist;
    }
  }
  result.playlists[media.uri] = mergedPlaylist;

  return result;
};

exports.updateMaster = updateMaster;
var setupMediaPlaylists = function setupMediaPlaylists(master) {
  // setup by-URI lookups and resolve media playlist URIs
  var i = master.playlists.length;

  while (i--) {
    var playlist = master.playlists[i];

    master.playlists[playlist.uri] = playlist;
    playlist.resolvedUri = (0, _resolveUrl2['default'])(master.uri, playlist.uri);

    if (!playlist.attributes) {
      // Although the spec states an #EXT-X-STREAM-INF tag MUST have a
      // BANDWIDTH attribute, we can play the stream without it. This means a poorly
      // formatted master playlist may not have an attribute list. An attributes
      // property is added here to prevent undefined references when we encounter
      // this scenario.
      playlist.attributes = {};

      _videoJs.log.warn('Invalid playlist STREAM-INF detected. Missing BANDWIDTH attribute.');
    }
  }
};

exports.setupMediaPlaylists = setupMediaPlaylists;
var resolveMediaGroupUris = function resolveMediaGroupUris(master) {
  ['AUDIO', 'SUBTITLES'].forEach(function (mediaType) {
    for (var groupKey in master.mediaGroups[mediaType]) {
      for (var labelKey in master.mediaGroups[mediaType][groupKey]) {
        var mediaProperties = master.mediaGroups[mediaType][groupKey][labelKey];

        if (mediaProperties.uri) {
          mediaProperties.resolvedUri = (0, _resolveUrl2['default'])(master.uri, mediaProperties.uri);
        }
      }
    }
  });
};

exports.resolveMediaGroupUris = resolveMediaGroupUris;
/**
 * Calculates the time to wait before refreshing a live playlist
 *
 * @param {Object} media
 *        The current media
 * @param {Boolean} update
 *        True if there were any updates from the last refresh, false otherwise
 * @return {Number}
 *         The time in ms to wait before refreshing the live playlist
 */
var refreshDelay = function refreshDelay(media, update) {
  var lastSegment = media.segments[media.segments.length - 1];
  var delay = undefined;

  if (update && lastSegment && lastSegment.duration) {
    delay = lastSegment.duration * 1000;
  } else {
    // if the playlist is unchanged since the last reload or last segment duration
    // cannot be determined, try again after half the target duration
    delay = (media.targetDuration || 10) * 500;
  }
  return delay;
};

exports.refreshDelay = refreshDelay;
/**
 * Load a playlist from a remote location
 *
 * @class PlaylistLoader
 * @extends videojs.EventTarget
 * @param {String} srcUrl the url to start with
 * @param {Object} hls
 * @param {Object} [options]
 * @param {Boolean} [options.withCredentials=false] the withCredentials xhr option
 * @param {Boolean} [options.handleManifestRedirects=false] whether to follow redirects, when any
 *        playlist request was redirected
 */

var PlaylistLoader = (function (_EventTarget) {
  _inherits(PlaylistLoader, _EventTarget);

  function PlaylistLoader(srcUrl, hls, options) {
    var _this = this;

    _classCallCheck(this, PlaylistLoader);

    _get(Object.getPrototypeOf(PlaylistLoader.prototype), 'constructor', this).call(this);

    options = options || {};

    this.srcUrl = srcUrl;
    this.hls_ = hls;
    this.withCredentials = !!options.withCredentials;
    this.handleManifestRedirects = !!options.handleManifestRedirects;

    if (!this.srcUrl) {
      throw new Error('A non-empty playlist URL is required');
    }

    // initialize the loader state
    this.state = 'HAVE_NOTHING';

    // live playlist staleness timeout
    this.on('mediaupdatetimeout', function () {
      if (_this.state !== 'HAVE_METADATA') {
        // only refresh the media playlist if no other activity is going on
        return;
      }

      _this.state = 'HAVE_CURRENT_METADATA';

      _this.request = _this.hls_.xhr({
        uri: (0, _resolveUrl2['default'])(_this.master.uri, _this.media().uri),
        withCredentials: _this.withCredentials
      }, function (error, req) {
        // disposed
        if (!_this.request) {
          return;
        }

        if (error) {
          return _this.playlistRequestError(_this.request, _this.media().uri, 'HAVE_METADATA');
        }

        _this.haveMetadata(_this.request, _this.media().uri);
      });
    });
  }

  _createClass(PlaylistLoader, [{
    key: 'playlistRequestError',
    value: function playlistRequestError(xhr, url, startingState) {
      // any in-flight request is now finished
      this.request = null;

      if (startingState) {
        this.state = startingState;
      }

      this.error = {
        playlist: this.master.playlists[url],
        status: xhr.status,
        message: 'HLS playlist request error at URL: ' + url,
        responseText: xhr.responseText,
        code: xhr.status >= 500 ? 4 : 2
      };

      this.trigger('error');
    }

    // update the playlist loader's state in response to a new or
    // updated playlist.
  }, {
    key: 'haveMetadata',
    value: function haveMetadata(xhr, url) {
      var _this2 = this;

      // any in-flight request is now finished
      this.request = null;
      this.state = 'HAVE_METADATA';

      var parser = new _m3u8Parser2['default'].Parser();

      parser.push(xhr.responseText);
      parser.end();
      parser.manifest.uri = url;
      // m3u8-parser does not attach an attributes property to media playlists so make
      // sure that the property is attached to avoid undefined reference errors
      parser.manifest.attributes = parser.manifest.attributes || {};

      // merge this playlist into the master
      var update = updateMaster(this.master, parser.manifest);

      this.targetDuration = parser.manifest.targetDuration;

      if (update) {
        this.master = update;
        this.media_ = this.master.playlists[parser.manifest.uri];
      } else {
        this.trigger('playlistunchanged');
      }

      // refresh live playlists after a target duration passes
      if (!this.media().endList) {
        _globalWindow2['default'].clearTimeout(this.mediaUpdateTimeout);
        this.mediaUpdateTimeout = _globalWindow2['default'].setTimeout(function () {
          _this2.trigger('mediaupdatetimeout');
        }, refreshDelay(this.media(), !!update));
      }

      this.trigger('loadedplaylist');
    }

    /**
     * Abort any outstanding work and clean up.
     */
  }, {
    key: 'dispose',
    value: function dispose() {
      this.stopRequest();
      _globalWindow2['default'].clearTimeout(this.mediaUpdateTimeout);
    }
  }, {
    key: 'stopRequest',
    value: function stopRequest() {
      if (this.request) {
        var oldRequest = this.request;

        this.request = null;
        oldRequest.onreadystatechange = null;
        oldRequest.abort();
      }
    }

    /**
     * When called without any arguments, returns the currently
     * active media playlist. When called with a single argument,
     * triggers the playlist loader to asynchronously switch to the
     * specified media playlist. Calling this method while the
     * loader is in the HAVE_NOTHING causes an error to be emitted
     * but otherwise has no effect.
     *
     * @param {Object=} playlist the parsed media playlist
     * object to switch to
     * @return {Playlist} the current loaded media
     */
  }, {
    key: 'media',
    value: function media(playlist) {
      var _this3 = this;

      // getter
      if (!playlist) {
        return this.media_;
      }

      // setter
      if (this.state === 'HAVE_NOTHING') {
        throw new Error('Cannot switch media playlist from ' + this.state);
      }

      var startingState = this.state;

      // find the playlist object if the target playlist has been
      // specified by URI
      if (typeof playlist === 'string') {
        if (!this.master.playlists[playlist]) {
          throw new Error('Unknown playlist URI: ' + playlist);
        }
        playlist = this.master.playlists[playlist];
      }

      var mediaChange = !this.media_ || playlist.uri !== this.media_.uri;

      // switch to fully loaded playlists immediately
      if (this.master.playlists[playlist.uri].endList) {
        // abort outstanding playlist requests
        if (this.request) {
          this.request.onreadystatechange = null;
          this.request.abort();
          this.request = null;
        }
        this.state = 'HAVE_METADATA';
        this.media_ = playlist;

        // trigger media change if the active media has been updated
        if (mediaChange) {
          this.trigger('mediachanging');
          this.trigger('mediachange');
        }
        return;
      }

      // switching to the active playlist is a no-op
      if (!mediaChange) {
        return;
      }

      this.state = 'SWITCHING_MEDIA';

      // there is already an outstanding playlist request
      if (this.request) {
        if (playlist.resolvedUri === this.request.url) {
          // requesting to switch to the same playlist multiple times
          // has no effect after the first
          return;
        }
        this.request.onreadystatechange = null;
        this.request.abort();
        this.request = null;
      }

      // request the new playlist
      if (this.media_) {
        this.trigger('mediachanging');
      }

      this.request = this.hls_.xhr({
        uri: playlist.resolvedUri,
        withCredentials: this.withCredentials
      }, function (error, req) {
        // disposed
        if (!_this3.request) {
          return;
        }

        playlist.resolvedUri = _this3.resolveManifestRedirect(playlist.resolvedUri, req);

        if (error) {
          return _this3.playlistRequestError(_this3.request, playlist.uri, startingState);
        }

        _this3.haveMetadata(req, playlist.uri);

        // fire loadedmetadata the first time a media playlist is loaded
        if (startingState === 'HAVE_MASTER') {
          _this3.trigger('loadedmetadata');
        } else {
          _this3.trigger('mediachange');
        }
      });
    }

    /**
     * Checks whether xhr request was redirected and returns correct url depending
     * on `handleManifestRedirects` option
     *
     * @api private
     *
     * @param  {String} url - an url being requested
     * @param  {XMLHttpRequest} req - xhr request result
     *
     * @return {String}
     */
  }, {
    key: 'resolveManifestRedirect',
    value: function resolveManifestRedirect(url, req) {
      if (this.handleManifestRedirects && req.responseURL && url !== req.responseURL) {
        return req.responseURL;
      }

      return url;
    }

    /**
     * pause loading of the playlist
     */
  }, {
    key: 'pause',
    value: function pause() {
      this.stopRequest();
      _globalWindow2['default'].clearTimeout(this.mediaUpdateTimeout);
      if (this.state === 'HAVE_NOTHING') {
        // If we pause the loader before any data has been retrieved, its as if we never
        // started, so reset to an unstarted state.
        this.started = false;
      }
      // Need to restore state now that no activity is happening
      if (this.state === 'SWITCHING_MEDIA') {
        // if the loader was in the process of switching media, it should either return to
        // HAVE_MASTER or HAVE_METADATA depending on if the loader has loaded a media
        // playlist yet. This is determined by the existence of loader.media_
        if (this.media_) {
          this.state = 'HAVE_METADATA';
        } else {
          this.state = 'HAVE_MASTER';
        }
      } else if (this.state === 'HAVE_CURRENT_METADATA') {
        this.state = 'HAVE_METADATA';
      }
    }

    /**
     * start loading of the playlist
     */
  }, {
    key: 'load',
    value: function load(isFinalRendition) {
      var _this4 = this;

      _globalWindow2['default'].clearTimeout(this.mediaUpdateTimeout);

      var media = this.media();

      if (isFinalRendition) {
        var delay = media ? media.targetDuration / 2 * 1000 : 5 * 1000;

        this.mediaUpdateTimeout = _globalWindow2['default'].setTimeout(function () {
          return _this4.load();
        }, delay);
        return;
      }

      if (!this.started) {
        this.start();
        return;
      }

      if (media && !media.endList) {
        this.trigger('mediaupdatetimeout');
      } else {
        this.trigger('loadedplaylist');
      }
    }

    /**
     * start loading of the playlist
     */
  }, {
    key: 'start',
    value: function start() {
      var _this5 = this;

      this.started = true;

      // request the specified URL
      this.request = this.hls_.xhr({
        uri: this.srcUrl,
        withCredentials: this.withCredentials
      }, function (error, req) {
        // disposed
        if (!_this5.request) {
          return;
        }

        // clear the loader's request reference
        _this5.request = null;

        if (error) {
          _this5.error = {
            status: req.status,
            message: 'HLS playlist request error at URL: ' + _this5.srcUrl,
            responseText: req.responseText,
            // MEDIA_ERR_NETWORK
            code: 2
          };
          if (_this5.state === 'HAVE_NOTHING') {
            _this5.started = false;
          }
          return _this5.trigger('error');
        }

        var parser = new _m3u8Parser2['default'].Parser();

        parser.push(req.responseText);
        parser.end();

        _this5.state = 'HAVE_MASTER';

        _this5.srcUrl = _this5.resolveManifestRedirect(_this5.srcUrl, req);

        parser.manifest.uri = _this5.srcUrl;

        // loaded a master playlist
        if (parser.manifest.playlists) {
          _this5.master = parser.manifest;

          setupMediaPlaylists(_this5.master);
          resolveMediaGroupUris(_this5.master);

          _this5.trigger('loadedplaylist');
          if (!_this5.request) {
            // no media playlist was specifically selected so start
            // from the first listed one
            _this5.media(parser.manifest.playlists[0]);
          }
          return;
        }

        // loaded a media playlist
        // infer a master playlist if none was previously requested
        _this5.master = {
          mediaGroups: {
            'AUDIO': {},
            'VIDEO': {},
            'CLOSED-CAPTIONS': {},
            'SUBTITLES': {}
          },
          uri: _globalWindow2['default'].location.href,
          playlists: [{
            uri: _this5.srcUrl,
            resolvedUri: _this5.srcUrl,
            // m3u8-parser does not attach an attributes property to media playlists so make
            // sure that the property is attached to avoid undefined reference errors
            attributes: {}
          }]
        };
        _this5.master.playlists[_this5.srcUrl] = _this5.master.playlists[0];
        _this5.haveMetadata(req, _this5.srcUrl);
        return _this5.trigger('loadedmetadata');
      });
    }
  }]);

  return PlaylistLoader;
})(_videoJs.EventTarget);

exports['default'] = PlaylistLoader;