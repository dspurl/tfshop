exports.ids = [23,24];
exports.modules = {

/***/ 259:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_goodIndent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'cart',

  head() {
    return {
      title: '我的购物车' + '-' + "DSSHOP商城-跨终端商城解决方案"
    };
  },

  data() {
    return {
      loading: true,
      cartList: [],
      cartOriginalList: [],
      invalidGood: [],
      total: 0,
      allChecked: true,
      empty: true,
      multipleSelection: []
    };
  },

  mounted() {
    $nuxt.$store.commit('setCartTitle', '我的购物车');

    if ($nuxt.$store.state.hasLogin) {
      this.getList();
    }
  },

  methods: {
    async getList() {
      this.loading = true;
      this.cartList = [];
      this.invalidGood = [];
      await Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_0__[/* synchronizationInventory */ "k"])().then(response => {
        this.store.set("DSSHOP-PC-" + 'CartList', response);
        this.cartOriginalList = response;

        if (response.length > 0) {
          this.empty = false;
        } else {
          this.empty = true;
        }

        for (let k in response) {
          if (response[k].good_sku) {
            response[k].specification = '';
            response[k].good_sku.skus.forEach(item => {
              if (response[k].specification) {
                response[k].specification += item.v + ';';
              } else {
                response[k].specification = item.v + ';';
              }
            });
            response[k].specification = response[k].specification.substr(0, response[k].specification.length - 1);
          }

          if (response[k].good.is_delete === 1 || response[k].good.is_show !== 1) {
            response[k].invalid = true;
          }

          if (response[k].invalid === true) {
            //失效的商品
            this.invalidGood.push({ ...response[k],
              index: k
            });
          } else {
            this.cartList.push({ ...response[k],
              index: k
            });
          }
        }

        this.$nextTick(() => {
          if (this.empty === false) {
            this.handleCheckAllChange();
          }
        });
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },

    calcTotal() {
      let list = this.multipleSelection;
      let total = 0;
      list.forEach(item => {
        total += item.price * item.number;
      });
      this.total = Number(total.toFixed(2));
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.calcTotal();
    },

    handleCheckAllChange() {
      this.$refs.table.toggleAllSelection();
      this.calcTotal();
    },

    //创建订单
    createOrder() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          message: '请选择商品',
          type: 'error'
        });
      } else {
        this.store.set("DSSHOP-PC-" + 'OrderList', this.multipleSelection);
        $nuxt.$router.push('/indent/create');
      }
    },

    //修改数量
    numberChange(index) {
      this.cartOriginalList[index].number = this.cartList[index].number;
      this.store.set("DSSHOP-PC-" + 'CartList', this.cartOriginalList);
      Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_0__[/* addShoppingCart */ "a"])(this.cartOriginalList);
      this.calcTotal();
    },

    //删除失效的商品
    deleteInvalidGood(index) {
      this.$confirm('是否移除该商品？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cartOriginalList.splice(this.invalidGood[index].index, 1);

        if (Object.values(this.cartOriginalList).length > 0) {
          this.store.set("DSSHOP-PC-" + 'CartList', this.cartOriginalList);
        } else {
          this.store.remove("DSSHOP-PC-" + 'CartList');
        }

        Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_0__[/* addShoppingCart */ "a"])(this.cartOriginalList).then(() => {
          this.getList();
        });
        this.invalidGood.splice(index, 1);
      }).catch(() => {});
    },

    //删除
    deleteCartItem(index) {
      this.$confirm('是否移除该商品？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cartOriginalList.splice(this.cartList[index].index, 1);

        if (Object.values(this.cartOriginalList).length > 0) {
          this.store.set("DSSHOP-PC-" + 'CartList', this.cartOriginalList);
        } else {
          this.store.remove("DSSHOP-PC-" + 'CartList');
        }

        Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_0__[/* addShoppingCart */ "a"])(this.cartOriginalList).then(() => {
          this.getList();
        });
        this.cartList.splice(index, 1);
      }).catch(() => {});
    },

    //删除选中的商品
    clearCart() {
      this.$confirm('是否移除所选商品？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.multipleSelection.forEach(item => {
          this.cartList.forEach((item2, index) => {
            if (item.good_sku_id) {
              if (item.good_sku_id === item2.good_sku_id) {
                delete this.cartOriginalList[item2.index];
                this.cartList.splice(index, 1);
              }
            } else {
              if (item.good_id === item2.good_id) {
                delete this.cartOriginalList[item2.index];
                this.cartList.splice(index, 1);
              }
            }
          });
        });
        this.cartOriginalList = this.cartOriginalList.filter(res => {
          return res;
        });

        if (Object.values(this.cartOriginalList).length > 0) {
          this.store.set("DSSHOP-PC-" + 'CartList', this.cartOriginalList);
        } else {
          this.store.remove("DSSHOP-PC-" + 'CartList');
        }

        Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_0__[/* addShoppingCart */ "a"])(this.cartOriginalList).then(() => {
          this.getList();
        });
      }).catch(() => {});
    }

  }
});

/***/ }),

/***/ 260:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(333);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("c11441da", content, true, context)
};

/***/ }),

/***/ 331:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/empty-cart.025b92e.png";

/***/ }),

/***/ 332:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_cart_vue_vue_type_style_index_0_id_96326bf0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(260);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_cart_vue_vue_type_style_index_0_id_96326bf0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_cart_vue_vue_type_style_index_0_id_96326bf0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_cart_vue_vue_type_style_index_0_id_96326bf0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_cart_vue_vue_type_style_index_0_id_96326bf0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 333:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".invalid-title[data-v-96326bf0]{padding:20px 0;font-size:26px;color:#ccc;text-align:center}.invalidTable[data-v-96326bf0]{margin-top:20px}.cart-list[data-v-96326bf0]{padding:30px 0}.cart-list .specification[data-v-96326bf0]{color:#999}.cart-operation[data-v-96326bf0]{margin-top:20px;background-color:#fff;display:flex;line-height:40px;font-size:12px}.cart-operation .left[data-v-96326bf0]{flex:1;padding-left:20px;color:#757575}.cart-operation .left .delete[data-v-96326bf0]{cursor:pointer}.cart-operation .left .delete[data-v-96326bf0]:hover,.cart-operation .left .number[data-v-96326bf0]{color:#fa524c}.cart-operation .right[data-v-96326bf0]{width:400px;justify-content:flex-end;display:flex}.cart-operation .right .total[data-v-96326bf0]{margin-right:30px;color:#fa524c}.cart-operation .right .total span[data-v-96326bf0]{font-size:28px}.cart-operation .right .settlement[data-v-96326bf0]{width:150px}.cart[data-v-96326bf0]{margin-top:100px;margin-bottom:100px;display:flex;position:relative}.cart .empty-cart img[data-v-96326bf0]{width:500px}.cart .instructions[data-v-96326bf0]{margin:160px 0 0 50px}.cart .instructions .title[data-v-96326bf0]{font-size:35px;color:#b0b0b0;line-height:55px;font-weight:700}.cart .instructions .login[data-v-96326bf0]{font-size:18px;line-height:45px;color:#b0b0b0}.cart .instructions .operation[data-v-96326bf0]{margin-top:20px}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 407:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/cart.vue?vue&type=template&id=96326bf0&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[(_vm.empty)?[_vm._ssrNode("<div class=\"cart container\" data-v-96326bf0>","</div>",[_vm._ssrNode("<div class=\"empty-cart\" data-v-96326bf0><img"+(_vm._ssrAttr("src",__webpack_require__(331)))+" data-v-96326bf0></div> "),_vm._ssrNode("<div class=\"instructions\" data-v-96326bf0>","</div>",[_vm._ssrNode("<div class=\"title\" data-v-96326bf0>您的购物车还是空的！</div> "+((!_vm.$store.state.hasLogin)?("<div class=\"login\" data-v-96326bf0>登录后将显示您之前加入的商品</div>"):"<!---->")+" "),_vm._ssrNode("<div class=\"operation\" data-v-96326bf0>","</div>",[(_vm.$store.state.hasLogin)?[_c('NuxtLink',{staticClass:"li",attrs:{"to":"/category/list"}},[_c('el-button',{attrs:{"type":"danger"}},[_vm._v("马上去购物")])],1)]:[_c('NuxtLink',{staticClass:"li",attrs:{"to":"/pass/login"}},[_c('el-button',{attrs:{"type":"danger"}},[_vm._v("立即登录")])],1),_vm._ssrNode(" "),_c('NuxtLink',{staticClass:"li",attrs:{"to":"/category/list"}},[_c('el-button',{attrs:{"type":"danger","plain":""}},[_vm._v("马上去购物")])],1)]],2)],2)],2)]:[_c('div',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}],staticClass:"cart-list container"},[_c('el-table',{ref:"table",staticClass:"table",attrs:{"data":_vm.cartList},on:{"selection-change":_vm.handleSelectionChange}},[_c('el-table-column',{attrs:{"type":"selection","width":"55","align":"center"}}),_vm._v(" "),_c('el-table-column',{attrs:{"align":"center","width":"100"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('NuxtLink',{attrs:{"to":{ path: ("/product/detail/" + (scope.row.good_id))}}},[_c('el-image',{staticClass:"image",attrs:{"src":_vm._f("smallImage")(scope.row.img,80),"fit":"cover"}})],1)]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"商品名称"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('NuxtLink',{attrs:{"to":{ path: ("/product/detail/" + (scope.row.good_id))}}},[_c('p',[_vm._v(_vm._s(scope.row.name))]),_vm._v(" "),_c('p',{staticClass:"specification"},[_vm._v(_vm._s(scope.row.specification))])])]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"单价","width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n            "+_vm._s(_vm._f("thousands")(scope.row.price))+"\n          ")]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"数量","width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('el-input-number',{attrs:{"size":"mini","min":1,"max":scope.row.good_sku.inventory},on:{"change":function($event){return _vm.numberChange(scope.$index)}},model:{value:(scope.row.number),callback:function ($$v) {_vm.$set(scope.row, "number", $$v)},expression:"scope.row.number"}})]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"小计","width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n            "+_vm._s(_vm._f("thousands")((scope.row.price * scope.row.number)))+"\n          ")]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"操作","width":"80","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('el-tooltip',{staticClass:"item",attrs:{"effect":"dark","content":"移除商品","placement":"top-start"}},[_c('el-button',{attrs:{"size":"mini","type":"danger","icon":"el-icon-delete","circle":""},on:{"click":function($event){$event.stopPropagation();return _vm.deleteCartItem(scope.$index)}}})],1)]}}])})],1),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"cart-operation\" data-v-96326bf0>","</div>",[_vm._ssrNode("<div class=\"left\" data-v-96326bf0>","</div>",[_c('el-button',{attrs:{"size":"mini","type":"danger","plain":""},on:{"click":_vm.handleCheckAllChange}},[_vm._v("全选/全不选")]),_vm._ssrNode(" "),_c('el-divider',{attrs:{"direction":"vertical"}}),_vm._ssrNode(" <span class=\"delete\" data-v-96326bf0>删除</span> "),_c('el-divider',{attrs:{"direction":"vertical"}}),_vm._ssrNode(" <span data-v-96326bf0>共 <span class=\"number\" data-v-96326bf0>"+_vm._ssrEscape(_vm._s(_vm.cartList.length))+"</span> 件商品，已选择 <span class=\"number\" data-v-96326bf0>"+_vm._ssrEscape(_vm._s(_vm.multipleSelection.length))+"</span>件</span>")],2),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"right\" data-v-96326bf0>","</div>",[_vm._ssrNode("<div class=\"total\" data-v-96326bf0>合计：<span data-v-96326bf0>"+_vm._ssrEscape(_vm._s(_vm.total))+"</span>元</div> "),_c('el-button',{staticClass:"settlement",attrs:{"type":"danger","disabled":_vm.total<=0},on:{"click":_vm.createOrder}},[_vm._v("去结算")])],2)],2),_vm._ssrNode(" "),(_vm.invalidGood.length)?[_vm._ssrNode("<h3 class=\"invalid-title\" data-v-96326bf0>已失效的商品</h3> "),_c('el-table',{ref:"invalidTable",staticClass:"invalidTable",attrs:{"data":_vm.invalidGood}},[_c('el-table-column',{attrs:{"align":"center","width":"100"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('NuxtLink',{attrs:{"to":{ path: ("/product/detail/" + (scope.row.good_id))}}},[_c('el-image',{staticClass:"image",attrs:{"src":_vm._f("smallImage")(scope.row.img,80),"fit":"cover"}})],1)]}}],null,false,138529428)}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"商品名称"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('NuxtLink',{attrs:{"to":{ path: ("/product/detail/" + (scope.row.good_id))}}},[_c('p',[_vm._v(_vm._s(scope.row.name))]),_vm._v(" "),_c('p',{staticClass:"specification"},[_vm._v(_vm._s(scope.row.specification))])])]}}],null,false,270465265)}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"单价","width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n              "+_vm._s(_vm._f("thousands")(scope.row.price))+"\n            ")]}}],null,false,912411108)}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"数量","width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n              "+_vm._s(scope.row.number)+"\n            ")]}}],null,false,4147131710)}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"小计","width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n              "+_vm._s(_vm._f("thousands")((scope.row.price * scope.row.number)))+"\n            ")]}}],null,false,1182163340)}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"操作","width":"80","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('el-tooltip',{staticClass:"item",attrs:{"effect":"dark","content":"移除商品","placement":"top-start"}},[_c('el-button',{attrs:{"size":"mini","type":"danger","icon":"el-icon-delete","circle":""},on:{"click":function($event){return _vm.deleteInvalidGood(scope.$index)}}})],1)]}}],null,false,847168811)})],1)]:_vm._e()],2)]],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/cart.vue?vue&type=template&id=96326bf0&scoped=true&

// EXTERNAL MODULE: ./pages/cart/js/index.js
var js = __webpack_require__(259);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/cart.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var cartvue_type_script_lang_js_ = (js["default"]);
// CONCATENATED MODULE: ./pages/cart.vue?vue&type=script&lang=js&
 /* harmony default export */ var pages_cartvue_type_script_lang_js_ = (cartvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/cart.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(332)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_cartvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "96326bf0",
  "3c8d81b1"
  
)

/* harmony default export */ var cart = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=cart.js.map