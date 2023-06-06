exports.ids = [35,36];
exports.modules = {

/***/ 179:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return detail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return goodCategory; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
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
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'good',
    method: 'GET',
    params: query
  });
}
function detail(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'good/' + id,
    method: 'GET'
  });
}
function goodCategory(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'goodCategory',
    method: 'GET',
    params: query
  });
}

/***/ }),

/***/ 248:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_good__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(179);

/* harmony default export */ __webpack_exports__["default"] = ({
  data() {
    return {
      goodList: [],
      listQuery: {},
      loading: false,
      total: 0,
      title: ''
    };
  },
  async asyncData(ctx) {
    try {
      const {
        query,
        params
      } = ctx;
      const listQuery = {
        limit: 20,
        page: 1,
        sort: '',
        category_id: params.id,
        title: params.id ? '' : query.title
      };
      let [goodData] = await Promise.all([Object(_api_good__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "b"])(listQuery)]);
      return {
        goodList: goodData.data,
        total: goodData.total,
        listQuery: listQuery,
        title: query.title ? query.title : this.$t('product.all')
      };
    } catch (err) {
      ctx.$errorHandler(err);
    }
  },
  head() {
    return {
      title: this.title + (this.listQuery.pid ? `-${this.$t('product.classify')}-` : `-${this.$t('product.search_result')}-`) + "DSSHOP商城-轻量级易扩展低代码开源商城系统"
    };
  },
  methods: {
    getList() {
      this.loading = true;
      Promise.all([Object(_api_good__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "b"])(this.listQuery)]).then(([goodData]) => {
        this.goodList = goodData.data;
        this.total = goodData.total;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },
    //筛选点击
    tabClick(index) {
      if (index) {
        if (index === 'sales') {
          this.listQuery.sort = '-sales';
        } else {
          if (this.listQuery.sort !== '+order_price') {
            this.listQuery.sort = '+order_price';
          } else {
            this.listQuery.sort = '-order_price';
          }
        }
      } else {
        this.listQuery.sort = '';
      }
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    }
  }
});

/***/ }),

/***/ 251:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(310);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("a0e665c2", content, true, context)
};

/***/ }),

/***/ 308:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/no-goods.b1692b5.png";

/***/ }),

/***/ 309:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_637958a6_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(251);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_637958a6_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_637958a6_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_637958a6_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_id_vue_vue_type_style_index_0_id_637958a6_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 310:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".no-goods[data-v-637958a6]{text-align:center;margin:20px 0 80px}.operation[data-v-637958a6],.product-list[data-v-637958a6]{margin-bottom:20px}.product-list[data-v-637958a6]{width:1210px;position:relative;left:5px}.list[data-v-637958a6]{display:flex;flex-wrap:wrap;align-content:flex-start}.list .li[data-v-637958a6]{cursor:pointer;width:20%}.list .li .card[data-v-637958a6]{margin:0 10px 10px 0}.list .li .card .image[data-v-637958a6]{width:100%;height:190px}.list .li .card .name[data-v-637958a6]{font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.list .li .card .price[data-v-637958a6]{display:flex;justify-content:center;margin-bottom:10px}.list .li .card .price .symbol[data-v-637958a6]{font-size:12px;line-height:40px;color:#fa524c}.list .li .card .price .value[data-v-637958a6]{color:#fa524c;line-height:35px}.list .li .card[data-v-637958a6]:hover{transform:translateY(-5px)}.screen-box[data-v-637958a6]{margin:30px 0 10px}.screen-box .on[data-v-637958a6]{color:#fa524c}.screen-box .f-sort[data-v-637958a6]{position:relative}.screen-box .f-sort .fs-tit[data-v-637958a6]{display:inline-block;vertical-align:top}.screen-box .f-sort .fs-up[data-v-637958a6]{width:7px;margin-left:5px;vertical-align:top}.screen-box .f-sort .up[data-v-637958a6]{position:relative;top:-3px;left:-7px}.screen-box .f-sort .below[data-v-637958a6]{position:relative;top:3px;left:-26px}.screen-box .screen[data-v-637958a6]{display:flex;margin-bottom:20px}.screen-box .screen .on[data-v-637958a6]{color:#fa524c}.screen-box .screen .divider[data-v-637958a6]{position:relative;top:3px;margin:0 20px}.breadcrumb[data-v-637958a6]{margin-top:20px;margin-bottom:10px}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 337:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/product/list/_id.vue?vue&type=template&id=637958a6&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_c('el-breadcrumb',{staticClass:"breadcrumb container",attrs:{"separator":"/"}},[_c('el-breadcrumb-item',[_c('NuxtLink',{attrs:{"to":{ path: '/' }}},[_vm._v("\n        "+_vm._s(_vm.$t('header.top.nav_list.home'))+"\n      ")])],1),_vm._v(" "),(_vm.listQuery.pid)?_c('el-breadcrumb-item',[_vm._v(_vm._s(_vm.$t('product.classify')))]):_c('el-breadcrumb-item',[_vm._v(_vm._s(_vm.$t('product.search_result')))]),_vm._v(" "),_c('el-breadcrumb-item',[_vm._v(_vm._s(_vm.title))])],1),_vm._ssrNode(" "),(_vm.total)?_vm._ssrNode("<div data-v-637958a6>","</div>",[_vm._ssrNode("<div class=\"screen-box\" data-v-637958a6>","</div>",[_vm._ssrNode("<div class=\"screen container\" data-v-637958a6>","</div>",[_c('el-link',{class:{on: !_vm.listQuery.sort},attrs:{"underline":false},on:{"click":function($event){return _vm.tabClick()}}},[_vm._v(_vm._s(_vm.$t('product.sort.synthesize')))]),_vm._ssrNode(" "),_c('el-divider',{staticClass:"divider",attrs:{"direction":"vertical"}}),_vm._ssrNode(" "),_c('el-link',{class:{on: _vm.listQuery.sort === '-sales'},attrs:{"underline":false},on:{"click":function($event){return _vm.tabClick('sales')}}},[_vm._v(_vm._s(_vm.$t('product.sort.sales')))]),_vm._ssrNode(" "),_c('el-divider',{staticClass:"divider",attrs:{"direction":"vertical"}}),_vm._ssrNode(" "),_c('el-link',{staticClass:"f-sort",attrs:{"underline":false},on:{"click":function($event){return _vm.tabClick('order_price')}}},[_c('span',{staticClass:"fs-tit"},[_vm._v(_vm._s(_vm.$t('product.sort.price')))]),_vm._v(" "),_c('em',{staticClass:"fs-up"},[_c('i',{staticClass:"up el-icon-caret-top",class:{on: _vm.listQuery.sort === '+order_price'}}),_vm._v(" "),_c('i',{staticClass:"below el-icon-caret-bottom",class:{on: _vm.listQuery.sort === '-order_price'}})])])],2)]),_vm._ssrNode(" "),_c('div',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}],staticClass:"product-list container"},[_vm._ssrNode("<div class=\"list\" data-v-637958a6>","</div>",_vm._l((_vm.goodList),function(item,index){return _c('NuxtLink',{key:index,staticClass:"li",attrs:{"to":{ path: ("/product/detail/" + (item.id))}}},[_c('el-card',{staticClass:"card",attrs:{"shadow":"hover"}},[_c('el-image',{staticClass:"image",attrs:{"src":_vm._f("smallImage")(item.resources.img,200),"fit":"cover","lazy":""}}),_vm._v(" "),_c('div',{staticClass:"name"},[_vm._v(_vm._s(item.name))]),_vm._v(" "),_c('div',{staticClass:"price"},[_c('div',{staticClass:"symbol"},[_vm._v(_vm._s(_vm.$t('common.unit')))]),_vm._v(" "),_c('div',{staticClass:"value"},[_vm._v(_vm._s(_vm._f("thousands")(item.order_price)))])])],1)],1)}),1)]),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"operation container\" data-v-637958a6>","</div>",[_c('el-pagination',{attrs:{"current-page":_vm.listQuery.page,"page-sizes":[10, 20, 30, 40],"page-size":_vm.listQuery.limit,"layout":"total, sizes, prev, pager, next, jumper","total":_vm.total},on:{"size-change":_vm.handleSizeChange,"current-change":_vm.handleCurrentChange}})],1)],2):_vm._ssrNode(("<div class=\"no-goods\" data-v-637958a6><img"+(_vm._ssrAttr("src",__webpack_require__(308)))+" data-v-637958a6> "+((_vm.listQuery.pid)?("<div data-v-637958a6>"+_vm._ssrEscape(_vm._s(_vm.$t('product.classified_no_commodity', {title: _vm.title})))+"</div>"):("<div data-v-637958a6>"+_vm._ssrEscape(_vm._s(_vm.$t('product._no_commodity', {title: _vm.title})))+"</div>"))+"</div>"))],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/product/list/_id.vue?vue&type=template&id=637958a6&scoped=true&

// EXTERNAL MODULE: ./pages/product/list/js/_id.js
var _id = __webpack_require__(248);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/product/list/_id.vue?vue&type=script&lang=js&
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


/* harmony default export */ var _idvue_type_script_lang_js_ = (_id["default"]);
// CONCATENATED MODULE: ./pages/product/list/_id.vue?vue&type=script&lang=js&
 /* harmony default export */ var list_idvue_type_script_lang_js_ = (_idvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(3);

// CONCATENATED MODULE: ./pages/product/list/_id.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(309)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  list_idvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "637958a6",
  "5eb3065a"
  
)

/* harmony default export */ var list_id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map