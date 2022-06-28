exports.ids = [62];
exports.modules = {

/***/ 233:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(257);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("35ff01c1", content, true, context)
};

/***/ }),

/***/ 256:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_coolc_coupon_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(233);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_coolc_coupon_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_coolc_coupon_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_coolc_coupon_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_coolc_coupon_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 257:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".coupon-item{width:100%;height:auto;display:table;border-radius:5px;padding:0 10px;margin-top:11px;border:1px solid #eee;position:relative}.coupon-item .coupon-money{width:232px;height:auto;display:table;float:left;padding:13px 0;border-style:none dotted none none;border-color:#eee}.coupon-item .coupon-money .nick,.coupon-item .coupon-money .tit{width:100%;height:25px;line-height:25px;font-size:15px;color:#999}.coupon-item .coupon-money .demand{width:100%;height:20px;line-height:15px;font-size:15px;color:#999}.coupon-item .coupon-money .layof{width:100%;height:24px;line-height:15px;font-size:22px;color:#ff9000;font-weight:700}.coupon-item .coupon-money .end_time{width:100%;height:15px;line-height:15px;font-size:15px;color:#999}.coupon-item .coupon-money .time{width:100%;height:20px;line-height:15px;font-size:15px;color:#999}.coupon-item .get-btn{width:73px;height:26px;line-height:25px;position:absolute;top:50%;right:5px;margin-top:-26upx;text-align:center;border-radius:30px;color:#ff9000;border:1px solid #ff9000;font-size:15px;float:right}.coupon-item:after{top:-1px;border-radius:0 0 20px 20px;border:1px solid #eee;border-top:0}.coupon-item:after,.coupon-item:before{width:20px;height:10px;position:absolute;left:230px;content:\"\";display:block;background:#fff}.coupon-item:before{bottom:-1px;border-radius:20px 20px 0 0;border:1px solid #eee;border-bottom:0}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 323:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/coupon/components/coolc-coupon.vue?vue&type=template&id=6f215202&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"coupon-item"},[_vm._ssrNode("<div class=\"coupon-money\">"+((_vm.item.seller_name)?("<div class=\"nick\">"+_vm._ssrEscape(_vm._s(_vm.item.seller_name)+"使用")+"</div>"):"<!---->")+" "+((_vm.item.type === 3)?("<div class=\"layof\""+(_vm._ssrStyle(null,{color:_vm.theme}, null))+">"+_vm._ssrEscape(_vm._s(_vm.item.money)+"%")+"</div>"):("<div class=\"layof\""+(_vm._ssrStyle(null,{color:_vm.theme}, null))+">"+_vm._ssrEscape("￥"+_vm._s(_vm.item.money))+"</div>"))+" "+((_vm.item.ticket)?("<div class=\"tit\">"+_vm._ssrEscape("券号："+_vm._s(_vm.item.ticket))+"</div>"):"<!---->")+" "+((_vm.item.title)?("<div class=\"demand\">"+_vm._ssrEscape(_vm._s(_vm.item.title))+"</div>"):"<!---->")+" "+((_vm.item.end_time)?("<div class=\"end_time\">"+_vm._ssrEscape(_vm._s(_vm.item.end_time)+"前使用")+"</div>"):("<div class=\"time\">"+_vm._ssrEscape("使用期限 "+_vm._s(_vm.item.time))+"</div>"))+"</div> "),(_vm.item.state === '1')?_vm._ssrNode("<div>","</div>",[(!_vm.types)?_vm._ssrNode("<div class=\"get-btn\""+(_vm._ssrStyle(null,{color:_vm.color, borderColor:_vm.color, background:_vm.solid}, null))+">","</div>",[_vm._ssrNode("立即领取")],2):_c('navigator',{staticClass:"get-btn",style:({color:_vm.color, borderColor:_vm.color, background:_vm.solid}),attrs:{"url":_vm.item.url,"open-type":"switchTab","hover-class":"other-navigator-hover"}},[_vm._v("立即使用")])],1):(_vm.item.state === '2')?_vm._ssrNode(("<div>"+((!_vm.types)?("<div class=\"get-btn\">已领取</div>"):("<div class=\"get-btn\">已使用</div>"))+"</div>")):_vm._ssrNode(("<div>"+((!_vm.types)?("<div class=\"get-btn\">已领取</div>"):("<div class=\"get-btn\">已失效</div>"))+"</div>"))],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/user/coupon/components/coolc-coupon.vue?vue&type=template&id=6f215202&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/coupon/components/coolc-coupon.vue?vue&type=script&lang=js&
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
//
/* harmony default export */ var coolc_couponvue_type_script_lang_js_ = ({
  components: {},

  data() {
    return {};
  },

  props: {
    item: {
      type: Object
    },
    types: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: '#ff9000'
    },
    solid: {
      type: String,
      default: '#ffffff'
    },
    color: {
      type: String,
      default: '#ff9000'
    }
  },
  methods: {
    getCoupon(item) {
      this.$emit('getCoupon', item);
    }

  }
});
// CONCATENATED MODULE: ./pages/user/coupon/components/coolc-coupon.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_coolc_couponvue_type_script_lang_js_ = (coolc_couponvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/user/coupon/components/coolc-coupon.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(256)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_coolc_couponvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  null,
  "8ae0c5ce"
  
)

/* harmony default export */ var coolc_coupon = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=coolc-coupon.js.map