# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project tries to adhere to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased
### Added

### Changed

### Fixed

### Removed

## 3.0.2 - Thursday, 1 July 2021 ([compare to previous](https://github.com/shalvah/clara/compare/3.0.1...3.0.2**))
### Fixed
- Use correct `$type` in labels mode ([75a8f98172678cb74ff92f7cf89ef3d20534e329](https://github.com/shalvah/clara/commit/75a8f98172678cb74ff92f7cf89ef3d20534e329))

## 3.0.1 - Wednesday, 30 June 2021 ([compare to previous](https://github.com/shalvah/clara/compare/3.0.0...3.0.1))
### Fixed
- Properly import Clara constant ([5e3d5218a773465c4eed14f173c2b4cb47fe84fc](https://github.com/shalvah/clara/commit/5e3d5218a773465c4eed14f173c2b4cb47fe84fc))

## 3.0.0 - Wednesday, 30 June 2021 ([compare to previous](https://github.com/shalvah/clara/compare/2.6.0...3.0.0))

### New features:
- Added icons and labels mode
- Made colours customisable

### Breaking change:
- The helper/constructor arguments have changed; if you were using the second parameter to show/hide debug, you'll now have to call `showDebugOutput()` instead.

  Before:
  ```php
  clara('myappname', $isVerbose);
  ```
  After:
  ```php
  clara('myappname')->showDebugOutput($isVerbose);
  ```

## 2.6.0 - Sunday, 12 April 2020 ([compare to previous](https://github.com/shalvah/clara/compare/2.5.0...2.6.0))
### Added
- Allow setting output interface (https://github.com/shalvah/clara/commit/6571043fdf3a9029358bab4029fd32c66a6d791c)
### Modified
- Switch clara() default showDebugOutput to true (https://github.com/shalvah/clara/commit/2371b83ad6d3ec54551c271504a26a359c02fa25)

## 2.5.0 - Friday, 10 April 2020 ([compare to previous](https://github.com/shalvah/clara/compare/2.4.0...2.5.0))
### Modified
- Make `->only()` instance (https://github.com/shalvah/clara/commit/af04fe9a410d10ae92ecf33f51537d6c2333fb7b)

## 2.4.0 - Friday, 10 April 2020 ([compare to previous](https://github.com/shalvah/clara/compare/2.3.0...2.4.0))
### Added
- `Clara::only` helper (https://github.com/shalvah/clara/commit/b117290af2d7574e70a57f5a997c9708d686d6f1)

## 2.3.0 - Friday, 10 April 2020 ([compare to previous](https://github.com/shalvah/clara/compare/2.2.0...2.3.0))
### Added
- Global function helper (https://github.com/shalvah/clara/commit/a1c68707e414a502b550c94336ec49f207c5f439)

## 2.2.0 - Friday, 10 April 2020 ([compare to previous](https://github.com/shalvah/clara/compare/2.1.0...2.2.0))
Dependency update

## 2.1.0 - Friday, 10 April 2020 ([compare to previous](https://github.com/shalvah/clara/compare/2.0.0...2.1.0))
### Fixed
- Internal bug: writing captured output to the wrong array

## 2.0.0 - Friday, 10 April 2020 ([compare to previous](https://github.com/shalvah/clara/compare/1.0.0...2.0.0))
### Modified
- Switched to granular output per app (https://github.com/shalvah/clara/pull/1)

### Added
- Muting output per app (https://github.com/shalvah/clara/pull/1)
- Output capturing (https://github.com/shalvah/clara/pull/2)
- Toggling debug utput (https://github.com/shalvah/clara/pull/3)