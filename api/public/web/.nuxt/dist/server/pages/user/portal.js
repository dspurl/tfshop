exports.ids = [59,52];
exports.modules = {

/***/ 207:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/portrait.2250589.gif";

/***/ }),

/***/ 235:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(291);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("3f4a35bd", content, true, context)
};

/***/ }),

/***/ 257:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./plugins/request.js
var request = __webpack_require__(2);

// CONCATENATED MODULE: ./api/browse.js
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
    url: 'browse',
    method: 'GET',
    params: query
  });
}
// EXTERNAL MODULE: ./api/user.js
var user = __webpack_require__(45);

// EXTERNAL MODULE: ./api/goodIndent.js
var goodIndent = __webpack_require__(27);

// CONCATENATED MODULE: ./pages/user/js/portal.js



/* harmony default export */ var portal = __webpack_exports__["default"] = ({
  layout: 'user',
  head() {
    return {
      title: this.$t('header.top.personal_center')
    };
  },
  async asyncData(ctx) {
    try {} catch (err) {
      ctx.$errorHandler(err);
    }
  },
  data() {
    return {
      loading: true,
      user: {},
      browseList: [],
      quantity: {
        all: 0,
        obligation: 0,
        waitdeliver: 0,
        waitforreceiving: 0
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      await Promise.all([getList({
        limit: 7,
        sort: '-updated_at'
      }), Object(user["c" /* detail */])(), Object(goodIndent["i" /* quantity */])()]).then(([browseData, userData, quantityData]) => {
        this.browseList = browseData.data;
        this.user = userData;
        this.quantity = quantityData;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    }
  }
});

/***/ }),

/***/ 290:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_portal_vue_vue_type_style_index_0_id_34e06795_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(235);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_portal_vue_vue_type_style_index_0_id_34e06795_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_portal_vue_vue_type_style_index_0_id_34e06795_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_portal_vue_vue_type_style_index_0_id_34e06795_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_portal_vue_vue_type_style_index_0_id_34e06795_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 291:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".indent-box[data-v-34e06795]{display:flex}.indent-box .li[data-v-34e06795]{display:flex;margin-right:20px}.indent-box .li .icon[data-v-34e06795]{display:flex;justify-content:center;align-items:center;border-radius:50%;width:80px;height:80px;margin-right:10px}.indent-box .li .icon .iconfont[data-v-34e06795]{color:#fff;font-size:40px}.indent-box .li .describe[data-v-34e06795]{margin-top:15px}.indent-box .li .describe .name[data-v-34e06795]{font-size:18px;font-weight:400;margin-bottom:5px}.indent-box .li .describe .name span[data-v-34e06795]{color:#fa524c}.indent-box .li .describe .link[data-v-34e06795]{font-size:12px}.indent-box .li .describe .link[data-v-34e06795]:hover{color:#fa524c}.browse-box[data-v-34e06795]{display:flex}.browse-box .card[data-v-34e06795]{width:135px;margin-right:8px;border:1px solid #ebeef5;padding:10px}.browse-box .card .image[data-v-34e06795]{width:100%;height:120px}.browse-box .card .name[data-v-34e06795]{font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.user-title[data-v-34e06795]{color:#757575;font-weight:400;font-size:18px;margin-bottom:10px}.portal-main[data-v-34e06795]{display:flex}.portal-main .user-card[data-v-34e06795]{display:flex;width:400px}.portal-main .user-card .card-box[data-v-34e06795]{margin-left:20px}.portal-main .user-card .card-box .username[data-v-34e06795]{font-size:22px;font-weight:400;color:#616161;padding:0}.portal-main .user-card .card-box .money[data-v-34e06795]{line-height:25px;color:#616161}.portal-main .user-card .card-box .personal[data-v-34e06795]{font-size:12px;color:#fa524c}.integral-money[data-v-34e06795]{color:#909399;font-size:12px;margin-left:5px}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 329:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/portal.vue?vue&type=template&id=34e06795&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}],staticClass:"box"},[_vm._ssrNode("<div class=\"portal-main\" data-v-34e06795>","</div>",[_vm._ssrNode("<div class=\"user-card\" data-v-34e06795>","</div>",[_c('el-avatar',{attrs:{"size":80}},[_c('img',{attrs:{"src":_vm.user.portrait ? _vm.user.portrait : __webpack_require__(207)}})]),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"card-box\" data-v-34e06795>","</div>",[_vm._ssrNode("<div class=\"username\" data-v-34e06795>"+_vm._ssrEscape(_vm._s(_vm.user.cellphone ? (_vm.user.nickname ? _vm.user.nickname : _vm.user.cellphone) : _vm.$t('portal.tourist')))+"</div> <div class=\"money\" data-v-34e06795>"+_vm._ssrEscape(_vm._s(_vm.$t('portal.balance'))+"："+_vm._s(_vm._f("thousands")((_vm.user.money ? _vm.user.money : 0))))+"</div> "),_c('NuxtLink',{staticClass:"personal",attrs:{"to":"/user/userinfo"}},[_vm._v(_vm._s(_vm.$t('portal.personal'))+">")])],2)],2)]),_vm._ssrNode(" "),_c('el-divider'),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"indent-box\" data-v-34e06795>","</div>",[_vm._ssrNode("<div class=\"li\" data-v-34e06795>","</div>",[_vm._ssrNode("<div class=\"icon bg-blue\" data-v-34e06795><i class=\"iconfont dsshop-icon-\" data-v-34e06795></i></div> "),_vm._ssrNode("<div class=\"describe\" data-v-34e06795>","</div>",[_vm._ssrNode("<div class=\"name\" data-v-34e06795>"+_vm._ssrEscape(_vm._s(_vm.$t('portal.orders_paid'))+"：")+"<span data-v-34e06795>"+_vm._ssrEscape(_vm._s(_vm.quantity.obligation ? _vm.quantity.obligation : 0))+"</span></div> "),_c('NuxtLink',{staticClass:"link",attrs:{"to":{ path: '/user/indent/list', query: { index: 1 }}}},[_vm._v(_vm._s(_vm.$t('hint.error.examine', {attribute: _vm.$t('portal.orders_paid')}))+" >")])],2)],2),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"li\" data-v-34e06795>","</div>",[_vm._ssrNode("<div class=\"icon bg-purple\" data-v-34e06795><i class=\"iconfont dsshop-daifahuo\" data-v-34e06795></i></div> "),_vm._ssrNode("<div class=\"describe\" data-v-34e06795>","</div>",[_vm._ssrNode("<div class=\"name\" data-v-34e06795>"+_vm._ssrEscape(_vm._s(_vm.$t('portal.orders_shipped'))+"：")+"<span data-v-34e06795>"+_vm._ssrEscape(_vm._s(_vm.quantity.waitdeliver ? _vm.quantity.waitdeliver : 0))+"</span></div> "),_c('NuxtLink',{staticClass:"link",attrs:{"to":{ path: '/user/indent/list', query: { index: 2 }}}},[_vm._v(_vm._s(_vm.$t('hint.error.examine', {attribute: _vm.$t('portal.orders_shipped')}))+" >")])],2)],2),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"li\" data-v-34e06795>","</div>",[_vm._ssrNode("<div class=\"icon bg-pink\" data-v-34e06795><i class=\"iconfont dsshop-daipingjia\" data-v-34e06795></i></div> "),_vm._ssrNode("<div class=\"describe\" data-v-34e06795>","</div>",[_vm._ssrNode("<div class=\"name\" data-v-34e06795>"+_vm._ssrEscape(_vm._s(_vm.$t('portal.orders_receivingd'))+"：")+"<span data-v-34e06795>"+_vm._ssrEscape(_vm._s(_vm.quantity.waitforreceiving ? _vm.quantity.waitforreceiving : 0))+"</span></div> "),_c('NuxtLink',{staticClass:"link",attrs:{"to":{ path: '/user/indent/list', query: { index: 3 }}}},[_vm._v(_vm._s(_vm.$t('hint.error.examine', {attribute: _vm.$t('portal.orders_receivingd')}))+" >")])],2)],2)],2),_vm._ssrNode(" "),_c('el-divider'),_vm._ssrNode(" <div class=\"user-title\" data-v-34e06795>"+_vm._ssrEscape(_vm._s(_vm.$t('portal.browsing_history')))+"</div> "),_vm._ssrNode("<div class=\"browse-box\" data-v-34e06795>","</div>",_vm._l((_vm.browseList),function(item,index){return _c('NuxtLink',{key:index,staticClass:"card",attrs:{"to":{ path: ("/product/detail/" + (item.good_id))}}},[(item.good)?_c('el-image',{staticClass:"image",attrs:{"src":_vm._f("smallImage")(item.good.resources.img,200),"fit":"cover","lazy":""}}):_vm._e(),_vm._v(" "),(item.good)?_c('div',{staticClass:"name"},[_vm._v(_vm._s(item.good.name))]):_vm._e()],1)}),1)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/user/portal.vue?vue&type=template&id=34e06795&scoped=true&

// EXTERNAL MODULE: ./pages/user/js/portal.js + 1 modules
var portal = __webpack_require__(257);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/portal.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var portalvue_type_script_lang_js_ = (portal["default"]);
// CONCATENATED MODULE: ./pages/user/portal.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_portalvue_type_script_lang_js_ = (portalvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(3);

// CONCATENATED MODULE: ./pages/user/portal.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(290)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  user_portalvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "34e06795",
  "779fc8c8"
  
)

/* harmony default export */ var user_portal = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=portal.js.map