# Changelog

## v1.3.X -> 1.4.X

* Add support for objects without constructor #11 [PR @futpib](https://github.com/SkeLLLa/node-object-hash/pull/12)
* Simplify eslint rules, update codestyle
* Fix npm links issues in readme
* Update dev dependencies

## v1.2.X -> 1.3.X

* Add definition types to support typescript
* Add >=node-8.0.0 support in tests.

## v1.1.X -> 1.2.X

Sorter refactoring and performance improvements

- Added typed arrays support
- Added primitive type constructors support
- Add more docs about type mapping and type coercion

## v1.0.X -> v1.1.X

Mainly all changes affected codestyle and documentation to provide better
experience using this library. There are no changes that should affect
functionality.

- Renamed `sortObject` function to `sort` (old one is still present in code
for backward compatibility).
- Performed some refactoring for better codestyle and documentation.
- Old version (`0.X.X`) moved to subfolder (`./v0`).
- Advanced API reference added: [link](API.md).

## v0.X.X -> v1.0.X

- Sorting mechanism rewritten form ES6 Maps to simple arrays
 (add <=node-4.0.0 support)
- Performance optimization (~2 times faster than 0.x.x)
- API changes:
  - Now module returns 'constructor' function, where you can set
  default parameters: ```var objectHash = require('node-object-hash')(options);```

In case if you still need an old 0.x.x version it's available in `hash.js`
file.
