import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _cd51d6d4 = () => interopDefault(import('..\\pages\\three.vue' /* webpackChunkName: "pages/three" */))
const _4fad74b0 = () => interopDefault(import('..\\pages\\pass\\login.vue' /* webpackChunkName: "pages/pass/login" */))
const _2ee1b3a8 = () => interopDefault(import('..\\pages\\pass\\register.vue' /* webpackChunkName: "pages/pass/register" */))
const _73bc446c = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/three",
    component: _cd51d6d4,
    name: "three"
  }, {
    path: "/pass/login",
    component: _4fad74b0,
    name: "pass-login"
  }, {
    path: "/pass/register",
    component: _2ee1b3a8,
    name: "pass-register"
  }, {
    path: "/",
    component: _73bc446c,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config.app && config.app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
