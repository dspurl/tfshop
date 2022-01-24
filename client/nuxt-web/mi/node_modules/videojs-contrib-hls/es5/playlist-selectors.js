'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _playlist = require('./playlist');

var _playlist2 = _interopRequireDefault(_playlist);

var _utilCodecsJs = require('./util/codecs.js');

// Utilities

/**
 * Returns the CSS value for the specified property on an element
 * using `getComputedStyle`. Firefox has a long-standing issue where
 * getComputedStyle() may return null when running in an iframe with
 * `display: none`.
 *
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 * @param {HTMLElement} el the htmlelement to work on
 * @param {string} the proprety to get the style for
 */
var safeGetComputedStyle = function safeGetComputedStyle(el, property) {
  var result = undefined;

  if (!el) {
    return '';
  }

  result = window.getComputedStyle(el);
  if (!result) {
    return '';
  }

  return result[property];
};

/**
 * Resuable stable sort function
 *
 * @param {Playlists} array
 * @param {Function} sortFn Different comparators
 * @function stableSort
 */
var stableSort = function stableSort(array, sortFn) {
  var newArray = array.slice();

  array.sort(function (left, right) {
    var cmp = sortFn(left, right);

    if (cmp === 0) {
      return newArray.indexOf(left) - newArray.indexOf(right);
    }
    return cmp;
  });
};

/**
 * A comparator function to sort two playlist object by bandwidth.
 *
 * @param {Object} left a media playlist object
 * @param {Object} right a media playlist object
 * @return {Number} Greater than zero if the bandwidth attribute of
 * left is greater than the corresponding attribute of right. Less
 * than zero if the bandwidth of right is greater than left and
 * exactly zero if the two are equal.
 */
var comparePlaylistBandwidth = function comparePlaylistBandwidth(left, right) {
  var leftBandwidth = undefined;
  var rightBandwidth = undefined;

  if (left.attributes.BANDWIDTH) {
    leftBandwidth = left.attributes.BANDWIDTH;
  }
  leftBandwidth = leftBandwidth || window.Number.MAX_VALUE;
  if (right.attributes.BANDWIDTH) {
    rightBandwidth = right.attributes.BANDWIDTH;
  }
  rightBandwidth = rightBandwidth || window.Number.MAX_VALUE;

  return leftBandwidth - rightBandwidth;
};

exports.comparePlaylistBandwidth = comparePlaylistBandwidth;
/**
 * A comparator function to sort two playlist object by resolution (width).
 * @param {Object} left a media playlist object
 * @param {Object} right a media playlist object
 * @return {Number} Greater than zero if the resolution.width attribute of
 * left is greater than the corresponding attribute of right. Less
 * than zero if the resolution.width of right is greater than left and
 * exactly zero if the two are equal.
 */
var comparePlaylistResolution = function comparePlaylistResolution(left, right) {
  var leftWidth = undefined;
  var rightWidth = undefined;

  if (left.attributes.RESOLUTION && left.attributes.RESOLUTION.width) {
    leftWidth = left.attributes.RESOLUTION.width;
  }

  leftWidth = leftWidth || window.Number.MAX_VALUE;

  if (right.attributes.RESOLUTION && right.attributes.RESOLUTION.width) {
    rightWidth = right.attributes.RESOLUTION.width;
  }

  rightWidth = rightWidth || window.Number.MAX_VALUE;

  // NOTE - Fallback to bandwidth sort as appropriate in cases where multiple renditions
  // have the same media dimensions/ resolution
  if (leftWidth === rightWidth && left.attributes.BANDWIDTH && right.attributes.BANDWIDTH) {
    return left.attributes.BANDWIDTH - right.attributes.BANDWIDTH;
  }
  return leftWidth - rightWidth;
};

exports.comparePlaylistResolution = comparePlaylistResolution;
/**
 * Chooses the appropriate media playlist based on bandwidth and player size
 *
 * @param {Object} master
 *        Object representation of the master manifest
 * @param {Number} playerBandwidth
 *        Current calculated bandwidth of the player
 * @param {Number} playerWidth
 *        Current width of the player element
 * @param {Number} playerHeight
 *        Current height of the player element
 * @return {Playlist} the highest bitrate playlist less than the
 * currently detected bandwidth, accounting for some amount of
 * bandwidth variance
 */
var simpleSelector = function simpleSelector(master, playerBandwidth, playerWidth, playerHeight) {
  // convert the playlists to an intermediary representation to make comparisons easier
  var sortedPlaylistReps = master.playlists.map(function (playlist) {
    var width = undefined;
    var height = undefined;
    var bandwidth = undefined;

    width = playlist.attributes.RESOLUTION && playlist.attributes.RESOLUTION.width;
    height = playlist.attributes.RESOLUTION && playlist.attributes.RESOLUTION.height;
    bandwidth = playlist.attributes.BANDWIDTH;

    bandwidth = bandwidth || window.Number.MAX_VALUE;

    return {
      bandwidth: bandwidth,
      width: width,
      height: height,
      playlist: playlist
    };
  });

  stableSort(sortedPlaylistReps, function (left, right) {
    return left.bandwidth - right.bandwidth;
  });

  // filter out any playlists that have been excluded due to
  // incompatible configurations
  sortedPlaylistReps = sortedPlaylistReps.filter(function (rep) {
    return !_playlist2['default'].isIncompatible(rep.playlist);
  });

  // filter out any playlists that have been disabled manually through the representations
  // api or blacklisted temporarily due to playback errors.
  var enabledPlaylistReps = sortedPlaylistReps.filter(function (rep) {
    return _playlist2['default'].isEnabled(rep.playlist);
  });

  if (!enabledPlaylistReps.length) {
    // if there are no enabled playlists, then they have all been blacklisted or disabled
    // by the user through the representations api. In this case, ignore blacklisting and
    // fallback to what the user wants by using playlists the user has not disabled.
    enabledPlaylistReps = sortedPlaylistReps.filter(function (rep) {
      return !_playlist2['default'].isDisabled(rep.playlist);
    });
  }

  // filter out any variant that has greater effective bitrate
  // than the current estimated bandwidth
  var bandwidthPlaylistReps = enabledPlaylistReps.filter(function (rep) {
    return rep.bandwidth * _config2['default'].BANDWIDTH_VARIANCE < playerBandwidth;
  });

  var highestRemainingBandwidthRep = bandwidthPlaylistReps[bandwidthPlaylistReps.length - 1];

  // get all of the renditions with the same (highest) bandwidth
  // and then taking the very first element
  var bandwidthBestRep = bandwidthPlaylistReps.filter(function (rep) {
    return rep.bandwidth === highestRemainingBandwidthRep.bandwidth;
  })[0];

  // filter out playlists without resolution information
  var haveResolution = bandwidthPlaylistReps.filter(function (rep) {
    return rep.width && rep.height;
  });

  // sort variants by resolution
  stableSort(haveResolution, function (left, right) {
    return left.width - right.width;
  });

  // if we have the exact resolution as the player use it
  var resolutionBestRepList = haveResolution.filter(function (rep) {
    return rep.width === playerWidth && rep.height === playerHeight;
  });

  highestRemainingBandwidthRep = resolutionBestRepList[resolutionBestRepList.length - 1];
  // ensure that we pick the highest bandwidth variant that have exact resolution
  var resolutionBestRep = resolutionBestRepList.filter(function (rep) {
    return rep.bandwidth === highestRemainingBandwidthRep.bandwidth;
  })[0];

  var resolutionPlusOneList = undefined;
  var resolutionPlusOneSmallest = undefined;
  var resolutionPlusOneRep = undefined;

  // find the smallest variant that is larger than the player
  // if there is no match of exact resolution
  if (!resolutionBestRep) {
    resolutionPlusOneList = haveResolution.filter(function (rep) {
      return rep.width > playerWidth || rep.height > playerHeight;
    });

    // find all the variants have the same smallest resolution
    resolutionPlusOneSmallest = resolutionPlusOneList.filter(function (rep) {
      return rep.width === resolutionPlusOneList[0].width && rep.height === resolutionPlusOneList[0].height;
    });

    // ensure that we also pick the highest bandwidth variant that
    // is just-larger-than the video player
    highestRemainingBandwidthRep = resolutionPlusOneSmallest[resolutionPlusOneSmallest.length - 1];
    resolutionPlusOneRep = resolutionPlusOneSmallest.filter(function (rep) {
      return rep.bandwidth === highestRemainingBandwidthRep.bandwidth;
    })[0];
  }

  // fallback chain of variants
  var chosenRep = resolutionPlusOneRep || resolutionBestRep || bandwidthBestRep || enabledPlaylistReps[0] || sortedPlaylistReps[0];

  return chosenRep ? chosenRep.playlist : null;
};

exports.simpleSelector = simpleSelector;
// Playlist Selectors

/**
 * Chooses the appropriate media playlist based on the most recent
 * bandwidth estimate and the player size.
 *
 * Expects to be called within the context of an instance of HlsHandler
 *
 * @return {Playlist} the highest bitrate playlist less than the
 * currently detected bandwidth, accounting for some amount of
 * bandwidth variance
 */
var lastBandwidthSelector = function lastBandwidthSelector() {
  return simpleSelector(this.playlists.master, this.systemBandwidth, parseInt(safeGetComputedStyle(this.tech_.el(), 'width'), 10), parseInt(safeGetComputedStyle(this.tech_.el(), 'height'), 10));
};

exports.lastBandwidthSelector = lastBandwidthSelector;
/**
 * Chooses the appropriate media playlist based on an
 * exponential-weighted moving average of the bandwidth after
 * filtering for player size.
 *
 * Expects to be called within the context of an instance of HlsHandler
 *
 * @param {Number} decay - a number between 0 and 1. Higher values of
 * this parameter will cause previous bandwidth estimates to lose
 * significance more quickly.
 * @return {Function} a function which can be invoked to create a new
 * playlist selector function.
 * @see https://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average
 */
var movingAverageBandwidthSelector = function movingAverageBandwidthSelector(decay) {
  var average = -1;

  if (decay < 0 || decay > 1) {
    throw new Error('Moving average bandwidth decay must be between 0 and 1.');
  }

  return function () {
    if (average < 0) {
      average = this.systemBandwidth;
    }

    average = decay * this.systemBandwidth + (1 - decay) * average;
    return simpleSelector(this.playlists.master, average, parseInt(safeGetComputedStyle(this.tech_.el(), 'width'), 10), parseInt(safeGetComputedStyle(this.tech_.el(), 'height'), 10));
  };
};

exports.movingAverageBandwidthSelector = movingAverageBandwidthSelector;
/**
 * Chooses the appropriate media playlist based on the potential to rebuffer
 *
 * @param {Object} settings
 *        Object of information required to use this selector
 * @param {Object} settings.master
 *        Object representation of the master manifest
 * @param {Number} settings.currentTime
 *        The current time of the player
 * @param {Number} settings.bandwidth
 *        Current measured bandwidth
 * @param {Number} settings.duration
 *        Duration of the media
 * @param {Number} settings.segmentDuration
 *        Segment duration to be used in round trip time calculations
 * @param {Number} settings.timeUntilRebuffer
 *        Time left in seconds until the player has to rebuffer
 * @param {Number} settings.currentTimeline
 *        The current timeline segments are being loaded from
 * @param {SyncController} settings.syncController
 *        SyncController for determining if we have a sync point for a given playlist
 * @return {Object|null}
 *         {Object} return.playlist
 *         The highest bandwidth playlist with the least amount of rebuffering
 *         {Number} return.rebufferingImpact
 *         The amount of time in seconds switching to this playlist will rebuffer. A
 *         negative value means that switching will cause zero rebuffering.
 */
var minRebufferMaxBandwidthSelector = function minRebufferMaxBandwidthSelector(settings) {
  var master = settings.master;
  var currentTime = settings.currentTime;
  var bandwidth = settings.bandwidth;
  var duration = settings.duration;
  var segmentDuration = settings.segmentDuration;
  var timeUntilRebuffer = settings.timeUntilRebuffer;
  var currentTimeline = settings.currentTimeline;
  var syncController = settings.syncController;

  // filter out any playlists that have been excluded due to
  // incompatible configurations
  var compatiblePlaylists = master.playlists.filter(function (playlist) {
    return !_playlist2['default'].isIncompatible(playlist);
  });

  // filter out any playlists that have been disabled manually through the representations
  // api or blacklisted temporarily due to playback errors.
  var enabledPlaylists = compatiblePlaylists.filter(_playlist2['default'].isEnabled);

  if (!enabledPlaylists.length) {
    // if there are no enabled playlists, then they have all been blacklisted or disabled
    // by the user through the representations api. In this case, ignore blacklisting and
    // fallback to what the user wants by using playlists the user has not disabled.
    enabledPlaylists = compatiblePlaylists.filter(function (playlist) {
      return !_playlist2['default'].isDisabled(playlist);
    });
  }

  var bandwidthPlaylists = enabledPlaylists.filter(_playlist2['default'].hasAttribute.bind(null, 'BANDWIDTH'));

  var rebufferingEstimates = bandwidthPlaylists.map(function (playlist) {
    var syncPoint = syncController.getSyncPoint(playlist, duration, currentTimeline, currentTime);
    // If there is no sync point for this playlist, switching to it will require a
    // sync request first. This will double the request time
    var numRequests = syncPoint ? 1 : 2;
    var requestTimeEstimate = _playlist2['default'].estimateSegmentRequestTime(segmentDuration, bandwidth, playlist);
    var rebufferingImpact = requestTimeEstimate * numRequests - timeUntilRebuffer;

    return {
      playlist: playlist,
      rebufferingImpact: rebufferingImpact
    };
  });

  var noRebufferingPlaylists = rebufferingEstimates.filter(function (estimate) {
    return estimate.rebufferingImpact <= 0;
  });

  // Sort by bandwidth DESC
  stableSort(noRebufferingPlaylists, function (a, b) {
    return comparePlaylistBandwidth(b.playlist, a.playlist);
  });

  if (noRebufferingPlaylists.length) {
    return noRebufferingPlaylists[0];
  }

  stableSort(rebufferingEstimates, function (a, b) {
    return a.rebufferingImpact - b.rebufferingImpact;
  });

  return rebufferingEstimates[0] || null;
};

exports.minRebufferMaxBandwidthSelector = minRebufferMaxBandwidthSelector;
/**
 * Chooses the appropriate media playlist, which in this case is the lowest bitrate
 * one with video.  If no renditions with video exist, return the lowest audio rendition.
 *
 * Expects to be called within the context of an instance of HlsHandler
 *
 * @return {Object|null}
 *         {Object} return.playlist
 *         The lowest bitrate playlist that contains a video codec.  If no such rendition
 *         exists pick the lowest audio rendition.
 */
var lowestBitrateCompatibleVariantSelector = function lowestBitrateCompatibleVariantSelector() {
  // filter out any playlists that have been excluded due to
  // incompatible configurations or playback errors
  var playlists = this.playlists.master.playlists.filter(_playlist2['default'].isEnabled);

  // Sort ascending by bitrate
  stableSort(playlists, function (a, b) {
    return comparePlaylistBandwidth(a, b);
  });

  // Parse and assume that playlists with no video codec have no video
  // (this is not necessarily true, although it is generally true).
  //
  // If an entire manifest has no valid videos everything will get filtered
  // out.
  var playlistsWithVideo = playlists.filter(function (playlist) {
    return (0, _utilCodecsJs.parseCodecs)(playlist.attributes.CODECS).videoCodec;
  });

  return playlistsWithVideo[0] || null;
};
exports.lowestBitrateCompatibleVariantSelector = lowestBitrateCompatibleVariantSelector;