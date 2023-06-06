exports.ids = [21,22];
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

/***/ 210:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_good__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(179);
/* harmony import */ var _api_banner__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(46);


/* harmony default export */ __webpack_exports__["default"] = ({
  data() {
    return {
      categoryStyle: 0,
      naveOn: null,
      goodList: [],
      banner: '',
      bannerList: [],
      categoryList: [],
      categorySublevel: [],
      recommendCategoryList: [],
      recommendGoodList: []
    };
  },
  async asyncData(ctx) {
    try {
      let [goodData, bannerData, categoryData, recommendCategoryData] = await Promise.all([Object(_api_good__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "b"])({
        limit: 10,
        is_recommend: 1
      }), Object(_api_banner__WEBPACK_IMPORTED_MODULE_1__[/* getList */ "a"])({
        limit: 5,
        type: 0,
        state: 0,
        sort: '+sort'
      }), Object(_api_good__WEBPACK_IMPORTED_MODULE_0__[/* goodCategory */ "c"])({
        tree: true
      }), Object(_api_good__WEBPACK_IMPORTED_MODULE_0__[/* goodCategory */ "c"])({
        is_recommend: 1
      })]);
      bannerData.data.forEach(item => {
        item.url = item.url ? item.url.replace('?id=', '/') : '';
      });
      return {
        goodList: goodData.data,
        bannerList: bannerData.data,
        categoryList: categoryData,
        recommendCategoryList: recommendCategoryData
      };
    } catch (err) {
      ctx.$errorHandler(err);
    }
  },
  mounted() {
    this.categoryGood();
    this.getBanner();
  },
  methods: {
    // 分类切换
    naveCut(index) {
      if (index !== -1) {
        this.naveOn = index;
        if (this.categoryList[index].children) {
          //存在子类目
          if (this.categoryList[index].children[0].resources) {
            this.categorySublevel = this.categoryList[index].children;
            this.categoryStyle = 2;
          } else {
            //存在三级
            this.categorySublevel = this.categoryList[index].children;
            this.categoryStyle = 1;
          }
        } else {
          this.categorySublevel = [];
        }
      }
    },
    // 获取分类商品
    categoryGood() {
      this.recommendCategoryList.forEach((item, index) => {
        this.recommendGoodList[index] = [];
        Object(_api_good__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "b"])({
          limit: 10,
          category_id: item.id
        }).then(response => {
          this.recommendGoodList[index] = response.data;
          this.$forceUpdate();
        });
      });
    },
    // 分类移出
    naveShiftOut() {
      this.naveOn = null;
      this.categoryStyle = 0;
    },
    // 首页广告
    getBanner() {
      Object(_api_banner__WEBPACK_IMPORTED_MODULE_1__[/* getList */ "a"])({
        limit: 1,
        type: 1,
        state: 0,
        sort: '+sort'
      }).then(response => {
        this.banner = response.data[0];
        if (this.banner) {
          this.banner.url = this.banner.url ? this.banner.url.replace('?id=', '/') : '';
        }
      });
    }
  }
});

/***/ }),

/***/ 211:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(263);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("562ef390", content, true, context)
};

/***/ }),

/***/ 262:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_46dc3874_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(211);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_46dc3874_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_46dc3874_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_46dc3874_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_46dc3874_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 263:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".advertising[data-v-46dc3874]{margin-top:20px}.recommend[data-v-46dc3874]{margin-top:40px;width:1210px;position:relative;left:5px}.recommend .title-box[data-v-46dc3874]{display:flex}.recommend .title-box .min-title[data-v-46dc3874]{font-size:22px;color:#333;line-height:58px;flex:1}.recommend .title-box .more[data-v-46dc3874]{font-size:16px;line-height:58px;color:#424242;width:95px}.recommend .title-box .more[data-v-46dc3874]:hover{color:#fa524c}.recommend .title[data-v-46dc3874]{text-align:center;display:block;font-size:28px;margin-bottom:20px}.recommend .list[data-v-46dc3874]{display:flex;flex-wrap:wrap;align-content:flex-start}.recommend .list .li[data-v-46dc3874]{cursor:pointer;width:20%}.recommend .list .li .card[data-v-46dc3874]{margin:0 10px 10px 0}.recommend .list .li .card .image[data-v-46dc3874]{width:100%;height:190px}.recommend .list .li .card .name[data-v-46dc3874]{font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.recommend .list .li .card .price[data-v-46dc3874]{display:flex;justify-content:center;margin-bottom:10px}.recommend .list .li .card .price .symbol[data-v-46dc3874]{font-size:12px;line-height:40px;color:#fa524c}.recommend .list .li .card .price .value[data-v-46dc3874]{color:#fa524c;line-height:35px}.recommend .list .li .card[data-v-46dc3874]:hover{transform:translateY(-5px)}.top[data-v-46dc3874]{padding-bottom:20px}.top .container[data-v-46dc3874]{position:relative}.secondary-navigation2[data-v-46dc3874]{position:absolute;background-color:#fff;border:1px solid #e0e0e0;box-shadow:0 8px 16px #888;top:0;left:200px;z-index:10;width:1000px;height:460px;padding:20px;display:flex;flex-wrap:wrap;align-content:flex-start}.secondary-navigation2 .li[data-v-46dc3874]{font-size:12px;line-height:40px;display:flex;width:25%}.secondary-navigation2 .li .name[data-v-46dc3874]{margin-left:10px;margin-right:10px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:80px}.secondary-navigation2 .li[data-v-46dc3874]:hover{color:#fa524c}.secondary-navigation2 .image[data-v-46dc3874]{width:80px;height:80px}.secondary-navigation[data-v-46dc3874]{position:absolute;background-color:#fff;border:1px solid #e0e0e0;box-shadow:0 8px 16px rgba(0,0,0,.3);top:0;left:200px;z-index:10;width:1000px;height:460px;padding:20px;font-size:14px}.secondary-navigation .list[data-v-46dc3874]{line-height:40px;display:flex}.secondary-navigation .list .dt[data-v-46dc3874]{width:100px;text-align:right;font-weight:700;margin-right:10px}.secondary-navigation .list .dt .iconfont[data-v-46dc3874]{margin-left:5px;font-size:12px}.secondary-navigation .list .dt[data-v-46dc3874]:hover{color:#fa524c}.secondary-navigation .list .dd[data-v-46dc3874]{display:flex;flex:1}.secondary-navigation .list .dd .li[data-v-46dc3874]{padding:0 10px}.secondary-navigation .list .dd .li[data-v-46dc3874]:hover{color:#fa524c}.classify[data-v-46dc3874]{display:flex;background-color:#fff;position:relative}.classify .nave[data-v-46dc3874]{z-index:10;position:absolute;left:0;top:0;width:200px;color:#fff;padding-top:20px;height:460px;background:rgba(105,101,101,.6)}.classify .nave .nave-li[data-v-46dc3874]{cursor:pointer;padding:10px}.classify .nave .nave-li .iconfont[data-v-46dc3874]{float:right;position:relative;top:3px}.classify .nave .nave-li.on[data-v-46dc3874],.classify .nave .nave-li[data-v-46dc3874]:hover{color:#fff;background-color:#fa524c}.classify .banner[data-v-46dc3874]{flex:1}.classify .banner .image[data-v-46dc3874]{width:100%;height:100%}.el-carousel__item h3[data-v-46dc3874]{color:#475669;font-size:18px;opacity:.75;line-height:300px;margin:0}.el-carousel__item[data-v-46dc3874]:nth-child(2n){background-color:#99a9bf}.el-carousel__item[data-v-46dc3874]:nth-child(odd){background-color:#d3dce6}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 316:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/index.vue?vue&type=template&id=46dc3874&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_vm._ssrNode("<div class=\"top\" data-v-46dc3874>","</div>",[_vm._ssrNode("<div class=\"container\" data-v-46dc3874>","</div>",[_vm._ssrNode("<div class=\"classify\" data-v-46dc3874>","</div>",[_vm._ssrNode("<div class=\"nave\" data-v-46dc3874>","</div>",[_vm._ssrNode((_vm._ssrList((_vm.categoryList),function(item,index){return ("<div"+(_vm._ssrClass("nave-li",{on:_vm.naveOn === index}))+" data-v-46dc3874>"+_vm._ssrEscape(_vm._s(item.name))+"<i class=\"iconfont dsshop-youjiantou\" data-v-46dc3874></i></div>")}))+" "),(_vm.categoryStyle === 1)?_vm._ssrNode("<div class=\"secondary-navigation\" data-v-46dc3874>","</div>",_vm._l((_vm.categorySublevel),function(item,index){return _vm._ssrNode("<div class=\"list\" data-v-46dc3874>","</div>",[_c('NuxtLink',{staticClass:"dt"},[_vm._v(_vm._s(item.name)),_c('i',{staticClass:"iconfont dsshop-youjiantou"})]),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"dd\" data-v-46dc3874>","</div>",_vm._l((item.children),function(item2,index2){return _c('NuxtLink',{key:index2,staticClass:"li",attrs:{"to":{ path: 'product/list', query: { pid: item2.id, title: item2.name }}}},[_vm._v(_vm._s(item2.name))])}),1)],2)}),0):(_vm.categoryStyle === 2)?_vm._ssrNode("<div class=\"secondary-navigation2\" data-v-46dc3874>","</div>",_vm._l((_vm.categorySublevel),function(item,index){return _c('NuxtLink',{key:index,staticClass:"li",attrs:{"to":{ path: 'product/list', query: { pid: item.id, title: item.name }}}},[_c('el-image',{staticClass:"image",attrs:{"src":_vm._f("smallImage")(item.resources.img,80),"fit":"scale-down"}}),_vm._v(" "),_c('div',{staticClass:"name"},[_vm._v(_vm._s(item.name))])],1)}),1):_vm._e()],2),_vm._ssrNode(" "),_c('el-carousel',{staticClass:"banner",attrs:{"height":"460px","arrow":"never"}},_vm._l((_vm.bannerList),function(item,index){return _c('el-carousel-item',{key:index},[(item.url)?_c('NuxtLink',{attrs:{"to":item.url.split('pages/').join('')}},[_c('el-image',{staticClass:"image",attrs:{"src":item.resources.img}})],1):_c('el-image',{staticClass:"image",attrs:{"src":item.resources.img}})],1)}),1)],2)])]),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"recommend container\" data-v-46dc3874>","</div>",[_vm._ssrNode("<div class=\"title\" data-v-46dc3874>"+_vm._ssrEscape(_vm._s(_vm.$t('index.recommend')))+"</div> "),_vm._ssrNode("<div class=\"list\" data-v-46dc3874>","</div>",_vm._l((_vm.goodList),function(item,index){return _c('NuxtLink',{key:index,staticClass:"li",attrs:{"to":{ path: ("/product/detail/" + (item.id))}}},[_c('el-card',{staticClass:"card",attrs:{"shadow":"hover"}},[_c('el-image',{staticClass:"image",attrs:{"src":_vm._f("smallImage")(item.resources.img,200),"fit":"cover","lazy":""}}),_vm._v(" "),_c('div',{staticClass:"name"},[_vm._v(_vm._s(item.name))]),_vm._v(" "),_c('div',{staticClass:"price"},[_c('div',{staticClass:"symbol"},[_vm._v(_vm._s(_vm.$t('common.unit')))]),_vm._v(" "),_c('div',{staticClass:"value"},[_vm._v(_vm._s(_vm._f("thousands")(item.order_price)))])])],1)],1)}),1)],2),_vm._ssrNode(" "),(_vm.banner)?_vm._ssrNode("<div class=\"container advertising\" data-v-46dc3874>","</div>",[(_vm.banner.url)?_c('NuxtLink',{attrs:{"to":_vm.banner.url.split('pages/').join('')}},[_c('el-image',{attrs:{"fit":"cover","src":_vm.banner.resources.img}})],1):_c('el-image',{attrs:{"fit":"cover","src":_vm.banner.resources.img}})],1):_vm._e(),_vm._ssrNode(" "),_vm._l((_vm.recommendCategoryList),function(fitem,findex){return _vm._ssrNode("<div class=\"recommend container\" data-v-46dc3874>","</div>",[_vm._ssrNode("<div class=\"title-box\" data-v-46dc3874>","</div>",[_vm._ssrNode("<div class=\"min-title\" data-v-46dc3874>"+_vm._ssrEscape(_vm._s(fitem.name))+"</div> "),_c('NuxtLink',{staticClass:"more",attrs:{"to":{ path: ("/product/list/" + (fitem.id)), query: { title: fitem.name }}}},[_vm._v(_vm._s(_vm.$t('index.view_more'))+">>")])],2),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"list\" data-v-46dc3874>","</div>",_vm._l((_vm.recommendGoodList[findex]),function(item,index){return _c('NuxtLink',{key:index,staticClass:"li",attrs:{"to":{ path: ("/product/detail/" + (item.id))}}},[_c('el-card',{staticClass:"card",attrs:{"shadow":"hover"}},[_c('el-image',{staticClass:"image",attrs:{"src":_vm._f("smallImage")(item.resources.img,200),"fit":"cover","lazy":""}}),_vm._v(" "),_c('div',{staticClass:"name"},[_vm._v(_vm._s(item.name))]),_vm._v(" "),_c('div',{staticClass:"price"},[_c('div',{staticClass:"symbol"},[_vm._v(_vm._s(_vm.$t('common.unit')))]),_vm._v(" "),_c('div',{staticClass:"value"},[_vm._v(_vm._s(_vm._f("thousands")(item.order_price)))])])],1)],1)}),1)],2)})],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/index.vue?vue&type=template&id=46dc3874&scoped=true&

// EXTERNAL MODULE: ./pages/index/js/index.js
var js = __webpack_require__(210);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var lib_vue_loader_options_pagesvue_type_script_lang_js_ = (js["default"]);
// CONCATENATED MODULE: ./pages/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var pagesvue_type_script_lang_js_ = (lib_vue_loader_options_pagesvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(3);

// CONCATENATED MODULE: ./pages/index.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(262)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pagesvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "46dc3874",
  "1aeebd91"
  
)

/* harmony default export */ var pages = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=index.js.map