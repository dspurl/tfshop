exports.ids = [18,15,19];
exports.modules = {

/***/ 229:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(250);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("4282846f", content, true, context)
};

/***/ }),

/***/ 239:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'DefaultArticle',
  props: {
    data: {
      type: Object,
      default: {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  watch: {},

  mounted() {},

  methods: {}
});

/***/ }),

/***/ 249:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_defaultArticle_vue_vue_type_style_index_0_id_bc788b20_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(229);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_defaultArticle_vue_vue_type_style_index_0_id_bc788b20_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_defaultArticle_vue_vue_type_style_index_0_id_bc788b20_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_defaultArticle_vue_vue_type_style_index_0_id_bc788b20_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_defaultArticle_vue_vue_type_style_index_0_id_bc788b20_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 250:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".breadcrumb[data-v-bc788b20]{margin-top:20px;margin-bottom:20px}.box[data-v-bc788b20]{background-color:#fff;padding:40px;margin-bottom:30px;min-height:600px}.box .title[data-v-bc788b20]{font-weight:700;font-size:22px;line-height:25px;padding-bottom:30px;padding-top:10px}.box .content[data-v-bc788b20]{font-size:16px;line-height:20px}.box .time[data-v-bc788b20]{font-size:16px;padding-top:20px;text-align:right;color:#757575}", ""]);
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

/***/ 319:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/components/defaultArticle.vue?vue&type=template&id=bc788b20&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-breadcrumb',{staticClass:"breadcrumb container",attrs:{"separator":"/"}},[_c('el-breadcrumb-item',[_c('NuxtLink',{attrs:{"to":{ path: '/' }}},[_vm._v("\n        首页\n      ")])],1),_vm._v(" "),_c('el-breadcrumb-item',[_c('NuxtLink',{attrs:{"to":{ path: ("/article/list/" + (_vm.data.column.id))}}},[_vm._v("\n        "+_vm._s(_vm.data.column.name)+"\n      ")])],1),_vm._v(" "),_c('el-breadcrumb-item',[_vm._v(_vm._s(_vm.data.name))])],1),_vm._ssrNode(" <div class=\"box container\" data-v-bc788b20><div data-v-bc788b20><div class=\"title\" data-v-bc788b20>"+_vm._ssrEscape(_vm._s(_vm.data.name))+"</div> <div class=\"content\" data-v-bc788b20>"+(_vm._s(_vm.data.article_property.details))+"</div> <div class=\"time\" data-v-bc788b20>"+_vm._ssrEscape(_vm._s(_vm.data.created_at.split(" ")[0]))+"</div></div></div>")],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/article/components/defaultArticle.vue?vue&type=template&id=bc788b20&scoped=true&

// EXTERNAL MODULE: ./pages/article/js/defaultArticle.js
var defaultArticle = __webpack_require__(239);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/components/defaultArticle.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var defaultArticlevue_type_script_lang_js_ = (defaultArticle["default"]);
// CONCATENATED MODULE: ./pages/article/components/defaultArticle.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_defaultArticlevue_type_script_lang_js_ = (defaultArticlevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/article/components/defaultArticle.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(249)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_defaultArticlevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "bc788b20",
  "5f53bf58"
  
)

/* harmony default export */ var components_defaultArticle = __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 435:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/detail/_id.vue?vue&type=template&id=5c1edabe&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_c(_vm.template,{tag:"component",attrs:{"loading":_vm.loading,"data":_vm.data}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/article/detail/_id.vue?vue&type=template&id=5c1edabe&scoped=true&

// EXTERNAL MODULE: ./pages/article/components/defaultArticle.vue + 4 modules
var defaultArticle = __webpack_require__(319);

// EXTERNAL MODULE: ./api/article.js
var article = __webpack_require__(257);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/detail/_id.vue?vue&type=script&lang=js&
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
    defaultArticle: defaultArticle["default"]
  },

  data() {
    return {
      template: '',
      data: '',
      loading: false
    };
  },

  async asyncData(ctx) {
    try {
      const {
        params
      } = ctx;
      let [articleDetailData] = await Promise.all([Object(article["a" /* detail */])(params.id)]);
      return {
        data: articleDetailData
      };
    } catch (err) {
      ctx.$errorHandler(err);
    }
  },

  head() {
    return {
      title: this.data.name + '-' + "DSSHOP商城-跨终端商城解决方案",
      meta: [{
        hid: 'index',
        name: this.data.name + '-' + "DSSHOP商城-跨终端商城解决方案",
        content: this.data.keywords ? this.data.keywords : "商城网店系统,商城,网店,免费商城,免费网店"
      }, {
        hid: 'description',
        name: 'description',
        content: this.data.short_description ? this.data.short_description : "免费开源可商用，快速搭建属于自己的独立商城网店系统，一次搭建适配多终端"
      }]
    };
  },

  mounted() {
    this.template = this.data.template;
    this.setPV();
  },

  methods: {
    setPV() {
      Object(article["c" /* pv */])($nuxt.$route.params.id);
    }

  }
});
// CONCATENATED MODULE: ./pages/article/detail/_id.vue?vue&type=script&lang=js&
 /* harmony default export */ var detail_idvue_type_script_lang_js_ = (_idvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/article/detail/_id.vue



function injectStyles (context) {
  
  
}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  detail_idvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "5c1edabe",
  "287122a6"
  
)

/* harmony default export */ var _id = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=_id.js.map