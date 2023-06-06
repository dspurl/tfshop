import { HTTPMethod } from 'workbox-routing';
import { Plugin } from 'workbox-background-sync';
import { Plugin as Plugin$1 } from 'workbox-broadcast-update';
import { Plugin as Plugin$2 } from 'workbox-cacheable-response';
import { Plugin as Plugin$3 } from 'workbox-expiration';
import { Plugin as Plugin$4 } from 'workbox-range-requests';
import { StaleWhileRevalidateOptions, CacheFirstOptions, NetworkFirstOptions, NetworkOnlyOptions, CacheOnlyOptions } from 'workbox-strategies';

/* eslint camelcase: 0 */

interface ManifestOptions {
  /**
   * Default: _npm_package_name_
   */
  name: string,
  /**
   * Default: _npm_package_name_
   */
  short_name: string,
  /**
   * Default: _npm_package_description_
   */
  description: string,
  /**
   *
   */
  icons: Record<string, any>[],
  /**
   * Default: `routerBase + '?standalone=true'`
   */
  start_url: string,
  /**
   * Default: `standalone`
   */
  display: string,
  /**
   * Default: `#ffffff`
   */
  background_color: string,
  /**
   * Default: undefined
   */
  theme_color: string,
  /**
   * Default: `ltr`
   */
  dir: 'ltr' | 'rtl',
  /**
   * Default: `en`
   */
  lang: string,
  /**
   * Default: `false`
   */
  useWebmanifestExtension: boolean,
  /**
   * Default: A combination of `routerBase` and `options.build.publicPath`
   */
  publicPath: string,

  fileName: string,
  crossorigin: boolean
}

/* eslint camelcase: 0 */


type OgImageObject = {
  path?: string,
  width?: number,
  height?: number,
  type?: string
}

interface MetaOptions extends Partial<ManifestOptions> {
  /**
   * Default: `utf-8`
   */
  charset: string,
  /**
   * Default: `width=device-width, initial-scale=1`
   *
   * Meta: `viewport`
   */
  viewport: string,
  /**
   * Default: `true`
   *
   * Meta: `mobile-web-app-capable`
   */
  mobileApp: boolean,
  /**
   * Default: `false`
   *
   * Meta: `apple-mobile-web-app-capable`
   */
  mobileAppIOS: boolean,
  /**
   * Default: `default`
   */
  appleStatusBarStyle: string,
  /**
   * Default: `true` (to use options.icons)
   *
   * Meta: `shortcut icon` + `apple-touch-icon`
   */
  favicon: boolean,
  /**
   * Default: _npm_package_name_
   *
   * Meta: `title`
   */
  name: string,
  /**
   * @deprecated use meta.name
   */
  title?: string,
  /**
   * Default: _npm_package_author_name_
   *
   * Meta: `author`
   */
  author: string,
  /**
   * Default: _npm_package_description_
   *
   * Meta: `description`
   */
  description: string,
  /**
   * Default: `options.loading.color`
   *
   * Meta: `description`
   */
  theme_color: string,
  /**
   * Default: `en`
   *
   * Meta: `lang`
   */
  lang: string,
  /**
   * Default: `website`
   *
   * Meta: `og:type`
   */
  ogType: string,
  /**
   * Default: _npm_package_name_
   *
   * Meta: `og:site_name`
   */
  ogSiteName: string | true,
  /**
   * Default: _npm_package_name_
   *
   * Meta: `og:title`
   */
  ogTitle: string | true,
  /**
   * Default: _npm_package_description_
   *
   * Meta: `og:description`
   */
  ogDescription: string | true,
  /**
   * Default: `undefined`
   *
   * Meta: `N/A`
   */
  ogHost: string | undefined,
  /**
   * Default: `true`
   *
   * Meta: `og:image` and sub-tags
   */
  ogImage: boolean | string | OgImageObject,
  /**
   * Default: ogHost (if defined)
   *
   * Meta: `og:url`
   */
  ogUrl: string | undefined | true,
  /**
   * Default: `undefined`
   *
   * Meta: `twitter:card`
   */
  twitterCard: string | undefined,
  /**
   * Default: `undefined`
   *
   * Meta: `twitter:site`
   */
  twitterSite: string | undefined,
  /**
   * Default: `undefined`
   *
   * Meta: `twitter:creator`
   */
  twitterCreator: string | undefined,
  /**
   * Default: `false`
   */
  nativeUI: boolean
}

type iOSType = 'ipad' | 'ipadpro9' | 'ipadpro9' | 'ipadpro10' | 'ipadpro12' | 'iphonese' | 'iphone6' | 'iphoneplus' | 'iphonex' | 'iphonexr' | 'iphonexsmax'
type iOSSize = [number, number, iOSType]

interface IconOptions {
  /**
   * Default: `[srcDir]/[staticDir]/icon.png`
   */
  source: string,
  /**
   * Default: `icon.png`
   */
  fileName: string,
  /**
   * Array of sizes to be generated (Square).
   * Default: `[64, 120, 144, 152, 192, 384, 512]`
   */
  sizes: number[],

  /**
   * Default:
   * ```javascript
   * [
   *   [1536, 2048, 'ipad'], // Ipad
   *   [1536, 2048, 'ipadpro9'], // Ipad Pro 9.7"
   *   [1668, 2224, 'ipadpro10'], // Ipad Pro 10.5"
   *   [2048, 2732, 'ipadpro12'], // Ipad Pro 12.9"
   *   [640, 1136, 'iphonese'], // Iphone SE
   *   [50, 1334, 'iphone6'], // Iphone 6
   *   [1080, 1920, 'iphoneplus'], // Iphone Plus
   *   [1125, 2436, 'iphonex'], // Iphone X
   *   [828, 1792, 'iphonexr'], // Iphone XR
   *   [1242, 2688, 'iphonexsmax'] // Iphone XS Max
   * ]
   * ```
   */
  iosSizes: iOSSize[],
  /**
   * Default: `icons`
   */
  targetDir: string,
  /**
   * Make icons accessible through `ctx` or Vue instances.
   *
   * Default: `true`
   */
  plugin: boolean,
  /**
   * Name of property for accessible icons.
   *
   * Default: `$icon`
   */
  pluginName: string,
  /**
   * Array or string of icon purpose.
   *
   * Default: `['any', 'maskable']`
   */
  purpose: string[] | string,
  /**
   * Cache dir for generated icons
   *
   * Default: `{rootDir}/node_modules/.cache/icon`
   */
  cacheDir: string,

  publicPath: string
}

type CachingStrategy = 'CacheFirst' | 'CacheOnly' | 'NetworkFirst' | 'NetworkOnly' | 'StaleWhileRevalidate'

type StrategyOptions =
  Omit<StaleWhileRevalidateOptions | CacheFirstOptions | NetworkFirstOptions | NetworkOnlyOptions | CacheOnlyOptions, 'plugins'>

type StrategyPluginOf<name, T> = {
  use: name
  config: ConstructorParameters<T>[0] | ConstructorParameters<T>
}

type BackgroundSync = StrategyPluginOf<'BackgroundSync', Plugin>
type BroadcastUpdate = StrategyPluginOf<'BroadcastUpdate', Plugin$1>
type CacheableResponse = StrategyPluginOf<'CacheableResponse', Plugin$2>
type Expiration = StrategyPluginOf<'Expiration', Plugin$3>
type RangeRequests = StrategyPluginOf<'RangeRequests', Plugin$4>

type StrategyPlugin = BackgroundSync | BroadcastUpdate | CacheableResponse | Expiration | RangeRequests

interface RuntimeCaching {
  urlPattern: string
  handler?: CachingStrategy
  method?: HTTPMethod
  strategyOptions?: StrategyOptions
  strategyPlugins?: StrategyPlugin[]
}

interface WorkboxOptions {
  dev: boolean,
  workboxVersion: string,
  workboxURL: string,
  importScripts: string[],
  /**
   * Default: `true`
   */
  autoRegister: boolean,
  /**
   * Default: `true` for production mode
   */
  enabled: boolean,
  cacheNames: Record<string, any>,
  config: Record<string, any>,
  /**
   * Default: `true`
   */
  clientsClaim: boolean,
  /**
   * Default: `true`
   */
  skipWaiting: boolean,
  /**
   * Default: `false`
   */
  offlineAnalytics: boolean,
  workboxExtensions: string | string[],
  /**
   * Default: `[]`
   */
  preCaching: string[] | {url: string, revision: string}[],
  cacheOptions: {
    /**
     * Default: `<npm package name> || nuxt`
     */
    cacheId: string,
    /**
     * Default: `/`
     */
    directoryIndex: string,
    /**
     * Default: `undefined`
     */
    revision: string | undefined
  },
  cachingExtensions: string | string[],
  cleanupOutdatedCaches: boolean,
  /**
   * Default: `true`
   */
  offline: boolean,
  /**
   * Default: `NetworkFirst`
   */
  offlineStrategy: CachingStrategy,
  offlinePage: string,
  offlineAssets: string[],
  runtimeCaching: RuntimeCaching[],
  /**
   * Default: `true`
   */
  cacheAssets: boolean,
  routingExtensions: string | string[],
  /**
   * Default: `/_nuxt/`
   */
  assetsURLPattern: string,
  /**
   * Auto generated based on `router.base`
   *
   * Default: `/`
   */
  pagesURLPattern: string,
  swTemplate: string,
  swURL: string,
  swDest: string,
  /**
   * Default: `routerBase`
   */
  swScope: string,
  /**
   * Default: `/`
   */
  routerBase: string,
  /**
   * Default: `/_nuxt`
   */
  publicPath: string
}

interface PWAOptions {
    meta?: Partial<MetaOptions> | false;
    icon?: Partial<IconOptions> | false;
    workbox?: Partial<WorkboxOptions> | false;
    manifest?: Partial<ManifestOptions> | false;
}
declare function pwa(moduleOptions: PWAOptions): Promise<void>;
declare namespace pwa {
    var meta: {
        name: string;
        version: string;
    };
}

declare module '@nuxt/types/config/index' {
    interface NuxtOptions {
        pwa?: Partial<PWAOptions>;
        meta?: Partial<MetaOptions> | false;
        icon?: Partial<IconOptions> | false;
        workbox?: Partial<WorkboxOptions> | false;
        manifest?: Partial<ManifestOptions> | false;
    }
}

export default pwa;
