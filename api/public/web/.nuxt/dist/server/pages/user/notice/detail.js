exports.ids = [91,92];
exports.modules = {

/***/ 207:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return detail; });
/* unused harmony export unread */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return destroy; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);


function getList(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'notification',
    method: 'GET',
    params: query
  });
}
function detail(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'notification/detail/' + id,
    method: 'GET'
  });
}
function unread(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'notification/unread',
    method: 'GET',
    params: query
  });
}
function read(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'notification/read/0',
    method: 'POST',
    data
  });
}
function destroy(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'notification/destroy/0',
    method: 'POST',
    data
  });
}

/***/ }),

/***/ 306:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_notification__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(207);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',

  head() {
    return {
      title: '消息通知-个人中心'
    };
  },

  data() {
    return {
      loading: true,
      notice: {}
    };
  },

  mounted() {
    this.getDetail();
  },

  methods: {
    async getDetail() {
      if (!$nuxt.$route.query.id) {
        this.$message({
          message: '参数有误，请联系管理员',
          type: 'error'
        });
        $nuxt.$router.go(-1);
        return false;
      }

      await Promise.all([Object(_api_notification__WEBPACK_IMPORTED_MODULE_0__[/* detail */ "b"])($nuxt.$route.query.id)]).then(([notificationData]) => {
        this.notice = notificationData;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },

    goBack() {
      $nuxt.$router.go(-1);
    },

    goNavigator(url) {
      // 为了兼容老版本
      uni.navigateTo({
        url: url.replace('pages', 'user')
      });
    }

  }
});

/***/ }),

/***/ 307:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(390);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("d13f4314", content, true, context)
};

/***/ }),

/***/ 389:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_style_index_0_id_134eb078_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(307);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_style_index_0_id_134eb078_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_style_index_0_id_134eb078_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_style_index_0_id_134eb078_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_style_index_0_id_134eb078_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 390:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".card[data-v-134eb078]{margin:30px auto 0;width:600px}.card .title[data-v-134eb078]{font-size:20px;margin-bottom:30px}.card .text-money-name[data-v-134eb078]{text-align:center;color:#999}.card .text-money-value[data-v-134eb078]{margin-top:10px;text-align:center;font-size:30px;margin-bottom:10px}.card .card-list[data-v-134eb078]{display:flex;padding-bottom:5px;font-size:14px}.card .card-list .card-list-title[data-v-134eb078]{width:80px;text-align:right;margin-right:10px;color:#999}.card .introduce[data-v-134eb078]{font-size:14px;margin-top:20px;color:#999}.card .link[data-v-134eb078]{text-align:center}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 434:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/notice/detail.vue?vue&type=template&id=134eb078&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_c('el-page-header',{attrs:{"content":"详情"},on:{"back":_vm.goBack}}),_vm._ssrNode(" "),_c('div',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}]},[(_vm.notice.data)?_c('el-card',{staticClass:"card",attrs:{"shadow":"hover"}},[_c('div',{staticClass:"title"},[_vm._v(_vm._s(_vm.notice.data.title))]),_vm._v(" "),(_vm.notice.data.type === 2)?[_c('div',{staticClass:"text-money-name"},[_vm._v("付款金额")]),_vm._v(" "),_c('div',{staticClass:"text-money-value"},[_vm._v(_vm._s(_vm._f("thousands")(_vm.notice.data.price/100)))])]:_vm._e(),_vm._v(" "),_vm._l((_vm.notice.data.list),function(item,index){return (_vm.notice.data.list.length > 0)?_c('div',{key:index,staticClass:"card-list"},[_c('div',{staticClass:"card-list-title"},[_vm._v(_vm._s(item.keyword)+"：")]),_vm._v(" "),_c('div',[_vm._v(_vm._s(item.data))])]):_vm._e()}),_vm._v(" "),(_vm.notice.data.remark)?_c('div',{staticClass:"introduce"},[_vm._v("\n        "+_vm._s(_vm.notice.data.remark)+"\n      ")]):_vm._e(),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('div',{staticClass:"link"},[(_vm.notice.data.url)?_c('el-button',{attrs:{"type":"danger"},on:{"click":function($event){return _vm.goNavigator(_vm.item.data.url)}}},[_vm._v("查看详情")]):_vm._e()],1)],2):_vm._e()],1)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/user/notice/detail.vue?vue&type=template&id=134eb078&scoped=true&

// EXTERNAL MODULE: ./pages/user/notice/js/detail.js
var detail = __webpack_require__(306);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/notice/detail.vue?vue&type=script&lang=js&
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

/* harmony default export */ var detailvue_type_script_lang_js_ = (detail["default"]);
// CONCATENATED MODULE: ./pages/user/notice/detail.vue?vue&type=script&lang=js&
 /* harmony default export */ var notice_detailvue_type_script_lang_js_ = (detailvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/user/notice/detail.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(389)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  notice_detailvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "134eb078",
  "62139855"
  
)

/* harmony default export */ var notice_detail = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=detail.js.map