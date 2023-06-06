CHANGELOG
=========

## HEAD (Unreleased)
_(none)_

--------------------
## 4.7.2 (2018-03-20)
* update webwackify to 0.1.6 ([#176](https://github.com/videojs/videojs-contrib-media-sources/pull/176))

--------------------
## 4.7.1 (2018-03-15)
* package: update webwackify to 0.1.5 ([#175](https://github.com/videojs/videojs-contrib-media-sources/pull/175))

--------------------
## 4.7.0 (2018-03-06)
* use webwackify for webworkers to support webpack bundle ([#173](https://github.com/videojs/videojs-contrib-media-sources/pull/173))
* update travis config ([#174](https://github.com/videojs/videojs-contrib-media-sources/pull/174))
* Update video.js dependency to allow for v6 to be installed. ([#169](https://github.com/videojs/videojs-contrib-media-sources/pull/169))

--------------------
## 4.6.2 (2017-11-06)
* update mux.js to 4.3.2 [#166](https://github.com/videojs/videojs-contrib-media-sources/pull/166)
  * flush pes packets when there is enough data

--------------------
## 4.6.1 (2017-10-24)
* update mux.js to 4.3.1 [#165](https://github.com/videojs/videojs-contrib-media-sources/pull/165)
  * Set active data channel per-field instead of globally for CEA-608
    * Fixed an issue with captions being placed in the wrong CC

--------------------
## 4.6.0 (2017-10-17)
* Append video data at end of buffer in HTML mode for IE11 for safe quality switch [#164](https://github.com/videojs/videojs-contrib-media-sources/pull/164)
  * make sure appended gops align with whats in the buffer
  * safe append mode for ie11
  * update mux.js to 4.3.0

--------------------
## 4.5.3 (2017-10-11)
* update mux.js to 4.2.2 [#162](https://github.com/videojs/videojs-contrib-media-sources/pull/162)
  * Use the first audio and video tracks in the PMT

--------------------
## 4.5.2 (2017-09-20)
* let video.js remoteTextTrack auto cleanup take care of text track cleanup [#159](https://github.com/videojs/videojs-contrib-media-sources/pull/159)

--------------------
## 4.5.1 (2017-08-28)
* fix: flv metadata tags now appened when audio info changes [#157](https://github.com/videojs/videojs-contrib-media-sources/pull/157)

--------------------
## 4.5.0 (2017-08-18)
* fix duplicate caption processing [#156](https://github.com/videojs/videojs-contrib-media-sources/pull/156)
* Support for multiple CEA608 tracks and HLS-provided track names [#140](https://github.com/videojs/videojs-contrib-media-sources/pull/140)

--------------------
## 4.4.8 (2017-07-17)
* Fix processing segments when mediaSource is closed [#151](https://github.com/videojs/videojs-contrib-media-sources/pull/151)

--------------------
## 4.4.7 (2017-07-12)
* Fix disabled audio for a single audio only source buffer [#152](https://github.com/videojs/videojs-contrib-media-sources/pull/152)
  * disable audio based on codec info when only one source buffer
  * allow audio only source buffer creation for flash

--------------------
## 4.4.6 (2017-06-27)
* update mux.js to v4.1.5 [#150](https://github.com/videojs/videojs-contrib-media-sources/pull/150)
  * Only flush PES packets from TS parsing front end when they are complete
    * Complete is defined as any time PES_packet_length matches the data’s length OR is a video packets
    * Works around an issue with incomplete packets getting sent down the pipeline when the source has audio PES packets split between segments

--------------------
## 4.4.5 (2017-05-16)
* update mux.js to 4.1.4 [#144](https://github.com/videojs/videojs-contrib-media-sources/pull/144)
  * ts probe searches packets for first it can successfully parse
* Fixed an issue that could cause updateend events to fire more than once per append or remove under very specific conditions on firefox [#142](https://github.com/videojs/videojs-contrib-media-sources/pull/142)
  * wrapping source buffer objects so that we can handle the `updating` state ourselves

--------------------
## 4.4.4 (2017-04-24)
* update mux.js to 4.1.3 [#141](https://github.com/videojs/videojs-contrib-media-sources/pull/141)

--------------------
## 4.4.3 (2017-04-10)
* update mux.js to 4.1.2 [#139](https://github.com/videojs/videojs-contrib-media-sources/pull/139)

--------------------
## 4.4.2 (2017-03-03)
* update mux.js to v4.1.1 [#138](https://github.com/videojs/videojs-contrib-media-sources/pull/138)
  * Fix silence insertion to not insert extra frames when audio is offset [#143](https://github.com/videojs/mux.js/pull/143)
