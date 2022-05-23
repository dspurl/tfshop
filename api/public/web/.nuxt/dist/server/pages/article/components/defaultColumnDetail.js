exports.ids = [17,21];
exports.modules = {

/***/ 231:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(254);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("45fb4ff3", content, true, context)
};

/***/ }),

/***/ 241:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'DefaultColumnDetail',
  props: {
    data: {
      type: Object,
      default: {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    listQuery: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {};
  },

  watch: {},

  mounted() {},

  methods: {
    getList() {
      this.$emit('getList');
    }

  }
});

/***/ }),

/***/ 253:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_defaultColumnDetail_vue_vue_type_style_index_0_id_153e5119_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(231);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_defaultColumnDetail_vue_vue_type_style_index_0_id_153e5119_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_defaultColumnDetail_vue_vue_type_style_index_0_id_153e5119_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_defaultColumnDetail_vue_vue_type_style_index_0_id_153e5119_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_defaultColumnDetail_vue_vue_type_style_index_0_id_153e5119_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 254:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".breadcrumb[data-v-153e5119]{margin-top:20px;margin-bottom:20px}.box[data-v-153e5119]{display:flex;align-items:flex-start;margin-bottom:30px;min-height:600px}.box .left[data-v-153e5119]{width:200px;background-color:#fff;margin-right:20px;padding:30px 10px 30px 30px}.box .left .dt[data-v-153e5119]{font-size:16px;font-weight:400;line-height:52px;color:#212121}.box .left .dd[data-v-153e5119]{font-size:14px;color:#757575;display:block;line-height:35px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.box .left .dd.on[data-v-153e5119],.box .left .dd[data-v-153e5119]:hover{color:#fa524c}.box .right[data-v-153e5119]{flex:1;background-color:#fff;padding:40px}.box .right .title[data-v-153e5119]{font-weight:700;font-size:22px;line-height:25px;padding-bottom:30px;padding-top:10px}.box .right .content[data-v-153e5119]{font-size:16px;line-height:20px}.box .right .time[data-v-153e5119]{font-size:16px;padding-top:20px;text-align:right;color:#757575}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 321:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/components/defaultColumnDetail.vue?vue&type=template&id=153e5119&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-breadcrumb',{staticClass:"container breadcrumb",attrs:{"separator":"/"}},[_c('el-breadcrumb-item',[_c('NuxtLink',{attrs:{"to":{ path: '/' }}},[_vm._v("\n        首页\n      ")])],1),_vm._v(" "),_vm._l((_vm.data.breadcrumb),function(item,index){return (_vm.data.breadcrumb.length>0)?_c('el-breadcrumb-item',{key:index},[_c('NuxtLink',{attrs:{"to":{ path: ("/article/list/" + (item.id))}}},[_vm._v("\n        "+_vm._s(item.name)+"\n      ")])],1):_vm._e()})],2),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"box container\" data-v-153e5119>","</div>",[_vm._ssrNode("<div class=\"right\" data-v-153e5119>","</div>",[_c('div',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}],staticClass:"list-box"},[_vm._ssrNode("<div class=\"title\" data-v-153e5119>"+_vm._ssrEscape(_vm._s(_vm.data.column.name))+"</div> <div class=\"content\" data-v-153e5119>"+(_vm._s(_vm.data.column.column_property.details))+"</div> <div class=\"time\" data-v-153e5119>"+_vm._ssrEscape(_vm._s(_vm.data.column.created_at.split(" ")[0]))+"</div>")])])])],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/article/components/defaultColumnDetail.vue?vue&type=template&id=153e5119&scoped=true&

// EXTERNAL MODULE: ./pages/article/js/defaultColumnDetail.js
var defaultColumnDetail = __webpack_require__(241);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/components/defaultColumnDetail.vue?vue&type=script&lang=js&
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

/* harmony default export */ var defaultColumnDetailvue_type_script_lang_js_ = (defaultColumnDetail["default"]);
// CONCATENATED MODULE: ./pages/article/components/defaultColumnDetail.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_defaultColumnDetailvue_type_script_lang_js_ = (defaultColumnDetailvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/article/components/defaultColumnDetail.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(253)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_defaultColumnDetailvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "153e5119",
  "38a0d34e"
  
)

/* harmony default export */ var components_defaultColumnDetail = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=defaultColumnDetail.js.map