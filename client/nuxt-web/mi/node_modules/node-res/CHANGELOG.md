<a name="5.0.1"></a>
## [5.0.1](https://github.com/poppinss/node-res/compare/v5.0.0...v5.0.1) (2018-08-22)



<a name="5.0.0"></a>
# [5.0.0](https://github.com/poppinss/node-res/compare/v4.1.4...v5.0.0) (2018-08-21)


### Code Refactoring

* remove download and attachment methods ([cdccb34](https://github.com/poppinss/node-res/commit/cdccb34))


### Features

* **stream:** add method to stream to response ([31d2180](https://github.com/poppinss/node-res/commit/31d2180))


### BREAKING CHANGES

* downlaod and attachment methods are removed, one can use `send` package from npm
for this



<a name="4.1.4"></a>
## [4.1.4](https://github.com/poppinss/node-res/compare/v4.1.3...v4.1.4) (2018-01-19)


### Bug Fixes

* **header:** do not cast headers to array forcefully ([2e032dd](https://github.com/poppinss/node-res/commit/2e032dd))



<a name="4.1.3"></a>
## [4.1.3](https://github.com/poppinss/node-res/compare/v4.1.2...v4.1.3) (2018-01-19)



<a name="4.1.2"></a>
## [4.1.2](https://github.com/poppinss/node-res/compare/v4.1.1...v4.1.2) (2018-01-18)



<a name="4.1.1"></a>
## [4.1.1](https://github.com/poppinss/node-res/compare/v4.1.0...v4.1.1) (2018-01-17)


### Features

* **response:** add `prepare` & `prepareJsonp` methods ([a765dd9](https://github.com/poppinss/node-res/commit/a765dd9))



<a name="4.1.0"></a>
# [4.1.0](https://github.com/poppinss/node-res/compare/v4.0.4...v4.1.0) (2018-01-16)



<a name="4.0.4"></a>
## [4.0.4](https://github.com/poppinss/node-res/compare/v4.0.2...v4.0.4) (2017-10-29)


### Bug Fixes

* **ReDos:** Regular Expression Denial of Service ([#4](https://github.com/poppinss/node-res/issues/4)) ([9c17076](https://github.com/poppinss/node-res/commit/9c17076))
* **response:** move write statement out of setImmediate ([b62071d](https://github.com/poppinss/node-res/commit/b62071d))



<a name="4.0.3"></a>
## [4.0.3](https://github.com/poppinss/node-res/compare/v4.0.2...v4.0.3) (2017-10-26)



<a name="4.0.2"></a>
## [4.0.2](https://github.com/poppinss/node-res/compare/v4.0.0...v4.0.2) (2017-10-02)


### Bug Fixes

* **response:** response.send handle `undefined` body ([e4897d8](https://github.com/poppinss/node-res/commit/e4897d8)), closes [#2](https://github.com/poppinss/node-res/issues/2)
* **response:** response.send options allow user to override ([438298f](https://github.com/poppinss/node-res/commit/438298f))


<a name="4.0.1"></a>
## [4.0.1](https://github.com/poppinss/node-res/compare/v4.0.0...v4.0.1) (2017-10-02)


### Features

* **response:** allow option to ignore etag ([989abe8](https://github.com/poppinss/node-res/commit/989abe8))



<a name="4.0.0"></a>
# [4.0.0](https://github.com/poppinss/node-res/compare/v3.0.2...v4.0.0) (2017-06-16)



<a name="3.0.2"></a>
## [3.0.2](https://github.com/poppinss/node-res/compare/v3.0.1...v3.0.2) (2017-06-12)



<a name="3.0.1"></a>
## [3.0.1](https://github.com/poppinss/node-res/compare/v2.0.1...v3.0.1) (2016-11-08)


### Bug Fixes

* **response:** set charset with content type ([19d6b87](https://github.com/poppinss/node-res/commit/19d6b87)), closes [adonis-framework#329](https://github.com/adonis-framework/issues/329)


<a name="3.0.0"></a>
# [3.0.0](https://github.com/poppinss/node-res/compare/v2.0.1...v3.0.0) (2016-06-25)


### Bug Fixes

* **download:** use send module to download file([7134e51](https://github.com/poppinss/node-res/commit/7134e51))



<a name="2.0.2"></a>
## [2.0.2](https://github.com/poppinss/node-res/compare/v2.0.1...v2.0.2) (2016-01-19)




<a name="2.0.1"></a>
## 2.0.1 (2016-01-18)


### Features

* **package:** added commitizen for consistent commit messages ([bc0241c](https://github.com/poppinss/node-res/commit/bc0241c))



