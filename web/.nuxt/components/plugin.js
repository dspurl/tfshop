import Vue from 'vue'

const components = {
  Footer: () => import('../..\\components\\Footer.vue' /* webpackChunkName: "components/footer" */).then(c => c.default || c),
  Header: () => import('../..\\components\\Header.vue' /* webpackChunkName: "components/header" */).then(c => c.default || c),
  MiniFooter: () => import('../..\\components\\MiniFooter.vue' /* webpackChunkName: "components/mini-footer" */).then(c => c.default || c),
  MiniHeader: () => import('../..\\components\\MiniHeader.vue' /* webpackChunkName: "components/mini-header" */).then(c => c.default || c)
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
