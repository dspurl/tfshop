module.exports = function(config) {
  var detectBrowsers = {
    usePhantomJS: false,

    // detect what browsers are installed on the system and
    // use headless mode and flags to allow for playback
    postDetection: function(browsers) {
      var newBrowsers = [];
      if (browsers.indexOf('Chrome') !== -1) {
        newBrowsers.push('ChromeHeadlessWithFlags');
      }

      if (browsers.indexOf('Firefox') !== -1) {
        newBrowsers.push('FirefoxHeadless');
      }

      return newBrowsers;
    }
  };

  config.set({
    basePath: '..',
    frameworks: ['browserify', 'qunit', 'detectBrowsers'],

    files: [
      'node_modules/sinon/pkg/sinon.js',
      'node_modules/sinon/pkg/sinon-ie.js',
      'node_modules/video.js/dist/video.js',
      'node_modules/video.js/dist/video-js.css',
      'node_modules/videojs-flash/dist/videojs-flash.js',
      'test/**/*.js',
      'dist-test/browserify-test.js',
      'dist-test/webpack-test.js'
    ],
    exclude: [
      'test/bundle.js'
    ],
    preprocessors: {
      'test/**/*.js': ['browserify']
    },
    customLaunchers: {
      ChromeHeadlessWithFlags: {
        base: 'ChromeHeadless',
        flags: [
          '--mute-audio',
          '--no-sandbox',
          '--no-user-gesture-required'
        ]
      }
    },
    detectBrowsers: detectBrowsers,
    reporters: ['dots'],
    port: 9876,
    colors: true,
    autoWatch: false,
    singleRun: true,
    concurrency: 1,
    captureTimeout: 300000,
    browserNoActivityTimeout: 300000,
    browserDisconnectTimeout: 300000,
    browserDisconnectTolerance: 3,
    browserify: {
      debug: true,
      transform: [
        'babelify',
        'browserify-shim'
      ]
    }

  });
};
