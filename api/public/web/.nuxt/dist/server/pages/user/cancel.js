exports.ids = [56,82];
exports.modules = {

/***/ 179:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return detail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return edit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return cancel; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);


function detail() {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'user',
    method: 'GET'
  });
}
function edit(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'user',
    method: 'POST',
    data
  });
}
function cancel(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'cancel',
    method: 'POST',
    data
  });
}

/***/ }),

/***/ 274:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(179);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',

  head() {
    return {
      title: '注销账户-个人中心'
    };
  },

  data() {
    return {
      loading: false,
      checked: false,
      disabled: true
    };
  },

  mounted() {},

  methods: {
    //注销提交
    cancel() {
      Object(_api_user__WEBPACK_IMPORTED_MODULE_0__[/* cancel */ "a"])(this.ruleForm).then(response => {
        this.loading = false;
        $nuxt.$store.commit('logout');
        this.$message({
          message: '注销成功',
          type: 'success'
        });
        this.$router.replace('/');
      }).catch(() => {
        this.loading = false;
      });
    },

    agree() {
      if (this.checked) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    }

  }
});

/***/ }),

/***/ 275:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(351);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("5f0663a0", content, true, context)
};

/***/ }),

/***/ 350:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_cancel_vue_vue_type_style_index_0_id_e1460bb4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(275);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_cancel_vue_vue_type_style_index_0_id_e1460bb4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_cancel_vue_vue_type_style_index_0_id_e1460bb4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_cancel_vue_vue_type_style_index_0_id_e1460bb4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_cancel_vue_vue_type_style_index_0_id_e1460bb4_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 351:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".card[data-v-e1460bb4]{margin:30px auto 0;width:600px}.card .title[data-v-e1460bb4]{text-align:center;font-size:20px;margin-bottom:30px;margin-top:20px}.card .condition .name[data-v-e1460bb4]{font-size:16px;margin-bottom:5px}.card .condition .explain[data-v-e1460bb4]{font-size:12px}.card .notice[data-v-e1460bb4]{margin:20px 0;text-align:center}.card .notice .text-red[data-v-e1460bb4]{color:#fa524c}.card .button[data-v-e1460bb4]{text-align:center}.user-title[data-v-e1460bb4]{color:#757575;font-weight:400;font-size:18px;margin-bottom:20px}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 409:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/cancel.vue?vue&type=template&id=e1460bb4&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_vm._ssrNode("<div class=\"user-title\" data-v-e1460bb4>注销申请</div> "),_c('div',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}]},[_c('el-card',{staticClass:"card"},[_c('div',{staticClass:"title"},[_vm._v("请确认您的账号是否满足以下注销条件")]),_vm._v(" "),_c('div',{staticClass:"condition"},[_c('div',{staticClass:"name"},[_vm._v("账号处于安全状态")]),_vm._v(" "),_c('div',{staticClass:"explain"},[_vm._v("账号处于正常状态，没有被封号等账户限制。")])]),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('div',{staticClass:"condition"},[_c('div',{staticClass:"name"},[_vm._v("账号无进行中的任何纠纷")]),_vm._v(" "),_c('div',{staticClass:"explain"},[_vm._v("本账号无任何账号纠纷，包括投诉、举报或被投诉、被举报等。")])]),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('div',{staticClass:"condition"},[_c('div',{staticClass:"name"},[_vm._v("账号无未完成的业务")]),_vm._v(" "),_c('div',{staticClass:"explain"},[_vm._v("没有正在进行中，或者尚未确认完成的交易。")])]),_vm._v(" "),_c('div',{staticClass:"notice"},[_c('el-checkbox',{on:{"change":_vm.agree},model:{value:(_vm.checked),callback:function ($$v) {_vm.checked=$$v},expression:"checked"}},[_vm._v("我已阅读并知晓了"),_c('span',{staticClass:"text-red"},[_vm._v("《账号注册须知》")])])],1),_vm._v(" "),_c('div',{staticClass:"button"},[_c('el-button',{attrs:{"disabled":_vm.disabled,"type":"danger"},on:{"click":function($event){return _vm.cancel()}}},[_vm._v("确认申请")])],1)],1)],1)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/user/cancel.vue?vue&type=template&id=e1460bb4&scoped=true&

// EXTERNAL MODULE: ./pages/user/js/cancel.js
var cancel = __webpack_require__(274);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/cancel.vue?vue&type=script&lang=js&
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
//
//
//
//
//
//
//
//
//

/* harmony default export */ var cancelvue_type_script_lang_js_ = (cancel["default"]);
// CONCATENATED MODULE: ./pages/user/cancel.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_cancelvue_type_script_lang_js_ = (cancelvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/user/cancel.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(350)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  user_cancelvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "e1460bb4",
  "24bc0aaa"
  
)

/* harmony default export */ var user_cancel = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=cancel.js.map