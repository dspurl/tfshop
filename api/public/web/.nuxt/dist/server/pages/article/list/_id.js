exports.ids = [22,4,5,16,17,20,21];
exports.modules = {

/***/ 171:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(174);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("cf86f00a", content, true, context)
};

/***/ }),

/***/ 172:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,

      default() {
        return [10, 20, 30, 50];
      }

    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },

      set(val) {
        this.$emit('update:page', val);
      }

    },
    pageSize: {
      get() {
        return this.limit;
      },

      set(val) {
        this.$emit('update:limit', val);
      }

    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', {
        page: this.currentPage,
        limit: val
      });
    },

    handleCurrentChange(val) {
      this.$emit('pagination', {
        page: val,
        limit: this.pageSize
      });
    }

  }
});

/***/ }),

/***/ 173:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_c339c37e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(171);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_c339c37e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_c339c37e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_c339c37e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_c339c37e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 174:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".pagination-container[data-v-c339c37e]{background:#fff;padding:32px 16px}.pagination-container.hidden[data-v-c339c37e]{display:none}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 175:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/Pagination/index.vue?vue&type=template&id=c339c37e&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"pagination-container",class:{'hidden':_vm.hidden}},[_c('el-pagination',_vm._b({attrs:{"background":_vm.background,"current-page":_vm.currentPage,"page-size":_vm.pageSize,"layout":_vm.layout,"page-sizes":_vm.pageSizes,"total":_vm.total},on:{"update:currentPage":function($event){_vm.currentPage=$event},"update:current-page":function($event){_vm.currentPage=$event},"update:pageSize":function($event){_vm.pageSize=$event},"update:page-size":function($event){_vm.pageSize=$event},"size-change":_vm.handleSizeChange,"current-change":_vm.handleCurrentChange}},'el-pagination',_vm.$attrs,false))],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./components/Pagination/index.vue?vue&type=template&id=c339c37e&scoped=true&

// EXTERNAL MODULE: ./components/Pagination/js/index.js
var js = __webpack_require__(172);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/Pagination/index.vue?vue&type=script&lang=js&
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

/* harmony default export */ var Paginationvue_type_script_lang_js_ = (js["default"]);
// CONCATENATED MODULE: ./components/Pagination/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_Paginationvue_type_script_lang_js_ = (Paginationvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./components/Pagination/index.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(173)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_Paginationvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "c339c37e",
  "2233290d"
  
)

/* harmony default export */ var Pagination = __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 230:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(252);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("1f9b4926", content, true, context)
};

/***/ }),

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

/***/ 240:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'DefaultColumn',
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

/***/ 251:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_defaultColumn_vue_vue_type_style_index_0_id_6c0c35d6_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(230);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_defaultColumn_vue_vue_type_style_index_0_id_6c0c35d6_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_defaultColumn_vue_vue_type_style_index_0_id_6c0c35d6_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_defaultColumn_vue_vue_type_style_index_0_id_6c0c35d6_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_defaultColumn_vue_vue_type_style_index_0_id_6c0c35d6_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 252:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".breadcrumb[data-v-6c0c35d6]{margin-top:20px;margin-bottom:20px}.box[data-v-6c0c35d6]{display:flex;align-items:flex-start;margin-bottom:30px;min-height:600px}.box .left[data-v-6c0c35d6]{width:200px;background-color:#fff;margin-right:20px;padding:30px 10px 30px 30px}.box .left .dt[data-v-6c0c35d6]{font-size:16px;font-weight:400;line-height:52px;color:#212121}.box .left .dd[data-v-6c0c35d6]{font-size:14px;color:#757575;display:block;line-height:35px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.box .left .dd.on[data-v-6c0c35d6],.box .left .dd[data-v-6c0c35d6]:hover{color:#fa524c}.box .right[data-v-6c0c35d6]{flex:1;background-color:#fff;padding:20px}.box .right .list-box .li[data-v-6c0c35d6]{display:flex;cursor:pointer;font-size:16px;color:#212121;border-bottom:1px solid #efeded;line-height:55px}.box .right .list-box .li .time[data-v-6c0c35d6]{width:100px}.box .right .list-box .li .name[data-v-6c0c35d6]{flex:1}.box .right .list-box .li[data-v-6c0c35d6]:hover{color:#fa524c}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


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

/***/ 257:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return detail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return pv; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);

function getList(id, query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'article/column/' + id,
    method: 'GET',
    params: query
  });
}
function detail(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'article/' + id,
    method: 'GET'
  });
}
function pv(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'article/pv/' + id,
    method: 'POST'
  });
}

/***/ }),

/***/ 320:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/components/defaultColumn.vue?vue&type=template&id=6c0c35d6&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-breadcrumb',{staticClass:"container breadcrumb",attrs:{"separator":"/"}},[_c('el-breadcrumb-item',[_c('NuxtLink',{attrs:{"to":{ path: '/' }}},[_vm._v("\n        首页\n      ")])],1),_vm._v(" "),_vm._l((_vm.data.breadcrumb),function(item,index){return (_vm.data.breadcrumb.length>0)?_c('el-breadcrumb-item',{key:index},[_c('NuxtLink',{attrs:{"to":{ path: ("/article/list/" + (item.id))}}},[_vm._v("\n        "+_vm._s(item.name)+"\n      ")])],1):_vm._e()})],2),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"box container\" data-v-6c0c35d6>","</div>",[(_vm.data.breadcrumb.length>0)?_vm._ssrNode("<div class=\"left\" data-v-6c0c35d6>","</div>",[_vm._ssrNode("<div class=\"dt\" data-v-6c0c35d6>"+_vm._ssrEscape(_vm._s(_vm.data.breadcrumb[_vm.data.breadcrumb.length-1].name))+"</div> "),_vm._l((_vm.data.menu),function(item,index){return _c('NuxtLink',{key:index,staticClass:"dd",class:{on: _vm.data.column.id === item.id},attrs:{"to":{ path: ("/article/list/" + (item.id))}}},[_vm._v(_vm._s(item.name))])})],2):_vm._e(),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"right\" data-v-6c0c35d6>","</div>",[_c('div',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}],staticClass:"list-box"},[_vm._l((_vm.data.paginate.data),function(item,index){return _c('NuxtLink',{key:index,staticClass:"li",attrs:{"to":{ path: ("/article/detail/" + (item.id))}}},[_c('div',{staticClass:"name"},[_vm._v(_vm._s(item.name))]),_vm._v(" "),_c('div',{staticClass:"time"},[_vm._v(_vm._s(item.created_at.split(" ")[0]))])])}),_vm._ssrNode(" "),(_vm.data.paginate.total>0)?_c('pagination',{staticClass:"pagination",attrs:{"total":_vm.data.paginate.total,"page":_vm.listQuery.page,"limit":_vm.listQuery.limit},on:{"update:page":function($event){return _vm.$set(_vm.listQuery, "page", $event)},"update:limit":function($event){return _vm.$set(_vm.listQuery, "limit", $event)},"pagination":_vm.getList}}):_vm._e()],2)])],2)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/article/components/defaultColumn.vue?vue&type=template&id=6c0c35d6&scoped=true&

// EXTERNAL MODULE: ./pages/article/js/defaultColumn.js
var defaultColumn = __webpack_require__(240);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/components/defaultColumn.vue?vue&type=script&lang=js&
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

/* harmony default export */ var defaultColumnvue_type_script_lang_js_ = (defaultColumn["default"]);
// CONCATENATED MODULE: ./pages/article/components/defaultColumn.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_defaultColumnvue_type_script_lang_js_ = (defaultColumnvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/article/components/defaultColumn.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(251)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_defaultColumnvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "6c0c35d6",
  "cfcb6330"
  
)

/* harmony default export */ var components_defaultColumn = __webpack_exports__["default"] = (component.exports);

/* nuxt-component-imports */
installComponents(component, {Pagination: __webpack_require__(175).default})


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

/***/ }),

/***/ 405:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/list/_id.vue?vue&type=template&id=3ec15f42&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_c(_vm.template,{tag:"component",attrs:{"listQuery":_vm.listQuery,"loading":_vm.loading,"data":_vm.data},on:{"getList":_vm.getList}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/article/list/_id.vue?vue&type=template&id=3ec15f42&scoped=true&

// EXTERNAL MODULE: ./pages/article/components/defaultColumn.vue + 4 modules
var defaultColumn = __webpack_require__(320);

// EXTERNAL MODULE: ./pages/article/components/defaultColumnDetail.vue + 4 modules
var defaultColumnDetail = __webpack_require__(321);

// EXTERNAL MODULE: ./api/article.js
var article = __webpack_require__(257);

// EXTERNAL MODULE: ./plugins/request.js
var request = __webpack_require__(2);

// CONCATENATED MODULE: ./api/column.js

function getList(query) {
  return Object(request["a" /* default */])({
    url: 'column',
    method: 'GET',
    params: query
  });
}
function detail(id) {
  return Object(request["a" /* default */])({
    url: 'column/' + id,
    method: 'GET'
  });
}
function pv(id) {
  return Object(request["a" /* default */])({
    url: 'column/pv/' + id,
    method: 'POST'
  });
}
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/list/_id.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//




/* harmony default export */ var _idvue_type_script_lang_js_ = ({
  components: {
    defaultColumn: defaultColumn["default"],
    defaultColumnDetail: defaultColumnDetail["default"]
  },

  data() {
    return {
      template: '',
      data: {},
      loading: false,
      listQuery: {}
    };
  },

  async asyncData(ctx) {
    try {
      const {
        query,
        params
      } = ctx;
      let listQuery = {
        limit: 10,
        page: query.page ? query.page : 1
      };
      let [columnData] = await Promise.all([Object(article["b" /* getList */])(params.id, listQuery)]);
      return {
        data: columnData,
        listQuery: listQuery
      };
    } catch (err) {
      ctx.$errorHandler(err);
    }
  },

  watch: {
    '$route'(to, from) {
      if (to.fullPath !== from.fullPath) {
        this.$nextTick(() => {
          this.listQuery.page = 1;
          this.getList();
        });
      }
    }

  },

  head() {
    return {
      title: this.data.column.name + '-' + "DSSHOP商城-跨终端商城解决方案",
      meta: [{
        hid: 'index',
        name: this.data.column.name + '-' + "DSSHOP商城-跨终端商城解决方案",
        content: this.data.column.keywords ? this.data.column.keywords : "商城网店系统,商城,网店,免费商城,免费网店"
      }, {
        hid: 'description',
        name: 'description',
        content: this.data.column.short_description ? this.data.column.short_description : "免费开源可商用，快速搭建属于自己的独立商城网店系统，一次搭建适配多终端"
      }]
    };
  },

  mounted() {
    this.template = this.data.column.template;

    if (this.data.column.list !== 1) {
      this.setPV();
    }
  },

  methods: {
    getList() {
      this.loading = true;
      Object(article["b" /* getList */])($nuxt.$route.params.id, this.listQuery).then(response => {
        this.data = response;
        this.loading = false;
        this.template = this.data.column.template;

        if (this.data.column.list !== 1) {
          this.setPV();
        }
      });
    },

    setPV() {
      pv($nuxt.$route.params.id);
    }

  }
});
// CONCATENATED MODULE: ./pages/article/list/_id.vue?vue&type=script&lang=js&
 /* harmony default export */ var list_idvue_type_script_lang_js_ = (_idvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/article/list/_id.vue



function injectStyles (context) {
  
  
}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  list_idvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "3ec15f42",
  "46d889b3"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map