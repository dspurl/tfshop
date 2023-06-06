import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _1353fe3b = () => interopDefault(import('..\\pages\\cart.vue' /* webpackChunkName: "pages/cart" */))
const _7080fe5e = () => interopDefault(import('..\\pages\\cart\\js\\index.js' /* webpackChunkName: "pages/cart/js/index" */))
const _1cf7d247 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _7f3a9446 = () => interopDefault(import('..\\pages\\index\\js\\index.js' /* webpackChunkName: "pages/index/js/index" */))
const _98bb4012 = () => interopDefault(import('..\\pages\\category\\list.vue' /* webpackChunkName: "pages/category/list" */))
const _e9236efa = () => interopDefault(import('..\\pages\\indent\\create.vue' /* webpackChunkName: "pages/indent/create" */))
const _035b857a = () => interopDefault(import('..\\pages\\money\\pay.vue' /* webpackChunkName: "pages/money/pay" */))
const _122824c4 = () => interopDefault(import('..\\pages\\money\\success.vue' /* webpackChunkName: "pages/money/success" */))
const _52acd0a0 = () => interopDefault(import('..\\pages\\pass\\findPassword.vue' /* webpackChunkName: "pages/pass/findPassword" */))
const _90b15126 = () => interopDefault(import('..\\pages\\pass\\login.vue' /* webpackChunkName: "pages/pass/login" */))
const _8df02362 = () => interopDefault(import('..\\pages\\pass\\register.vue' /* webpackChunkName: "pages/pass/register" */))
const _a53b5c04 = () => interopDefault(import('..\\pages\\user\\address.vue' /* webpackChunkName: "pages/user/address" */))
const _ed78ff40 = () => interopDefault(import('..\\pages\\user\\cancel.vue' /* webpackChunkName: "pages/user/cancel" */))
const _310bf6d6 = () => interopDefault(import('..\\pages\\user\\cellphone.vue' /* webpackChunkName: "pages/user/cellphone" */))
const _6df08c34 = () => interopDefault(import('..\\pages\\user\\collect.vue' /* webpackChunkName: "pages/user/collect" */))
const _13943881 = () => interopDefault(import('..\\pages\\user\\password.vue' /* webpackChunkName: "pages/user/password" */))
const _28b79152 = () => interopDefault(import('..\\pages\\user\\portal.vue' /* webpackChunkName: "pages/user/portal" */))
const _6a7adc42 = () => interopDefault(import('..\\pages\\user\\userinfo.vue' /* webpackChunkName: "pages/user/userinfo" */))
const _480f168f = () => interopDefault(import('..\\pages\\category\\js\\list.js' /* webpackChunkName: "pages/category/js/list" */))
const _2be5cc7a = () => interopDefault(import('..\\pages\\indent\\js\\create.js' /* webpackChunkName: "pages/indent/js/create" */))
const _08edb735 = () => interopDefault(import('..\\pages\\money\\js\\pay.js' /* webpackChunkName: "pages/money/js/pay" */))
const _505742fa = () => interopDefault(import('..\\pages\\money\\js\\success.js' /* webpackChunkName: "pages/money/js/success" */))
const _7d7cf746 = () => interopDefault(import('..\\pages\\pass\\js\\findPassword.js' /* webpackChunkName: "pages/pass/js/findPassword" */))
const _868ae3ea = () => interopDefault(import('..\\pages\\pass\\js\\login.js' /* webpackChunkName: "pages/pass/js/login" */))
const _03c1ab37 = () => interopDefault(import('..\\pages\\pass\\js\\register.js' /* webpackChunkName: "pages/pass/js/register" */))
const _009411fc = () => interopDefault(import('..\\pages\\user\\finance\\list.vue' /* webpackChunkName: "pages/user/finance/list" */))
const _44ac72e3 = () => interopDefault(import('..\\pages\\user\\indent\\detail.vue' /* webpackChunkName: "pages/user/indent/detail" */))
const _462419a0 = () => interopDefault(import('..\\pages\\user\\indent\\list.vue' /* webpackChunkName: "pages/user/indent/list" */))
const _1e9ed21a = () => interopDefault(import('..\\pages\\user\\js\\address.js' /* webpackChunkName: "pages/user/js/address" */))
const _2d78ac74 = () => interopDefault(import('..\\pages\\user\\js\\cancel.js' /* webpackChunkName: "pages/user/js/cancel" */))
const _26b977fc = () => interopDefault(import('..\\pages\\user\\js\\cellphone.js' /* webpackChunkName: "pages/user/js/cellphone" */))
const _66e57924 = () => interopDefault(import('..\\pages\\user\\js\\collect.js' /* webpackChunkName: "pages/user/js/collect" */))
const _5b0f9fc5 = () => interopDefault(import('..\\pages\\user\\js\\password.js' /* webpackChunkName: "pages/user/js/password" */))
const _0f70b294 = () => interopDefault(import('..\\pages\\user\\js\\portal.js' /* webpackChunkName: "pages/user/js/portal" */))
const _0621a2a7 = () => interopDefault(import('..\\pages\\user\\js\\userinfo.js' /* webpackChunkName: "pages/user/js/userinfo" */))
const _3e86370f = () => interopDefault(import('..\\pages\\user\\notice\\detail.vue' /* webpackChunkName: "pages/user/notice/detail" */))
const _6882d25c = () => interopDefault(import('..\\pages\\user\\notice\\list.vue' /* webpackChunkName: "pages/user/notice/list" */))
const _63c51fa4 = () => interopDefault(import('..\\pages\\user\\finance\\js\\list.js' /* webpackChunkName: "pages/user/finance/js/list" */))
const _7df190e3 = () => interopDefault(import('..\\pages\\user\\indent\\js\\detail.js' /* webpackChunkName: "pages/user/indent/js/detail" */))
const _4c5ee694 = () => interopDefault(import('..\\pages\\user\\indent\\js\\list.js' /* webpackChunkName: "pages/user/indent/js/list" */))
const _3ab56592 = () => interopDefault(import('..\\pages\\user\\notice\\js\\detail.js' /* webpackChunkName: "pages/user/notice/js/detail" */))
const _1b2f4e0a = () => interopDefault(import('..\\pages\\user\\notice\\js\\list.js' /* webpackChunkName: "pages/user/notice/js/list" */))
const _924cb4ba = () => interopDefault(import('..\\pages\\product\\detail\\js\\_id.js' /* webpackChunkName: "pages/product/detail/js/_id" */))
const _047db520 = () => interopDefault(import('..\\pages\\product\\list\\js\\_id.js' /* webpackChunkName: "pages/product/list/js/_id" */))
const _4781bc95 = () => interopDefault(import('..\\pages\\product\\detail\\_id.vue' /* webpackChunkName: "pages/product/detail/_id" */))
const _76c3d030 = () => interopDefault(import('..\\pages\\product\\list\\_id.vue' /* webpackChunkName: "pages/product/list/_id" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/cart",
    component: _1353fe3b,
    name: "cart___zh",
    children: [{
      path: "js",
      component: _7080fe5e,
      name: "cart-js___zh"
    }]
  }, {
    path: "/en",
    component: _1cf7d247,
    name: "index___en",
    children: [{
      path: "js",
      component: _7f3a9446,
      name: "index-js___en"
    }]
  }, {
    path: "/category/list",
    component: _98bb4012,
    name: "category-list___zh"
  }, {
    path: "/en/cart",
    component: _1353fe3b,
    name: "cart___en",
    children: [{
      path: "js",
      component: _7080fe5e,
      name: "cart-js___en"
    }]
  }, {
    path: "/indent/create",
    component: _e9236efa,
    name: "indent-create___zh"
  }, {
    path: "/money/pay",
    component: _035b857a,
    name: "money-pay___zh"
  }, {
    path: "/money/success",
    component: _122824c4,
    name: "money-success___zh"
  }, {
    path: "/pass/findPassword",
    component: _52acd0a0,
    name: "pass-findPassword___zh"
  }, {
    path: "/pass/login",
    component: _90b15126,
    name: "pass-login___zh"
  }, {
    path: "/pass/register",
    component: _8df02362,
    name: "pass-register___zh"
  }, {
    path: "/user/address",
    component: _a53b5c04,
    name: "user-address___zh"
  }, {
    path: "/user/cancel",
    component: _ed78ff40,
    name: "user-cancel___zh"
  }, {
    path: "/user/cellphone",
    component: _310bf6d6,
    name: "user-cellphone___zh"
  }, {
    path: "/user/collect",
    component: _6df08c34,
    name: "user-collect___zh"
  }, {
    path: "/user/password",
    component: _13943881,
    name: "user-password___zh"
  }, {
    path: "/user/portal",
    component: _28b79152,
    name: "user-portal___zh"
  }, {
    path: "/user/userinfo",
    component: _6a7adc42,
    name: "user-userinfo___zh"
  }, {
    path: "/category/js/list",
    component: _480f168f,
    name: "category-js-list___zh"
  }, {
    path: "/en/category/list",
    component: _98bb4012,
    name: "category-list___en"
  }, {
    path: "/en/indent/create",
    component: _e9236efa,
    name: "indent-create___en"
  }, {
    path: "/en/money/pay",
    component: _035b857a,
    name: "money-pay___en"
  }, {
    path: "/en/money/success",
    component: _122824c4,
    name: "money-success___en"
  }, {
    path: "/en/pass/findPassword",
    component: _52acd0a0,
    name: "pass-findPassword___en"
  }, {
    path: "/en/pass/login",
    component: _90b15126,
    name: "pass-login___en"
  }, {
    path: "/en/pass/register",
    component: _8df02362,
    name: "pass-register___en"
  }, {
    path: "/en/user/address",
    component: _a53b5c04,
    name: "user-address___en"
  }, {
    path: "/en/user/cancel",
    component: _ed78ff40,
    name: "user-cancel___en"
  }, {
    path: "/en/user/cellphone",
    component: _310bf6d6,
    name: "user-cellphone___en"
  }, {
    path: "/en/user/collect",
    component: _6df08c34,
    name: "user-collect___en"
  }, {
    path: "/en/user/password",
    component: _13943881,
    name: "user-password___en"
  }, {
    path: "/en/user/portal",
    component: _28b79152,
    name: "user-portal___en"
  }, {
    path: "/en/user/userinfo",
    component: _6a7adc42,
    name: "user-userinfo___en"
  }, {
    path: "/indent/js/create",
    component: _2be5cc7a,
    name: "indent-js-create___zh"
  }, {
    path: "/money/js/pay",
    component: _08edb735,
    name: "money-js-pay___zh"
  }, {
    path: "/money/js/success",
    component: _505742fa,
    name: "money-js-success___zh"
  }, {
    path: "/pass/js/findPassword",
    component: _7d7cf746,
    name: "pass-js-findPassword___zh"
  }, {
    path: "/pass/js/login",
    component: _868ae3ea,
    name: "pass-js-login___zh"
  }, {
    path: "/pass/js/register",
    component: _03c1ab37,
    name: "pass-js-register___zh"
  }, {
    path: "/user/finance/list",
    component: _009411fc,
    name: "user-finance-list___zh"
  }, {
    path: "/user/indent/detail",
    component: _44ac72e3,
    name: "user-indent-detail___zh"
  }, {
    path: "/user/indent/list",
    component: _462419a0,
    name: "user-indent-list___zh"
  }, {
    path: "/user/js/address",
    component: _1e9ed21a,
    name: "user-js-address___zh"
  }, {
    path: "/user/js/cancel",
    component: _2d78ac74,
    name: "user-js-cancel___zh"
  }, {
    path: "/user/js/cellphone",
    component: _26b977fc,
    name: "user-js-cellphone___zh"
  }, {
    path: "/user/js/collect",
    component: _66e57924,
    name: "user-js-collect___zh"
  }, {
    path: "/user/js/password",
    component: _5b0f9fc5,
    name: "user-js-password___zh"
  }, {
    path: "/user/js/portal",
    component: _0f70b294,
    name: "user-js-portal___zh"
  }, {
    path: "/user/js/userinfo",
    component: _0621a2a7,
    name: "user-js-userinfo___zh"
  }, {
    path: "/user/notice/detail",
    component: _3e86370f,
    name: "user-notice-detail___zh"
  }, {
    path: "/user/notice/list",
    component: _6882d25c,
    name: "user-notice-list___zh"
  }, {
    path: "/en/category/js/list",
    component: _480f168f,
    name: "category-js-list___en"
  }, {
    path: "/en/indent/js/create",
    component: _2be5cc7a,
    name: "indent-js-create___en"
  }, {
    path: "/en/money/js/pay",
    component: _08edb735,
    name: "money-js-pay___en"
  }, {
    path: "/en/money/js/success",
    component: _505742fa,
    name: "money-js-success___en"
  }, {
    path: "/en/pass/js/findPassword",
    component: _7d7cf746,
    name: "pass-js-findPassword___en"
  }, {
    path: "/en/pass/js/login",
    component: _868ae3ea,
    name: "pass-js-login___en"
  }, {
    path: "/en/pass/js/register",
    component: _03c1ab37,
    name: "pass-js-register___en"
  }, {
    path: "/en/user/finance/list",
    component: _009411fc,
    name: "user-finance-list___en"
  }, {
    path: "/en/user/indent/detail",
    component: _44ac72e3,
    name: "user-indent-detail___en"
  }, {
    path: "/en/user/indent/list",
    component: _462419a0,
    name: "user-indent-list___en"
  }, {
    path: "/en/user/js/address",
    component: _1e9ed21a,
    name: "user-js-address___en"
  }, {
    path: "/en/user/js/cancel",
    component: _2d78ac74,
    name: "user-js-cancel___en"
  }, {
    path: "/en/user/js/cellphone",
    component: _26b977fc,
    name: "user-js-cellphone___en"
  }, {
    path: "/en/user/js/collect",
    component: _66e57924,
    name: "user-js-collect___en"
  }, {
    path: "/en/user/js/password",
    component: _5b0f9fc5,
    name: "user-js-password___en"
  }, {
    path: "/en/user/js/portal",
    component: _0f70b294,
    name: "user-js-portal___en"
  }, {
    path: "/en/user/js/userinfo",
    component: _0621a2a7,
    name: "user-js-userinfo___en"
  }, {
    path: "/en/user/notice/detail",
    component: _3e86370f,
    name: "user-notice-detail___en"
  }, {
    path: "/en/user/notice/list",
    component: _6882d25c,
    name: "user-notice-list___en"
  }, {
    path: "/user/finance/js/list",
    component: _63c51fa4,
    name: "user-finance-js-list___zh"
  }, {
    path: "/user/indent/js/detail",
    component: _7df190e3,
    name: "user-indent-js-detail___zh"
  }, {
    path: "/user/indent/js/list",
    component: _4c5ee694,
    name: "user-indent-js-list___zh"
  }, {
    path: "/user/notice/js/detail",
    component: _3ab56592,
    name: "user-notice-js-detail___zh"
  }, {
    path: "/user/notice/js/list",
    component: _1b2f4e0a,
    name: "user-notice-js-list___zh"
  }, {
    path: "/en/user/finance/js/list",
    component: _63c51fa4,
    name: "user-finance-js-list___en"
  }, {
    path: "/en/user/indent/js/detail",
    component: _7df190e3,
    name: "user-indent-js-detail___en"
  }, {
    path: "/en/user/indent/js/list",
    component: _4c5ee694,
    name: "user-indent-js-list___en"
  }, {
    path: "/en/user/notice/js/detail",
    component: _3ab56592,
    name: "user-notice-js-detail___en"
  }, {
    path: "/en/user/notice/js/list",
    component: _1b2f4e0a,
    name: "user-notice-js-list___en"
  }, {
    path: "/en/product/detail/js/:id?",
    component: _924cb4ba,
    name: "product-detail-js-id___en"
  }, {
    path: "/en/product/list/js/:id?",
    component: _047db520,
    name: "product-list-js-id___en"
  }, {
    path: "/en/product/detail/:id?",
    component: _4781bc95,
    name: "product-detail-id___en"
  }, {
    path: "/en/product/list/:id?",
    component: _76c3d030,
    name: "product-list-id___en"
  }, {
    path: "/product/detail/js/:id?",
    component: _924cb4ba,
    name: "product-detail-js-id___zh"
  }, {
    path: "/product/list/js/:id?",
    component: _047db520,
    name: "product-list-js-id___zh"
  }, {
    path: "/product/detail/:id?",
    component: _4781bc95,
    name: "product-detail-id___zh"
  }, {
    path: "/product/list/:id?",
    component: _76c3d030,
    name: "product-list-id___zh"
  }, {
    path: "/",
    component: _1cf7d247,
    name: "index___zh",
    children: [{
      path: "js",
      component: _7f3a9446,
      name: "index-js___zh"
    }]
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
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
