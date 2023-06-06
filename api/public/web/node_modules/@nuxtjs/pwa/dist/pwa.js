'use strict';

const path = require('path');
const serveStatic = require('serve-static');
const fs = require('fs-extra');
const template = require('lodash.template');
const child_process = require('child_process');
const hasha2 = require('hasha');
const cloneDeep = require('clone-deep');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

const serveStatic__default = /*#__PURE__*/_interopDefaultLegacy(serveStatic);
const fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
const template__default = /*#__PURE__*/_interopDefaultLegacy(template);
const hasha2__default = /*#__PURE__*/_interopDefaultLegacy(hasha2);
const cloneDeep__default = /*#__PURE__*/_interopDefaultLegacy(cloneDeep);

var name = "@nuxtjs/pwa";
var version = "3.3.4";

const PKG = {
  name,
  version
};
const PKG_DIR = path.resolve(__dirname, "..");
function isUrl(url) {
  return url.indexOf("http") === 0 || url.indexOf("//") === 0;
}
function joinUrl(...args) {
  return path.posix.join(...args).replace(":/", "://");
}
function normalizeSize(size) {
  if (!Array.isArray(size)) {
    size = [size, size];
  }
  if (size.length === 1) {
    size = [size, size];
  } else if (size.length === 0) {
    size = 64;
  }
  return size;
}
function sizeName(size) {
  size = normalizeSize(size);
  const prefix = size[2] ? size[2] + "_" : "";
  return prefix + size[0] + "x" + size[1];
}
function getRouteParams(options) {
  const routerBase = options.router.base;
  let publicPath;
  if (isUrl(options.build.publicPath)) {
    publicPath = options.build.publicPath;
  } else {
    publicPath = joinUrl(routerBase, options.build.publicPath);
  }
  return {
    routerBase,
    publicPath
  };
}
function startCase(str) {
  return typeof str === "string" ? str[0].toUpperCase() + str.substr(1) : str;
}
async function writeData(path2, data) {
  path2 = path2.split("?")[0];
  await fs.mkdirp(path.dirname(path2));
  await fs.writeFile(path2, await data);
}
function emitAsset(nuxt, fileName, data) {
  const emitAsset2 = async () => {
    const buildPath = path.resolve(nuxt.options.buildDir, "dist/client", fileName);
    await writeData(buildPath, data);
  };
  nuxt.hook("build:done", () => emitAsset2());
  const isGenerate = nuxt.options.target === "static" && !nuxt.options.dev;
  if (isGenerate) {
    nuxt.hook("modules:done", () => emitAsset2());
  }
}
async function readJSFiles(nuxt, files) {
  const contents = [];
  for (const file of Array.isArray(files) ? files : [files]) {
    const path2 = nuxt.resolver.resolvePath(file);
    if (path2 && fs.existsSync(path2)) {
      contents.push(await fs.readFile(path2, "utf8").then((s) => s.trim()));
    } else {
      throw new Error("Can not read " + path2);
    }
  }
  return contents.join("\n\n");
}
function pick(obj, props) {
  const newObj = {};
  props.forEach((prop) => {
    newObj[prop] = obj[prop];
  });
  return newObj;
}
async function copyTemplate({src, dst, options}) {
  const compile = template__default['default'](await fs.readFile(src, "utf8"));
  await fs.writeFile(dst, compile({options}));
}
function randomString(length) {
  const result = [];
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    const char = characters.charAt(Math.floor(Math.random() * characters.length));
    result.push(char);
  }
  return result.join("");
}

async function icon(nuxt, pwa, moduleContainer) {
  const {publicPath} = getRouteParams(nuxt.options);
  const defaults = {
    sizes: [64, 120, 144, 152, 192, 384, 512],
    iosSizes: [
      [1536, 2048, "ipad"],
      [1536, 2048, "ipadpro9"],
      [1668, 2224, "ipadpro10"],
      [2048, 2732, "ipadpro12"],
      [640, 1136, "iphonese"],
      [50, 1334, "iphone6"],
      [1080, 1920, "iphoneplus"],
      [1125, 2436, "iphonex"],
      [828, 1792, "iphonexr"],
      [1242, 2688, "iphonexsmax"]
    ],
    fileName: "icon.png",
    source: null,
    purpose: ["any", "maskable"],
    cacheDir: path.join(nuxt.options.rootDir, "node_modules/.cache/pwa/icon"),
    targetDir: "icons",
    plugin: true,
    pluginName: "$icon",
    publicPath,
    _iconHash: null,
    _assets: null,
    _manifestIcons: null,
    _iosSplash: null
  };
  const options = {
    ...defaults,
    ...pwa.icon
  };
  options.source = await findIcon(nuxt, options);
  if (!options.source) {
    console.warn("[pwa] [icon] Icon not found in " + path.resolve(nuxt.options.srcDir, nuxt.options.dir.static, options.fileName));
    return;
  }
  if (options.purpose) {
    if (!Array.isArray(options.purpose)) {
      options.purpose = [options.purpose];
    }
    const validPurpose = ["badge", "maskable", "any"];
    if (options.purpose.find((p) => !validPurpose.includes(p))) {
      console.warn("[pwa] [icon] Some invalid items removed from `options.purpose`. Valid values: " + validPurpose);
    }
  }
  await generateIcons(nuxt, options);
  addManifest(nuxt, options, pwa);
  if (options.plugin) {
    addPlugin(nuxt, options, moduleContainer);
  }
  emitAssets(nuxt, options);
}
function findIcon(nuxt, options) {
  const iconSearchPath = [
    options.source,
    path.resolve(nuxt.options.srcDir, nuxt.options.dir.static, options.fileName),
    path.resolve(nuxt.options.srcDir, nuxt.options.dir.assets, options.fileName)
  ].filter((p) => p);
  for (const source of iconSearchPath) {
    if (fs__default['default'].existsSync(source)) {
      return source;
    }
  }
}
function addPlugin(_nuxt, options, moduleContainer) {
  const icons = {};
  for (const asset of options._assets) {
    icons[asset.name] = joinUrl(options.publicPath, asset.target);
  }
  if (options.plugin) {
    moduleContainer.addPlugin({
      src: path.resolve(PKG_DIR, "templates/icon.plugin.js"),
      fileName: "pwa/icon.plugin.js",
      options: {
        pluginName: options.pluginName,
        icons
      }
    });
  }
}
async function generateIcons(_nuxt, options) {
  if (!options.iconHash) {
    options.iconHash = await hasha2__default['default'].fromFile(options.source).then((h) => h.substring(0, 6));
  }
  options._assets = [];
  const purpose = options.purpose ? options.purpose.join(" ") : void 0;
  options._manifestIcons = [];
  for (const size of options.sizes) {
    const name = sizeName(size);
    const target = `${options.targetDir}/icon_${name}.${options.iconHash}.png`;
    options._assets.push({name, target});
    options._manifestIcons.push({
      src: joinUrl(options.publicPath, target),
      sizes: name,
      type: "image/png",
      purpose
    });
  }
  options._iosSplash = {};
  for (const size of options.iosSizes) {
    const name = sizeName(size);
    const target = `${options.targetDir}/splash_${name}.${options.iconHash}.png`;
    options._assets.push({name, target});
    options._iosSplash[size[2]] = joinUrl(options.publicPath, target);
  }
}
function addManifest(_nuxt, options, pwa) {
  if (!pwa.manifest) {
    pwa.manifest = {};
  }
  if (!pwa.manifest.icons) {
    pwa.manifest.icons = [];
  }
  pwa.manifest.icons.push(...options._manifestIcons);
  pwa._iosSplash = {
    ...options._iosSplash
  };
}
function emitAssets(nuxt, options) {
  const resizePromise = resizeIcons(nuxt, options);
  for (const {name, target} of options._assets) {
    const srcFileName = path.join(options.cacheDir, `${name}.png`);
    emitAsset(nuxt, target, resizePromise.then(() => fs__default['default'].readFile(srcFileName)));
  }
}
async function resizeIcons(_nuxt, options) {
  const resizeOpts = JSON.stringify({
    version: PKG.version,
    input: options.source,
    distDir: options.cacheDir,
    sizes: [
      ...options.sizes,
      ...options.iosSizes
    ]
  });
  const integrityFile = path.join(options.cacheDir, "." + hasha2__default['default'](resizeOpts).substr(0, 8));
  if (fs__default['default'].existsSync(integrityFile)) {
    return;
  }
  await fs__default['default'].remove(options.cacheDir);
  await fs__default['default'].mkdirp(options.cacheDir);
  await new Promise((_resolve, _reject) => {
    const child = child_process.fork(path.resolve(PKG_DIR, "lib/resize.js"), [resizeOpts], {execArgv: []});
    child.on("exit", (code) => {
      return code ? _reject(code) : _resolve();
    });
  });
  await fs__default['default'].writeFile(integrityFile, "");
}

function manifest(nuxt, pwa) {
  const {routerBase, publicPath} = getRouteParams(nuxt.options);
  const defaults = {
    name: process.env.npm_package_name,
    short_name: process.env.npm_package_name,
    description: process.env.npm_package_description,
    publicPath,
    icons: [],
    start_url: routerBase + "?standalone=true",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: pwa.meta.theme_color,
    lang: "en",
    useWebmanifestExtension: false,
    fileName: "manifest.[hash].[ext]",
    dir: void 0,
    crossorigin: void 0
  };
  const options = {...defaults, ...pwa.manifest};
  const manifest2 = {...options};
  delete manifest2.src;
  delete manifest2.publicPath;
  delete manifest2.useWebmanifestExtension;
  delete manifest2.fileName;
  const manifestFileName = options.fileName.replace("[hash]", hasha2__default['default'](JSON.stringify(manifest2)).substr(0, 8)).replace("[ext]", options.useWebmanifestExtension ? "webmanifest" : "json");
  if (!nuxt.options.manifest) {
    nuxt.options.manifest = {};
  }
  Object.assign(nuxt.options.manifest, manifest2);
  Object.assign(pwa.manifest, manifest2);
  const manifestSource = JSON.stringify(manifest2, null, 2);
  emitAsset(nuxt, manifestFileName, manifestSource);
  const manifestMeta = {rel: "manifest", href: joinUrl(options.publicPath, manifestFileName), hid: "manifest"};
  if (manifest2.crossorigin) {
    manifestMeta.crossorigin = manifest2.crossorigin;
  }
  pwa._manifestMeta = manifestMeta;
}

function mergeMeta(to, from) {
  if (typeof to === "function") {
    console.warn("Cannot merge meta. Avoid using head as a function!");
    return;
  }
  for (const key in from) {
    const value = from[key];
    if (Array.isArray(value)) {
      to[key] = to[key] || [];
      for (const item of value) {
        if (item.hid && hasMeta(to[key], "hid", item.hid) || item.name && hasMeta(to[key], "name", item.name)) {
          continue;
        }
        to[key].push(item);
      }
    } else if (typeof value === "object") {
      to[key] = to[key] || {};
      for (const attr in value) {
        to[key][attr] = value[attr];
      }
    } else if (to[key] === void 0) {
      to[key] = value;
    }
  }
}
function hasMeta(arr, key, val) {
  return arr.find((obj) => val ? obj[key] === val : obj[key]);
}

function meta(nuxt, pwa, moduleContainer) {
  const defaults = {
    name: process.env.npm_package_name,
    author: process.env.npm_package_author_name,
    description: process.env.npm_package_description,
    charset: "utf-8",
    viewport: void 0,
    mobileApp: true,
    nativeUI: false,
    favicon: true,
    mobileAppIOS: void 0,
    appleStatusBarStyle: void 0,
    theme_color: void 0,
    lang: "en",
    ogType: "website",
    ogSiteName: true,
    ogTitle: true,
    ogDescription: true,
    ogImage: true,
    ogHost: void 0,
    ogUrl: true,
    twitterCard: void 0,
    twitterSite: void 0,
    twitterCreator: void 0
  };
  const options = {...defaults, ...pwa.manifest, ...pwa.meta};
  if (options.viewport === void 0) {
    options.viewport = options.nativeUI ? "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, minimal-ui" : "width=device-width, initial-scale=1";
  }
  if (options.mobileAppIOS === void 0) {
    options.mobileAppIOS = !!options.nativeUI;
  }
  const head = {
    title: "",
    meta: [],
    link: [],
    htmlAttrs: {}
  };
  if (options.charset) {
    head.meta.push({hid: "charset", charset: options.charset});
  }
  if (options.viewport) {
    head.meta.push({hid: "viewport", name: "viewport", content: options.viewport});
  }
  if (options.mobileApp) {
    head.meta.push({hid: "mobile-web-app-capable", name: "mobile-web-app-capable", content: "yes"});
  }
  if (options.mobileAppIOS) {
    head.meta.push({hid: "apple-mobile-web-app-capable", name: "apple-mobile-web-app-capable", content: "yes"});
  }
  if (options.mobileAppIOS || options.appleStatusBarStyle) {
    head.meta.push({
      hid: "apple-mobile-web-app-status-bar-style",
      name: "apple-mobile-web-app-status-bar-style",
      content: options.appleStatusBarStyle || "default"
    });
  }
  if (options.icons && options.icons.length > 0) {
    const iconSmall = options.icons[0];
    const iconBig = options.icons[options.icons.length - 1];
    if (options.favicon) {
      head.link.push({hid: "shortcut-icon", rel: "shortcut icon", href: iconSmall.src});
      head.link.push({hid: "apple-touch-icon", rel: "apple-touch-icon", href: iconBig.src, sizes: iconBig.sizes});
    }
    if (options.mobileAppIOS && pwa._iosSplash) {
      const splashes = [
        ["iphonese", "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"],
        ["iphone6", "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"],
        ["iphoneplus", "(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)"],
        ["iphonex", "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"],
        ["iphonexr", "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"],
        ["iphonexsmax", "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"],
        ["ipad", "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"],
        ["ipadpro1", "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"],
        ["ipadpro2", "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"],
        ["ipadpro3", "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"]
      ];
      for (const [type, media] of splashes) {
        head.link.push({
          href: pwa._iosSplash[type],
          media,
          rel: "apple-touch-startup-image",
          hid: "apple-touch-startup-image-" + type
        });
      }
    }
  } else {
    const favicon = path.join(nuxt.options.srcDir, nuxt.options.dir.static, "favicon.ico");
    if (fs.existsSync(favicon)) {
      head.link.push({hid: "shortcut-icon", rel: "shortcut icon", href: nuxt.options.router.base + "favicon.ico"});
    }
  }
  const title = options.name || options.title;
  if (title) {
    head.title = options.name;
    head.meta.push({hid: "apple-mobile-web-app-title", name: "apple-mobile-web-app-title", content: title});
  }
  if (options.author) {
    head.meta.push({hid: "author", name: "author", content: options.author});
  }
  if (options.description) {
    head.meta.push({hid: "description", name: "description", content: options.description});
  }
  if (options.theme_color) {
    head.meta.push({hid: "theme-color", name: "theme-color", content: options.theme_color});
  }
  if (options.lang) {
    head.htmlAttrs.lang = options.lang;
  }
  if (options.ogType) {
    head.meta.push({hid: "og:type", name: "og:type", property: "og:type", content: options.ogType});
  }
  if (options.ogTitle === true) {
    options.ogTitle = options.name;
  }
  if (options.ogTitle) {
    head.meta.push({hid: "og:title", name: "og:title", property: "og:title", content: options.ogTitle});
  }
  if (options.ogSiteName === true) {
    options.ogSiteName = options.name;
  }
  if (options.ogSiteName) {
    head.meta.push({hid: "og:site_name", name: "og:site_name", property: "og:site_name", content: options.ogSiteName});
  }
  if (options.ogDescription === true) {
    options.ogDescription = options.description;
  }
  if (options.ogDescription) {
    head.meta.push({hid: "og:description", name: "og:description", property: "og:description", content: options.ogDescription});
  }
  if (options.ogHost && options.ogUrl === true) {
    options.ogUrl = options.ogHost;
  }
  if (options.ogUrl && options.ogUrl !== true) {
    head.meta.push({hid: "og:url", name: "og:url", property: "og:url", content: options.ogUrl});
  }
  if (options.ogImage === true) {
    if (options.icons && options.icons.length > 0) {
      const iconBig = options.icons[options.icons.length - 1];
      const [width, height] = iconBig.sizes.split("x").map((x) => parseInt(x));
      options.ogImage = {path: iconBig.src, width, height, type: iconBig.type};
    } else {
      options.ogImage = false;
    }
  } else if (typeof options.ogImage === "string") {
    options.ogImage = {path: options.ogImage};
  }
  if (options.ogImage) {
    if (options.ogHost || isUrl(options.ogImage.path)) {
      head.meta.push({
        hid: "og:image",
        name: "og:image",
        property: "og:image",
        content: isUrl(options.ogImage.path) ? options.ogImage.path : options.ogHost + options.ogImage.path
      });
      if (options.ogImage.width && options.ogImage.height) {
        head.meta.push({
          hid: "og:image:width",
          name: "og:image:width",
          property: "og:image:width",
          content: options.ogImage.width
        });
        head.meta.push({
          hid: "og:image:height",
          name: "og:image:height",
          property: "og:image:height",
          content: options.ogImage.height
        });
      }
      if (options.ogImage.type) {
        head.meta.push({
          hid: "og:image:type",
          name: "og:image:type",
          property: "og:image:type",
          content: options.ogImage.type
        });
      }
    }
  }
  if (options.twitterCard) {
    head.meta.push({hid: "twitter:card", name: "twitter:card", property: "twitter:card", content: options.twitterCard});
  }
  if (options.twitterSite) {
    head.meta.push({hid: "twitter:site", name: "twitter:site", property: "twitter:site", content: options.twitterSite});
  }
  if (options.twitterCreator) {
    head.meta.push({hid: "twitter:creator", name: "twitter:creator", property: "twitter:creator", content: options.twitterCreator});
  }
  if (pwa._manifestMeta) {
    head.link.push(pwa._manifestMeta);
  }
  moduleContainer.addPlugin({
    src: path.resolve(PKG_DIR, "templates/meta.plugin.js"),
    fileName: "pwa/meta.plugin.js",
    options: {}
  });
  moduleContainer.addTemplate({
    src: path.resolve(PKG_DIR, "templates/meta.json"),
    fileName: "pwa/meta.json",
    options: {head}
  });
  moduleContainer.addTemplate({
    src: path.resolve(PKG_DIR, "lib/meta.utils.js"),
    fileName: "pwa/meta.utils.js",
    options: {head}
  });
  metaRuntime(nuxt);
}
function metaRuntime(nuxt) {
  const spaSupport = () => {
    try {
      const metaJSON = fs.readJsonSync(path.resolve(nuxt.options.buildDir, "pwa/meta.json"));
      mergeMeta(nuxt.options.head, metaJSON);
    } catch (_err) {
    }
  };
  nuxt.hook("render:resourcesLoaded", () => spaSupport());
}

var version$1 = "5.1.4";

const defaults = {
  workboxVersion: version$1,
  workboxURL: void 0,
  importScripts: [],
  autoRegister: true,
  enabled: void 0,
  config: {},
  clientsClaim: true,
  skipWaiting: true,
  offlineAnalytics: false,
  workboxExtensions: [],
  preCaching: [],
  cacheOptions: {
    cacheId: void 0,
    directoryIndex: "/",
    revision: void 0
  },
  cachingExtensions: [],
  cleanupOutdatedCaches: true,
  offline: true,
  offlineStrategy: "NetworkFirst",
  offlinePage: null,
  offlineAssets: [],
  runtimeCaching: [],
  routingExtensions: [],
  cacheAssets: true,
  assetsURLPattern: void 0,
  pagesURLPattern: void 0,
  swTemplate: void 0,
  swURL: void 0,
  swScope: void 0,
  swDest: void 0,
  routerBase: void 0,
  publicPath: void 0,
  dev: void 0,
  cacheNames: void 0
};

function getOptions(nuxt, pwa) {
  const options = cloneDeep__default['default']({...defaults, ...pwa.workbox});
  if (options.enabled === void 0) {
    options.enabled = !nuxt.options.dev || options.dev;
  }
  if (!options.routerBase) {
    options.routerBase = nuxt.options.router.base;
  }
  if (!options.publicPath) {
    const {publicPath} = getRouteParams(nuxt.options);
    options.publicPath = publicPath;
  }
  if (!options.swTemplate) {
    options.swTemplate = path.resolve(PKG_DIR, `templates/workbox/sw${options.enabled ? "" : ".unregister"}.js`);
  }
  if (!options.swDest) {
    options.swDest = path.resolve(nuxt.options.srcDir, nuxt.options.dir.static || "static", "sw.js");
  }
  options.swURL = joinUrl(options.routerBase, options.swURL || "sw.js");
  if (!options.swScope) {
    options.swScope = options.routerBase;
  }
  if (!options.assetsURLPattern) {
    options.assetsURLPattern = options.publicPath;
  }
  if (options.cacheAssets) {
    options.runtimeCaching.push({
      urlPattern: options.assetsURLPattern,
      handler: nuxt.options.dev ? "NetworkFirst" : "CacheFirst"
    });
  }
  if (!options.pagesURLPattern) {
    options.pagesURLPattern = options.routerBase;
  }
  if (options.offline && !options.offlinePage) {
    options.runtimeCaching.push({
      urlPattern: options.pagesURLPattern,
      handler: options.offlineStrategy
    });
  }
  if (!options.cacheOptions.revision) {
    options.cacheOptions.revision = randomString(12);
  }
  const normalizePreCaching = (arr) => [].concat(arr).map((url) => ({
    revision: options.cacheOptions.revision,
    ...typeof url === "string" ? {url} : url
  }));
  if (pwa.manifest && pwa.manifest.start_url) {
    options.preCaching.unshift(...normalizePreCaching(pwa.manifest.start_url));
  }
  if (options.offlineAssets.length) {
    options.preCaching.unshift(...normalizePreCaching(options.offlineAssets));
  }
  if (options.offlinePage) {
    options.preCaching.unshift(...normalizePreCaching(options.offlinePage));
  }
  if (options.cacheOptions.cacheId === void 0) {
    options.cacheOptions.cacheId = (process.env.npm_package_name || "nuxt") + (nuxt.options.dev ? "-dev" : "-prod");
  }
  options.preCaching = normalizePreCaching(options.preCaching);
  const pluginModules = {
    BackgroundSync: "backgroundSync.BackgroundSyncPlugin",
    BroadcastUpdate: "broadcastUpdate.BroadcastUpdatePlugin",
    CacheableResponse: "cacheableResponse.CacheableResponsePlugin",
    Expiration: "expiration.ExpirationPlugin",
    RangeRequests: "rangeRequests.RangeRequestsPlugin"
  };
  options.runtimeCaching = options.runtimeCaching.map((entry) => {
    return {
      ...entry,
      handler: startCase(entry.handler) || "NetworkFirst",
      method: entry.method || "GET",
      strategyPlugins: (entry.strategyPlugins || []).map((plugin) => {
        const use = pluginModules[plugin.use];
        if (!use) {
          console.warn(`Invalid strategy plugin ${plugin.use}`);
          return false;
        }
        return {
          use,
          config: Array.isArray(plugin.config) ? plugin.config : [plugin.config]
        };
      }).filter(Boolean)
    };
  });
  if (!options.workboxURL) {
    options.workboxURL = `https://cdn.jsdelivr.net/npm/workbox-cdn@${options.workboxVersion}/workbox/workbox-sw.js`;
  }
  if (options.config.debug === void 0) {
    options.config.debug = options.dev || nuxt.options.dev;
  }
  return options;
}

async function workbox(nuxt, pwa, moduleContainer) {
  const options2 = getOptions(nuxt, pwa);
  if (options2.dev) {
    console.warn("Workbox is running in development mode");
  }
  if (options2.autoRegister) {
    moduleContainer.addPlugin({
      src: path.resolve(PKG_DIR, `templates/workbox/workbox${options2.enabled ? "" : ".unregister"}.js`),
      ssr: false,
      fileName: "workbox.js",
      options: {
        ...options2
      }
    });
  }
  if (options2.swTemplate) {
    copyTemplate({
      src: options2.swTemplate,
      dst: options2.swDest,
      options: {
        dev: nuxt.options.dev,
        swOptions: pick(options2, [
          "workboxURL",
          "importScripts",
          "config",
          "cacheNames",
          "cacheOptions",
          "clientsClaim",
          "skipWaiting",
          "cleanupOutdatedCaches",
          "offlineAnalytics",
          "preCaching",
          "runtimeCaching",
          "offlinePage",
          "pagesURLPattern",
          "offlineStrategy"
        ]),
        routingExtensions: await readJSFiles(nuxt, options2.routingExtensions),
        cachingExtensions: await readJSFiles(nuxt, options2.cachingExtensions),
        workboxExtensions: await readJSFiles(nuxt, options2.workboxExtensions)
      }
    });
  }
}

async function pwa(moduleOptions) {
  const {nuxt} = this;
  const moduleContainer = this;
  const isBuild = nuxt.options._build;
  const isGenerate = nuxt.options.target === "static" && !nuxt.options.dev;
  const isRuntime = !isBuild && !isGenerate;
  if (isRuntime) {
    metaRuntime(nuxt);
    return;
  }
  const modules = {icon: icon, manifest: manifest, meta: meta, workbox: workbox};
  nuxt.options.pwa = {...nuxt.options.pwa || {}, ...moduleOptions || {}};
  const pwa2 = nuxt.options.pwa;
  for (const name in modules) {
    if (pwa2[name] === false || nuxt.options[name] === false) {
      continue;
    }
    if (pwa2[name] === void 0) {
      pwa2[name] = {};
    }
    if (nuxt.options[name] !== void 0) {
      pwa2[name] = {...nuxt.options[name], ...pwa2[name]};
    }
  }
  for (const name in modules) {
    if (pwa2[name] === false) {
      continue;
    }
    await modules[name](nuxt, pwa2, moduleContainer);
  }
  if (nuxt.options.dev) {
    const clientDir = path.resolve(nuxt.options.buildDir, "dist/client");
    nuxt.options.serverMiddleware.push({
      path: nuxt.options.build.publicPath,
      handler: serveStatic__default['default'](clientDir)
    });
  }
}
pwa.meta = PKG;

module.exports = pwa;
