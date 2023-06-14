import Vue from 'vue'
import { wrapFunctional } from './utils'

const components = {
  CartHeader: () => import('../..\\components\\CartHeader.vue' /* webpackChunkName: "components/cart-header" */).then(c => wrapFunctional(c.default || c)),
  Footer: () => import('../..\\components\\Footer.vue' /* webpackChunkName: "components/footer" */).then(c => wrapFunctional(c.default || c)),
  Header: () => import('../..\\components\\Header.vue' /* webpackChunkName: "components/header" */).then(c => wrapFunctional(c.default || c)),
  MiniFooter: () => import('../..\\components\\MiniFooter.vue' /* webpackChunkName: "components/mini-footer" */).then(c => wrapFunctional(c.default || c)),
  MiniHeader: () => import('../..\\components\\MiniHeader.vue' /* webpackChunkName: "components/mini-header" */).then(c => wrapFunctional(c.default || c)),
  VueVideo: () => import('../..\\components\\VueVideo.vue' /* webpackChunkName: "components/vue-video" */).then(c => wrapFunctional(c.default || c)),
  AddressList: () => import('../..\\components\\Address\\list.vue' /* webpackChunkName: "components/address-list" */).then(c => wrapFunctional(c.default || c)),
  JsCartHeader: () => import('../..\\components\\js\\CartHeader.js' /* webpackChunkName: "components/js-cart-header" */).then(c => wrapFunctional(c.default || c)),
  JsFooter: () => import('../..\\components\\js\\Footer.js' /* webpackChunkName: "components/js-footer" */).then(c => wrapFunctional(c.default || c)),
  JsHeader: () => import('../..\\components\\js\\Header.js' /* webpackChunkName: "components/js-header" */).then(c => wrapFunctional(c.default || c)),
  JsMiniFooter: () => import('../..\\components\\js\\MiniFooter.js' /* webpackChunkName: "components/js-mini-footer" */).then(c => wrapFunctional(c.default || c)),
  JsMiniHeader: () => import('../..\\components\\js\\MiniHeader.js' /* webpackChunkName: "components/js-mini-header" */).then(c => wrapFunctional(c.default || c)),
  JsVueVideo: () => import('../..\\components\\js\\VueVideo.js' /* webpackChunkName: "components/js-vue-video" */).then(c => wrapFunctional(c.default || c)),
  Pagination: () => import('../..\\components\\Pagination\\index.vue' /* webpackChunkName: "components/pagination" */).then(c => wrapFunctional(c.default || c)),
  Sku: () => import('../..\\components\\Sku\\index.vue' /* webpackChunkName: "components/sku" */).then(c => wrapFunctional(c.default || c)),
  Sku2param: () => import('../..\\components\\Sku\\sku2param.js' /* webpackChunkName: "components/sku2param" */).then(c => wrapFunctional(c.default || c)),
  SkuUtils: () => import('../..\\components\\Sku\\utils.js' /* webpackChunkName: "components/sku-utils" */).then(c => wrapFunctional(c.default || c)),
  UploadAvatarImage: () => import('../..\\components\\Upload\\AvatarImage.vue' /* webpackChunkName: "components/upload-avatar-image" */).then(c => wrapFunctional(c.default || c)),
  UploadInsertImage: () => import('../..\\components\\Upload\\InsertImage.vue' /* webpackChunkName: "components/upload-insert-image" */).then(c => wrapFunctional(c.default || c)),
  AddressJsList: () => import('../..\\components\\Address\\js\\list.js' /* webpackChunkName: "components/address-js-list" */).then(c => wrapFunctional(c.default || c)),
  PaginationJs: () => import('../..\\components\\Pagination\\js\\index.js' /* webpackChunkName: "components/pagination-js" */).then(c => wrapFunctional(c.default || c)),
  SkuJs: () => import('../..\\components\\Sku\\js\\index.js' /* webpackChunkName: "components/sku-js" */).then(c => wrapFunctional(c.default || c)),
  UploadJsAvatarImage: () => import('../..\\components\\Upload\\js\\avatarImage.js' /* webpackChunkName: "components/upload-js-avatar-image" */).then(c => wrapFunctional(c.default || c)),
  UploadJsInsertImage: () => import('../..\\components\\Upload\\js\\insertImage.js' /* webpackChunkName: "components/upload-js-insert-image" */).then(c => wrapFunctional(c.default || c))
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
