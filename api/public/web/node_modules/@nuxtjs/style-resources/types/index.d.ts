import '@nuxt/types'

interface Options {
  sass?: string[] | string
  scss?: string[] | string
  less?: string[] | string
  stylus?: string[] | string
  hoistUseStatements?: boolean
}

declare module '@nuxt/types' {
  interface NuxtConfig {
    styleResources?: Options
  }
}
