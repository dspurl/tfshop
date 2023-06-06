import { Module } from '@nuxt/types';

interface TelemetryOptions {
  debug: boolean
  endpoint: string
  seed: string
  consent?: number
  enabled: boolean
}

declare module '@nuxt/types/config/index' {
  interface NuxtOptions {
    telemetry: boolean | Partial<{
      debug: boolean
      endpoint: string
      seed: string
      consent: 1
      enabled: boolean
    }>
  }
}

declare const telemetryModule: Module<TelemetryOptions>;

export default telemetryModule;
