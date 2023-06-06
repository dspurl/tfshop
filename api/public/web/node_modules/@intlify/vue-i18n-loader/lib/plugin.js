"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
;
(async () => {
    try {
        await Promise.resolve().then(() => __importStar(require('vue-i18n')));
    }
    catch (e) {
        throw new Error('@intlify/vue-i18n-loader requires vue-i18n to be present in the dependency tree.');
    }
})();
const webpack_1 = __importDefault(require("webpack"));
let Plugin;
console.warn(`[@intlify/vue-i18n-loader] IntlifyVuePlugin is experimental! This plugin is used for Intlify tools. Don't use this plugin to enhancement Component options of your application.`);
// console.log('[@intlify/vue-i18n-loader] webpack version:', webpack.version)
if (webpack_1.default.version && webpack_1.default.version[0] > '4') {
    // webpack5 and upper
    Plugin = require('./pluginWebpack5').default; // eslint-disable-line @typescript-eslint/no-var-requires
}
else {
    // webpack4 and lower
    Plugin = require('./pluginWebpack4').default; // eslint-disable-line @typescript-eslint/no-var-requires
}
exports.default = Plugin;
