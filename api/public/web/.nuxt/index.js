import Vue from 'vue'
import Vuex from 'vuex'
import Meta from 'vue-meta'
import ClientOnly from 'vue-client-only'
import NoSsr from 'vue-no-ssr'
import { createRouter } from './router.js'
import NuxtChild from './components/nuxt-child.js'
import NuxtError from '..\\layouts\\error.vue'
import Nuxt from './components/nuxt.js'
import App from './App.js'
import { setContext, getLocation, getRouteData, normalizeError } from './utils'
import { createStore } from './store.js'

/* Plugins */

import nuxt_plugin_plugin_c1a88ef4 from 'nuxt_plugin_plugin_c1a88ef4' // Source: .\\components\\plugin.js (mode: 'all')
import nuxt_plugin_pluginutils_3ce7e036 from 'nuxt_plugin_pluginutils_3ce7e036' // Source: .\\nuxt-i18n\\plugin.utils.js (mode: 'all')
import nuxt_plugin_pluginrouting_64c837f0 from 'nuxt_plugin_pluginrouting_64c837f0' // Source: .\\nuxt-i18n\\plugin.routing.js (mode: 'all')
import nuxt_plugin_pluginmain_db858d02 from 'nuxt_plugin_pluginmain_db858d02' // Source: .\\nuxt-i18n\\plugin.main.js (mode: 'all')
import nuxt_plugin_axios_660174ae from 'nuxt_plugin_axios_660174ae' // Source: .\\axios.js (mode: 'all')
import nuxt_plugin_workbox_0c14f485 from 'nuxt_plugin_workbox_0c14f485' // Source: .\\workbox.js (mode: 'client')
import nuxt_plugin_metaplugin_f34cd7f6 from 'nuxt_plugin_metaplugin_f34cd7f6' // Source: .\\pwa\\meta.plugin.js (mode: 'all')
import nuxt_plugin_iconplugin_e9fd8d0e from 'nuxt_plugin_iconplugin_e9fd8d0e' // Source: .\\pwa\\icon.plugin.js (mode: 'all')
import nuxt_plugin_route_231494d5 from 'nuxt_plugin_route_231494d5' // Source: ..\\plugins\\route (mode: 'all')
import nuxt_plugin_elementui_d905880e from 'nuxt_plugin_elementui_d905880e' // Source: ..\\plugins\\element-ui (mode: 'all')
import nuxt_plugin_ctxinject_7475112c from 'nuxt_plugin_ctxinject_7475112c' // Source: ..\\plugins\\ctx-inject.js (mode: 'all')
import nuxt_plugin_filter_6c04580b from 'nuxt_plugin_filter_6c04580b' // Source: ..\\plugins\\filter.js (mode: 'all')
import nuxt_plugin_store_2324db6d from 'nuxt_plugin_store_2324db6d' // Source: ..\\plugins\\store (mode: 'all')
import nuxt_plugin_global_2c8b7297 from 'nuxt_plugin_global_2c8b7297' // Source: ..\\plugins\\global (mode: 'all')
import nuxt_plugin_vuemoment_522d55ca from 'nuxt_plugin_vuemoment_522d55ca' // Source: ..\\plugins\\vue-moment (mode: 'all')
import nuxt_plugin_videoPlayer_10da482f from 'nuxt_plugin_videoPlayer_10da482f' // Source: ..\\plugins\\videoPlayer.js (mode: 'client')

// Component: <ClientOnly>
Vue.component(ClientOnly.name, ClientOnly)

// TODO: Remove in Nuxt 3: <NoSsr>
Vue.component(NoSsr.name, {
  ...NoSsr,
  render (h, ctx) {
    if (process.client && !NoSsr._warned) {
      NoSsr._warned = true

      console.warn('<no-ssr> has been deprecated and will be removed in Nuxt 3, please use <client-only> instead')
    }
    return NoSsr.render(h, ctx)
  }
})

// Component: <NuxtChild>
Vue.component(NuxtChild.name, NuxtChild)
Vue.component('NChild', NuxtChild)

// Component NuxtLink is imported in server.js or client.js

// Component: <Nuxt>
Vue.component(Nuxt.name, Nuxt)

Object.defineProperty(Vue.prototype, '$nuxt', {
  get() {
    const globalNuxt = this.$root.$options.$nuxt
    if (process.client && !globalNuxt && typeof window !== 'undefined') {
      return window.$nuxt
    }
    return globalNuxt
  },
  configurable: true
})

Vue.use(Meta, {"keyName":"head","attribute":"data-n-head","ssrAttribute":"data-n-head-ssr","tagIDKeyName":"hid"})

const defaultTransition = {"name":"page","mode":"out-in","appear":false,"appearClass":"appear","appearActiveClass":"appear-active","appearToClass":"appear-to"}

const originalRegisterModule = Vuex.Store.prototype.registerModule

function registerModule (path, rawModule, options = {}) {
  const preserveState = process.client && (
    Array.isArray(path)
      ? !!path.reduce((namespacedState, path) => namespacedState && namespacedState[path], this.state)
      : path in this.state
  )
  return originalRegisterModule.call(this, path, rawModule, { preserveState, ...options })
}

async function createApp(ssrContext, config = {}) {
  const router = await createRouter(ssrContext, config)

  const store = createStore(ssrContext)
  // Add this.$router into store actions/mutations
  store.$router = router

  // Fix SSR caveat https://github.com/nuxt/nuxt.js/issues/3757#issuecomment-414689141
  store.registerModule = registerModule

  // Create Root instance

  // here we inject the router and store to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = {
    head: {"title":"DSSHOP商城-轻量级易扩展低代码开源商城系统","htmlAttrs":{"lang":"en"},"meta":[{"charset":"utf-8"},{"hid":"index","name":"DSSHOP商城-轻量级易扩展低代码开源商城系统","content":"DSSHOP,轻量级商城网店系统,免费商城,免费网店,低代码商城,轻量级商城,商城,网店"},{"name":"viewport","content":"width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"},{"hid":"description","name":"description","content":"一款轻量级商城开源系统，支持多语言，易二开，低代码，跨终端"},{"hid":"keywords","name":"keywords","content":"DSSHOP,轻量级商城网店系统,免费商城,免费网店,低代码商城,轻量级商城,商城,网店"}],"link":[{"rel":"icon","type":"image\u002Fx-icon","href":"\u002Ffavicon.ico"},{"rel":"shortcut icon","href":"\u002Ffavicon.ico"},{"rel":"apple-touch-icon","href":"\u002Ffavicon.ico"}],"style":[],"script":[]},

    store,
    router,
    nuxt: {
      defaultTransition,
      transitions: [defaultTransition],
      setTransitions (transitions) {
        if (!Array.isArray(transitions)) {
          transitions = [transitions]
        }
        transitions = transitions.map((transition) => {
          if (!transition) {
            transition = defaultTransition
          } else if (typeof transition === 'string') {
            transition = Object.assign({}, defaultTransition, { name: transition })
          } else {
            transition = Object.assign({}, defaultTransition, transition)
          }
          return transition
        })
        this.$options.nuxt.transitions = transitions
        return transitions
      },

      err: null,
      dateErr: null,
      error (err) {
        err = err || null
        app.context._errored = Boolean(err)
        err = err ? normalizeError(err) : null
        let nuxt = app.nuxt // to work with @vue/composition-api, see https://github.com/nuxt/nuxt.js/issues/6517#issuecomment-573280207
        if (this) {
          nuxt = this.nuxt || this.$options.nuxt
        }
        nuxt.dateErr = Date.now()
        nuxt.err = err
        // Used in src/server.js
        if (ssrContext) {
          ssrContext.nuxt.error = err
        }
        return err
      }
    },
    ...App
  }

  // Make app available into store via this.app
  store.app = app

  const next = ssrContext ? ssrContext.next : location => app.router.push(location)
  // Resolve route
  let route
  if (ssrContext) {
    route = router.resolve(ssrContext.url).route
  } else {
    const path = getLocation(router.options.base, router.options.mode)
    route = router.resolve(path).route
  }

  // Set context to app.context
  await setContext(app, {
    store,
    route,
    next,
    error: app.nuxt.error.bind(app),
    payload: ssrContext ? ssrContext.payload : undefined,
    req: ssrContext ? ssrContext.req : undefined,
    res: ssrContext ? ssrContext.res : undefined,
    beforeRenderFns: ssrContext ? ssrContext.beforeRenderFns : undefined,
    ssrContext
  })

  function inject(key, value) {
    if (!key) {
      throw new Error('inject(key, value) has no key provided')
    }
    if (value === undefined) {
      throw new Error(`inject('${key}', value) has no value provided`)
    }

    key = '$' + key
    // Add into app
    app[key] = value
    // Add into context
    if (!app.context[key]) {
      app.context[key] = value
    }

    // Add into store
    store[key] = app[key]

    // Check if plugin not already installed
    const installKey = '__nuxt_' + key + '_installed__'
    if (Vue[installKey]) {
      return
    }
    Vue[installKey] = true
    // Call Vue.use() to install the plugin into vm
    Vue.use(() => {
      if (!Object.prototype.hasOwnProperty.call(Vue.prototype, key)) {
        Object.defineProperty(Vue.prototype, key, {
          get () {
            return this.$root.$options[key]
          }
        })
      }
    })
  }

  // Inject runtime config as $config
  inject('config', config)

  if (process.client) {
    // Replace store state before plugins execution
    if (window.__NUXT__ && window.__NUXT__.state) {
      store.replaceState(window.__NUXT__.state)
    }
  }

  // Add enablePreview(previewData = {}) in context for plugins
  if (process.static && process.client) {
    app.context.enablePreview = function (previewData = {}) {
      app.previewData = Object.assign({}, previewData)
      inject('preview', previewData)
    }
  }
  // Plugin execution

  if (typeof nuxt_plugin_plugin_c1a88ef4 === 'function') {
    await nuxt_plugin_plugin_c1a88ef4(app.context, inject)
  }

  if (typeof nuxt_plugin_pluginutils_3ce7e036 === 'function') {
    await nuxt_plugin_pluginutils_3ce7e036(app.context, inject)
  }

  if (typeof nuxt_plugin_pluginrouting_64c837f0 === 'function') {
    await nuxt_plugin_pluginrouting_64c837f0(app.context, inject)
  }

  if (typeof nuxt_plugin_pluginmain_db858d02 === 'function') {
    await nuxt_plugin_pluginmain_db858d02(app.context, inject)
  }

  if (typeof nuxt_plugin_axios_660174ae === 'function') {
    await nuxt_plugin_axios_660174ae(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_workbox_0c14f485 === 'function') {
    await nuxt_plugin_workbox_0c14f485(app.context, inject)
  }

  if (typeof nuxt_plugin_metaplugin_f34cd7f6 === 'function') {
    await nuxt_plugin_metaplugin_f34cd7f6(app.context, inject)
  }

  if (typeof nuxt_plugin_iconplugin_e9fd8d0e === 'function') {
    await nuxt_plugin_iconplugin_e9fd8d0e(app.context, inject)
  }

  if (typeof nuxt_plugin_route_231494d5 === 'function') {
    await nuxt_plugin_route_231494d5(app.context, inject)
  }

  if (typeof nuxt_plugin_elementui_d905880e === 'function') {
    await nuxt_plugin_elementui_d905880e(app.context, inject)
  }

  if (typeof nuxt_plugin_ctxinject_7475112c === 'function') {
    await nuxt_plugin_ctxinject_7475112c(app.context, inject)
  }

  if (typeof nuxt_plugin_filter_6c04580b === 'function') {
    await nuxt_plugin_filter_6c04580b(app.context, inject)
  }

  if (typeof nuxt_plugin_store_2324db6d === 'function') {
    await nuxt_plugin_store_2324db6d(app.context, inject)
  }

  if (typeof nuxt_plugin_global_2c8b7297 === 'function') {
    await nuxt_plugin_global_2c8b7297(app.context, inject)
  }

  if (typeof nuxt_plugin_vuemoment_522d55ca === 'function') {
    await nuxt_plugin_vuemoment_522d55ca(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_videoPlayer_10da482f === 'function') {
    await nuxt_plugin_videoPlayer_10da482f(app.context, inject)
  }

  // Lock enablePreview in context
  if (process.static && process.client) {
    app.context.enablePreview = function () {
      console.warn('You cannot call enablePreview() outside a plugin.')
    }
  }

  // Wait for async component to be resolved first
  await new Promise((resolve, reject) => {
    const { route } = router.resolve(app.context.route.fullPath)
    // Ignore 404s rather than blindly replacing URL
    if (!route.matched.length && process.client) {
      return resolve()
    }
    router.replace(route, resolve, (err) => {
      // https://github.com/vuejs/vue-router/blob/v3.4.3/src/util/errors.js
      if (!err._isRouter) return reject(err)
      if (err.type !== 2 /* NavigationFailureType.redirected */) return resolve()

      // navigated to a different route in router guard
      const unregister = router.afterEach(async (to, from) => {
        if (process.server && ssrContext && ssrContext.url) {
          ssrContext.url = to.fullPath
        }
        app.context.route = await getRouteData(to)
        app.context.params = to.params || {}
        app.context.query = to.query || {}
        unregister()
        resolve()
      })
    })
  })

  return {
    store,
    app,
    router
  }
}

export { createApp, NuxtError }
