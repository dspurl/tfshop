# vue-client-only

[![NPM version](https://img.shields.io/npm/v/vue-client-only.svg?style=flat)](https://npmjs.com/package/vue-client-only) [![NPM downloads](https://img.shields.io/npm/dm/vue-client-only.svg?style=flat)](https://npmjs.com/package/vue-client-only) [![CircleCI](https://circleci.com/gh/egoist/vue-client-only/tree/master.svg?style=shield)](https://circleci.com/gh/egoist/vue-client-only/tree/master)  [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

## Install

```bash
yarn add vue-client-only
```

> __This project is previously known as *vue-no-ssr*, switch to [1.x](https://github.com/egoist/vue-client-only/tree/1.x) branch for the old docs.__

## Usage

```vue
<template>
  <div id="app">
    <h1>My Website</h1>
    <client-only>
      <!-- this component will only be rendered on client-side -->
      <comments />
    </client-only>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only'

  export default {
    components: {
      ClientOnly
    }
  }
</script>
```

### Placeholder

Use a slot or text as placeholder until `<client-only />` is mounted on client-side.

eg, show a loading indicator.

```vue
<template>
  <div id="app">
    <h1>My Website</h1>
    <!-- use slot -->
    <client-only>
      <comments />
      <comments-placeholder slot="placeholder" />
    </client-only>
    <!-- or use text -->
    <client-only placeholder="Loading...">
      <comments />
    </client-only>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only'

  export default {
    components: {
      ClientOnly
    }
  }
</script>
```

By default the placeholder will be wrapped in a `div` tag, however you can use `placeholderTag` prop to customize it:

```vue
<client-only placeholder="loading" placeholder-tag="span">
  <comments />
</client-only>
```

And you get:

```html
<span class="client-only-placeholder">
  loading
</span>
```

If prop `placeholder` is an empty string (or `null`) and no `placeholder`
slot is found, then `<client-only>` will render the Vue placeholder element `<!---->`
instead of rendering the `placholder-tag` during SSR render.

## Development

```bash
yarn install

# Run example
yarn example
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**vue-client-only** © [egoist](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by egoist with help from contributors ([list](https://github.com/egoist/vue-client-only/contributors)).

> [egoist.moe](https://egoist.moe) · GitHub [@egoist](https://github.com/egoist) · Twitter [@_egoistlily](https://twitter.com/_egoistlily)
