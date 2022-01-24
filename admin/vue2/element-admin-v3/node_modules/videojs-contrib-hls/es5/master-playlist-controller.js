/**
 * @file master-playlist-controller.js
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

var _playlistLoader = require('./playlist-loader');

var _playlistLoader2 = _interopRequireDefault(_playlistLoader);

var _playlistJs = require('./playlist.js');

var _segmentLoader = require('./segment-loader');

var _segmentLoader2 = _interopRequireDefault(_segmentLoader);

var _vttSegmentLoader = require('./vtt-segment-loader');

var _vttSegmentLoader2 = _interopRequireDefault(_vttSegmentLoader);

var _ranges = require('./ranges');

var _ranges2 = _interopRequireDefault(_ranges);

var _videoJs = require('video.js');

var _videoJs2 = _interopRequireDefault(_videoJs);

var _adCueTags = require('./ad-cue-tags');

var _adCueTags2 = _interopRequireDefault(_adCueTags);

var _syncController = require('./sync-controller');

var _syncController2 = _interopRequireDefault(_syncController);

var _videojsContribMediaSourcesEs5CodecUtils = require('videojs-contrib-media-sources/es5/codec-utils');

var _webwackify = require('webwackify');

var _webwackify2 = _interopRequireDefault(_webwackify);

var _decrypterWorker = require('./decrypter-worker');

var _decrypterWorker2 = _interopRequireDefault(_decrypterWorker);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _utilCodecsJs = require('./util/codecs.js');

var _mediaGroups = require('./media-groups');

var ABORT_EARLY_BLACKLIST_SECONDS = 60 * 2;

var Hls = undefined;

// Default codec parameters if none were provided for video and/or audio
var defaultCodecs = {
  videoCodec: 'avc1',
  videoObjectTypeIndicator: '.4d400d',
  // AAC-LC
  audioProfile: '2'
};

// SegmentLoader stats that need to have each loader's
// values summed to calculate the final value
var loaderStats = ['mediaRequests', 'mediaRequestsAborted', 'mediaRequestsTimedout', 'mediaRequestsErrored', 'mediaTransferDuration', 'mediaBytesTransferred'];
var sumLoaderStat = function sumLoaderStat(stat) {
  return this.audioSegmentLoader_[stat] + this.mainSegmentLoader_[stat];
};

var resolveDecrypterWorker = function resolveDecrypterWorker() {
  var result = undefined;

  try {
    result = require.resolve('./decrypter-worker');
  } catch (e) {
    // no result
  }

  return result;
};

/**
 * Replace codecs in the codec string with the old apple-style `avc1.<dd>.<dd>` to the
 * standard `avc1.<hhhhhh>`.
 *
 * @param codecString {String} the codec string
 * @return {String} the codec string with old apple-style codecs replaced
 *
 * @private
 */
var mapLegacyAvcCodecs_ = function mapLegacyAvcCodecs_(codecString) {
  return codecString.replace(/avc1\.(\d+)\.(\d+)/i, function (match) {
    return (0, _videojsContribMediaSourcesEs5CodecUtils.translateLegacyCodecs)([match])[0];
  });
};

exports.mapLegacyAvcCodecs_ = mapLegacyAvcCodecs_;
/**
 * Build a media mime-type string from a set of parameters
 * @param {String} type either 'audio' or 'video'
 * @param {String} container either 'mp2t' or 'mp4'
 * @param {Array} codecs an array of codec strings to add
 * @return {String} a valid media mime-type
 */
var makeMimeTypeString = function makeMimeTypeString(type, container, codecs) {
  // The codecs array is filtered so that falsey values are
  // dropped and don't cause Array#join to create spurious
  // commas
  return type + '/' + container + '; codecs="' + codecs.filter(function (c) {
    return !!c;
  }).join(', ') + '"';
};

/**
 * Returns the type container based on information in the playlist
 * @param {Playlist} media the current media playlist
 * @return {String} a valid media container type
 */
var getContainerType = function getContainerType(media) {
  // An initialization segment means the media playlist is an iframe
  // playlist or is using the mp4 container. We don't currently
  // support iframe playlists, so assume this is signalling mp4
  // fragments.
  if (media.segments && media.segments.length && media.segments[0].map) {
    return 'mp4';
  }
  return 'mp2t';
};

/**
 * Returns a set of codec strings parsed from the playlist or the default
 * codec strings if no codecs were specified in the playlist
 * @param {Playlist} media the current media playlist
 * @return {Object} an object with the video and audio codecs
 */
var getCodecs = function getCodecs(media) {
  // if the codecs were explicitly specified, use them instead of the
  // defaults
  var mediaAttributes = media.attributes || {};

  if (mediaAttributes.CODECS) {
    return (0, _utilCodecsJs.parseCodecs)(mediaAttributes.CODECS);
  }
  return defaultCodecs;
};

/**
 * Calculates the MIME type strings for a working configuration of
 * SourceBuffers to play variant streams in a master playlist. If
 * there is no possible working configuration, an empty array will be
 * returned.
 *
 * @param master {Object} the m3u8 object for the master playlist
 * @param media {Object} the m3u8 object for the variant playlist
 * @return {Array} the MIME type strings. If the array has more than
 * one entry, the first element should be applied to the video
 * SourceBuffer and the second to the audio SourceBuffer.
 *
 * @private
 */
var mimeTypesForPlaylist_ = function mimeTypesForPlaylist_(master, media) {
  var containerType = getContainerType(media);
  var codecInfo = getCodecs(media);
  var mediaAttributes = media.attributes || {};
  // Default condition for a traditional HLS (no demuxed audio/video)
  var isMuxed = true;
  var isMaat = false;

  if (!media) {
    // Not enough information
    return [];
  }

  if (master.mediaGroups.AUDIO && mediaAttributes.AUDIO) {
    var audioGroup = master.mediaGroups.AUDIO[mediaAttributes.AUDIO];

    // Handle the case where we are in a multiple-audio track scenario
    if (audioGroup) {
      isMaat = true;
      // Start with the everything demuxed then...
      isMuxed = false;
      // ...check to see if any audio group tracks are muxed (ie. lacking a uri)
      for (var groupId in audioGroup) {
        if (!audioGroup[groupId].uri) {
          isMuxed = true;
          break;
        }
      }
    }
  }

  // HLS with multiple-audio tracks must always get an audio codec.
  // Put another way, there is no way to have a video-only multiple-audio HLS!
  if (isMaat && !codecInfo.audioProfile) {
    _videoJs2['default'].log.warn('Multiple audio tracks present but no audio codec string is specified. ' + 'Attempting to use the default audio codec (mp4a.40.2)');
    codecInfo.audioProfile = defaultCodecs.audioProfile;
  }

  // Generate the final codec strings from the codec object generated above
  var codecStrings = {};

  if (codecInfo.videoCodec) {
    codecStrings.video = '' + codecInfo.videoCodec + codecInfo.videoObjectTypeIndicator;
  }

  if (codecInfo.audioProfile) {
    codecStrings.audio = 'mp4a.40.' + codecInfo.audioProfile;
  }

  // Finally, make and return an array with proper mime-types depending on
  // the configuration
  var justAudio = makeMimeTypeString('audio', containerType, [codecStrings.audio]);
  var justVideo = makeMimeTypeString('video', containerType, [codecStrings.video]);
  var bothVideoAudio = makeMimeTypeString('video', containerType, [codecStrings.video, codecStrings.audio]);

  if (isMaat) {
    if (!isMuxed && codecStrings.video) {
      return [justVideo, justAudio];
    }
    // There exists the possiblity that this will return a `video/container`
    // mime-type for the first entry in the array even when there is only audio.
    // This doesn't appear to be a problem and simplifies the code.
    return [bothVideoAudio, justAudio];
  }

  // If there is ano video codec at all, always just return a single
  // audio/<container> mime-type
  if (!codecStrings.video) {
    return [justAudio];
  }

  // When not using separate audio media groups, audio and video is
  // *always* muxed
  return [bothVideoAudio];
};

exports.mimeTypesForPlaylist_ = mimeTypesForPlaylist_;
/**
 * the master playlist controller controls all interactons
 * between playlists and segmentloaders. At this time this mainly
 * involves a master playlist and a series of audio playlists
 * if they are available
 *
 * @class MasterPlaylistController
 * @extends videojs.EventTarget
 */

var MasterPlaylistController = (function (_videojs$EventTarget) {
  _inherits(MasterPlaylistController, _videojs$EventTarget);

  function MasterPlaylistController(options) {
    var _this = this;

    _classCallCheck(this, MasterPlaylistController);

    _get(Object.getPrototypeOf(MasterPlaylistController.prototype), 'constructor', this).call(this);

    var url = options.url;
    var handleManifestRedirects = options.handleManifestRedirects;
    var withCredentials = options.withCredentials;
    var mode = options.mode;
    var tech = options.tech;
    var bandwidth = options.bandwidth;
    var externHls = options.externHls;
    var useCueTags = options.useCueTags;
    var blacklistDuration = options.blacklistDuration;
    var enableLowInitialPlaylist = options.enableLowInitialPlaylist;

    if (!url) {
      throw new Error('A non-empty playlist URL is required');
    }

    Hls = externHls;

    this.tech_ = tech;
    this.hls_ = tech.hls;
    this.mode_ = mode;
    this.useCueTags_ = useCueTags;
    this.blacklistDuration = blacklistDuration;
    this.enableLowInitialPlaylist = enableLowInitialPlaylist;

    if (this.useCueTags_) {
      this.cueTagsTrack_ = this.tech_.addTextTrack('metadata', 'ad-cues');
      this.cueTagsTrack_.inBandMetadataTrackDispatchType = '';
    }

    this.requestOptions_ = {
      withCredentials: withCredentials,
      handleManifestRedirects: handleManifestRedirects,
      timeout: null
    };

    this.mediaTypes_ = (0, _mediaGroups.createMediaTypes)();

    this.mediaSource = new _videoJs2['default'].MediaSource({ mode: mode });

    // load the media source into the player
    this.mediaSource.addEventListener('sourceopen', this.handleSourceOpen_.bind(this));

    this.seekable_ = _videoJs2['default'].createTimeRanges();
    this.hasPlayed_ = function () {
      return false;
    };

    this.syncController_ = new _syncController2['default'](options);
    this.segmentMetadataTrack_ = tech.addRemoteTextTrack({
      kind: 'metadata',
      label: 'segment-metadata'
    }, false).track;

    this.decrypter_ = (0, _webwackify2['default'])(_decrypterWorker2['default'], resolveDecrypterWorker());

    var segmentLoaderSettings = {
      hls: this.hls_,
      mediaSource: this.mediaSource,
      currentTime: this.tech_.currentTime.bind(this.tech_),
      seekable: function seekable() {
        return _this.seekable();
      },
      seeking: function seeking() {
        return _this.tech_.seeking();
      },
      duration: function duration() {
        return _this.mediaSource.duration;
      },
      hasPlayed: function hasPlayed() {
        return _this.hasPlayed_();
      },
      goalBufferLength: function goalBufferLength() {
        return _this.goalBufferLength();
      },
      bandwidth: bandwidth,
      syncController: this.syncController_,
      decrypter: this.decrypter_
    };

    // setup playlist loaders
    this.masterPlaylistLoader_ = new _playlistLoader2['default'](url, this.hls_, this.requestOptions_);
    this.setupMasterPlaylistLoaderListeners_();

    // setup segment loaders
    // combined audio/video or just video when alternate audio track is selected
    this.mainSegmentLoader_ = new _segmentLoader2['default'](_videoJs2['default'].mergeOptions(segmentLoaderSettings, {
      segmentMetadataTrack: this.segmentMetadataTrack_,
      loaderType: 'main'
    }), options);

    // alternate audio track
    this.audioSegmentLoader_ = new _segmentLoader2['default'](_videoJs2['default'].mergeOptions(segmentLoaderSettings, {
      loaderType: 'audio'
    }), options);

    this.subtitleSegmentLoader_ = new _vttSegmentLoader2['default'](_videoJs2['default'].mergeOptions(segmentLoaderSettings, {
      loaderType: 'vtt'
    }), options);

    this.setupSegmentLoaderListeners_();

    // Create SegmentLoader stat-getters
    loaderStats.forEach(function (stat) {
      _this[stat + '_'] = sumLoaderStat.bind(_this, stat);
    });

    this.masterPlaylistLoader_.load();
  }

  /**
   * Register event handlers on the master playlist loader. A helper
   * function for construction time.
   *
   * @private
   */

  _createClass(MasterPlaylistController, [{
    key: 'setupMasterPlaylistLoaderListeners_',
    value: function setupMasterPlaylistLoaderListeners_() {
      var _this2 = this;

      this.masterPlaylistLoader_.on('loadedmetadata', function () {
        var media = _this2.masterPlaylistLoader_.media();
        var requestTimeout = _this2.masterPlaylistLoader_.targetDuration * 1.5 * 1000;

        // If we don't have any more available playlists, we don't want to
        // timeout the request.
        if ((0, _playlistJs.isLowestEnabledRendition)(_this2.masterPlaylistLoader_.master, _this2.masterPlaylistLoader_.media())) {
          _this2.requestOptions_.timeout = 0;
        } else {
          _this2.requestOptions_.timeout = requestTimeout;
        }

        // if this isn't a live video and preload permits, start
        // downloading segments
        if (media.endList && _this2.tech_.preload() !== 'none') {
          _this2.mainSegmentLoader_.playlist(media, _this2.requestOptions_);
          _this2.mainSegmentLoader_.load();
        }

        (0, _mediaGroups.setupMediaGroups)({
          segmentLoaders: {
            AUDIO: _this2.audioSegmentLoader_,
            SUBTITLES: _this2.subtitleSegmentLoader_,
            main: _this2.mainSegmentLoader_
          },
          tech: _this2.tech_,
          requestOptions: _this2.requestOptions_,
          masterPlaylistLoader: _this2.masterPlaylistLoader_,
          mode: _this2.mode_,
          hls: _this2.hls_,
          master: _this2.master(),
          mediaTypes: _this2.mediaTypes_,
          blacklistCurrentPlaylist: _this2.blacklistCurrentPlaylist.bind(_this2)
        });

        _this2.triggerPresenceUsage_(_this2.master(), media);

        try {
          _this2.setupSourceBuffers_();
        } catch (e) {
          _videoJs2['default'].log.warn('Failed to create SourceBuffers', e);
          return _this2.mediaSource.endOfStream('decode');
        }
        _this2.setupFirstPlay();

        _this2.trigger('selectedinitialmedia');
      });

      this.masterPlaylistLoader_.on('loadedplaylist', function () {
        var updatedPlaylist = _this2.masterPlaylistLoader_.media();

        if (!updatedPlaylist) {
          var selectedMedia = undefined;

          if (_this2.enableLowInitialPlaylist) {
            selectedMedia = _this2.selectInitialPlaylist();
          }

          if (!selectedMedia) {
            selectedMedia = _this2.selectPlaylist();
          }

          _this2.initialMedia_ = selectedMedia;
          _this2.masterPlaylistLoader_.media(_this2.initialMedia_);
          return;
        }

        if (_this2.useCueTags_) {
          _this2.updateAdCues_(updatedPlaylist);
        }

        // TODO: Create a new event on the PlaylistLoader that signals
        // that the segments have changed in some way and use that to
        // update the SegmentLoader instead of doing it twice here and
        // on `mediachange`
        _this2.mainSegmentLoader_.playlist(updatedPlaylist, _this2.requestOptions_);
        _this2.updateDuration();

        // If the player isn't paused, ensure that the segment loader is running,
        // as it is possible that it was temporarily stopped while waiting for
        // a playlist (e.g., in case the playlist errored and we re-requested it).
        if (!_this2.tech_.paused()) {
          _this2.mainSegmentLoader_.load();
        }

        if (!updatedPlaylist.endList) {
          (function () {
            var addSeekableRange = function addSeekableRange() {
              var seekable = _this2.seekable();

              if (seekable.length !== 0) {
                _this2.mediaSource.addSeekableRange_(seekable.start(0), seekable.end(0));
              }
            };

            if (_this2.duration() !== Infinity) {
              (function () {
                var onDurationchange = function onDurationchange() {
                  if (_this2.duration() === Infinity) {
                    addSeekableRange();
                  } else {
                    _this2.tech_.one('durationchange', onDurationchange);
                  }
                };

                _this2.tech_.one('durationchange', onDurationchange);
              })();
            } else {
              addSeekableRange();
            }
          })();
        }
      });

      this.masterPlaylistLoader_.on('error', function () {
        _this2.blacklistCurrentPlaylist(_this2.masterPlaylistLoader_.error);
      });

      this.masterPlaylistLoader_.on('mediachanging', function () {
        _this2.mainSegmentLoader_.abort();
        _this2.mainSegmentLoader_.pause();
      });

      this.masterPlaylistLoader_.on('mediachange', function () {
        var media = _this2.masterPlaylistLoader_.media();
        var requestTimeout = _this2.masterPlaylistLoader_.targetDuration * 1.5 * 1000;

        // If we don't have any more available playlists, we don't want to
        // timeout the request.
        if ((0, _playlistJs.isLowestEnabledRendition)(_this2.masterPlaylistLoader_.master, _this2.masterPlaylistLoader_.media())) {
          _this2.requestOptions_.timeout = 0;
        } else {
          _this2.requestOptions_.timeout = requestTimeout;
        }

        // TODO: Create a new event on the PlaylistLoader that signals
        // that the segments have changed in some way and use that to
        // update the SegmentLoader instead of doing it twice here and
        // on `loadedplaylist`
        _this2.mainSegmentLoader_.playlist(media, _this2.requestOptions_);
        _this2.mainSegmentLoader_.load();

        _this2.tech_.trigger({
          type: 'mediachange',
          bubbles: true
        });
      });

      this.masterPlaylistLoader_.on('playlistunchanged', function () {
        var updatedPlaylist = _this2.masterPlaylistLoader_.media();
        var playlistOutdated = _this2.stuckAtPlaylistEnd_(updatedPlaylist);

        if (playlistOutdated) {
          // Playlist has stopped updating and we're stuck at its end. Try to
          // blacklist it and switch to another playlist in the hope that that
          // one is updating (and give the player a chance to re-adjust to the
          // safe live point).
          _this2.blacklistCurrentPlaylist({
            message: 'Playlist no longer updating.'
          });
          // useful for monitoring QoS
          _this2.tech_.trigger('playliststuck');
        }
      });

      this.masterPlaylistLoader_.on('renditiondisabled', function () {
        _this2.tech_.trigger({ type: 'usage', name: 'hls-rendition-disabled' });
      });
      this.masterPlaylistLoader_.on('renditionenabled', function () {
        _this2.tech_.trigger({ type: 'usage', name: 'hls-rendition-enabled' });
      });
    }

    /**
     * A helper function for triggerring presence usage events once per source
     *
     * @private
     */
  }, {
    key: 'triggerPresenceUsage_',
    value: function triggerPresenceUsage_(master, media) {
      var mediaGroups = master.mediaGroups || {};
      var defaultDemuxed = true;
      var audioGroupKeys = Object.keys(mediaGroups.AUDIO);

      for (var mediaGroup in mediaGroups.AUDIO) {
        for (var label in mediaGroups.AUDIO[mediaGroup]) {
          var properties = mediaGroups.AUDIO[mediaGroup][label];

          if (!properties.uri) {
            defaultDemuxed = false;
          }
        }
      }

      if (defaultDemuxed) {
        this.tech_.trigger({ type: 'usage', name: 'hls-demuxed' });
      }

      if (Object.keys(mediaGroups.SUBTITLES).length) {
        this.tech_.trigger({ type: 'usage', name: 'hls-webvtt' });
      }

      if (Hls.Playlist.isAes(media)) {
        this.tech_.trigger({ type: 'usage', name: 'hls-aes' });
      }

      if (Hls.Playlist.isFmp4(media)) {
        this.tech_.trigger({ type: 'usage', name: 'hls-fmp4' });
      }

      if (audioGroupKeys.length && Object.keys(mediaGroups.AUDIO[audioGroupKeys[0]]).length > 1) {
        this.tech_.trigger({ type: 'usage', name: 'hls-alternate-audio' });
      }

      if (this.useCueTags_) {
        this.tech_.trigger({ type: 'usage', name: 'hls-playlist-cue-tags' });
      }
    }

    /**
     * Register event handlers on the segment loaders. A helper function
     * for construction time.
     *
     * @private
     */
  }, {
    key: 'setupSegmentLoaderListeners_',
    value: function setupSegmentLoaderListeners_() {
      var _this3 = this;

      this.mainSegmentLoader_.on('bandwidthupdate', function () {
        var nextPlaylist = _this3.selectPlaylist();
        var currentPlaylist = _this3.masterPlaylistLoader_.media();
        var buffered = _this3.tech_.buffered();
        var forwardBuffer = buffered.length ? buffered.end(buffered.length - 1) - _this3.tech_.currentTime() : 0;

        var bufferLowWaterLine = _this3.bufferLowWaterLine();

        // If the playlist is live, then we want to not take low water line into account.
        // This is because in LIVE, the player plays 3 segments from the end of the
        // playlist, and if `BUFFER_LOW_WATER_LINE` is greater than the duration availble
        // in those segments, a viewer will never experience a rendition upswitch.
        if (!currentPlaylist.endList ||
        // For the same reason as LIVE, we ignore the low water line when the VOD
        // duration is below the max potential low water line
        _this3.duration() < _config2['default'].MAX_BUFFER_LOW_WATER_LINE ||
        // we want to switch down to lower resolutions quickly to continue playback, but
        nextPlaylist.attributes.BANDWIDTH < currentPlaylist.attributes.BANDWIDTH ||
        // ensure we have some buffer before we switch up to prevent us running out of
        // buffer while loading a higher rendition.
        forwardBuffer >= bufferLowWaterLine) {
          _this3.masterPlaylistLoader_.media(nextPlaylist);
        }

        _this3.tech_.trigger('bandwidthupdate');
      });
      this.mainSegmentLoader_.on('progress', function () {
        _this3.trigger('progress');
      });

      this.mainSegmentLoader_.on('error', function () {
        _this3.blacklistCurrentPlaylist(_this3.mainSegmentLoader_.error());
      });

      this.mainSegmentLoader_.on('syncinfoupdate', function () {
        _this3.onSyncInfoUpdate_();
      });

      this.mainSegmentLoader_.on('timestampoffset', function () {
        _this3.tech_.trigger({ type: 'usage', name: 'hls-timestamp-offset' });
      });
      this.audioSegmentLoader_.on('syncinfoupdate', function () {
        _this3.onSyncInfoUpdate_();
      });

      this.mainSegmentLoader_.on('ended', function () {
        _this3.onEndOfStream();
      });

      this.mainSegmentLoader_.on('earlyabort', function () {
        _this3.blacklistCurrentPlaylist({
          message: 'Aborted early because there isn\'t enough bandwidth to complete the ' + 'request without rebuffering.'
        }, ABORT_EARLY_BLACKLIST_SECONDS);
      });

      this.mainSegmentLoader_.on('reseteverything', function () {
        // If playing an MTS stream, a videojs.MediaSource is listening for
        // hls-reset to reset caption parsing state in the transmuxer
        _this3.tech_.trigger('hls-reset');
      });

      this.mainSegmentLoader_.on('segmenttimemapping', function (event) {
        // If playing an MTS stream in html, a videojs.MediaSource is listening for
        // hls-segment-time-mapping update its internal mapping of stream to display time
        _this3.tech_.trigger({
          type: 'hls-segment-time-mapping',
          mapping: event.mapping
        });
      });

      this.audioSegmentLoader_.on('ended', function () {
        _this3.onEndOfStream();
      });
    }
  }, {
    key: 'mediaSecondsLoaded_',
    value: function mediaSecondsLoaded_() {
      return Math.max(this.audioSegmentLoader_.mediaSecondsLoaded + this.mainSegmentLoader_.mediaSecondsLoaded);
    }

    /**
     * Call load on our SegmentLoaders
     */
  }, {
    key: 'load',
    value: function load() {
      this.mainSegmentLoader_.load();
      if (this.mediaTypes_.AUDIO.activePlaylistLoader) {
        this.audioSegmentLoader_.load();
      }
      if (this.mediaTypes_.SUBTITLES.activePlaylistLoader) {
        this.subtitleSegmentLoader_.load();
      }
    }

    /**
     * Re-tune playback quality level for the current player
     * conditions. This method may perform destructive actions, like
     * removing already buffered content, to readjust the currently
     * active playlist quickly.
     *
     * @private
     */
  }, {
    key: 'fastQualityChange_',
    value: function fastQualityChange_() {
      var media = this.selectPlaylist();

      if (media !== this.masterPlaylistLoader_.media()) {
        this.masterPlaylistLoader_.media(media);

        this.mainSegmentLoader_.resetLoader();
        // don't need to reset audio as it is reset when media changes
      }
    }

    /**
     * Begin playback.
     */
  }, {
    key: 'play',
    value: function play() {
      if (this.setupFirstPlay()) {
        return;
      }

      if (this.tech_.ended()) {
        this.tech_.setCurrentTime(0);
      }

      if (this.hasPlayed_()) {
        this.load();
      }

      var seekable = this.tech_.seekable();

      // if the viewer has paused and we fell out of the live window,
      // seek forward to the live point
      if (this.tech_.duration() === Infinity) {
        if (this.tech_.currentTime() < seekable.start(0)) {
          return this.tech_.setCurrentTime(seekable.end(seekable.length - 1));
        }
      }
    }

    /**
     * Seek to the latest media position if this is a live video and the
     * player and video are loaded and initialized.
     */
  }, {
    key: 'setupFirstPlay',
    value: function setupFirstPlay() {
      var _this4 = this;

      var media = this.masterPlaylistLoader_.media();

      // Check that everything is ready to begin buffering for the first call to play
      //  If 1) there is no active media
      //     2) the player is paused
      //     3) the first play has already been setup
      // then exit early
      if (!media || this.tech_.paused() || this.hasPlayed_()) {
        return false;
      }

      // when the video is a live stream
      if (!media.endList) {
        var _ret3 = (function () {
          var seekable = _this4.seekable();

          if (!seekable.length) {
            // without a seekable range, the player cannot seek to begin buffering at the live
            // point
            return {
              v: false
            };
          }

          if (_videoJs2['default'].browser.IE_VERSION && _this4.mode_ === 'html5' && _this4.tech_.readyState() === 0) {
            // IE11 throws an InvalidStateError if you try to set currentTime while the
            // readyState is 0, so it must be delayed until the tech fires loadedmetadata.
            _this4.tech_.one('loadedmetadata', function () {
              _this4.trigger('firstplay');
              _this4.tech_.setCurrentTime(seekable.end(0));
              _this4.hasPlayed_ = function () {
                return true;
              };
            });

            return {
              v: false
            };
          }

          // trigger firstplay to inform the source handler to ignore the next seek event
          _this4.trigger('firstplay');
          // seek to the live point
          _this4.tech_.setCurrentTime(seekable.end(0));
        })();

        if (typeof _ret3 === 'object') return _ret3.v;
      }

      this.hasPlayed_ = function () {
        return true;
      };
      // we can begin loading now that everything is ready
      this.load();
      return true;
    }

    /**
     * handle the sourceopen event on the MediaSource
     *
     * @private
     */
  }, {
    key: 'handleSourceOpen_',
    value: function handleSourceOpen_() {
      // Only attempt to create the source buffer if none already exist.
      // handleSourceOpen is also called when we are "re-opening" a source buffer
      // after `endOfStream` has been called (in response to a seek for instance)
      try {
        this.setupSourceBuffers_();
      } catch (e) {
        _videoJs2['default'].log.warn('Failed to create Source Buffers', e);
        return this.mediaSource.endOfStream('decode');
      }

      // if autoplay is enabled, begin playback. This is duplicative of
      // code in video.js but is required because play() must be invoked
      // *after* the media source has opened.
      if (this.tech_.autoplay()) {
        var playPromise = this.tech_.play();

        // Catch/silence error when a pause interrupts a play request
        // on browsers which return a promise
        if (typeof playPromise !== 'undefined' && typeof playPromise.then === 'function') {
          playPromise.then(null, function (e) {});
        }
      }

      this.trigger('sourceopen');
    }

    /**
     * Calls endOfStream on the media source when all active stream types have called
     * endOfStream
     *
     * @param {string} streamType
     *        Stream type of the segment loader that called endOfStream
     * @private
     */
  }, {
    key: 'onEndOfStream',
    value: function onEndOfStream() {
      var isEndOfStream = this.mainSegmentLoader_.ended_;

      if (this.mediaTypes_.AUDIO.activePlaylistLoader) {
        // if the audio playlist loader exists, then alternate audio is active, so we need
        // to wait for both the main and audio segment loaders to call endOfStream
        isEndOfStream = isEndOfStream && this.audioSegmentLoader_.ended_;
      }

      if (isEndOfStream) {
        this.mediaSource.endOfStream();
      }
    }

    /**
     * Check if a playlist has stopped being updated
     * @param {Object} playlist the media playlist object
     * @return {boolean} whether the playlist has stopped being updated or not
     */
  }, {
    key: 'stuckAtPlaylistEnd_',
    value: function stuckAtPlaylistEnd_(playlist) {
      var seekable = this.seekable();

      if (!seekable.length) {
        // playlist doesn't have enough information to determine whether we are stuck
        return false;
      }

      var expired = this.syncController_.getExpiredTime(playlist, this.mediaSource.duration);

      if (expired === null) {
        return false;
      }

      // does not use the safe live end to calculate playlist end, since we
      // don't want to say we are stuck while there is still content
      var absolutePlaylistEnd = Hls.Playlist.playlistEnd(playlist, expired);
      var currentTime = this.tech_.currentTime();
      var buffered = this.tech_.buffered();

      if (!buffered.length) {
        // return true if the playhead reached the absolute end of the playlist
        return absolutePlaylistEnd - currentTime <= _ranges2['default'].SAFE_TIME_DELTA;
      }
      var bufferedEnd = buffered.end(buffered.length - 1);

      // return true if there is too little buffer left and buffer has reached absolute
      // end of playlist
      return bufferedEnd - currentTime <= _ranges2['default'].SAFE_TIME_DELTA && absolutePlaylistEnd - bufferedEnd <= _ranges2['default'].SAFE_TIME_DELTA;
    }

    /**
     * Blacklists a playlist when an error occurs for a set amount of time
     * making it unavailable for selection by the rendition selection algorithm
     * and then forces a new playlist (rendition) selection.
     *
     * @param {Object=} error an optional error that may include the playlist
     * to blacklist
     * @param {Number=} blacklistDuration an optional number of seconds to blacklist the
     * playlist
     */
  }, {
    key: 'blacklistCurrentPlaylist',
    value: function blacklistCurrentPlaylist(error, blacklistDuration) {
      if (error === undefined) error = {};

      var currentPlaylist = undefined;
      var nextPlaylist = undefined;

      // If the `error` was generated by the playlist loader, it will contain
      // the playlist we were trying to load (but failed) and that should be
      // blacklisted instead of the currently selected playlist which is likely
      // out-of-date in this scenario
      currentPlaylist = error.playlist || this.masterPlaylistLoader_.media();

      blacklistDuration = blacklistDuration || error.blacklistDuration || this.blacklistDuration;

      // If there is no current playlist, then an error occurred while we were
      // trying to load the master OR while we were disposing of the tech
      if (!currentPlaylist) {
        this.error = error;

        try {
          return this.mediaSource.endOfStream('network');
        } catch (e) {
          return this.trigger('error');
        }
      }

      var isFinalRendition = this.masterPlaylistLoader_.master.playlists.filter(_playlistJs.isEnabled).length === 1;

      if (isFinalRendition) {
        // Never blacklisting this playlist because it's final rendition
        _videoJs2['default'].log.warn('Problem encountered with the current ' + 'HLS playlist. Trying again since it is the final playlist.');

        this.tech_.trigger('retryplaylist');
        return this.masterPlaylistLoader_.load(isFinalRendition);
      }
      // Blacklist this playlist
      currentPlaylist.excludeUntil = Date.now() + blacklistDuration * 1000;
      this.tech_.trigger('blacklistplaylist');
      this.tech_.trigger({ type: 'usage', name: 'hls-rendition-blacklisted' });

      // Select a new playlist
      nextPlaylist = this.selectPlaylist();
      _videoJs2['default'].log.warn('Problem encountered with the current HLS playlist.' + (error.message ? ' ' + error.message : '') + ' Switching to another playlist.');

      return this.masterPlaylistLoader_.media(nextPlaylist);
    }

    /**
     * Pause all segment loaders
     */
  }, {
    key: 'pauseLoading',
    value: function pauseLoading() {
      this.mainSegmentLoader_.pause();
      if (this.mediaTypes_.AUDIO.activePlaylistLoader) {
        this.audioSegmentLoader_.pause();
      }
      if (this.mediaTypes_.SUBTITLES.activePlaylistLoader) {
        this.subtitleSegmentLoader_.pause();
      }
    }

    /**
     * set the current time on all segment loaders
     *
     * @param {TimeRange} currentTime the current time to set
     * @return {TimeRange} the current time
     */
  }, {
    key: 'setCurrentTime',
    value: function setCurrentTime(currentTime) {
      var buffered = _ranges2['default'].findRange(this.tech_.buffered(), currentTime);

      if (!(this.masterPlaylistLoader_ && this.masterPlaylistLoader_.media())) {
        // return immediately if the metadata is not ready yet
        return 0;
      }

      // it's clearly an edge-case but don't thrown an error if asked to
      // seek within an empty playlist
      if (!this.masterPlaylistLoader_.media().segments) {
        return 0;
      }

      // In flash playback, the segment loaders should be reset on every seek, even
      // in buffer seeks. If the seek location is already buffered, continue buffering as
      // usual
      if (buffered && buffered.length && this.mode_ !== 'flash') {
        return currentTime;
      }

      // cancel outstanding requests so we begin buffering at the new
      // location
      this.mainSegmentLoader_.resetEverything();
      this.mainSegmentLoader_.abort();
      if (this.mediaTypes_.AUDIO.activePlaylistLoader) {
        this.audioSegmentLoader_.resetEverything();
        this.audioSegmentLoader_.abort();
      }
      if (this.mediaTypes_.SUBTITLES.activePlaylistLoader) {
        this.subtitleSegmentLoader_.resetEverything();
        this.subtitleSegmentLoader_.abort();
      }

      // start segment loader loading in case they are paused
      this.load();
    }

    /**
     * get the current duration
     *
     * @return {TimeRange} the duration
     */
  }, {
    key: 'duration',
    value: function duration() {
      if (!this.masterPlaylistLoader_) {
        return 0;
      }

      if (this.mediaSource) {
        return this.mediaSource.duration;
      }

      return Hls.Playlist.duration(this.masterPlaylistLoader_.media());
    }

    /**
     * check the seekable range
     *
     * @return {TimeRange} the seekable range
     */
  }, {
    key: 'seekable',
    value: function seekable() {
      return this.seekable_;
    }
  }, {
    key: 'onSyncInfoUpdate_',
    value: function onSyncInfoUpdate_() {
      var mainSeekable = undefined;
      var audioSeekable = undefined;

      if (!this.masterPlaylistLoader_) {
        return;
      }

      var media = this.masterPlaylistLoader_.media();

      if (!media) {
        return;
      }

      var expired = this.syncController_.getExpiredTime(media, this.mediaSource.duration);

      if (expired === null) {
        // not enough information to update seekable
        return;
      }

      mainSeekable = Hls.Playlist.seekable(media, expired);

      if (mainSeekable.length === 0) {
        return;
      }

      if (this.mediaTypes_.AUDIO.activePlaylistLoader) {
        media = this.mediaTypes_.AUDIO.activePlaylistLoader.media();
        expired = this.syncController_.getExpiredTime(media, this.mediaSource.duration);

        if (expired === null) {
          return;
        }

        audioSeekable = Hls.Playlist.seekable(media, expired);

        if (audioSeekable.length === 0) {
          return;
        }
      }

      if (!audioSeekable) {
        // seekable has been calculated based on buffering video data so it
        // can be returned directly
        this.seekable_ = mainSeekable;
      } else if (audioSeekable.start(0) > mainSeekable.end(0) || mainSeekable.start(0) > audioSeekable.end(0)) {
        // seekables are pretty far off, rely on main
        this.seekable_ = mainSeekable;
      } else {
        this.seekable_ = _videoJs2['default'].createTimeRanges([[audioSeekable.start(0) > mainSeekable.start(0) ? audioSeekable.start(0) : mainSeekable.start(0), audioSeekable.end(0) < mainSeekable.end(0) ? audioSeekable.end(0) : mainSeekable.end(0)]]);
      }

      this.tech_.trigger('seekablechanged');
    }

    /**
     * Update the player duration
     */
  }, {
    key: 'updateDuration',
    value: function updateDuration() {
      var _this5 = this;

      var oldDuration = this.mediaSource.duration;
      var newDuration = Hls.Playlist.duration(this.masterPlaylistLoader_.media());
      var buffered = this.tech_.buffered();
      var setDuration = function setDuration() {
        _this5.mediaSource.duration = newDuration;
        _this5.tech_.trigger('durationchange');

        _this5.mediaSource.removeEventListener('sourceopen', setDuration);
      };

      if (buffered.length > 0) {
        newDuration = Math.max(newDuration, buffered.end(buffered.length - 1));
      }

      // if the duration has changed, invalidate the cached value
      if (oldDuration !== newDuration) {
        // update the duration
        if (this.mediaSource.readyState !== 'open') {
          this.mediaSource.addEventListener('sourceopen', setDuration);
        } else {
          setDuration();
        }
      }
    }

    /**
     * dispose of the MasterPlaylistController and everything
     * that it controls
     */
  }, {
    key: 'dispose',
    value: function dispose() {
      var _this6 = this;

      this.decrypter_.terminate();
      this.masterPlaylistLoader_.dispose();
      this.mainSegmentLoader_.dispose();

      ['AUDIO', 'SUBTITLES'].forEach(function (type) {
        var groups = _this6.mediaTypes_[type].groups;

        for (var id in groups) {
          groups[id].forEach(function (group) {
            if (group.playlistLoader) {
              group.playlistLoader.dispose();
            }
          });
        }
      });

      this.audioSegmentLoader_.dispose();
      this.subtitleSegmentLoader_.dispose();
    }

    /**
     * return the master playlist object if we have one
     *
     * @return {Object} the master playlist object that we parsed
     */
  }, {
    key: 'master',
    value: function master() {
      return this.masterPlaylistLoader_.master;
    }

    /**
     * return the currently selected playlist
     *
     * @return {Object} the currently selected playlist object that we parsed
     */
  }, {
    key: 'media',
    value: function media() {
      // playlist loader will not return media if it has not been fully loaded
      return this.masterPlaylistLoader_.media() || this.initialMedia_;
    }

    /**
     * setup our internal source buffers on our segment Loaders
     *
     * @private
     */
  }, {
    key: 'setupSourceBuffers_',
    value: function setupSourceBuffers_() {
      var media = this.masterPlaylistLoader_.media();
      var mimeTypes = undefined;

      // wait until a media playlist is available and the Media Source is
      // attached
      if (!media || this.mediaSource.readyState !== 'open') {
        return;
      }

      mimeTypes = mimeTypesForPlaylist_(this.masterPlaylistLoader_.master, media);
      if (mimeTypes.length < 1) {
        this.error = 'No compatible SourceBuffer configuration for the variant stream:' + media.resolvedUri;
        return this.mediaSource.endOfStream('decode');
      }
      this.mainSegmentLoader_.mimeType(mimeTypes[0]);
      if (mimeTypes[1]) {
        this.audioSegmentLoader_.mimeType(mimeTypes[1]);
      }

      // exclude any incompatible variant streams from future playlist
      // selection
      this.excludeIncompatibleVariants_(media);
    }

    /**
     * Blacklist playlists that are known to be codec or
     * stream-incompatible with the SourceBuffer configuration. For
     * instance, Media Source Extensions would cause the video element to
     * stall waiting for video data if you switched from a variant with
     * video and audio to an audio-only one.
     *
     * @param {Object} media a media playlist compatible with the current
     * set of SourceBuffers. Variants in the current master playlist that
     * do not appear to have compatible codec or stream configurations
     * will be excluded from the default playlist selection algorithm
     * indefinitely.
     * @private
     */
  }, {
    key: 'excludeIncompatibleVariants_',
    value: function excludeIncompatibleVariants_(media) {
      var master = this.masterPlaylistLoader_.master;
      var codecCount = 2;
      var videoCodec = null;
      var codecs = undefined;

      if (media.attributes.CODECS) {
        codecs = (0, _utilCodecsJs.parseCodecs)(media.attributes.CODECS);
        videoCodec = codecs.videoCodec;
        codecCount = codecs.codecCount;
      }
      master.playlists.forEach(function (variant) {
        var variantCodecs = {
          codecCount: 2,
          videoCodec: null
        };

        if (variant.attributes.CODECS) {
          var codecString = variant.attributes.CODECS;

          variantCodecs = (0, _utilCodecsJs.parseCodecs)(codecString);

          if (window.MediaSource && window.MediaSource.isTypeSupported && !window.MediaSource.isTypeSupported('video/mp4; codecs="' + mapLegacyAvcCodecs_(codecString) + '"')) {
            variant.excludeUntil = Infinity;
          }
        }

        // if the streams differ in the presence or absence of audio or
        // video, they are incompatible
        if (variantCodecs.codecCount !== codecCount) {
          variant.excludeUntil = Infinity;
        }

        // if h.264 is specified on the current playlist, some flavor of
        // it must be specified on all compatible variants
        if (variantCodecs.videoCodec !== videoCodec) {
          variant.excludeUntil = Infinity;
        }
      });
    }
  }, {
    key: 'updateAdCues_',
    value: function updateAdCues_(media) {
      var offset = 0;
      var seekable = this.seekable();

      if (seekable.length) {
        offset = seekable.start(0);
      }

      _adCueTags2['default'].updateAdCues(media, this.cueTagsTrack_, offset);
    }

    /**
     * Calculates the desired forward buffer length based on current time
     *
     * @return {Number} Desired forward buffer length in seconds
     */
  }, {
    key: 'goalBufferLength',
    value: function goalBufferLength() {
      var currentTime = this.tech_.currentTime();
      var initial = _config2['default'].GOAL_BUFFER_LENGTH;
      var rate = _config2['default'].GOAL_BUFFER_LENGTH_RATE;
      var max = Math.max(initial, _config2['default'].MAX_GOAL_BUFFER_LENGTH);

      return Math.min(initial + currentTime * rate, max);
    }

    /**
     * Calculates the desired buffer low water line based on current time
     *
     * @return {Number} Desired buffer low water line in seconds
     */
  }, {
    key: 'bufferLowWaterLine',
    value: function bufferLowWaterLine() {
      var currentTime = this.tech_.currentTime();
      var initial = _config2['default'].BUFFER_LOW_WATER_LINE;
      var rate = _config2['default'].BUFFER_LOW_WATER_LINE_RATE;
      var max = Math.max(initial, _config2['default'].MAX_BUFFER_LOW_WATER_LINE);

      return Math.min(initial + currentTime * rate, max);
    }
  }]);

  return MasterPlaylistController;
})(_videoJs2['default'].EventTarget);

exports.MasterPlaylistController = MasterPlaylistController;