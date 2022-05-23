exports.ids = [34,33];
exports.modules = {

/***/ 176:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getUserList; });
/* unused harmony export count */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return create; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);


function getList(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'coupon',
    method: 'GET',
    params: query
  });
}
function getUserList(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'coupon/user',
    method: 'GET',
    params: query
  });
}
function count() {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'coupon/user/count',
    method: 'GET'
  });
}
function create(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'coupon',
    method: 'POST',
    data
  });
}

/***/ }),

/***/ 200:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(219);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("1a6f2ee4", content, true, context)
};

/***/ }),

/***/ 211:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_coupon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(176);

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'CouponUse',
  props: {
    money: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      tableLoading: false,
      checkboxAll: false,
      loading: true,
      buttonLoading: false,
      list: [],
      total: 0,
      couponMoney: 0,
      couponIndex: null,
      visible: false,
      listQuery: {
        limit: 100,
        money: 0,
        index: 1,
        page: 1,
        sort: '-created_at'
      }
    };
  },

  watch: {
    money(newVal) {
      this.listQuery.money = newVal;
      this.getList();
    }

  },
  methods: {
    async getList() {
      this.loading = true;
      await Promise.all([Object(_api_coupon__WEBPACK_IMPORTED_MODULE_0__[/* getUserList */ "c"])(this.listQuery)]).then(([data]) => {
        data.data.forEach((item, index) => {
          switch (item.coupon.type) {
            case 1:
              item.cost = item.coupon.cost / 100;

              if (item.cost > this.couponMoney) {
                this.couponMoney = item.cost;
                this.couponIndex = index;
              }

              break;

            case 2:
              item.cost = item.coupon.cost / 100;

              if (item.cost > this.couponMoney) {
                this.couponMoney = item.cost;
                this.couponIndex = index;
              }

              break;

            case 3:
              item.cost = this.listQuery.money * item.coupon.cost / 10000;

              if (item.cost > this.couponMoney) {
                this.couponMoney = item.cost;
                this.couponIndex = index;
              }

              break;
          }

          if (item.coupon.sill) {
            item.sill = '满' + item.coupon.sill / 100 + '可用';
          } else {
            item.sill = '无门槛';
          }
        });
        this.list = data.data;
        this.total = data.total;
        this.loading = false;
        this.$emit('select', this.list[this.couponIndex]);
      }).catch(error => {
        this.loading = false;
      });
    },

    // 选择优惠券
    select(item, index) {
      this.couponIndex = index;
      this.visible = false;
      this.$emit('select', item);
    }

  }
});

/***/ }),

/***/ 218:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_use_vue_vue_type_style_index_0_id_27d1b77a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(200);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_use_vue_vue_type_style_index_0_id_27d1b77a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_use_vue_vue_type_style_index_0_id_27d1b77a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_use_vue_vue_type_style_index_0_id_27d1b77a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_use_vue_vue_type_style_index_0_id_27d1b77a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 219:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".coupon[data-v-27d1b77a]{display:flex;justify-content:flex-end}.coupon .tag[data-v-27d1b77a]{line-height:30px;cursor:pointer;border:1px dashed #fa524c;color:#fa524c;text-align:center;padding:0 10px}.ul .li[data-v-27d1b77a]{padding:10px;display:flex;align-items:flex-start}.ul .li .money[data-v-27d1b77a]{color:#fa524c;width:70px;text-align:center;border:1px dashed #fa524c;line-height:25px;padding:0 10px;margin:5px 10px 5px 0}.ul .li .explain[data-v-27d1b77a]{width:220px;padding-right:10px}.ul .li .explain .name[data-v-27d1b77a]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ul .li .button[data-v-27d1b77a]{margin-top:8px}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 244:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/coupon/components/use.vue?vue&type=template&id=27d1b77a&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._ssrNode("<div class=\"coupon\" data-v-27d1b77a>","</div>",[_c('el-popover',{attrs:{"placement":"bottom","width":"400","trigger":"click"},model:{value:(_vm.visible),callback:function ($$v) {_vm.visible=$$v},expression:"visible"}},[_c('div',{staticClass:"ul"},_vm._l((_vm.list),function(item,index){return _c('div',{key:index,staticClass:"li"},[_c('div',{staticClass:"money"},[_c('span',[_vm._v("￥")]),_vm._v(_vm._s(item.cost))]),_vm._v(" "),_c('div',{staticClass:"explain"},[_c('div',{staticClass:"name"},[_vm._v(_vm._s(item.coupon.explain))]),_vm._v(" "),(item.coupon.end_time)?_c('div',{staticClass:"time"},[_vm._v("有效期至"+_vm._s(_vm._f("moment")(item.coupon.end_time,'YYYY.MM.DD')))]):_c('div',{staticClass:"time"},[_vm._v("不限")])]),_vm._v(" "),_c('el-button',{staticClass:"button",attrs:{"type":"primary","size":"mini","loading":_vm.buttonLoading,"disabled":_vm.couponIndex === index},on:{"click":function($event){return _vm.select(item, index)}}},[_vm._v(_vm._s(_vm.couponIndex === index ? '已选' : '选择'))])],1)}),0),_vm._v(" "),_c('div',{staticClass:"tag",attrs:{"slot":"reference"},slot:"reference"},[(_vm.list[_vm.couponIndex])?[_vm._v("\n            "+_vm._s(_vm.list[_vm.couponIndex].coupon.name)+"\n          ")]:[_vm._v("\n            选择优惠券\n          ")],_vm._v(" "),_c('i',{staticClass:"el-icon-caret-bottom"})],2)])],1)])}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/coupon/components/use.vue?vue&type=template&id=27d1b77a&scoped=true&

// EXTERNAL MODULE: ./pages/coupon/components/js/use.js
var use = __webpack_require__(211);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/coupon/components/use.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var usevue_type_script_lang_js_ = (use["default"]);
// CONCATENATED MODULE: ./pages/coupon/components/use.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_usevue_type_script_lang_js_ = (usevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/coupon/components/use.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(218)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_usevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "27d1b77a",
  "7a171276"
  
)

/* harmony default export */ var components_use = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=use.js.map