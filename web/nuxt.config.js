require('dotenv').config()
export default {
  server: {
    port: 3004, // default: 3000
    host: '0.0.0.0', // default: localhost,
  },
  env: {
    baseUrl: process.env.BASE_URL
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'dsshop',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/css/main.css',
    '@/assets/css/iconfont.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/ctx-inject.js',
    '@/plugins/filter.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],
  // router: {
  //   middleware: ['auth']
  // },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    ['@nuxtjs/dotenv', { filename: '.env.prod' }]
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  }
}
