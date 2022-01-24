'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _videoJs = require('video.js');

var _videoJs2 = _interopRequireDefault(_videoJs);

var _playlistLoader = require('./playlist-loader');

var _playlistLoader2 = _interopRequireDefault(_playlistLoader);

var noop = function noop() {};

/**
 * Convert the properties of an HLS track into an audioTrackKind.
 *
 * @private
 */
var audioTrackKind_ = function audioTrackKind_(properties) {
  var kind = properties['default'] ? 'main' : 'alternative';

  if (properties.characteristics && properties.characteristics.indexOf('public.accessibility.describes-video') >= 0) {
    kind = 'main-desc';
  }

  return kind;
};

/**
 * Pause provided segment loader and playlist loader if active
 *
 * @param {SegmentLoader} segmentLoader
 *        SegmentLoader to pause
 * @param {Object} mediaType
 *        Active media type
 * @function stopLoaders
 */
var stopLoaders = function stopLoaders(segmentLoader, mediaType) {
  segmentLoader.abort();
  segmentLoader.pause();

  if (mediaType && mediaType.activePlaylistLoader) {
    mediaType.activePlaylistLoader.pause();
    mediaType.activePlaylistLoader = null;
  }
};

exports.stopLoaders = stopLoaders;
/**
 * Start loading provided segment loader and playlist loader
 *
 * @param {PlaylistLoader} playlistLoader
 *        PlaylistLoader to start loading
 * @param {Object} mediaType
 *        Active media type
 * @function startLoaders
 */
var startLoaders = function startLoaders(playlistLoader, mediaType) {
  // Segment loader will be started after `loadedmetadata` or `loadedplaylist` from the
  // playlist loader
  mediaType.activePlaylistLoader = playlistLoader;
  playlistLoader.load();
};

exports.startLoaders = startLoaders;
/**
 * Returns a function to be called when the media group changes. It performs a
 * non-destructive (preserve the buffer) resync of the SegmentLoader. This is because a
 * change of group is merely a rendition switch of the same content at another encoding,
 * rather than a change of content, such as switching audio from English to Spanish.
 *
 * @param {String} type
 *        MediaGroup type
 * @param {Object} settings
 *        Object containing required information for media groups
 * @return {Function}
 *         Handler for a non-destructive resync of SegmentLoader when the active media
 *         group changes.
 * @function onGroupChanged
 */
var onGroupChanged = function onGroupChanged(type, settings) {
  return function () {
    var _settings$segmentLoaders = settings.segmentLoaders;
    var segmentLoader = _settings$segmentLoaders[type];
    var mainSegmentLoader = _settings$segmentLoaders.main;
    var mediaType = settings.mediaTypes[type];

    var activeTrack = mediaType.activeTrack();
    var activeGroup = mediaType.activeGroup(activeTrack);
    var previousActiveLoader = mediaType.activePlaylistLoader;

    stopLoaders(segmentLoader, mediaType);

    if (!activeGroup) {
      // there is no group active
      return;
    }

    if (!activeGroup.playlistLoader) {
      if (previousActiveLoader) {
        // The previous group had a playlist loader but the new active group does not
        // this means we are switching from demuxed to muxed audio. In this case we want to
        // do a destructive reset of the main segment loader and not restart the audio
        // loaders.
        mainSegmentLoader.resetEverything();
      }
      return;
    }

    // Non-destructive resync
    segmentLoader.resyncLoader();

    startLoaders(activeGroup.playlistLoader, mediaType);
  };
};

exports.onGroupChanged = onGroupChanged;
/**
 * Returns a function to be called when the media track changes. It performs a
 * destructive reset of the SegmentLoader to ensure we start loading as close to
 * currentTime as possible.
 *
 * @param {String} type
 *        MediaGroup type
 * @param {Object} settings
 *        Object containing required information for media groups
 * @return {Function}
 *         Handler for a destructive reset of SegmentLoader when the active media
 *         track changes.
 * @function onTrackChanged
 */
var onTrackChanged = function onTrackChanged(type, settings) {
  return function () {
    var _settings$segmentLoaders2 = settings.segmentLoaders;
    var segmentLoader = _settings$segmentLoaders2[type];
    var mainSegmentLoader = _settings$segmentLoaders2.main;
    var mediaType = settings.mediaTypes[type];

    var activeTrack = mediaType.activeTrack();
    var activeGroup = mediaType.activeGroup(activeTrack);
    var previousActiveLoader = mediaType.activePlaylistLoader;

    stopLoaders(segmentLoader, mediaType);

    if (!activeGroup) {
      // there is no group active so we do not want to restart loaders
      return;
    }

    if (!activeGroup.playlistLoader) {
      // when switching from demuxed audio/video to muxed audio/video (noted by no playlist
      // loader for the audio group), we want to do a destructive reset of the main segment
      // loader and not restart the audio loaders
      mainSegmentLoader.resetEverything();
      return;
    }

    if (previousActiveLoader === activeGroup.playlistLoader) {
      // Nothing has actually changed. This can happen because track change events can fire
      // multiple times for a "single" change. One for enabling the new active track, and
      // one for disabling the track that was active
      startLoaders(activeGroup.playlistLoader, mediaType);
      return;
    }

    if (segmentLoader.track) {
      // For WebVTT, set the new text track in the segmentloader
      segmentLoader.track(activeTrack);
    }

    // destructive reset
    segmentLoader.resetEverything();

    startLoaders(activeGroup.playlistLoader, mediaType);
  };
};

exports.onTrackChanged = onTrackChanged;
var onError = {
  /**
   * Returns a function to be called when a SegmentLoader or PlaylistLoader encounters
   * an error.
   *
   * @param {String} type
   *        MediaGroup type
   * @param {Object} settings
   *        Object containing required information for media groups
   * @return {Function}
   *         Error handler. Logs warning (or error if the playlist is blacklisted) to
   *         console and switches back to default audio track.
   * @function onError.AUDIO
   */
  AUDIO: function AUDIO(type, settings) {
    return function () {
      var segmentLoader = settings.segmentLoaders[type];
      var mediaType = settings.mediaTypes[type];
      var blacklistCurrentPlaylist = settings.blacklistCurrentPlaylist;

      stopLoaders(segmentLoader, mediaType);

      // switch back to default audio track
      var activeTrack = mediaType.activeTrack();
      var activeGroup = mediaType.activeGroup();
      var id = (activeGroup.filter(function (group) {
        return group['default'];
      })[0] || activeGroup[0]).id;
      var defaultTrack = mediaType.tracks[id];

      if (activeTrack === defaultTrack) {
        // Default track encountered an error. All we can do now is blacklist the current
        // rendition and hope another will switch audio groups
        blacklistCurrentPlaylist({
          message: 'Problem encountered loading the default audio track.'
        });
        return;
      }

      _videoJs2['default'].log.warn('Problem encountered loading the alternate audio track.' + 'Switching back to default.');

      for (var trackId in mediaType.tracks) {
        mediaType.tracks[trackId].enabled = mediaType.tracks[trackId] === defaultTrack;
      }

      mediaType.onTrackChanged();
    };
  },
  /**
   * Returns a function to be called when a SegmentLoader or PlaylistLoader encounters
   * an error.
   *
   * @param {String} type
   *        MediaGroup type
   * @param {Object} settings
   *        Object containing required information for media groups
   * @return {Function}
   *         Error handler. Logs warning to console and disables the active subtitle track
   * @function onError.SUBTITLES
   */
  SUBTITLES: function SUBTITLES(type, settings) {
    return function () {
      var segmentLoader = settings.segmentLoaders[type];
      var mediaType = settings.mediaTypes[type];

      _videoJs2['default'].log.warn('Problem encountered loading the subtitle track.' + 'Disabling subtitle track.');

      stopLoaders(segmentLoader, mediaType);

      var track = mediaType.activeTrack();

      if (track) {
        track.mode = 'disabled';
      }

      mediaType.onTrackChanged();
    };
  }
};

exports.onError = onError;
var setupListeners = {
  /**
   * Setup event listeners for audio playlist loader
   *
   * @param {String} type
   *        MediaGroup type
   * @param {PlaylistLoader|null} playlistLoader
   *        PlaylistLoader to register listeners on
   * @param {Object} settings
   *        Object containing required information for media groups
   * @function setupListeners.AUDIO
   */
  AUDIO: function AUDIO(type, playlistLoader, settings) {
    if (!playlistLoader) {
      // no playlist loader means audio will be muxed with the video
      return;
    }

    var tech = settings.tech;
    var requestOptions = settings.requestOptions;
    var segmentLoader = settings.segmentLoaders[type];

    playlistLoader.on('loadedmetadata', function () {
      var media = playlistLoader.media();

      segmentLoader.playlist(media, requestOptions);

      // if the video is already playing, or if this isn't a live video and preload
      // permits, start downloading segments
      if (!tech.paused() || media.endList && tech.preload() !== 'none') {
        segmentLoader.load();
      }
    });

    playlistLoader.on('loadedplaylist', function () {
      segmentLoader.playlist(playlistLoader.media(), requestOptions);

      // If the player isn't paused, ensure that the segment loader is running
      if (!tech.paused()) {
        segmentLoader.load();
      }
    });

    playlistLoader.on('error', onError[type](type, settings));
  },
  /**
   * Setup event listeners for subtitle playlist loader
   *
   * @param {String} type
   *        MediaGroup type
   * @param {PlaylistLoader|null} playlistLoader
   *        PlaylistLoader to register listeners on
   * @param {Object} settings
   *        Object containing required information for media groups
   * @function setupListeners.SUBTITLES
   */
  SUBTITLES: function SUBTITLES(type, playlistLoader, settings) {
    var tech = settings.tech;
    var requestOptions = settings.requestOptions;
    var segmentLoader = settings.segmentLoaders[type];
    var mediaType = settings.mediaTypes[type];

    playlistLoader.on('loadedmetadata', function () {
      var media = playlistLoader.media();

      segmentLoader.playlist(media, requestOptions);
      segmentLoader.track(mediaType.activeTrack());

      // if the video is already playing, or if this isn't a live video and preload
      // permits, start downloading segments
      if (!tech.paused() || media.endList && tech.preload() !== 'none') {
        segmentLoader.load();
      }
    });

    playlistLoader.on('loadedplaylist', function () {
      segmentLoader.playlist(playlistLoader.media(), requestOptions);

      // If the player isn't paused, ensure that the segment loader is running
      if (!tech.paused()) {
        segmentLoader.load();
      }
    });

    playlistLoader.on('error', onError[type](type, settings));
  }
};

exports.setupListeners = setupListeners;
var initialize = {
  /**
   * Setup PlaylistLoaders and AudioTracks for the audio groups
   *
   * @param {String} type
   *        MediaGroup type
   * @param {Object} settings
   *        Object containing required information for media groups
   * @function initialize.AUDIO
   */
  'AUDIO': function AUDIO(type, settings) {
    var mode = settings.mode;
    var hls = settings.hls;
    var segmentLoader = settings.segmentLoaders[type];
    var requestOptions = settings.requestOptions;
    var mediaGroups = settings.master.mediaGroups;
    var _settings$mediaTypes$type = settings.mediaTypes[type];
    var groups = _settings$mediaTypes$type.groups;
    var tracks = _settings$mediaTypes$type.tracks;

    // force a default if we have none or we are not
    // in html5 mode (the only mode to support more than one
    // audio track)
    if (!mediaGroups[type] || Object.keys(mediaGroups[type]).length === 0 || mode !== 'html5') {
      mediaGroups[type] = { main: { 'default': { 'default': true } } };
    }

    for (var groupId in mediaGroups[type]) {
      if (!groups[groupId]) {
        groups[groupId] = [];
      }

      for (var variantLabel in mediaGroups[type][groupId]) {
        var properties = mediaGroups[type][groupId][variantLabel];
        var playlistLoader = undefined;

        if (properties.resolvedUri) {
          playlistLoader = new _playlistLoader2['default'](properties.resolvedUri, hls, requestOptions);
        } else {
          // no resolvedUri means the audio is muxed with the video when using this
          // audio track
          playlistLoader = null;
        }

        properties = _videoJs2['default'].mergeOptions({ id: variantLabel, playlistLoader: playlistLoader }, properties);

        setupListeners[type](type, properties.playlistLoader, settings);

        groups[groupId].push(properties);

        if (typeof tracks[variantLabel] === 'undefined') {
          var track = new _videoJs2['default'].AudioTrack({
            id: variantLabel,
            kind: audioTrackKind_(properties),
            enabled: false,
            language: properties.language,
            'default': properties['default'],
            label: variantLabel
          });

          tracks[variantLabel] = track;
        }
      }
    }

    // setup single error event handler for the segment loader
    segmentLoader.on('error', onError[type](type, settings));
  },
  /**
   * Setup PlaylistLoaders and TextTracks for the subtitle groups
   *
   * @param {String} type
   *        MediaGroup type
   * @param {Object} settings
   *        Object containing required information for media groups
   * @function initialize.SUBTITLES
   */
  'SUBTITLES': function SUBTITLES(type, settings) {
    var tech = settings.tech;
    var hls = settings.hls;
    var segmentLoader = settings.segmentLoaders[type];
    var requestOptions = settings.requestOptions;
    var mediaGroups = settings.master.mediaGroups;
    var _settings$mediaTypes$type2 = settings.mediaTypes[type];
    var groups = _settings$mediaTypes$type2.groups;
    var tracks = _settings$mediaTypes$type2.tracks;

    for (var groupId in mediaGroups[type]) {
      if (!groups[groupId]) {
        groups[groupId] = [];
      }

      for (var variantLabel in mediaGroups[type][groupId]) {
        if (mediaGroups[type][groupId][variantLabel].forced) {
          // Subtitle playlists with the forced attribute are not selectable in Safari.
          // According to Apple's HLS Authoring Specification:
          //   If content has forced subtitles and regular subtitles in a given language,
          //   the regular subtitles track in that language MUST contain both the forced
          //   subtitles and the regular subtitles for that language.
          // Because of this requirement and that Safari does not add forced subtitles,
          // forced subtitles are skipped here to maintain consistent experience across
          // all platforms
          continue;
        }

        var properties = mediaGroups[type][groupId][variantLabel];

        properties = _videoJs2['default'].mergeOptions({
          id: variantLabel,
          playlistLoader: new _playlistLoader2['default'](properties.resolvedUri, hls, requestOptions)
        }, properties);

        setupListeners[type](type, properties.playlistLoader, settings);

        groups[groupId].push(properties);

        if (typeof tracks[variantLabel] === 'undefined') {
          var track = tech.addRemoteTextTrack({
            id: variantLabel,
            kind: 'subtitles',
            enabled: false,
            language: properties.language,
            label: variantLabel
          }, false).track;

          tracks[variantLabel] = track;
        }
      }
    }

    // setup single error event handler for the segment loader
    segmentLoader.on('error', onError[type](type, settings));
  },
  /**
   * Setup TextTracks for the closed-caption groups
   *
   * @param {String} type
   *        MediaGroup type
   * @param {Object} settings
   *        Object containing required information for media groups
   * @function initialize['CLOSED-CAPTIONS']
   */
  'CLOSED-CAPTIONS': function CLOSEDCAPTIONS(type, settings) {
    var tech = settings.tech;
    var mediaGroups = settings.master.mediaGroups;
    var _settings$mediaTypes$type3 = settings.mediaTypes[type];
    var groups = _settings$mediaTypes$type3.groups;
    var tracks = _settings$mediaTypes$type3.tracks;

    for (var groupId in mediaGroups[type]) {
      if (!groups[groupId]) {
        groups[groupId] = [];
      }

      for (var variantLabel in mediaGroups[type][groupId]) {
        var properties = mediaGroups[type][groupId][variantLabel];

        // We only support CEA608 captions for now, so ignore anything that
        // doesn't use a CCx INSTREAM-ID
        if (!properties.instreamId.match(/CC\d/)) {
          continue;
        }

        // No PlaylistLoader is required for Closed-Captions because the captions are
        // embedded within the video stream
        groups[groupId].push(_videoJs2['default'].mergeOptions({ id: variantLabel }, properties));

        if (typeof tracks[variantLabel] === 'undefined') {
          var track = tech.addRemoteTextTrack({
            id: properties.instreamId,
            kind: 'captions',
            enabled: false,
            language: properties.language,
            label: variantLabel
          }, false).track;

          tracks[variantLabel] = track;
        }
      }
    }
  }
};

exports.initialize = initialize;
/**
 * Returns a function used to get the active group of the provided type
 *
 * @param {String} type
 *        MediaGroup type
 * @param {Object} settings
 *        Object containing required information for media groups
 * @return {Function}
 *         Function that returns the active media group for the provided type. Takes an
 *         optional parameter {TextTrack} track. If no track is provided, a list of all
 *         variants in the group, otherwise the variant corresponding to the provided
 *         track is returned.
 * @function activeGroup
 */
var activeGroup = function activeGroup(type, settings) {
  return function (track) {
    var masterPlaylistLoader = settings.masterPlaylistLoader;
    var groups = settings.mediaTypes[type].groups;

    var media = masterPlaylistLoader.media();

    if (!media) {
      return null;
    }

    var variants = null;

    if (media.attributes[type]) {
      variants = groups[media.attributes[type]];
    }

    variants = variants || groups.main;

    if (typeof track === 'undefined') {
      return variants;
    }

    if (track === null) {
      // An active track was specified so a corresponding group is expected. track === null
      // means no track is currently active so there is no corresponding group
      return null;
    }

    return variants.filter(function (props) {
      return props.id === track.id;
    })[0] || null;
  };
};

exports.activeGroup = activeGroup;
var activeTrack = {
  /**
   * Returns a function used to get the active track of type provided
   *
   * @param {String} type
   *        MediaGroup type
   * @param {Object} settings
   *        Object containing required information for media groups
   * @return {Function}
   *         Function that returns the active media track for the provided type. Returns
   *         null if no track is active
   * @function activeTrack.AUDIO
   */
  AUDIO: function AUDIO(type, settings) {
    return function () {
      var tracks = settings.mediaTypes[type].tracks;

      for (var id in tracks) {
        if (tracks[id].enabled) {
          return tracks[id];
        }
      }

      return null;
    };
  },
  /**
   * Returns a function used to get the active track of type provided
   *
   * @param {String} type
   *        MediaGroup type
   * @param {Object} settings
   *        Object containing required information for media groups
   * @return {Function}
   *         Function that returns the active media track for the provided type. Returns
   *         null if no track is active
   * @function activeTrack.SUBTITLES
   */
  SUBTITLES: function SUBTITLES(type, settings) {
    return function () {
      var tracks = settings.mediaTypes[type].tracks;

      for (var id in tracks) {
        if (tracks[id].mode === 'showing') {
          return tracks[id];
        }
      }

      return null;
    };
  }
};

exports.activeTrack = activeTrack;
/**
 * Setup PlaylistLoaders and Tracks for media groups (Audio, Subtitles,
 * Closed-Captions) specified in the master manifest.
 *
 * @param {Object} settings
 *        Object containing required information for setting up the media groups
 * @param {SegmentLoader} settings.segmentLoaders.AUDIO
 *        Audio segment loader
 * @param {SegmentLoader} settings.segmentLoaders.SUBTITLES
 *        Subtitle segment loader
 * @param {SegmentLoader} settings.segmentLoaders.main
 *        Main segment loader
 * @param {Tech} settings.tech
 *        The tech of the player
 * @param {Object} settings.requestOptions
 *        XHR request options used by the segment loaders
 * @param {PlaylistLoader} settings.masterPlaylistLoader
 *        PlaylistLoader for the master source
 * @param {String} mode
 *        Mode of the hls source handler. Can be 'auto', 'html5', or 'flash'
 * @param {HlsHandler} settings.hls
 *        HLS SourceHandler
 * @param {Object} settings.master
 *        The parsed master manifest
 * @param {Object} settings.mediaTypes
 *        Object to store the loaders, tracks, and utility methods for each media type
 * @param {Function} settings.blacklistCurrentPlaylist
 *        Blacklists the current rendition and forces a rendition switch.
 * @function setupMediaGroups
 */
var setupMediaGroups = function setupMediaGroups(settings) {
  ['AUDIO', 'SUBTITLES', 'CLOSED-CAPTIONS'].forEach(function (type) {
    initialize[type](type, settings);
  });

  var mediaTypes = settings.mediaTypes;
  var masterPlaylistLoader = settings.masterPlaylistLoader;
  var tech = settings.tech;
  var hls = settings.hls;

  // setup active group and track getters and change event handlers
  ['AUDIO', 'SUBTITLES'].forEach(function (type) {
    mediaTypes[type].activeGroup = activeGroup(type, settings);
    mediaTypes[type].activeTrack = activeTrack[type](type, settings);
    mediaTypes[type].onGroupChanged = onGroupChanged(type, settings);
    mediaTypes[type].onTrackChanged = onTrackChanged(type, settings);
  });

  // DO NOT enable the default subtitle or caption track.
  // DO enable the default audio track
  var audioGroup = mediaTypes.AUDIO.activeGroup();
  var groupId = (audioGroup.filter(function (group) {
    return group['default'];
  })[0] || audioGroup[0]).id;

  mediaTypes.AUDIO.tracks[groupId].enabled = true;
  mediaTypes.AUDIO.onTrackChanged();

  masterPlaylistLoader.on('mediachange', function () {
    ['AUDIO', 'SUBTITLES'].forEach(function (type) {
      return mediaTypes[type].onGroupChanged();
    });
  });

  // custom audio track change event handler for usage event
  var onAudioTrackChanged = function onAudioTrackChanged() {
    mediaTypes.AUDIO.onTrackChanged();
    tech.trigger({ type: 'usage', name: 'hls-audio-change' });
  };

  tech.audioTracks().addEventListener('change', onAudioTrackChanged);
  tech.remoteTextTracks().addEventListener('change', mediaTypes.SUBTITLES.onTrackChanged);

  hls.on('dispose', function () {
    tech.audioTracks().removeEventListener('change', onAudioTrackChanged);
    tech.remoteTextTracks().removeEventListener('change', mediaTypes.SUBTITLES.onTrackChanged);
  });

  // clear existing audio tracks and add the ones we just created
  tech.clearTracks('audio');

  for (var id in mediaTypes.AUDIO.tracks) {
    tech.audioTracks().addTrack(mediaTypes.AUDIO.tracks[id]);
  }
};

exports.setupMediaGroups = setupMediaGroups;
/**
 * Creates skeleton object used to store the loaders, tracks, and utility methods for each
 * media type
 *
 * @return {Object}
 *         Object to store the loaders, tracks, and utility methods for each media type
 * @function createMediaTypes
 */
var createMediaTypes = function createMediaTypes() {
  var mediaTypes = {};

  ['AUDIO', 'SUBTITLES', 'CLOSED-CAPTIONS'].forEach(function (type) {
    mediaTypes[type] = {
      groups: {},
      tracks: {},
      activePlaylistLoader: null,
      activeGroup: noop,
      activeTrack: noop,
      onGroupChanged: noop,
      onTrackChanged: noop
    };
  });

  return mediaTypes;
};
exports.createMediaTypes = createMediaTypes;