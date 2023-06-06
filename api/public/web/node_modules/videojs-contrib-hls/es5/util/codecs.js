
/**
 * @file - codecs.js - Handles tasks regarding codec strings such as translating them to
 * codec strings, or translating codec strings into objects that can be examined.
 */

/**
 * Parses a codec string to retrieve the number of codecs specified,
 * the video codec and object type indicator, and the audio profile.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var parseCodecs = function parseCodecs() {
  var codecs = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  var result = {
    codecCount: 0
  };
  var parsed = undefined;

  result.codecCount = codecs.split(',').length;
  result.codecCount = result.codecCount || 2;

  // parse the video codec
  parsed = /(^|\s|,)+(avc1)([^ ,]*)/i.exec(codecs);
  if (parsed) {
    result.videoCodec = parsed[2];
    result.videoObjectTypeIndicator = parsed[3];
  }

  // parse the last field of the audio codec
  result.audioProfile = /(^|\s|,)+mp4a.[0-9A-Fa-f]+\.([0-9A-Fa-f]+)/i.exec(codecs);
  result.audioProfile = result.audioProfile && result.audioProfile[2];

  return result;
};
exports.parseCodecs = parseCodecs;