<a name="2.2.1"></a>
## [2.2.1](https://github.com/videojs/videojs-flash/compare/v2.2.0...v2.2.1) (2019-10-03)

### Bug Fixes

* ignore Chrome on iOS ([#143](https://github.com/videojs/videojs-flash/issues/143)) ([e586938](https://github.com/videojs/videojs-flash/commit/e586938)), closes [#142](https://github.com/videojs/videojs-flash/issues/142)
* typo with getters ([#120](https://github.com/videojs/videojs-flash/issues/120)) ([2f4f435](https://github.com/videojs/videojs-flash/commit/2f4f435))

### Chores

* Update deps ([#144](https://github.com/videojs/videojs-flash/issues/144)) ([1203664](https://github.com/videojs/videojs-flash/commit/1203664))

<a name="2.2.0"></a>
# [2.2.0](https://github.com/videojs/videojs-flash/compare/v2.1.2...v2.2.0) (2019-02-12)

### Features

* support microsoft edge ([#111](https://github.com/videojs/videojs-flash/issues/111)) ([34ffa8e](https://github.com/videojs/videojs-flash/commit/34ffa8e))

### Chores

* minimal rollup update along with npm audit updates to get build working ([#116](https://github.com/videojs/videojs-flash/issues/116)) ([94eecb4](https://github.com/videojs/videojs-flash/commit/94eecb4))

<a name="2.1.2"></a>
## [2.1.2](https://github.com/videojs/videojs-flash/compare/v2.1.1...v2.1.2) (2018-09-24)

### Bug Fixes

* **package:** update videojs-swf to version 5.4.2 🚀 ([#90](https://github.com/videojs/videojs-flash/issues/90)) ([fe0d952](https://github.com/videojs/videojs-flash/commit/fe0d952))
* rtmp parameters can contains "-" ([#59](https://github.com/videojs/videojs-flash/issues/59)) ([3d5087d](https://github.com/videojs/videojs-flash/commit/3d5087d))

### Chores

* update index.html to work better ([#85](https://github.com/videojs/videojs-flash/issues/85)) ([e5e990f](https://github.com/videojs/videojs-flash/commit/e5e990f))
* **package-lock:** upgrade to npm 6.4.1 ([aa8db77](https://github.com/videojs/videojs-flash/commit/aa8db77))

<a name="2.1.1"></a>
## [2.1.1](https://github.com/videojs/videojs-flash/compare/v2.1.0...v2.1.1) (2018-07-05)

### Chores

* enable Greenkeeper 🌴 ([#62](https://github.com/videojs/videojs-flash/issues/62)) ([09963ea](https://github.com/videojs/videojs-flash/commit/09963ea))
* update to add vjs 7 support ([#75](https://github.com/videojs/videojs-flash/issues/75)) ([7fd4a27](https://github.com/videojs/videojs-flash/commit/7fd4a27)), closes [#76](https://github.com/videojs/videojs-flash/issues/76)
* **package:** update conventional-changelog-cli to version 2.0.0 ([#72](https://github.com/videojs/videojs-flash/issues/72)) ([d9366f7](https://github.com/videojs/videojs-flash/commit/d9366f7))

<a name="2.1.0"></a>
# [2.1.0](https://github.com/videojs/videojs-flash/compare/v2.0.2...v2.1.0) (2017-12-14)

### Features

* forward errors from swf without altering when error is not just a string ([#55](https://github.com/videojs/videojs-flash/issues/55)) ([e594ffa](https://github.com/videojs/videojs-flash/commit/e594ffa))

### Chores

* add .nvmrc to point at node LTS ([1da7ce8](https://github.com/videojs/videojs-flash/commit/1da7ce8))
* add in-publish to build process and use node 8 in CI ([#56](https://github.com/videojs/videojs-flash/issues/56)) ([8605ef3](https://github.com/videojs/videojs-flash/commit/8605ef3))

<a name="2.0.2"></a>
## [2.0.2](https://github.com/videojs/videojs-flash/compare/v2.0.1...v2.0.2) (2017-12-14)

### Bug Fixes

* Always load SWF file over HTTPS ([#52](https://github.com/videojs/videojs-flash/issues/52)) ([58c7276](https://github.com/videojs/videojs-flash/commit/58c7276))
* returns true for support on desktop chrome and safari ([#39](https://github.com/videojs/videojs-flash/issues/39)) ([eea6baa](https://github.com/videojs/videojs-flash/commit/eea6baa)), closes [#26](https://github.com/videojs/videojs-flash/issues/26)

### Documentation

* Add a CDN link to README ([#37](https://github.com/videojs/videojs-flash/issues/37)) ([9f8ad52](https://github.com/videojs/videojs-flash/commit/9f8ad52))

<a name="2.0.1"></a>
## [2.0.1](https://github.com/videojs/videojs-flash/compare/v2.0.0...v2.0.1) (2017-07-27)

### Chores

* **package:** update to swf 5.4.1 ([#28](https://github.com/videojs/videojs-flash/issues/28)) ([b9fcbad](https://github.com/videojs/videojs-flash/commit/b9fcbad))

<a name="2.0.0"></a>
# [2.0.0](https://github.com/videojs/videojs-flash/compare/v1.0.0-RC.0...v2.0.0) (2017-05-23)

### Features

* Get video playback quality ([#16](https://github.com/videojs/videojs-flash/issues/16)) ([4662c65](https://github.com/videojs/videojs-flash/commit/4662c65))

### Bug Fixes

* inline-json the swf version ([#10](https://github.com/videojs/videojs-flash/issues/10)) ([2264761](https://github.com/videojs/videojs-flash/commit/2264761)), closes [#9](https://github.com/videojs/videojs-flash/issues/9)
* register Flash once and warn if already registered ([#5](https://github.com/videojs/videojs-flash/issues/5)) ([c8ce70e](https://github.com/videojs/videojs-flash/commit/c8ce70e))

### Chores

* **package:** make sure repo urls are in package.json ([#6](https://github.com/videojs/videojs-flash/issues/6)) ([7a9c503](https://github.com/videojs/videojs-flash/commit/7a9c503))
* **package:** update swf to 5.2.0 ([#7](https://github.com/videojs/videojs-flash/issues/7)) ([62895bd](https://github.com/videojs/videojs-flash/commit/62895bd))
* Update tooling using generator v5 prerelease. ([#17](https://github.com/videojs/videojs-flash/issues/17)) ([52ac92d](https://github.com/videojs/videojs-flash/commit/52ac92d))

### Documentation

* Fix a typo in the Flash-only example code in README.md ([#18](https://github.com/videojs/videojs-flash/issues/18)) ([ebd9020](https://github.com/videojs/videojs-flash/commit/ebd9020))
* fix the docs, plugin -> tech ([#12](https://github.com/videojs/videojs-flash/issues/12)) ([215b8d3](https://github.com/videojs/videojs-flash/commit/215b8d3))


### BREAKING CHANGES

* Remove Bower support.

CHANGELOG
=========

## HEAD (Unreleased)
_(none)_

--------------------

## 1.0.1 (2017-04-27)
_(none)_

## 1.0.0-RC.2 (2017-03-07)
_(none)_

