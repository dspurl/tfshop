/**
 * Rollup configuration for packaging the plugin in a module that is consumable
 * by either CommonJS (e.g. Node or Browserify) or ECMAScript (e.g. Rollup).
 *
 * These modules DO NOT include their dependencies as we expect those to be
 * handled by the module system.
 */
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

export default {
  input: 'src/plugin.js',
  external: ['video.js'],
  legacy: true,
  plugins: [
    json(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        'es3',
        ['es2015', {
          loose: true,
          modules: false
        }]
      ],
      plugins: [
        'external-helpers',
        'transform-object-assign'
      ]
    })
  ],
  output: [
    {
      file: 'dist/videojs-flash.cjs.js',
      format: 'cjs',
      name: 'videojsFlash',
      globals: {
        'video.js': 'videojs'
      }
    },
    {
      file: 'dist/videojs-flash.es.js',
      format: 'es',
      name: 'videojsFlash',
      globals: {
        'video.js': 'videojs'
      }
    }
  ]
};
