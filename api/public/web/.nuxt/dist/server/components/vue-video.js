exports.ids = [14,3];
exports.modules = {

/***/ 183:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(195);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("5ca45718", content, true, context)
};

/***/ }),

/***/ 188:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(189);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
__webpack_require__(4).default("64ca229e", content, true)

/***/ }),

/***/ 189:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".vjs-custom-skin>.video-js{width:100%;font-family:\"PingFang SC\",\"Helvetica Neue\",\"Hiragino Sans GB\",\"Segoe UI\",\"Microsoft YaHei\",\"微软雅黑\",sans-serif}.video-js.vjs-no-flex .vjs-menu-button-inline,.vjs-custom-skin>.video-js .vjs-menu-button-inline.vjs-slider-active,.vjs-custom-skin>.video-js .vjs-menu-button-inline:focus,.vjs-custom-skin>.video-js .vjs-menu-button-inline:hover{width:10em}.vjs-custom-skin>.video-js .vjs-controls-disabled .vjs-big-play-button{display:none!important}.vjs-custom-skin>.video-js .vjs-control{width:3em}.vjs-custom-skin>.video-js .vjs-control.vjs-live-control{width:auto;padding-left:.5em;letter-spacing:.1em}.vjs-custom-skin>.video-js .vjs-menu-button-inline:before{width:1.5em}.vjs-menu-button-inline .vjs-menu{left:3em}.vjs-custom-skin>.video-js .vjs-load-progress div,.vjs-seeking .vjs-big-play-button,.vjs-waiting .vjs-big-play-button{display:none!important}.vjs-custom-skin>.video-js .vjs-mouse-display:after,.vjs-custom-skin>.video-js .vjs-play-progress:after{padding:0 .4em .3em}.video-js.vjs-ended .vjs-loading-spinner{display:none}.video-js.vjs-ended .vjs-big-play-button{display:block!important}.video-js.vjs-ended .vjs-big-play-button,.video-js.vjs-paused .vjs-big-play-button,.vjs-paused.vjs-has-started.vjs-custom-skin>.video-js .vjs-big-play-button{display:block}.vjs-custom-skin>.video-js .vjs-big-play-button{top:50%;left:50%;margin-left:-1.5em;margin-top:-1em;background-color:rgba(0,0,0,.45);font-size:3.5em;height:2em!important;line-height:2em!important;margin-top:-1em!important}.video-js:hover .vjs-big-play-button,.vjs-custom-skin>.video-js .vjs-big-play-button:active,.vjs-custom-skin>.video-js .vjs-big-play-button:focus{background-color:rgba(36,131,213,.9)}.vjs-custom-skin>.video-js .vjs-loading-spinner{border-color:rgba(36,131,213,.8)}.vjs-custom-skin>.video-js .vjs-control-bar2{background-color:#000}.vjs-custom-skin>.video-js .vjs-control-bar{color:#fff;font-size:14px}.vjs-custom-skin>.video-js .vjs-play-progress,.vjs-custom-skin>.video-js .vjs-volume-level{background-color:#2483d5}.vjs-custom-skin>.video-js .vjs-play-progress:before{top:-.3em}.vjs-custom-skin>.video-js .vjs-progress-control:hover .vjs-progress-holder{font-size:1.3em}.vjs-menu-button-popup.vjs-volume-menu-button-vertical .vjs-menu{left:0}.vjs-custom-skin>.video-js .vjs-menu li{padding:0;line-height:2em;font-size:1.1em;font-family:\"PingFang SC\",\"Helvetica Neue\",\"Hiragino Sans GB\",\"Segoe UI\",\"Microsoft YaHei\",\"微软雅黑\",sans-serif}.vjs-custom-skin>.video-js .vjs-mouse-display:after,.vjs-custom-skin>.video-js .vjs-play-progress:after,.vjs-custom-skin>.video-js .vjs-time-tooltip{border-radius:0;font-size:1em;padding:0;width:3em;height:1.5em;line-height:1.5em;top:-3em}.vjs-custom-skin>.video-js .vjs-menu-button-popup .vjs-menu{width:5em;left:-1em}.vjs-custom-skin>.video-js .vjs-menu-button-popup.vjs-volume-menu-button-vertical .vjs-menu{left:0}.vjs-custom-skin>.video-js .vjs-control-bar .vjs-play-control{order:0}.vjs-custom-skin>.video-js .vjs-control-bar .vjs-time-control{min-width:1em;padding:0;margin:0 .1em;text-align:center;display:block;order:1}.vjs-custom-skin>.video-js .vjs-control-bar .vjs-playback-rate .vjs-playback-rate-value{font-size:1.2em;line-height:2.4}.vjs-custom-skin>.video-js .vjs-progress-control.vjs-control{order:2}.vjs-custom-skin>.video-js .vjs-control-bar .vjs-volume-menu-button{order:3}.vjs-custom-skin>.video-js .vjs-control-bar .vjs-resolution-button{order:4}.vjs-custom-skin>.video-js .vjs-control-bar .vjs-resolution-button .vjs-resolution-button-label{display:block;line-height:3em}.vjs-custom-skin>.video-js .vjs-control-bar .vjs-playback-rate{order:5}.vjs-custom-skin>.video-js .vjs-control-bar .vjs-fullscreen-control{order:6}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 191:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var video_js_dist_video_js_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(73);
/* harmony import */ var video_js_dist_video_js_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(video_js_dist_video_js_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vue_video_player_src_custom_theme_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(188);
/* harmony import */ var vue_video_player_src_custom_theme_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(vue_video_player_src_custom_theme_css__WEBPACK_IMPORTED_MODULE_1__);


/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    poster: {
      type: String,
      default: ''
    },
    sources: {
      type: String,
      default: ''
    },
    aspectRatio: {
      type: String,
      default: '4:4'
    }
  },

  data() {
    return {
      playsinline: true,
      playerOptions: {
        // 播放器配置
        muted: false,
        // 是否静音
        language: 'zh-CN',
        aspectRatio: this.aspectRatio,
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        // 播放速度
        controls: true,
        preload: 'auto',
        // 视频预加载
        fluid: true,
        sources: [{
          type: 'video/mp4',
          src: this.sources
        }],
        poster: this.poster,
        // 封面图
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮

        }
      }
    };
  },

  mounted() {},

  methods: {
    // 监听播放
    onPlayerPlay(player) {// console.log('player play!', player)
    },

    // 监听暂停
    onPlayerPause(player) {// console.log('player pause!', player)
    },

    // 监听停止
    onPlayerEnded(player) {// console.log('player ended!', player)
    },

    // 监听加载完成
    onPlayerLoadeddata(player) {// console.log('player Loadeddata!', player)
    },

    // 监听视频缓存等待
    onPlayerWaiting(player) {// console.log('player Waiting!', player)
    },

    // 监听视频暂停后播放
    onPlayerPlaying(player) {// console.log('player Playing!', player)
    },

    // 监听视频播放时长更新
    onPlayerTimeupdate(player) {// console.log('player Timeupdate!', player.currentTime())
    },

    onPlayerCanplay(player) {
      console.log('player Canplay!', player);
    },

    onPlayerCanplaythrough(player) {// console.log('player Canplaythrough!', player)
    },

    // 监听状态改变
    playerStateChanged(playerCurrentState) {// console.log('player current update state', playerCurrentState)
    },

    // 监听播放器准备就绪
    playerReadied(player) {// console.log('example 01: the player is readied', player)
    }

  }
});

/***/ }),

/***/ 194:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueVideo_vue_vue_type_style_index_0_id_5eeaa29e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(183);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueVideo_vue_vue_type_style_index_0_id_5eeaa29e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueVideo_vue_vue_type_style_index_0_id_5eeaa29e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueVideo_vue_vue_type_style_index_0_id_5eeaa29e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VueVideo_vue_vue_type_style_index_0_id_5eeaa29e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 195:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 197:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/VueVideo.vue?vue&type=template&id=5eeaa29e&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('section',{staticClass:"vueVideo"},[_c('div',{directives:[{name:"video-player",rawName:"v-video-player:myVideoPlayer",value:(_vm.playerOptions),expression:"playerOptions",arg:"myVideoPlayer"}],staticClass:"video-player vjs-custom-skin",attrs:{"playsinline":_vm.playsinline},on:{"play":function($event){return _vm.onPlayerPlay($event)},"pause":function($event){return _vm.onPlayerPause($event)},"ended":function($event){return _vm.onPlayerEnded($event)},"loadeddata":function($event){return _vm.onPlayerLoadeddata($event)},"waiting":function($event){return _vm.onPlayerWaiting($event)},"playing":function($event){return _vm.onPlayerPlaying($event)},"timeupdate":function($event){return _vm.onPlayerTimeupdate($event)},"canplay":function($event){return _vm.onPlayerCanplay($event)},"canplaythrough":function($event){return _vm.onPlayerCanplaythrough($event)},"ready":_vm.playerReadied,"statechanged":function($event){return _vm.playerStateChanged($event)}}},[])])}
var staticRenderFns = []


// CONCATENATED MODULE: ./components/VueVideo.vue?vue&type=template&id=5eeaa29e&scoped=true&

// EXTERNAL MODULE: ./components/js/VueVideo.js
var VueVideo = __webpack_require__(191);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/VueVideo.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var VueVideovue_type_script_lang_js_ = (VueVideo["default"]);
// CONCATENATED MODULE: ./components/VueVideo.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_VueVideovue_type_script_lang_js_ = (VueVideovue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./components/VueVideo.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(194)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_VueVideovue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "5eeaa29e",
  "feef57dc"
  
)

/* harmony default export */ var components_VueVideo = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=vue-video.js.map