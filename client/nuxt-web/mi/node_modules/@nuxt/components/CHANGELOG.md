# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.1.8](https://github.com/nuxt/components/compare/v2.1.7...v2.1.8) (2021-04-28)


### Bug Fixes

* **pkg:** explicitly export package.json (resolves [#191](https://github.com/nuxt/components/issues/191)) ([5949790](https://github.com/nuxt/components/commit/59497903614ff1a47c190bac5115b0622190831a))

### [2.1.7](https://github.com/nuxt/components/compare/v2.1.6...v2.1.7) (2021-04-28)


### Bug Fixes

* use consola for output info ([#184](https://github.com/nuxt/components/issues/184)) ([c6c3f66](https://github.com/nuxt/components/commit/c6c3f66f0bb86c3d7a2a1eac737aa145e64b0fc7))

### [2.1.6](https://github.com/nuxt/components/compare/v2.1.5...v2.1.6) (2021-04-06)


### Bug Fixes

* use parent dir name for index.[ext] components without pathPrefix ([#178](https://github.com/nuxt/components/issues/178)) ([6ba6d22](https://github.com/nuxt/components/commit/6ba6d2243a0ebac2acc515ded3003827f62f7505))

### [2.1.5](https://github.com/nuxt/components/compare/v2.1.4...v2.1.5) (2021-04-06)


### Bug Fixes

* avoid importing global entry (fixes [#176](https://github.com/nuxt/components/issues/176)) ([c821719](https://github.com/nuxt/components/commit/c821719a2b47a57b0252426975992ffd8143a939))

### [2.1.4](https://github.com/nuxt/components/compare/v2.1.3...v2.1.4) (2021-03-23)


### Bug Fixes

* use wrapper for lazy-loaded functional components ([#172](https://github.com/nuxt/components/issues/172)) ([0210066](https://github.com/nuxt/components/commit/021006680e7d37f0f4aaa1bfe7de8a4692f2eb9e))

### [2.1.3](https://github.com/nuxt/components/compare/v2.1.2...v2.1.3) (2021-03-11)


### Bug Fixes

* use hyphenate instead of kebabCase (fixes [#165](https://github.com/nuxt/components/issues/165)) ([3de27ff](https://github.com/nuxt/components/commit/3de27ff47cbe6e7c712a2a105c257dac1ca64674))

### [2.1.2](https://github.com/nuxt/components/compare/v2.1.1...v2.1.2) (2021-02-22)


### Bug Fixes

* avoid using .md for templates (resolves nuxt/nuxt.js[#8860](https://github.com/nuxt/components/issues/8860)) ([9e6e180](https://github.com/nuxt/components/commit/9e6e1808c09ec78004715ffb009055b0dda11986))

### [2.1.1](https://github.com/nuxt/components/compare/v2.1.0...v2.1.1) (2021-02-17)


### Bug Fixes

* **pkg:** change postinstall to prepare ([6742b4a](https://github.com/nuxt/components/commit/6742b4ac1fd734e6199ce82d4eaf6d40dbd8f4d3))

## [2.1.0](https://github.com/nuxt/components/compare/v2.0.0...v2.1.0) (2021-02-16)


### Features

* allow disabling prefix by path using pathPrefix option ([#150](https://github.com/nuxt/components/issues/150)) ([2a2acdf](https://github.com/nuxt/components/commit/2a2acdf0826d360e7229e0e30b3c844a9c315283))


### Bug Fixes

* ignore .d.ts files (resolves [#146](https://github.com/nuxt/components/issues/146)) ([1062abf](https://github.com/nuxt/components/commit/1062abf6264987bbdce6e23a61ce8780f8aab1ba))
* improve scanner ([#149](https://github.com/nuxt/components/issues/149)) ([62e951c](https://github.com/nuxt/components/commit/62e951cb607336d957b120bd6fdc34ebe91aa089))
* **scan:** avoid duplicate prefix ([#148](https://github.com/nuxt/components/issues/148)) ([276aa76](https://github.com/nuxt/components/commit/276aa7672c6c4b434c7eb03c6215c4501ef553ba))

## [2.0.0](https://github.com/nuxt/components/compare/v2.0.0-1...v2.0.0) (2021-02-15)


### Bug Fixes

* register global components with lazy prefix ([ae7249f](https://github.com/nuxt/components/commit/ae7249fd8dcb54b3a4c4f6e231faadc64f32dd9a)), closes [#139](https://github.com/nuxt/components/issues/139)

## [2.0.0-1](https://github.com/nuxt/components/compare/v2.0.0-0...v2.0.0-1) (2021-02-13)


### Bug Fixes

* allow components to be in multilevel nested folders ([#141](https://github.com/nuxt/components/issues/141)) ([9aa52f4](https://github.com/nuxt/components/commit/9aa52f458698ba058e073c59b46460e7d2a46028))

## [2.0.0-0](https://github.com/nuxt/components/compare/v1.2.6...v2.0.0-0) (2021-02-10)


### ⚠ BREAKING CHANGES

* prefix components in nested dirs with full path (#81)

### Features

* components always available globally (hybrid loader) ([#126](https://github.com/nuxt/components/issues/126)) ([7a855dc](https://github.com/nuxt/components/commit/7a855dcbfb151990e939f95abf6b70fa64ad672b))
* included pattern to ignore mixins ([#136](https://github.com/nuxt/components/issues/136)) ([aa6da2f](https://github.com/nuxt/components/commit/aa6da2fcf895a62e389dc3df6d62b32c100ba7fb))
* prefix components in nested dirs with full path ([#81](https://github.com/nuxt/components/issues/81)) ([84a5de7](https://github.com/nuxt/components/commit/84a5de7e68dbb0536e35b656a2b21626adffcfc9))

### [1.2.6](https://github.com/nuxt/components/compare/v1.2.5...v1.2.6) (2021-02-01)


### Bug Fixes

* **ignore:** ignore typescript stories ([#135](https://github.com/nuxt/components/issues/135)) ([cf54c71](https://github.com/nuxt/components/commit/cf54c71f6efe5a1307772f88f174006f639cbea1))

### [1.2.5](https://github.com/nuxt/components/compare/v1.2.4...v1.2.5) (2021-01-13)


### Bug Fixes

* **scan:** preserve original component name for webpack chunk ([82357b2](https://github.com/nuxt/components/commit/82357b20651fa792927e6c98bee713a8cf72c619))

### [1.2.4](https://github.com/nuxt/components/compare/v1.2.3...v1.2.4) (2021-01-12)


### Bug Fixes

* **scan:** generate chunkName based on componentName and use upath ([1b5139a](https://github.com/nuxt/components/commit/1b5139a861712f800f34b1bfed73b59dfd49a404)), closes [nuxt/content#711](https://github.com/nuxt/content/issues/711)
* **types:** fix generated types ([57d6eb5](https://github.com/nuxt/components/commit/57d6eb5f14a9083e755012107e5e8025f2e1fdd0))

### [1.2.3](https://github.com/nuxt/components/compare/v1.2.2...v1.2.3) (2021-01-06)


### Bug Fixes

* transform to PascalCase only on first lower letter or name contains hyphens ([#129](https://github.com/nuxt/components/issues/129)) ([2c819e6](https://github.com/nuxt/components/commit/2c819e6776ed8142394fc823f8b992e70389e242))

### [1.2.2](https://github.com/nuxt/components/compare/v1.2.1...v1.2.2) (2020-12-07)


### Bug Fixes

* convert const to var for ie compatibility ([eac269c](https://github.com/nuxt/components/commit/eac269c41905ed937793e2fe2a0432034241c0b8))

### [1.2.1](https://github.com/nuxt/components/compare/v1.2.0...v1.2.1) (2020-12-06)


### Bug Fixes

* **module:** avoid adding global directory if manually added ([#120](https://github.com/nuxt/components/issues/120)) ([dad04f7](https://github.com/nuxt/components/commit/dad04f7e2971e04619c8369011efe753c048d8df))
* don't use implicit dependencies ([#119](https://github.com/nuxt/components/issues/119)) ([ceaaaec](https://github.com/nuxt/components/commit/ceaaaec7e36e44aa0b1f097f17f9e66106d64e41))
* ie compatibility (resolves [#109](https://github.com/nuxt/components/issues/109)) ([04bea9b](https://github.com/nuxt/components/commit/04bea9bc3e44533fc6c6128234a7c13eb3f704ce))

## [1.2.0](https://github.com/nuxt/components/compare/v1.1.1...v1.2.0) (2020-11-23)


### Features

* add components/global/ directory ([#113](https://github.com/nuxt/components/issues/113)) ([dde86a7](https://github.com/nuxt/components/commit/dde86a7ba72425f771571e12373ffa261e880f53))
* support overwriting components ([#96](https://github.com/nuxt/components/issues/96)) ([47a21e9](https://github.com/nuxt/components/commit/47a21e9a016c20022e4ec9c6ae3dac469a91a4a1))

### [1.1.1](https://github.com/nuxt/components/compare/v1.1.0...v1.1.1) (2020-10-22)


### Bug Fixes

* **npm:** component may require wrong webpack version ([3fc657a](https://github.com/nuxt/components/commit/3fc657ab88fe5bfc832e9d0c8c0cd0afe4ee555b))

## [1.1.0](https://github.com/nuxt/components/compare/v1.0.7...v1.1.0) (2020-08-04)


### Features

* ignore storybook stories ([#84](https://github.com/nuxt/components/issues/84)) ([b4d9e11](https://github.com/nuxt/components/commit/b4d9e113f2967507b2c827f57f4564273f96b6e9))


### Bug Fixes

* invalid `webpackChunkName` for global exports ([3fc3709](https://github.com/nuxt/components/commit/3fc3709729310ea3e6d8a3005b8b951045903dfc))

### [1.0.7](https://github.com/nuxt/components/compare/v1.0.6...v1.0.7) (2020-07-05)


### Bug Fixes

* disable loader for global dirs ([#70](https://github.com/nuxt/components/issues/70)) ([78baa92](https://github.com/nuxt/components/commit/78baa92880c3985e0382a35d5d9b67f7fb968e29)), closes [#18](https://github.com/nuxt/components/issues/18)

### [1.0.6](https://github.com/nuxt/components/compare/v1.0.5...v1.0.6) (2020-06-28)


### Bug Fixes

* **types:** extend NuxtOptions and use 2.13 NuxtOptionsHooks ([dd9ec90](https://github.com/nuxt/components/commit/dd9ec90d20b472fe08f88480d84451f36371fc2e))

### [1.0.5](https://github.com/nuxt/components/compare/v1.0.4...v1.0.5) (2020-06-24)


### Bug Fixes

* disable module if no components option provided ([#60](https://github.com/nuxt/components/issues/60)) ([8be7b26](https://github.com/nuxt/components/commit/8be7b261f0c05364ef441ef021f93fb39f24ec82))

### [1.0.4](https://github.com/nuxt/components/compare/v1.0.3...v1.0.4) (2020-06-23)


### Bug Fixes

* ensure requireNuxtVersion skips when currentVersion is nullish ([bf7dbfa](https://github.com/nuxt/components/commit/bf7dbfadd81e261b69e7615cf2cd7a87200e2589))

### [1.0.3](https://github.com/nuxt/components/compare/v1.0.2...v1.0.3) (2020-06-19)


### Bug Fixes

* **installComponents:** avoid function shorthand for IE support (fixes [#56](https://github.com/nuxt/components/issues/56)) ([201914b](https://github.com/nuxt/components/commit/201914bd71b4b4c7215e0da1d705984991a38b53))

### [1.0.2](https://github.com/nuxt/components/compare/v1.0.1...v1.0.2) (2020-06-19)

### [1.0.1](https://github.com/nuxt/components/compare/v1.0.0...v1.0.1) (2020-06-19)


### Bug Fixes

* **plugin:** add missing wrapper ([9e42435](https://github.com/nuxt/components/commit/9e4243577c0da145f8ee5d17a9519b8fe0d70187))

## [1.0.0](https://github.com/nuxt/components/compare/v0.3.4...v1.0.0) (2020-06-18)


### Bug Fixes

* add missing comma for multiple global components ([#54](https://github.com/nuxt/components/issues/54)) ([2822a44](https://github.com/nuxt/components/commit/2822a44dfd18483683320f11d4372f85bb4423b8))

### [0.3.5](https://github.com/nuxt/components/compare/v0.3.4...v0.3.5) (2020-06-18)

### [0.3.4](https://github.com/nuxt/components/compare/v0.3.3...v0.3.4) (2020-06-12)


### Features

* support functional components ([#41](https://github.com/nuxt/components/issues/41)) ([5fe2de6](https://github.com/nuxt/components/commit/5fe2de6aa3cb54055e596657c5cffdf1e27f1c2b))
* support global async components ([#43](https://github.com/nuxt/components/issues/43)) ([6dfef95](https://github.com/nuxt/components/commit/6dfef95fbc818e8047db698acba484944340d253))


### Bug Fixes

* disable telemetry for example ([73fe953](https://github.com/nuxt/components/commit/73fe9537c0280344433878642f04a14401630204))
* provide default value for versions ([16eb18a](https://github.com/nuxt/components/commit/16eb18ab4f30581518be56b30be5beb5c01ac473))

### [0.3.3](https://github.com/nuxt/components/compare/v0.3.2...v0.3.3) (2020-06-01)


### Bug Fixes

* **build:** add loader entrypoint ([b2275bb](https://github.com/nuxt/components/commit/b2275bb4deb6f777609d5bb08be0bf4614bbc32d))

### [0.3.2](https://github.com/nuxt/components/compare/v0.3.1...v0.3.2) (2020-06-01)


### Features

* support `dir.extensions` ([#32](https://github.com/nuxt/components/issues/32)) ([0b76ddd](https://github.com/nuxt/components/commit/0b76dddd5513ee9048c73142d8fbafb383d36f6f))
* use globby ([#33](https://github.com/nuxt/components/issues/33)) ([cdac9b9](https://github.com/nuxt/components/commit/cdac9b9856fad581d3392042c307d3839288edb7))


### Bug Fixes

* **scan:** support index.{ext} ([#30](https://github.com/nuxt/components/issues/30)) ([8fcf984](https://github.com/nuxt/components/commit/8fcf984487b7babef1b58e6a5fca172f8e96d5b4))

### [0.3.1](https://github.com/nuxt/components/compare/v0.3.0...v0.3.1) (2020-05-29)


### Features

* components array and simplify usage ([#27](https://github.com/nuxt/components/issues/27)) ([6fc2ba0](https://github.com/nuxt/components/commit/6fc2ba0ec5b8d672cd722b60e014079904698458))

## [0.3.0](https://github.com/nuxt/components/compare/v0.2.5...v0.3.0) (2020-05-25)


### Features

* add pug support ([#21](https://github.com/nuxt/components/issues/21)) ([52584dd](https://github.com/nuxt/components/commit/52584dda4ea949e307fbe7880bdc5322e147c453))

### [0.2.5](https://github.com/nuxt/components/compare/v0.2.4...v0.2.5) (2020-05-21)


### Bug Fixes

* add missing `components:extend` hook call for initial build ([9a29c8b](https://github.com/nuxt/components/commit/9a29c8bdbe505f4a95cc0585817b37bdf92bbba8))

### [0.2.4](https://github.com/nuxt/components/compare/v0.2.3...v0.2.4) (2020-05-20)


### Features

* `components:extend` hook ([462834f](https://github.com/nuxt/components/commit/462834f7cdd77fadad842367db9bceb7cdad6637))
* auto generate components.json, global plugin for tests and vetur tags ([#14](https://github.com/nuxt/components/issues/14)) ([12d546d](https://github.com/nuxt/components/commit/12d546d3f98183626693f3b4c0c13aadef7afc93))
* support `extendComponent` option for scan ([4baa840](https://github.com/nuxt/components/commit/4baa8405800e711bcf58c799f85e3954b0a3c741))


### Bug Fixes

* don't override imports if extendComponent already provided ([01959b1](https://github.com/nuxt/components/commit/01959b16c554408fd78c1bf1c2248f8e806e0275))
* properly resolve components dir name and warn about non existent dirs ([#12](https://github.com/nuxt/components/issues/12)) ([1ffea77](https://github.com/nuxt/components/commit/1ffea77fb3a800a4e14670d651a615c2862a6540))

### [0.2.3](https://github.com/nuxt/components/compare/v0.2.2...v0.2.3) (2020-05-18)


### Features

* set chunk name for async components ([3cb6aaa](https://github.com/nuxt/components/commit/3cb6aaaec83d9641ebd85b22e6e4bad4607bc33b))


### Bug Fixes

* remove moduleOptions to only use components key ([58c7e26](https://github.com/nuxt/components/commit/58c7e26f72576dfbbcaf790f332a73f73090936a))

### [0.2.2](https://github.com/nuxt/components/compare/v0.2.1...v0.2.2) (2020-05-17)


### Bug Fixes

* **scan:** use unix paths for windows ([9b5e6c6](https://github.com/nuxt/components/commit/9b5e6c6ea6bdd38dd03156428dc9c917165b1b45))

### [0.2.1](https://github.com/nuxt/components/compare/v0.2.0...v0.2.1) (2020-05-13)


### Features

* add components:dirs hook ([#6](https://github.com/nuxt/components/issues/6)) ([ed83955](https://github.com/nuxt/components/commit/ed8395569e81691147872d5d08aeec61ad3ea756))

## [0.2.0](https://github.com/nuxt/components/compare/v0.1.2...v0.2.0) (2020-04-30)


### Features

* implements new specs ([#2](https://github.com/nuxt/components/issues/2)) ([f4e5972](https://github.com/nuxt/components/commit/f4e5972188cd14db226b93fca45b7a3f4e36cdc7))
* throw error if nuxt version not supported ([757af3c](https://github.com/nuxt/components/commit/757af3c7f793d28cfdc22f91af0d0ebccbdde05d))

### [0.1.2](https://github.com/nuxt/components/compare/v0.1.1...v0.1.2) (2020-04-24)


### Bug Fixes

* fix IE compatibility ([7fa2785](https://github.com/nuxt/components/commit/7fa278578b2bb018f26b31adda25f59860a310b8))

### [0.1.1](https://github.com/nuxt/components/compare/v0.1.0...v0.1.1) (2020-04-23)


### Bug Fixes

* add webpack entry instead of using nuxt plugin ([eaa4013](https://github.com/nuxt/components/commit/eaa4013541cee918b00c37ea11c7fae9d754fa32))

## [0.1.0](https://github.com/nuxt/components/tree/v0.1.0) (2020-04-22)
