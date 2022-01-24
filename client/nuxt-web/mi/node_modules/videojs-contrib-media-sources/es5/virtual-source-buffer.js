/**
 * @file virtual-source-buffer.js
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

var _videoJs = require('video.js');

var _videoJs2 = _interopRequireDefault(_videoJs);

var _createTextTracksIfNecessary = require('./create-text-tracks-if-necessary');

var _createTextTracksIfNecessary2 = _interopRequireDefault(_createTextTracksIfNecessary);

var _removeCuesFromTrack = require('./remove-cues-from-track');

var _removeCuesFromTrack2 = _interopRequireDefault(_removeCuesFromTrack);

var _addTextTrackData = require('./add-text-track-data');

var _webwackify = require('webwackify');

var _webwackify2 = _interopRequireDefault(_webwackify);

var _transmuxerWorker = require('./transmuxer-worker');

var _transmuxerWorker2 = _interopRequireDefault(_transmuxerWorker);

var _codecUtils = require('./codec-utils');

var resolveTransmuxWorker = function resolveTransmuxWorker() {
  var result = undefined;

  try {
    result = require.resolve('./transmuxer-worker');
  } catch (e) {
    // no result
  }

  return result;
};

// We create a wrapper around the SourceBuffer so that we can manage the
// state of the `updating` property manually. We have to do this because
// Firefox changes `updating` to false long before triggering `updateend`
// events and that was causing strange problems in videojs-contrib-hls
var makeWrappedSourceBuffer = function makeWrappedSourceBuffer(mediaSource, mimeType) {
  var sourceBuffer = mediaSource.addSourceBuffer(mimeType);
  var wrapper = Object.create(null);

  wrapper.updating = false;
  wrapper.realBuffer_ = sourceBuffer;

  var _loop = function (key) {
    if (typeof sourceBuffer[key] === 'function') {
      wrapper[key] = function () {
        return sourceBuffer[key].apply(sourceBuffer, arguments);
      };
    } else if (typeof wrapper[key] === 'undefined') {
      Object.defineProperty(wrapper, key, {
        get: function get() {
          return sourceBuffer[key];
        },
        set: function set(v) {
          return sourceBuffer[key] = v;
        }
      });
    }
  };

  for (var key in sourceBuffer) {
    _loop(key);
  }

  return wrapper;
};

/**
 * Returns a list of gops in the buffer that have a pts value of 3 seconds or more in
 * front of current time.
 *
 * @param {Array} buffer
 *        The current buffer of gop information
 * @param {Player} player
 *        The player instance
 * @param {Double} mapping
 *        Offset to map display time to stream presentation time
 * @return {Array}
 *         List of gops considered safe to append over
 */
var gopsSafeToAlignWith = function gopsSafeToAlignWith(buffer, player, mapping) {
  if (!player || !buffer.length) {
    return [];
  }

  // pts value for current time + 3 seconds to give a bit more wiggle room
  var currentTimePts = Math.ceil((player.currentTime() - mapping + 3) * 90000);

  var i = undefined;

  for (i = 0; i < buffer.length; i++) {
    if (buffer[i].pts > currentTimePts) {
      break;
    }
  }

  return buffer.slice(i);
};

exports.gopsSafeToAlignWith = gopsSafeToAlignWith;
/**
 * Appends gop information (timing and byteLength) received by the transmuxer for the
 * gops appended in the last call to appendBuffer
 *
 * @param {Array} buffer
 *        The current buffer of gop information
 * @param {Array} gops
 *        List of new gop information
 * @param {boolean} replace
 *        If true, replace the buffer with the new gop information. If false, append the
 *        new gop information to the buffer in the right location of time.
 * @return {Array}
 *         Updated list of gop information
 */
var updateGopBuffer = function updateGopBuffer(buffer, gops, replace) {
  if (!gops.length) {
    return buffer;
  }

  if (replace) {
    // If we are in safe append mode, then completely overwrite the gop buffer
    // with the most recent appeneded data. This will make sure that when appending
    // future segments, we only try to align with gops that are both ahead of current
    // time and in the last segment appended.
    return gops.slice();
  }

  var start = gops[0].pts;

  var i = 0;

  for (i; i < buffer.length; i++) {
    if (buffer[i].pts >= start) {
      break;
    }
  }

  return buffer.slice(0, i).concat(gops);
};

exports.updateGopBuffer = updateGopBuffer;
/**
 * Removes gop information in buffer that overlaps with provided start and end
 *
 * @param {Array} buffer
 *        The current buffer of gop information
 * @param {Double} start
 *        position to start the remove at
 * @param {Double} end
 *        position to end the remove at
 * @param {Double} mapping
 *        Offset to map display time to stream presentation time
 */
var removeGopBuffer = function removeGopBuffer(buffer, start, end, mapping) {
  var startPts = Math.ceil((start - mapping) * 90000);
  var endPts = Math.ceil((end - mapping) * 90000);
  var updatedBuffer = buffer.slice();

  var i = buffer.length;

  while (i--) {
    if (buffer[i].pts <= endPts) {
      break;
    }
  }

  if (i === -1) {
    // no removal because end of remove range is before start of buffer
    return updatedBuffer;
  }

  var j = i + 1;

  while (j--) {
    if (buffer[j].pts <= startPts) {
      break;
    }
  }

  // clamp remove range start to 0 index
  j = Math.max(j, 0);

  updatedBuffer.splice(j, i - j + 1);

  return updatedBuffer;
};

exports.removeGopBuffer = removeGopBuffer;
/**
 * VirtualSourceBuffers exist so that we can transmux non native formats
 * into a native format, but keep the same api as a native source buffer.
 * It creates a transmuxer, that works in its own thread (a web worker) and
 * that transmuxer muxes the data into a native format. VirtualSourceBuffer will
 * then send all of that data to the naive sourcebuffer so that it is
 * indestinguishable from a natively supported format.
 *
 * @param {HtmlMediaSource} mediaSource the parent mediaSource
 * @param {Array} codecs array of codecs that we will be dealing with
 * @class VirtualSourceBuffer
 * @extends video.js.EventTarget
 */

var VirtualSourceBuffer = (function (_videojs$EventTarget) {
  _inherits(VirtualSourceBuffer, _videojs$EventTarget);

  function VirtualSourceBuffer(mediaSource, codecs) {
    var _this = this;

    _classCallCheck(this, VirtualSourceBuffer);

    _get(Object.getPrototypeOf(VirtualSourceBuffer.prototype), 'constructor', this).call(this, _videoJs2['default'].EventTarget);
    this.timestampOffset_ = 0;
    this.pendingBuffers_ = [];
    this.bufferUpdating_ = false;

    this.mediaSource_ = mediaSource;
    this.codecs_ = codecs;
    this.audioCodec_ = null;
    this.videoCodec_ = null;
    this.audioDisabled_ = false;
    this.appendAudioInitSegment_ = true;
    this.gopBuffer_ = [];
    this.timeMapping_ = 0;
    this.safeAppend_ = _videoJs2['default'].browser.IE_VERSION >= 11;

    var options = {
      remux: false,
      alignGopsAtEnd: this.safeAppend_
    };

    this.codecs_.forEach(function (codec) {
      if ((0, _codecUtils.isAudioCodec)(codec)) {
        _this.audioCodec_ = codec;
      } else if ((0, _codecUtils.isVideoCodec)(codec)) {
        _this.videoCodec_ = codec;
      }
    });

    // append muxed segments to their respective native buffers as
    // soon as they are available
    this.transmuxer_ = (0, _webwackify2['default'])(_transmuxerWorker2['default'], resolveTransmuxWorker());
    this.transmuxer_.postMessage({ action: 'init', options: options });

    this.transmuxer_.onmessage = function (event) {
      if (event.data.action === 'data') {
        return _this.data_(event);
      }

      if (event.data.action === 'done') {
        return _this.done_(event);
      }

      if (event.data.action === 'gopInfo') {
        return _this.appendGopInfo_(event);
      }
    };

    // this timestampOffset is a property with the side-effect of resetting
    // baseMediaDecodeTime in the transmuxer on the setter
    Object.defineProperty(this, 'timestampOffset', {
      get: function get() {
        return this.timestampOffset_;
      },
      set: function set(val) {
        if (typeof val === 'number' && val >= 0) {
          this.timestampOffset_ = val;
          this.appendAudioInitSegment_ = true;

          // reset gop buffer on timestampoffset as this signals a change in timeline
          this.gopBuffer_.length = 0;
          this.timeMapping_ = 0;

          // We have to tell the transmuxer to set the baseMediaDecodeTime to
          // the desired timestampOffset for the next segment
          this.transmuxer_.postMessage({
            action: 'setTimestampOffset',
            timestampOffset: val
          });
        }
      }
    });

    // setting the append window affects both source buffers
    Object.defineProperty(this, 'appendWindowStart', {
      get: function get() {
        return (this.videoBuffer_ || this.audioBuffer_).appendWindowStart;
      },
      set: function set(start) {
        if (this.videoBuffer_) {
          this.videoBuffer_.appendWindowStart = start;
        }
        if (this.audioBuffer_) {
          this.audioBuffer_.appendWindowStart = start;
        }
      }
    });

    // this buffer is "updating" if either of its native buffers are
    Object.defineProperty(this, 'updating', {
      get: function get() {
        return !!(this.bufferUpdating_ || !this.audioDisabled_ && this.audioBuffer_ && this.audioBuffer_.updating || this.videoBuffer_ && this.videoBuffer_.updating);
      }
    });

    // the buffered property is the intersection of the buffered
    // ranges of the native source buffers
    Object.defineProperty(this, 'buffered', {
      get: function get() {
        var start = null;
        var end = null;
        var arity = 0;
        var extents = [];
        var ranges = [];

        // neither buffer has been created yet
        if (!this.videoBuffer_ && !this.audioBuffer_) {
          return _videoJs2['default'].createTimeRange();
        }

        // only one buffer is configured
        if (!this.videoBuffer_) {
          return this.audioBuffer_.buffered;
        }
        if (!this.audioBuffer_) {
          return this.videoBuffer_.buffered;
        }

        // both buffers are configured
        if (this.audioDisabled_) {
          return this.videoBuffer_.buffered;
        }

        // both buffers are empty
        if (this.videoBuffer_.buffered.length === 0 && this.audioBuffer_.buffered.length === 0) {
          return _videoJs2['default'].createTimeRange();
        }

        // Handle the case where we have both buffers and create an
        // intersection of the two
        var videoBuffered = this.videoBuffer_.buffered;
        var audioBuffered = this.audioBuffer_.buffered;
        var count = videoBuffered.length;

        // A) Gather up all start and end times
        while (count--) {
          extents.push({ time: videoBuffered.start(count), type: 'start' });
          extents.push({ time: videoBuffered.end(count), type: 'end' });
        }
        count = audioBuffered.length;
        while (count--) {
          extents.push({ time: audioBuffered.start(count), type: 'start' });
          extents.push({ time: audioBuffered.end(count), type: 'end' });
        }
        // B) Sort them by time
        extents.sort(function (a, b) {
          return a.time - b.time;
        });

        // C) Go along one by one incrementing arity for start and decrementing
        //    arity for ends
        for (count = 0; count < extents.length; count++) {
          if (extents[count].type === 'start') {
            arity++;

            // D) If arity is ever incremented to 2 we are entering an
            //    overlapping range
            if (arity === 2) {
              start = extents[count].time;
            }
          } else if (extents[count].type === 'end') {
            arity--;

            // E) If arity is ever decremented to 1 we leaving an
            //    overlapping range
            if (arity === 1) {
              end = extents[count].time;
            }
          }

          // F) Record overlapping ranges
          if (start !== null && end !== null) {
            ranges.push([start, end]);
            start = null;
            end = null;
          }
        }

        return _videoJs2['default'].createTimeRanges(ranges);
      }
    });
  }

  /**
   * When we get a data event from the transmuxer
   * we call this function and handle the data that
   * was sent to us
   *
   * @private
   * @param {Event} event the data event from the transmuxer
   */

  _createClass(VirtualSourceBuffer, [{
    key: 'data_',
    value: function data_(event) {
      var segment = event.data.segment;

      // Cast ArrayBuffer to TypedArray
      segment.data = new Uint8Array(segment.data, event.data.byteOffset, event.data.byteLength);

      segment.initSegment = new Uint8Array(segment.initSegment.data, segment.initSegment.byteOffset, segment.initSegment.byteLength);

      (0, _createTextTracksIfNecessary2['default'])(this, this.mediaSource_, segment);

      // Add the segments to the pendingBuffers array
      this.pendingBuffers_.push(segment);
      return;
    }

    /**
     * When we get a done event from the transmuxer
     * we call this function and we process all
     * of the pending data that we have been saving in the
     * data_ function
     *
     * @private
     * @param {Event} event the done event from the transmuxer
     */
  }, {
    key: 'done_',
    value: function done_(event) {
      // Don't process and append data if the mediaSource is closed
      if (this.mediaSource_.readyState === 'closed') {
        this.pendingBuffers_.length = 0;
        return;
      }

      // All buffers should have been flushed from the muxer
      // start processing anything we have received
      this.processPendingSegments_();
      return;
    }

    /**
     * Create our internal native audio/video source buffers and add
     * event handlers to them with the following conditions:
     * 1. they do not already exist on the mediaSource
     * 2. this VSB has a codec for them
     *
     * @private
     */
  }, {
    key: 'createRealSourceBuffers_',
    value: function createRealSourceBuffers_() {
      var _this2 = this;

      var types = ['audio', 'video'];

      types.forEach(function (type) {
        // Don't create a SourceBuffer of this type if we don't have a
        // codec for it
        if (!_this2[type + 'Codec_']) {
          return;
        }

        // Do nothing if a SourceBuffer of this type already exists
        if (_this2[type + 'Buffer_']) {
          return;
        }

        var buffer = null;

        // If the mediasource already has a SourceBuffer for the codec
        // use that
        if (_this2.mediaSource_[type + 'Buffer_']) {
          buffer = _this2.mediaSource_[type + 'Buffer_'];
          // In multiple audio track cases, the audio source buffer is disabled
          // on the main VirtualSourceBuffer by the HTMLMediaSource much earlier
          // than createRealSourceBuffers_ is called to create the second
          // VirtualSourceBuffer because that happens as a side-effect of
          // videojs-contrib-hls starting the audioSegmentLoader. As a result,
          // the audioBuffer is essentially "ownerless" and no one will toggle
          // the `updating` state back to false once the `updateend` event is received
          //
          // Setting `updating` to false manually will work around this
          // situation and allow work to continue
          buffer.updating = false;
        } else {
          var codecProperty = type + 'Codec_';
          var mimeType = type + '/mp4;codecs="' + _this2[codecProperty] + '"';

          buffer = makeWrappedSourceBuffer(_this2.mediaSource_.nativeMediaSource_, mimeType);

          _this2.mediaSource_[type + 'Buffer_'] = buffer;
        }

        _this2[type + 'Buffer_'] = buffer;

        // Wire up the events to the SourceBuffer
        ['update', 'updatestart', 'updateend'].forEach(function (event) {
          buffer.addEventListener(event, function () {
            // if audio is disabled
            if (type === 'audio' && _this2.audioDisabled_) {
              return;
            }

            if (event === 'updateend') {
              _this2[type + 'Buffer_'].updating = false;
            }

            var shouldTrigger = types.every(function (t) {
              // skip checking audio's updating status if audio
              // is not enabled
              if (t === 'audio' && _this2.audioDisabled_) {
                return true;
              }
              // if the other type if updating we don't trigger
              if (type !== t && _this2[t + 'Buffer_'] && _this2[t + 'Buffer_'].updating) {
                return false;
              }
              return true;
            });

            if (shouldTrigger) {
              return _this2.trigger(event);
            }
          });
        });
      });
    }

    /**
     * Emulate the native mediasource function, but our function will
     * send all of the proposed segments to the transmuxer so that we
     * can transmux them before we append them to our internal
     * native source buffers in the correct format.
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/API/SourceBuffer/appendBuffer
     * @param {Uint8Array} segment the segment to append to the buffer
     */
  }, {
    key: 'appendBuffer',
    value: function appendBuffer(segment) {
      // Start the internal "updating" state
      this.bufferUpdating_ = true;

      if (this.audioBuffer_ && this.audioBuffer_.buffered.length) {
        var audioBuffered = this.audioBuffer_.buffered;

        this.transmuxer_.postMessage({
          action: 'setAudioAppendStart',
          appendStart: audioBuffered.end(audioBuffered.length - 1)
        });
      }

      if (this.videoBuffer_) {
        this.transmuxer_.postMessage({
          action: 'alignGopsWith',
          gopsToAlignWith: gopsSafeToAlignWith(this.gopBuffer_, this.mediaSource_.player_, this.timeMapping_)
        });
      }

      this.transmuxer_.postMessage({
        action: 'push',
        // Send the typed-array of data as an ArrayBuffer so that
        // it can be sent as a "Transferable" and avoid the costly
        // memory copy
        data: segment.buffer,

        // To recreate the original typed-array, we need information
        // about what portion of the ArrayBuffer it was a view into
        byteOffset: segment.byteOffset,
        byteLength: segment.byteLength
      }, [segment.buffer]);
      this.transmuxer_.postMessage({ action: 'flush' });
    }

    /**
     * Appends gop information (timing and byteLength) received by the transmuxer for the
     * gops appended in the last call to appendBuffer
     *
     * @param {Event} event
     *        The gopInfo event from the transmuxer
     * @param {Array} event.data.gopInfo
     *        List of gop info to append
     */
  }, {
    key: 'appendGopInfo_',
    value: function appendGopInfo_(event) {
      this.gopBuffer_ = updateGopBuffer(this.gopBuffer_, event.data.gopInfo, this.safeAppend_);
    }

    /**
     * Emulate the native mediasource function and remove parts
     * of the buffer from any of our internal buffers that exist
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/API/SourceBuffer/remove
     * @param {Double} start position to start the remove at
     * @param {Double} end position to end the remove at
     */
  }, {
    key: 'remove',
    value: function remove(start, end) {
      if (this.videoBuffer_) {
        this.videoBuffer_.updating = true;
        this.videoBuffer_.remove(start, end);
        this.gopBuffer_ = removeGopBuffer(this.gopBuffer_, start, end, this.timeMapping_);
      }
      if (!this.audioDisabled_ && this.audioBuffer_) {
        this.audioBuffer_.updating = true;
        this.audioBuffer_.remove(start, end);
      }

      // Remove Metadata Cues (id3)
      (0, _removeCuesFromTrack2['default'])(start, end, this.metadataTrack_);

      // Remove Any Captions
      if (this.inbandTextTracks_) {
        for (var track in this.inbandTextTracks_) {
          (0, _removeCuesFromTrack2['default'])(start, end, this.inbandTextTracks_[track]);
        }
      }
    }

    /**
     * Process any segments that the muxer has output
     * Concatenate segments together based on type and append them into
     * their respective sourceBuffers
     *
     * @private
     */
  }, {
    key: 'processPendingSegments_',
    value: function processPendingSegments_() {
      var sortedSegments = {
        video: {
          segments: [],
          bytes: 0
        },
        audio: {
          segments: [],
          bytes: 0
        },
        captions: [],
        metadata: []
      };

      // Sort segments into separate video/audio arrays and
      // keep track of their total byte lengths
      sortedSegments = this.pendingBuffers_.reduce(function (segmentObj, segment) {
        var type = segment.type;
        var data = segment.data;
        var initSegment = segment.initSegment;

        segmentObj[type].segments.push(data);
        segmentObj[type].bytes += data.byteLength;

        segmentObj[type].initSegment = initSegment;

        // Gather any captions into a single array
        if (segment.captions) {
          segmentObj.captions = segmentObj.captions.concat(segment.captions);
        }

        if (segment.info) {
          segmentObj[type].info = segment.info;
        }

        // Gather any metadata into a single array
        if (segment.metadata) {
          segmentObj.metadata = segmentObj.metadata.concat(segment.metadata);
        }

        return segmentObj;
      }, sortedSegments);

      // Create the real source buffers if they don't exist by now since we
      // finally are sure what tracks are contained in the source
      if (!this.videoBuffer_ && !this.audioBuffer_) {
        // Remove any codecs that may have been specified by default but
        // are no longer applicable now
        if (sortedSegments.video.bytes === 0) {
          this.videoCodec_ = null;
        }
        if (sortedSegments.audio.bytes === 0) {
          this.audioCodec_ = null;
        }

        this.createRealSourceBuffers_();
      }

      if (sortedSegments.audio.info) {
        this.mediaSource_.trigger({ type: 'audioinfo', info: sortedSegments.audio.info });
      }
      if (sortedSegments.video.info) {
        this.mediaSource_.trigger({ type: 'videoinfo', info: sortedSegments.video.info });
      }

      if (this.appendAudioInitSegment_) {
        if (!this.audioDisabled_ && this.audioBuffer_) {
          sortedSegments.audio.segments.unshift(sortedSegments.audio.initSegment);
          sortedSegments.audio.bytes += sortedSegments.audio.initSegment.byteLength;
        }
        this.appendAudioInitSegment_ = false;
      }

      var triggerUpdateend = false;

      // Merge multiple video and audio segments into one and append
      if (this.videoBuffer_ && sortedSegments.video.bytes) {
        sortedSegments.video.segments.unshift(sortedSegments.video.initSegment);
        sortedSegments.video.bytes += sortedSegments.video.initSegment.byteLength;
        this.concatAndAppendSegments_(sortedSegments.video, this.videoBuffer_);
        // TODO: are video tracks the only ones with text tracks?
        (0, _addTextTrackData.addTextTrackData)(this, sortedSegments.captions, sortedSegments.metadata);
      } else if (this.videoBuffer_ && (this.audioDisabled_ || !this.audioBuffer_)) {
        // The transmuxer did not return any bytes of video, meaning it was all trimmed
        // for gop alignment. Since we have a video buffer and audio is disabled, updateend
        // will never be triggered by this source buffer, which will cause contrib-hls
        // to be stuck forever waiting for updateend. If audio is not disabled, updateend
        // will be triggered by the audio buffer, which will be sent upwards since the video
        // buffer will not be in an updating state.
        triggerUpdateend = true;
      }

      if (!this.audioDisabled_ && this.audioBuffer_) {
        this.concatAndAppendSegments_(sortedSegments.audio, this.audioBuffer_);
      }

      this.pendingBuffers_.length = 0;

      if (triggerUpdateend) {
        this.trigger('updateend');
      }

      // We are no longer in the internal "updating" state
      this.bufferUpdating_ = false;
    }

    /**
     * Combine all segments into a single Uint8Array and then append them
     * to the destination buffer
     *
     * @param {Object} segmentObj
     * @param {SourceBuffer} destinationBuffer native source buffer to append data to
     * @private
     */
  }, {
    key: 'concatAndAppendSegments_',
    value: function concatAndAppendSegments_(segmentObj, destinationBuffer) {
      var offset = 0;
      var tempBuffer = undefined;

      if (segmentObj.bytes) {
        tempBuffer = new Uint8Array(segmentObj.bytes);

        // Combine the individual segments into one large typed-array
        segmentObj.segments.forEach(function (segment) {
          tempBuffer.set(segment, offset);
          offset += segment.byteLength;
        });

        try {
          destinationBuffer.updating = true;
          destinationBuffer.appendBuffer(tempBuffer);
        } catch (error) {
          if (this.mediaSource_.player_) {
            this.mediaSource_.player_.error({
              code: -3,
              type: 'APPEND_BUFFER_ERR',
              message: error.message,
              originalError: error
            });
          }
        }
      }
    }

    /**
     * Emulate the native mediasource function. abort any soureBuffer
     * actions and throw out any un-appended data.
     *
     * @link https://developer.mozilla.org/en-US/docs/Web/API/SourceBuffer/abort
     */
  }, {
    key: 'abort',
    value: function abort() {
      if (this.videoBuffer_) {
        this.videoBuffer_.abort();
      }
      if (!this.audioDisabled_ && this.audioBuffer_) {
        this.audioBuffer_.abort();
      }
      if (this.transmuxer_) {
        this.transmuxer_.postMessage({ action: 'reset' });
      }
      this.pendingBuffers_.length = 0;
      this.bufferUpdating_ = false;
    }
  }]);

  return VirtualSourceBuffer;
})(_videoJs2['default'].EventTarget);

exports['default'] = VirtualSourceBuffer;