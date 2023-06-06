![@nuxt/components](https://user-images.githubusercontent.com/904724/99790294-2f75d300-2b24-11eb-8114-0a2569913fae.png)

# @nuxt/components

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Module to scan and auto import components for Nuxt 2.13+

- [🎲&nbsp; Play on CodeSandbox](https://githubbox.com/nuxt/components/tree/master/example)
- [🎬&nbsp; Demonstration video (49s)](https://www.youtube.com/watch?v=lQ8OBrgVVr8)
- [📖&nbsp; Release Notes](./CHANGELOG.md)

## Table of Contents

- [Features](#features)
- [Usage](#usage)
- [Dynamic Components](#dynamic-components)
- [Lazy Imports](#lazy-imports)
- [Overwriting Components](#overwriting-components)
- [Directories](#directories)
- [Directory Properties](#directory-properties)
- [Library authors](#library-authors)
- [License](#license)

## Features

- Automatically scan `components/` directory
- No need to manually import components anymore
- Multiple paths with customizable prefixes and lookup/ignore patterns
- Lazy loading (Async components)
- Production code-splitting optimization (loader)
- Hot reloading
- Module integration ([library authors](#library-authors))
- Fully tested

## Usage

Set the `components` option in `nuxt.config`:

```js
export default {
  components: true
}
```

**Note:** If using nuxt `2.10...2.13`, you have to also manually install and add `@nuxt/components` to `buildModules` inside `nuxt.config`.

**Create your components:**

```bash
| components/
---| ComponentFoo.vue
---| ComponentBar.vue
```

**Use them whenever you want, they will be auto imported in `.vue` files :**

```html
<template>
  <ComponentFoo />
  <component-bar />
</template>
```

No need anymore to manually import them in the `script` section!

See [live demo](https://codesandbox.io/s/nuxt-components-cou9k) or [video example](https://www.youtube.com/watch?v=lQ8OBrgVVr8).

### Lazy Imports

Nuxt by default does code-slitting per page and components. But sometimes we also need to lazy load them:
- Component size is rather big (or has big dependencies imported) like a text-editor
- Component is rendered conditionally with `v-if` or being in a modal

In order to [lazy load](https://webpack.js.org/guides/lazy-loading/) a component, all we need to do is to add `Lazy` prefix to component name.

You now can easily import a component on-demand:

```html
<template>
  <LazyComponentFoo v-if="foo" />
  <button @click="loadFoo">
    Load Foo
  </button>
</template>

<script>
export default {
  data () {
    return {
      foo: null
    }
  },
  methods: {
    async loadFoo () {
      this.foo = await this.$axios.$get('foo')
    }
  }
}
</script>
```

### Nested Components

If you have components in nested directories:

```bash
| components/
---| my/
------| form/
---------| TextArea.vue
```

The component name will contain its path:

```html
<MyFormTextArea />
```

For clarity, it is recommended that component file name matches its name. You can also use `MyFormTextArea.vue` as name with same directory structure.

If for any reason different prefix is desired, we can add specific directory with the `prefix` option: (See [directories](#directories) section)

```js
components: [
  '~/components/',
  { path: '~/components/foo/', prefix: 'foo' }
]
```

## Overwriting Components

It is possible to have a way to overwrite components using the [level](#level) option. This is very useful for modules and theme authors.

Considering this structure:

```bash
| node_modules/
---| my-theme/
------| components/
---------| Header.vue
| components/
---| Header.vue
```

Then defining in the `nuxt.config`:

```js
components: [
  '~/components', // default level is 0
  { path: 'node_modules/my-theme/components', level: 1 }
]
```

Our `components/Header.vue` will overwrite our theme component since the lowest level overwrites.

## Directories

By setting `components: true`, default `~/components` directory will be included.
However you can customize module behaviour by providing directories to scan:

```js
export default {
  components: [
    '~/components', // shortcut to { path: '~/components' }
    { path: '~/components/awesome/', prefix: 'awesome' }
  ],
}
```

Each item can be either string or object. String is shortcut to `{ path }`.

**Note:** Don't worry about ordering or overlapping directories! Components module will take care of it. Each file will be only matched once with longest path.

### Directory Properties

#### path

- Required
- Type: `String`

Path (absolute or relative) to the directory containing your components.

You can use Nuxt aliases (`~` or `@`) to refer to directories inside project or directly use a npm package path similar to require.

#### extensions

- Type: `Array<string>`
- Default:
  - Extensions supported by Nuxt builder (`builder.supportedExtensions`)
  - Default supported extensions `['vue', 'js']` or `['vue', 'js', 'ts', 'tsx']` depending on your environment

**Example:** Support multi-file component structure

If you prefer to split your SFCs into `.js`, `.vue` and `.css`, you can only enable `.vue` files to be scanned:

```
| components
---| componentC
------| componentC.vue
------| componentC.js
------| componentC.scss
```

```js
// nuxt.config.js
export default {
  components: [
    { path: '~/components', extensions: ['vue'] }
  ]
}
```

#### pattern

- Type: `string` ([glob pattern]( https://github.com/isaacs/node-glob#glob-primer))
- Default: `**/*.${extensions.join(',')}`

Accept Pattern that will be run against specified `path`.

#### ignore

- Type: `Array`
- Items: `string` ([glob pattern]( https://github.com/isaacs/node-glob#glob-primer))
- Default: `[]`

Ignore patterns that will be run against specified `path`.

#### prefix

- Type: `String`
- Default: `''` (no prefix)

Prefix all matched components.

Example below adds `awesome-`/`Awesome` prefix to the name of components in `awesome/` directory.

```js
// nuxt.config.js
export default {
  components: [
      '~/components',
      { path: '~/components/awesome/', prefix: 'awesome' }
  ]
}
```

```bash
components/
  awesome/
    Button.vue
  Button.vue
```

```html
<template>
  <div>
    <AwesomeButton>Click on me 🤘</AwesomeButton>
    <Button>Click on me</Button>
  </div>
</template>
```

#### pathPrefix

- Type: `Boolean`
- Default: `true`

Prefix component name by it's path

#### watch

- Type: `Boolean`
- Default: `true`

Watch specified `path` for changes, including file additions and file deletions.

#### transpile

- Type: `Boolean`
- Default: `'auto'`

Transpile specified `path` using [`build.transpile`](https://nuxtjs.org/api/configuration-build#transpile), by default (`'auto'`) it will set `transpile: true` if `node_modules/` is in `path`.

#### level

- Type: `Number`
- Default: `0`

Level are use to define a hint when overwriting the components which have the same name in two different directories, this is useful for theming.

```js
export default {
  components: [
    '~/components', // default level is 0
   { path: 'my-theme/components', level: 1 }
  ]
}
```

Components having the same name in `~/components` will overwrite the one in `my-theme/components`, learn more in [Overwriting Components](#overwriting-components). The lowest value will overwrite.

## Migration guide

## `v1` to `v2`

Starting with `nuxt@2.15`, Nuxt uses `@nuxt/components` v2:

- All components are globally available so you can move `components/global/`
to `components/` and `global: true` is not required anymore
- Full path inside `components` is used to prefix component names. If you were structing your
components in multiple directories, should either add prefix or register in `components` section of `nuxt.config` or use new `pathPrefix` option.

**Example:**

```
components
├── atoms
│   └── icons
├── molecules
│   └── illustrations
├── organisms
│   └── ads
└── templates
    ├── blog
    └── home
```

```js
// nuxt.config.js
export default {
  components: [
    '~/components/templates',
    '~/components/atoms',
    '~/components/molecules',
    '~/components/organisms',
  ]
}
```

## Library Authors

Making Vue Component libraries with automatic tree-shaking and component registration is now damn easy ✨

This module expose a hook named `components:dirs` so you can easily extend the directory list without updating user configuration in your Nuxt module.

Imagine a directory structure like this:

```bash
| node_modules/
---| awesome-ui/
------| components/
---------| Alert.vue
---------| Button.vue
------| nuxt.js
| pages/
---| index.vue
| nuxt.config.js
```

Then in `awesome-ui/nuxt.js` you can use the `components:dir` hook:

```js
import { join } from 'path'

export default function () {
  this.nuxt.hook('components:dirs', (dirs) => {
    // Add ./components dir to the list
    dirs.push({
      path: join(__dirname, 'components'),
      prefix: 'awesome'
    })
  })
}
```

That's it! Now in your project, you can import your ui library as a Nuxt module in your `nuxt.config.js`:

```js
export default {
  buildModules: [
    '@nuxt/components',
    'awesome-ui/nuxt'
  ]
}
```

And directly use the module components (prefixed with `awesome-`), our `pages/index.vue`:

```vue
<template>
  <div>
    My <AwesomeButton>UI button</AwesomeButton>!
    <awesome-alert>Here's an alert!</awesome-alert>
  </div>
</template>
```

It will automatically import the components only if used and also support HMR when updating your components in `node_modules/awesome-ui/components/`.

Next: publish your `awesome-ui` module to [npm](https://www.npmjs.com) and share it with the other Nuxters ✨

## License

[MIT](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@nuxt/components/latest.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/@nuxt/components

[npm-downloads-src]: https://img.shields.io/npm/dt/@nuxt/components.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@nuxt/components

[github-actions-ci-src]: https://img.shields.io/github/workflow/status/nuxt/typescript/test?label=ci&style=flat-square
[github-actions-ci-href]: https://github.com/nuxt/components/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/nuxt/components.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/nuxt/components

[license-src]: https://img.shields.io/npm/l/@nuxt/components.svg?style=flat-square
[license-href]: https://npmjs.com/package/@nuxt/components
