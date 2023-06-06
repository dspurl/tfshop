exports.ids = [42,4,5,41];
exports.modules = {

/***/ 181:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(190);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("cf86f00a", content, true, context)
};

/***/ }),

/***/ 184:
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

/***/ 189:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_c339c37e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(181);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_c339c37e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_c339c37e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_c339c37e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_c339c37e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 190:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".pagination-container[data-v-c339c37e]{background:#fff;padding:32px 16px}.pagination-container.hidden[data-v-c339c37e]{display:none}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 193:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/Pagination/index.vue?vue&type=template&id=c339c37e&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"pagination-container",class:{'hidden':_vm.hidden}},[_c('el-pagination',_vm._b({attrs:{"background":_vm.background,"current-page":_vm.currentPage,"page-size":_vm.pageSize,"layout":_vm.layout,"page-sizes":_vm.pageSizes,"total":_vm.total},on:{"update:currentPage":function($event){_vm.currentPage=$event},"update:current-page":function($event){_vm.currentPage=$event},"update:pageSize":function($event){_vm.pageSize=$event},"update:page-size":function($event){_vm.pageSize=$event},"size-change":_vm.handleSizeChange,"current-change":_vm.handleCurrentChange}},'el-pagination',_vm.$attrs,false))],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./components/Pagination/index.vue?vue&type=template&id=c339c37e&scoped=true&

// EXTERNAL MODULE: ./components/Pagination/js/index.js
var js = __webpack_require__(184);

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
var componentNormalizer = __webpack_require__(3);

// CONCATENATED MODULE: ./components/Pagination/index.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(189)
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

/***/ 238:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(295);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("49c0db80", content, true, context)
};

/***/ }),

/***/ 258:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./plugins/request.js
var request = __webpack_require__(2);

// CONCATENATED MODULE: ./api/moneyLog.js
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */

function getList(query) {
  return Object(request["a" /* default */])({
    url: 'moneyLog',
    method: 'GET',
    params: query
  });
}
function detail(id) {
  return Object(request["a" /* default */])({
    url: 'moneyLog/' + id,
    method: 'GET'
  });
}
// CONCATENATED MODULE: ./pages/user/finance/js/list.js

/* harmony default export */ var list = __webpack_exports__["default"] = ({
  layout: 'user',
  head() {
    return {
      title: `${this.$t('user.bill')}-${this.$t('header.top.personal_center')}`
    };
  },
  data() {
    return {
      tableLoading: false,
      buttonLoading: false,
      loading: false,
      moneyLogList: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        sort: '-created_at',
        month: '',
        type: 0
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      this.loading = true;
      await Promise.all([getList(this.listQuery)]).then(([goodIndent]) => {
        this.moneyLogList = goodIndent.paginate.data;
        this.total = goodIndent.paginate.total;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },
    getReloadList() {
      this.listQuery.page = 1;
      this.getList();
    }
  }
});

/***/ }),

/***/ 294:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_009b72bb_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(238);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_009b72bb_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_009b72bb_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_009b72bb_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_009b72bb_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 295:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".indent-list .li[data-v-009b72bb]{border:1px solid #e5e5e5;margin-bottom:20px}.indent-list .li .details[data-v-009b72bb]{display:flex;font-size:12px}.indent-list .li .details .good[data-v-009b72bb]{width:600px}.indent-list .li .details .good .good-li[data-v-009b72bb]{display:flex;padding:10px;font-size:12px;border-right:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5}.indent-list .li .details .good .good-li a[data-v-009b72bb]{font-size:12px;margin-bottom:5px}.indent-list .li .details .good .good-li .image[data-v-009b72bb]{border:1px solid #e5e5e5;margin-right:10px}.indent-list .li .details .good .good-li .specification[data-v-009b72bb]{color:#999}.indent-list .li .details .good .good-li[data-v-009b72bb]:last-child{border-bottom:none}.indent-list .li .details .total[data-v-009b72bb]{display:flex;width:150px;text-align:center;border-right:1px solid #e5e5e5;align-items:center;justify-content:center}.indent-list .li .details .total .freight[data-v-009b72bb]{color:#999}.indent-list .li .details .state[data-v-009b72bb]{display:flex;width:80px;text-align:center;border-right:1px solid #e5e5e5;align-items:center;justify-content:center}.indent-list .li .details .state div[data-v-009b72bb]{margin-bottom:5px}.indent-list .li .details .state a[data-v-009b72bb]:hover{color:#fa524c}.indent-list .li .details .operation[data-v-009b72bb]{width:120px;display:flex;text-align:center;align-items:center;justify-content:center}.indent-list .li .details .operation .button[data-v-009b72bb]{margin-bottom:5px}.indent-list .li .top[data-v-009b72bb]{display:flex;padding:10px;color:#666;font-size:14px;background:#f5f5f5}.indent-list .li .top .time[data-v-009b72bb]{margin-right:20px}.indent-list .li .top .odd[data-v-009b72bb]{flex:1}.indent-list .li .top .odd span[data-v-009b72bb]{color:#333}.indent-list .li .top .delete[data-v-009b72bb]{cursor:pointer}.indent-list .li .top .delete[data-v-009b72bb]:hover{color:#fa524c}.indent-list .navigation[data-v-009b72bb]{margin-bottom:20px;display:flex;background:#f5f5f5;line-height:45px;padding-left:20px;padding-right:20px;font-size:14px;color:#666}.indent-list .navigation .good[data-v-009b72bb]{width:580px}.indent-list .navigation .total[data-v-009b72bb]{width:150px;text-align:center}.indent-list .navigation .state[data-v-009b72bb]{width:80px;text-align:center}.indent-list .navigation .operation[data-v-009b72bb]{width:120px;text-align:center}.user-title[data-v-009b72bb]{color:#757575;font-weight:400;font-size:18px;margin-bottom:20px}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 331:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/finance/list.vue?vue&type=template&id=009b72bb&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_vm._ssrNode("<div class=\"user-title\" data-v-009b72bb>"+_vm._ssrEscape(_vm._s(_vm.$t('user.bill')))+"</div> "),_vm._ssrNode("<div class=\"padding-top-20\" data-v-009b72bb>","</div>",[_c('el-tabs',{on:{"tab-click":_vm.getReloadList},model:{value:(_vm.listQuery.type),callback:function ($$v) {_vm.$set(_vm.listQuery, "type", $$v)},expression:"listQuery.type"}},[_c('el-tab-pane',{attrs:{"label":_vm.$t('finance.all'),"name":"0"}}),_vm._v(" "),_c('el-tab-pane',{attrs:{"label":_vm.$t('finance.income'),"name":"1"}}),_vm._v(" "),_c('el-tab-pane',{attrs:{"label":_vm.$t('finance.disbursement'),"name":"2"}})],1),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"indent-list\" data-v-009b72bb>","</div>",[_c('el-table',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}],ref:"table",staticClass:"table",attrs:{"data":_vm.moneyLogList,"border":""}},[_c('el-table-column',{attrs:{"label":_vm.$t('finance.remark')},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n            "+_vm._s(scope.row.remark)+"\n          ")]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"type_show","label":_vm.$t('finance.type'),"width":"120"}}),_vm._v(" "),_c('el-table-column',{attrs:{"label":_vm.$t('finance.money'),"width":"120"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n            "+_vm._s(_vm._f("thousands")(scope.row.money_show))+"\n          ")]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"created_at","label":_vm.$t('finance.date'),"width":"180"}})],1)],1),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"operation\" data-v-009b72bb>","</div>",[(_vm.total>0)?_c('pagination',{staticClass:"pagination",attrs:{"total":_vm.total,"page":_vm.listQuery.page,"limit":_vm.listQuery.limit},on:{"update:page":function($event){return _vm.$set(_vm.listQuery, "page", $event)},"update:limit":function($event){return _vm.$set(_vm.listQuery, "limit", $event)},"pagination":_vm.getList}}):_vm._e()],1)],2)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/user/finance/list.vue?vue&type=template&id=009b72bb&scoped=true&

// EXTERNAL MODULE: ./pages/user/finance/js/list.js + 1 modules
var list = __webpack_require__(258);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/finance/list.vue?vue&type=script&lang=js&
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


/* harmony default export */ var listvue_type_script_lang_js_ = (list["default"]);
// CONCATENATED MODULE: ./pages/user/finance/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var finance_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(3);

// CONCATENATED MODULE: ./pages/user/finance/list.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(294)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  finance_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "009b72bb",
  "6a2f5ae0"
  
)

/* harmony default export */ var finance_list = __webpack_exports__["default"] = (component.exports);

/* nuxt-component-imports */
installComponents(component, {Pagination: __webpack_require__(193).default})


/***/ })

};;
//# sourceMappingURL=list.js.map