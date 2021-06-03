import Vue from 'vue'
import VueBus from 'vue-bus'

import { getToken } from '@/utils/auth'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control

import * as filters from './filters' // global filters

import permission from '@/directive/permission/index.js'
Vue.use(permission)

Vue.use(Element, {
  size: getToken('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import filter from './utils/filter.js'
/* 注册过滤器 */
for (const key in filter) {
  if (filter.hasOwnProperty(key)) {
    const element = filter[key]
    Vue.filter(key, element)
  }
}
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

import VueDND from 'awe-dnd'
Vue.use(VueDND)
Vue.use(VueBus)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
