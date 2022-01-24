'use strict';

const httpProxyMiddleware = require('http-proxy-middleware');

function getProxyEntries(proxyOptions, defaults) {
  const applyDefaults = (opts) => ({...defaults, ...opts});
  const normalizeTarget = (input) => typeof input === "object" ? input : {target: input};
  const proxyEntries = [];
  if (!proxyOptions) {
    return proxyEntries;
  }
  if (!Array.isArray(proxyOptions)) {
    for (const key in proxyOptions) {
      proxyEntries.push({
        context: key,
        options: applyDefaults(normalizeTarget(proxyOptions[key]))
      });
    }
    return proxyEntries;
  }
  for (const input of proxyOptions) {
    if (Array.isArray(input)) {
      proxyEntries.push({
        context: input[0],
        options: applyDefaults(normalizeTarget(input[1]))
      });
    } else {
      proxyEntries.push({
        context: input,
        options: applyDefaults()
      });
    }
  }
  return proxyEntries;
}

const proxyModule = function(options2) {
  const nuxt = this.nuxt;
  if (!nuxt.options.server || !nuxt.options.proxy) {
    return;
  }
  const defaults = {
    changeOrigin: true,
    ws: true,
    ...options2
  };
  const proxyEntries = getProxyEntries(nuxt.options.proxy, defaults);
  for (const proxyEntry of proxyEntries) {
    this.addServerMiddleware({
      prefix: false,
      handler: httpProxyMiddleware.createProxyMiddleware(proxyEntry.context, proxyEntry.options)
    });
  }
};
proxyModule.meta = require("../package.json");

module.exports = proxyModule;
