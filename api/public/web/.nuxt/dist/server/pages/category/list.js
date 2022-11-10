exports.ids = [18,17];
exports.modules = {

/***/ 169:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return detail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return goodCategory; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);

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

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_good__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(169);

/* harmony default export */ __webpack_exports__["default"] = ({
  data() {
    return {
      goodCategory: []
    };
  },

  async asyncData(ctx) {
    try {
      let [goodCategoryData] = await Promise.all([Object(_api_good__WEBPACK_IMPORTED_MODULE_0__[/* goodCategory */ "c"])({
        tree: true
      })]);

      for (let item of goodCategoryData) {
        if (item.children) {
          item.level = 3;

          for (let item2 of item.children) {
            if (item2.resources) {
              item.level = 2;
            }

            break;
          }
        }
      }

      return {
        goodCategory: goodCategoryData
      };
    } catch (err) {
      ctx.$errorHandler(err);
    }
  },

  head() {
    return {
      title: '全部商品分类-' + "DSSHOP商城-跨终端商城解决方案"
    };
  },

  mounted() {},

  methods: {}
});

/***/ }),

/***/ 202:
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
  add("2f44cac4", content, true, context)
};

/***/ }),

/***/ 253:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_79eba588_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(202);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_79eba588_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_79eba588_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_79eba588_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_79eba588_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 254:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".category-box[data-v-79eba588]{background-color:#fff;padding:20px 0}.category-box .title[data-v-79eba588]{font-size:24px;border-bottom:1px solid #ccc;padding-bottom:10px;display:flex}.category-box .category-list-box[data-v-79eba588]{padding-top:20px}.category-box .category-list-box .min-title[data-v-79eba588]{font-weight:700;color:#999;margin-bottom:20px;display:flex}.category-box .category-list-box .list[data-v-79eba588]{display:flex;flex-wrap:wrap}.category-box .category-list-box .list .li[data-v-79eba588]{border:1px solid #e0e0e0;padding:20px;text-align:center;margin:0 10px 10px 0}.category-box .category-list-box .list .li .image[data-v-79eba588]{width:80px;height:80px}.category-box .category-list-box .list .li .name[data-v-79eba588]{margin-top:20px;text-align:center}.category-box .category-list-box .list .li:hover .name[data-v-79eba588]{color:#fa524c}.breadcrumb[data-v-79eba588]{margin-top:10px;margin-bottom:10px}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 307:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/category/list.vue?vue&type=template&id=79eba588&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_c('el-breadcrumb',{staticClass:"breadcrumb container",attrs:{"separator":"/"}},[_c('el-breadcrumb-item',[_c('NuxtLink',{attrs:{"to":{ path: '/' }}},[_vm._v("\n        首页\n      ")])],1),_vm._v(" "),_c('el-breadcrumb-item',[_vm._v("全部商品分类")])],1),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"category-box\" data-v-79eba588>","</div>",_vm._l((_vm.goodCategory),function(item,index){return _vm._ssrNode("<div class=\"category-list container\" data-v-79eba588>","</div>",[_c('NuxtLink',{staticClass:"title",attrs:{"to":{ path: ("/product/list/" + (item.id)), query: { title: item.name }}}},[_vm._v("\n        "+_vm._s(item.name)+"\n      ")]),_vm._ssrNode(" "),(item.level === 3)?_vm._l((item.children),function(item2,index2){return _vm._ssrNode("<div class=\"category-list-box\" data-v-79eba588>","</div>",[_c('NuxtLink',{staticClass:"min-title",attrs:{"to":{ path: ("/product/list/" + (item2.id)), query: { title: item2.name }}}},[_vm._v("\n            "+_vm._s(item2.name)+"\n          ")]),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"list\" data-v-79eba588>","</div>",_vm._l((item2.children),function(item3,index3){return _vm._ssrNode("<div class=\"li\" data-v-79eba588>","</div>",[_c('NuxtLink',{attrs:{"to":{ path: ("/product/list/" + (item3.id)), query: { title: item3.name }}}},[_c('el-image',{staticClass:"image",attrs:{"src":item3.resources.img,"fit":"scale-down"}}),_vm._v(" "),_c('div',{staticClass:"name"},[_vm._v(_vm._s(item3.name))])],1)],1)}),0)],2)}):[_vm._ssrNode("<div class=\"category-list-box\" data-v-79eba588>","</div>",[_vm._ssrNode("<div class=\"list\" data-v-79eba588>","</div>",_vm._l((item.children),function(item2,index2){return _vm._ssrNode("<div class=\"li\" data-v-79eba588>","</div>",[_c('NuxtLink',{attrs:{"to":{ path: ("/product/list/" + (item2.id)), query: { title: item2.name }}}},[_c('el-image',{staticClass:"image",attrs:{"src":item2.resources.img,"fit":"scale-down"}}),_vm._v(" "),_c('div',{staticClass:"name"},[_vm._v(_vm._s(item2.name))])],1)],1)}),0)])]],2)}),0)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/category/list.vue?vue&type=template&id=79eba588&scoped=true&

// EXTERNAL MODULE: ./pages/category/js/list.js
var list = __webpack_require__(201);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/category/list.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
// CONCATENATED MODULE: ./pages/category/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var category_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/category/list.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(253)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  category_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "79eba588",
  "70a3650a"
  
)

/* harmony default export */ var category_list = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=list.js.map