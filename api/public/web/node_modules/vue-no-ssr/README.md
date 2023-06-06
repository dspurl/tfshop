# vue-no-ssr

[![NPM version](https://img.shields.io/npm/v/vue-no-ssr.svg?style=flat)](https://npmjs.com/package/vue-no-ssr) [![NPM downloads](https://img.shields.io/npm/dm/vue-no-ssr.svg?style=flat)](https://npmjs.com/package/vue-no-ssr) [![CircleCI](https://circleci.com/gh/egoist/vue-no-ssr/tree/master.svg?style=shield)](https://circleci.com/gh/egoist/vue-no-ssr/tree/master)  [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

## Install

```bash
yarn add vue-no-ssr
```

## Usage

```vue
<template>
  <div id="app">
    <h1>My Website</h1>
    <no-ssr>
      <!-- this component will only be rendered on client-side -->
      <comments />
    </no-ssr>
  </div>
</template>

<script>
  import NoSSR from 'vue-no-ssr'

  export default {
    components: {
      'no-ssr': NoSSR
    }
  }
</script>
```

### Placeholder

Use a slot or text as placeholder until `<no-ssr />` is mounted on client-side.

eg, show a loading indicator.

```vue
<template>
  <div id="app">
    <h1>My Website</h1>
    <!-- use slot -->
    <no-ssr>
      <comments />
      <comments-placeholder slot="placeholder" />
    </no-ssr>
    <!-- or use text -->
    <no-ssr placeholder="Loading...">
      <comments />
    </no-ssr>
  </div>
</template>

<script>
  import NoSSR from 'vue-no-ssr'

  export default {
    components: {
      'no-ssr': NoSSR
    }
  }
</script>
```

By default the placeholder will be wrapped in a `div` tag, however you can use `placeholderTag` prop to customize it:

```vue
<no-ssr placeholder="loading" placeholader-tag="span">
  <comments />
</no-ssr>
```

And you get:

```html
<span class="no-ssr-placeholder">
  loading
</span>
```

If prop `placeholder` is an empty string (or `null`) and no `placeholder`
slot is found, then `<no-ssr>` will render the Vue placeholder element `<!---->`
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

**vue-no-ssr** © [egoist](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by egoist with help from contributors ([list](https://github.com/egoist/vue-no-ssr/contributors)).

> [egoist.moe](https://egoist.moe) · GitHub [@egoist](https://github.com/egoist) · Twitter [@_egoistlily](https://twitter.com/_egoistlily)
