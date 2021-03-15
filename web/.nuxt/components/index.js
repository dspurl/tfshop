export { default as Footer } from '../..\\components\\Footer.vue'
export { default as Header } from '../..\\components\\Header.vue'
export { default as MiniFooter } from '../..\\components\\MiniFooter.vue'
export { default as MiniHeader } from '../..\\components\\MiniHeader.vue'

export const LazyFooter = import('../..\\components\\Footer.vue' /* webpackChunkName: "components/footer" */).then(c => c.default || c)
export const LazyHeader = import('../..\\components\\Header.vue' /* webpackChunkName: "components/header" */).then(c => c.default || c)
export const LazyMiniFooter = import('../..\\components\\MiniFooter.vue' /* webpackChunkName: "components/mini-footer" */).then(c => c.default || c)
export const LazyMiniHeader = import('../..\\components\\MiniHeader.vue' /* webpackChunkName: "components/mini-header" */).then(c => c.default || c)
