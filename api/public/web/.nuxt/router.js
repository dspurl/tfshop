import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _1353fe3b = () => interopDefault(import('..\\pages\\cart.vue' /* webpackChunkName: "pages/cart" */))
const _7080fe5e = () => interopDefault(import('..\\pages\\cart\\js\\index.js' /* webpackChunkName: "pages/cart/js/index" */))
const _98bb4012 = () => interopDefault(import('..\\pages\\category\\list.vue' /* webpackChunkName: "pages/category/list" */))
const _0a9a939c = () => interopDefault(import('..\\pages\\comment\\list.vue' /* webpackChunkName: "pages/comment/list" */))
const _261fc5ae = () => interopDefault(import('..\\pages\\comment\\score.vue' /* webpackChunkName: "pages/comment/score" */))
const _70a27b0b = () => interopDefault(import('..\\pages\\coupon\\components\\index.vue' /* webpackChunkName: "pages/coupon/components/index" */))
const _f9640442 = () => interopDefault(import('..\\pages\\coupon\\list.vue' /* webpackChunkName: "pages/coupon/list" */))
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
const _23ad0368 = () => interopDefault(import('..\\pages\\user\\integralDraw\\index.vue' /* webpackChunkName: "pages/user/integralDraw/index" */))
const _13943881 = () => interopDefault(import('..\\pages\\user\\password.vue' /* webpackChunkName: "pages/user/password" */))
const _28b79152 = () => interopDefault(import('..\\pages\\user\\portal.vue' /* webpackChunkName: "pages/user/portal" */))
const _6a7adc42 = () => interopDefault(import('..\\pages\\user\\userinfo.vue' /* webpackChunkName: "pages/user/userinfo" */))
const _3dfb1ab6 = () => interopDefault(import('..\\pages\\article\\components\\defaultArticle.vue' /* webpackChunkName: "pages/article/components/defaultArticle" */))
const _7a9b7fc6 = () => interopDefault(import('..\\pages\\article\\components\\defaultColumn.vue' /* webpackChunkName: "pages/article/components/defaultColumn" */))
const _c15c6d92 = () => interopDefault(import('..\\pages\\article\\components\\defaultColumnDetail.vue' /* webpackChunkName: "pages/article/components/defaultColumnDetail" */))
const _1e271e06 = () => interopDefault(import('..\\pages\\article\\js\\defaultArticle.js' /* webpackChunkName: "pages/article/js/defaultArticle" */))
const _dd7fd508 = () => interopDefault(import('..\\pages\\article\\js\\defaultColumn.js' /* webpackChunkName: "pages/article/js/defaultColumn" */))
const _8afb10aa = () => interopDefault(import('..\\pages\\article\\js\\defaultColumnDetail.js' /* webpackChunkName: "pages/article/js/defaultColumnDetail" */))
const _480f168f = () => interopDefault(import('..\\pages\\category\\js\\list.js' /* webpackChunkName: "pages/category/js/list" */))
const _0e31d274 = () => interopDefault(import('..\\pages\\comment\\js\\list.js' /* webpackChunkName: "pages/comment/js/list" */))
const _4af3dfaa = () => interopDefault(import('..\\pages\\comment\\js\\score.js' /* webpackChunkName: "pages/comment/js/score" */))
const _f15f9da6 = () => interopDefault(import('..\\pages\\coupon\\components\\js\\index.js' /* webpackChunkName: "pages/coupon/components/js/index" */))
const _7d016980 = () => interopDefault(import('..\\pages\\coupon\\components\\use.vue' /* webpackChunkName: "pages/coupon/components/use" */))
const _1c4bcfa7 = () => interopDefault(import('..\\pages\\coupon\\js\\list.js' /* webpackChunkName: "pages/coupon/js/list" */))
const _2be5cc7a = () => interopDefault(import('..\\pages\\indent\\js\\create.js' /* webpackChunkName: "pages/indent/js/create" */))
const _08edb735 = () => interopDefault(import('..\\pages\\money\\js\\pay.js' /* webpackChunkName: "pages/money/js/pay" */))
const _505742fa = () => interopDefault(import('..\\pages\\money\\js\\success.js' /* webpackChunkName: "pages/money/js/success" */))
const _7d7cf746 = () => interopDefault(import('..\\pages\\pass\\js\\findPassword.js' /* webpackChunkName: "pages/pass/js/findPassword" */))
const _868ae3ea = () => interopDefault(import('..\\pages\\pass\\js\\login.js' /* webpackChunkName: "pages/pass/js/login" */))
const _03c1ab37 = () => interopDefault(import('..\\pages\\pass\\js\\register.js' /* webpackChunkName: "pages/pass/js/register" */))
const _2256c0a0 = () => interopDefault(import('..\\pages\\user\\coupon\\components\\index.vue' /* webpackChunkName: "pages/user/coupon/components/index" */))
const _91e16bac = () => interopDefault(import('..\\pages\\user\\coupon\\list.vue' /* webpackChunkName: "pages/user/coupon/list" */))
const _009411fc = () => interopDefault(import('..\\pages\\user\\finance\\list.vue' /* webpackChunkName: "pages/user/finance/list" */))
const _44ac72e3 = () => interopDefault(import('..\\pages\\user\\indent\\detail.vue' /* webpackChunkName: "pages/user/indent/detail" */))
const _462419a0 = () => interopDefault(import('..\\pages\\user\\indent\\list.vue' /* webpackChunkName: "pages/user/indent/list" */))
const _696d5cb0 = () => interopDefault(import('..\\pages\\user\\integral\\list.vue' /* webpackChunkName: "pages/user/integral/list" */))
const _49e3da4c = () => interopDefault(import('..\\pages\\user\\integralDraw\\js\\index.js' /* webpackChunkName: "pages/user/integralDraw/js/index" */))
const _7688f7d8 = () => interopDefault(import('..\\pages\\user\\integralDraw\\list.vue' /* webpackChunkName: "pages/user/integralDraw/list" */))
const _b719ff84 = () => interopDefault(import('..\\pages\\user\\integralDraw\\log.vue' /* webpackChunkName: "pages/user/integralDraw/log" */))
const _1e9ed21a = () => interopDefault(import('..\\pages\\user\\js\\address.js' /* webpackChunkName: "pages/user/js/address" */))
const _2d78ac74 = () => interopDefault(import('..\\pages\\user\\js\\cancel.js' /* webpackChunkName: "pages/user/js/cancel" */))
const _26b977fc = () => interopDefault(import('..\\pages\\user\\js\\cellphone.js' /* webpackChunkName: "pages/user/js/cellphone" */))
const _66e57924 = () => interopDefault(import('..\\pages\\user\\js\\collect.js' /* webpackChunkName: "pages/user/js/collect" */))
const _5b0f9fc5 = () => interopDefault(import('..\\pages\\user\\js\\password.js' /* webpackChunkName: "pages/user/js/password" */))
const _0f70b294 = () => interopDefault(import('..\\pages\\user\\js\\portal.js' /* webpackChunkName: "pages/user/js/portal" */))
const _0621a2a7 = () => interopDefault(import('..\\pages\\user\\js\\userinfo.js' /* webpackChunkName: "pages/user/js/userinfo" */))
const _3e86370f = () => interopDefault(import('..\\pages\\user\\notice\\detail.vue' /* webpackChunkName: "pages/user/notice/detail" */))
const _6882d25c = () => interopDefault(import('..\\pages\\user\\notice\\list.vue' /* webpackChunkName: "pages/user/notice/list" */))
const _60d00e58 = () => interopDefault(import('..\\pages\\coupon\\components\\js\\use.js' /* webpackChunkName: "pages/coupon/components/js/use" */))
const _5eb08a3b = () => interopDefault(import('..\\pages\\user\\coupon\\components\\coolc-coupon.vue' /* webpackChunkName: "pages/user/coupon/components/coolc-coupon" */))
const _30cdc908 = () => interopDefault(import('..\\pages\\user\\coupon\\js\\list.js' /* webpackChunkName: "pages/user/coupon/js/list" */))
const _63c51fa4 = () => interopDefault(import('..\\pages\\user\\finance\\js\\list.js' /* webpackChunkName: "pages/user/finance/js/list" */))
const _7df190e3 = () => interopDefault(import('..\\pages\\user\\indent\\js\\detail.js' /* webpackChunkName: "pages/user/indent/js/detail" */))
const _4c5ee694 = () => interopDefault(import('..\\pages\\user\\indent\\js\\list.js' /* webpackChunkName: "pages/user/indent/js/list" */))
const _8e329994 = () => interopDefault(import('..\\pages\\user\\integral\\js\\list.js' /* webpackChunkName: "pages/user/integral/js/list" */))
const _2410bd23 = () => interopDefault(import('..\\pages\\user\\integralDraw\\components\\dsLuckyGrid.vue' /* webpackChunkName: "pages/user/integralDraw/components/dsLuckyGrid" */))
const _76320264 = () => interopDefault(import('..\\pages\\user\\integralDraw\\components\\dsLuckyWheel.vue' /* webpackChunkName: "pages/user/integralDraw/components/dsLuckyWheel" */))
const _21546304 = () => interopDefault(import('..\\pages\\user\\integralDraw\\components\\dsSlotMachine.vue' /* webpackChunkName: "pages/user/integralDraw/components/dsSlotMachine" */))
const _20d1305c = () => interopDefault(import('..\\pages\\user\\integralDraw\\components\\winningResults.vue' /* webpackChunkName: "pages/user/integralDraw/components/winningResults" */))
const _04c0a152 = () => interopDefault(import('..\\pages\\user\\integralDraw\\js\\list.js' /* webpackChunkName: "pages/user/integralDraw/js/list" */))
const _f6d33f4c = () => interopDefault(import('..\\pages\\user\\integralDraw\\js\\log.js' /* webpackChunkName: "pages/user/integralDraw/js/log" */))
const _3ab56592 = () => interopDefault(import('..\\pages\\user\\notice\\js\\detail.js' /* webpackChunkName: "pages/user/notice/js/detail" */))
const _1b2f4e0a = () => interopDefault(import('..\\pages\\user\\notice\\js\\list.js' /* webpackChunkName: "pages/user/notice/js/list" */))
const _924cb4ba = () => interopDefault(import('..\\pages\\product\\detail\\js\\_id.js' /* webpackChunkName: "pages/product/detail/js/_id" */))
const _047db520 = () => interopDefault(import('..\\pages\\product\\list\\js\\_id.js' /* webpackChunkName: "pages/product/list/js/_id" */))
const _5fd82924 = () => interopDefault(import('..\\pages\\article\\detail\\_id.vue' /* webpackChunkName: "pages/article/detail/_id" */))
const _39702901 = () => interopDefault(import('..\\pages\\article\\list\\_id.vue' /* webpackChunkName: "pages/article/list/_id" */))
const _4781bc95 = () => interopDefault(import('..\\pages\\product\\detail\\_id.vue' /* webpackChunkName: "pages/product/detail/_id" */))
const _76c3d030 = () => interopDefault(import('..\\pages\\product\\list\\_id.vue' /* webpackChunkName: "pages/product/list/_id" */))
const _1cf7d247 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _7f3a9446 = () => interopDefault(import('..\\pages\\index\\js\\index.js' /* webpackChunkName: "pages/index/js/index" */))

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
    name: "cart",
    children: [{
      path: "js",
      component: _7080fe5e,
      name: "cart-js"
    }]
  }, {
    path: "/category/list",
    component: _98bb4012,
    name: "category-list"
  }, {
    path: "/comment/list",
    component: _0a9a939c,
    name: "comment-list"
  }, {
    path: "/comment/score",
    component: _261fc5ae,
    name: "comment-score"
  }, {
    path: "/coupon/components",
    component: _70a27b0b,
    name: "coupon-components"
  }, {
    path: "/coupon/list",
    component: _f9640442,
    name: "coupon-list"
  }, {
    path: "/indent/create",
    component: _e9236efa,
    name: "indent-create"
  }, {
    path: "/money/pay",
    component: _035b857a,
    name: "money-pay"
  }, {
    path: "/money/success",
    component: _122824c4,
    name: "money-success"
  }, {
    path: "/pass/findPassword",
    component: _52acd0a0,
    name: "pass-findPassword"
  }, {
    path: "/pass/login",
    component: _90b15126,
    name: "pass-login"
  }, {
    path: "/pass/register",
    component: _8df02362,
    name: "pass-register"
  }, {
    path: "/user/address",
    component: _a53b5c04,
    name: "user-address"
  }, {
    path: "/user/cancel",
    component: _ed78ff40,
    name: "user-cancel"
  }, {
    path: "/user/cellphone",
    component: _310bf6d6,
    name: "user-cellphone"
  }, {
    path: "/user/collect",
    component: _6df08c34,
    name: "user-collect"
  }, {
    path: "/user/integralDraw",
    component: _23ad0368,
    name: "user-integralDraw"
  }, {
    path: "/user/password",
    component: _13943881,
    name: "user-password"
  }, {
    path: "/user/portal",
    component: _28b79152,
    name: "user-portal"
  }, {
    path: "/user/userinfo",
    component: _6a7adc42,
    name: "user-userinfo"
  }, {
    path: "/article/components/defaultArticle",
    component: _3dfb1ab6,
    name: "article-components-defaultArticle"
  }, {
    path: "/article/components/defaultColumn",
    component: _7a9b7fc6,
    name: "article-components-defaultColumn"
  }, {
    path: "/article/components/defaultColumnDetail",
    component: _c15c6d92,
    name: "article-components-defaultColumnDetail"
  }, {
    path: "/article/js/defaultArticle",
    component: _1e271e06,
    name: "article-js-defaultArticle"
  }, {
    path: "/article/js/defaultColumn",
    component: _dd7fd508,
    name: "article-js-defaultColumn"
  }, {
    path: "/article/js/defaultColumnDetail",
    component: _8afb10aa,
    name: "article-js-defaultColumnDetail"
  }, {
    path: "/category/js/list",
    component: _480f168f,
    name: "category-js-list"
  }, {
    path: "/comment/js/list",
    component: _0e31d274,
    name: "comment-js-list"
  }, {
    path: "/comment/js/score",
    component: _4af3dfaa,
    name: "comment-js-score"
  }, {
    path: "/coupon/components/js",
    component: _f15f9da6,
    name: "coupon-components-js"
  }, {
    path: "/coupon/components/use",
    component: _7d016980,
    name: "coupon-components-use"
  }, {
    path: "/coupon/js/list",
    component: _1c4bcfa7,
    name: "coupon-js-list"
  }, {
    path: "/indent/js/create",
    component: _2be5cc7a,
    name: "indent-js-create"
  }, {
    path: "/money/js/pay",
    component: _08edb735,
    name: "money-js-pay"
  }, {
    path: "/money/js/success",
    component: _505742fa,
    name: "money-js-success"
  }, {
    path: "/pass/js/findPassword",
    component: _7d7cf746,
    name: "pass-js-findPassword"
  }, {
    path: "/pass/js/login",
    component: _868ae3ea,
    name: "pass-js-login"
  }, {
    path: "/pass/js/register",
    component: _03c1ab37,
    name: "pass-js-register"
  }, {
    path: "/user/coupon/components",
    component: _2256c0a0,
    name: "user-coupon-components"
  }, {
    path: "/user/coupon/list",
    component: _91e16bac,
    name: "user-coupon-list"
  }, {
    path: "/user/finance/list",
    component: _009411fc,
    name: "user-finance-list"
  }, {
    path: "/user/indent/detail",
    component: _44ac72e3,
    name: "user-indent-detail"
  }, {
    path: "/user/indent/list",
    component: _462419a0,
    name: "user-indent-list"
  }, {
    path: "/user/integral/list",
    component: _696d5cb0,
    name: "user-integral-list"
  }, {
    path: "/user/integralDraw/js",
    component: _49e3da4c,
    name: "user-integralDraw-js"
  }, {
    path: "/user/integralDraw/list",
    component: _7688f7d8,
    name: "user-integralDraw-list"
  }, {
    path: "/user/integralDraw/log",
    component: _b719ff84,
    name: "user-integralDraw-log"
  }, {
    path: "/user/js/address",
    component: _1e9ed21a,
    name: "user-js-address"
  }, {
    path: "/user/js/cancel",
    component: _2d78ac74,
    name: "user-js-cancel"
  }, {
    path: "/user/js/cellphone",
    component: _26b977fc,
    name: "user-js-cellphone"
  }, {
    path: "/user/js/collect",
    component: _66e57924,
    name: "user-js-collect"
  }, {
    path: "/user/js/password",
    component: _5b0f9fc5,
    name: "user-js-password"
  }, {
    path: "/user/js/portal",
    component: _0f70b294,
    name: "user-js-portal"
  }, {
    path: "/user/js/userinfo",
    component: _0621a2a7,
    name: "user-js-userinfo"
  }, {
    path: "/user/notice/detail",
    component: _3e86370f,
    name: "user-notice-detail"
  }, {
    path: "/user/notice/list",
    component: _6882d25c,
    name: "user-notice-list"
  }, {
    path: "/coupon/components/js/use",
    component: _60d00e58,
    name: "coupon-components-js-use"
  }, {
    path: "/user/coupon/components/coolc-coupon",
    component: _5eb08a3b,
    name: "user-coupon-components-coolc-coupon"
  }, {
    path: "/user/coupon/js/list",
    component: _30cdc908,
    name: "user-coupon-js-list"
  }, {
    path: "/user/finance/js/list",
    component: _63c51fa4,
    name: "user-finance-js-list"
  }, {
    path: "/user/indent/js/detail",
    component: _7df190e3,
    name: "user-indent-js-detail"
  }, {
    path: "/user/indent/js/list",
    component: _4c5ee694,
    name: "user-indent-js-list"
  }, {
    path: "/user/integral/js/list",
    component: _8e329994,
    name: "user-integral-js-list"
  }, {
    path: "/user/integralDraw/components/dsLuckyGrid",
    component: _2410bd23,
    name: "user-integralDraw-components-dsLuckyGrid"
  }, {
    path: "/user/integralDraw/components/dsLuckyWheel",
    component: _76320264,
    name: "user-integralDraw-components-dsLuckyWheel"
  }, {
    path: "/user/integralDraw/components/dsSlotMachine",
    component: _21546304,
    name: "user-integralDraw-components-dsSlotMachine"
  }, {
    path: "/user/integralDraw/components/winningResults",
    component: _20d1305c,
    name: "user-integralDraw-components-winningResults"
  }, {
    path: "/user/integralDraw/js/list",
    component: _04c0a152,
    name: "user-integralDraw-js-list"
  }, {
    path: "/user/integralDraw/js/log",
    component: _f6d33f4c,
    name: "user-integralDraw-js-log"
  }, {
    path: "/user/notice/js/detail",
    component: _3ab56592,
    name: "user-notice-js-detail"
  }, {
    path: "/user/notice/js/list",
    component: _1b2f4e0a,
    name: "user-notice-js-list"
  }, {
    path: "/product/detail/js/:id?",
    component: _924cb4ba,
    name: "product-detail-js-id"
  }, {
    path: "/product/list/js/:id?",
    component: _047db520,
    name: "product-list-js-id"
  }, {
    path: "/article/detail/:id?",
    component: _5fd82924,
    name: "article-detail-id"
  }, {
    path: "/article/list/:id?",
    component: _39702901,
    name: "article-list-id"
  }, {
    path: "/product/detail/:id?",
    component: _4781bc95,
    name: "product-detail-id"
  }, {
    path: "/product/list/:id?",
    component: _76c3d030,
    name: "product-list-id"
  }, {
    path: "/",
    component: _1cf7d247,
    name: "index",
    children: [{
      path: "js",
      component: _7f3a9446,
      name: "index-js"
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
