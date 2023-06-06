# videojs-flash

[![Build Status](https://travis-ci.org/videojs/videojs-flash.svg?branch=master)](https://travis-ci.org/videojs/videojs-flash)
[![Greenkeeper badge](https://badges.greenkeeper.io/videojs/videojs-flash.svg)](https://greenkeeper.io/)
[![Slack Status](http://slack.videojs.com/badge.svg)](http://slack.videojs.com)

[![NPM](https://nodei.co/npm/videojs-flash.png?downloads=true&downloadRank=true)](https://nodei.co/npm/videojs-flash/)

The official flash tech for the videojs player.

> NOTE: This should only be used with Video.js >= 6.0.0 as the flash tech is build into versions before that!

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Adding the Flash Tech to video.js](#adding-the-flash-tech-to-videojs)
  - [`<script>` Tag](#script-tag)
  - [Browserify](#browserify)
  - [RequireJS/AMD](#requirejsamd)
- [Force Flash playback](#force-flash-playback)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
## Installation

```sh
npm install --save videojs-flash
```

The npm installation is preferred, but Bower works, too.

```sh
bower install  --save videojs-flash
```

You can also use it via a CDN:
 ```html
<script src="https://cdn.jsdelivr.net/npm/videojs-flash@2/dist/videojs-flash.min.js"></script>
 ```

## Adding the Flash Tech to video.js

To include videojs-flash on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the tech _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-flash.min.js"></script>
<script>
  var player = videojs('my-video');
</script>
```

### Browserify

When using with Browserify, install videojs-flash via npm and `require` the tech as you would any other module.

```js
var videojs = require('video.js');

// The actual tech function is registered to video.js automatically; so, there
// is no need to assign it to a variable.
require('videojs-flash');
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the tech as you normally would:

```js
require(['video.js', 'videojs-flash'], function(videojs) {
  var player = videojs('my-video');
});
```

## Force Flash playback

By default techs are used in the order in which they are registered. This means that the HTML5 tech that is buildin to video.js is going to be registered first and thus prioritized. To change this you will have to change the `techOrder` option on video.js. See examples below

> NOTE: video.js and flash are already included in these example

Prioritize the flash tech over the HTML5 tech, but fallback to the HTML5 tech if the Flash tech does not work.
```js
videojs('some-video-id', {techOrder: ['flash', 'html5']});
```

If you don't want to fallback to the HTML5 and only want to use the Flash tech you can do this:
```js
videojs('some-video-id', {techOrder: ['flash']});
```

[See the video.js docs](https://github.com/videojs/video.js/blob/master/docs/guides/setup.md#options) for additional information and other ways to set options in video.js
[See the video.js docs](https://github.com/videojs/video.js/blob/master/docs/guides/options.md#techorder) for additional information on the `techOrder` option.

## License

Apache-2.0. Copyright (c) Brightcove, Inc.


[videojs]: http://videojs.com/
