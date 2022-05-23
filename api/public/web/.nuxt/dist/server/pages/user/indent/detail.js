exports.ids = [68,69];
exports.modules = {

/***/ 296:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_goodIndent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',

  head() {
    return {
      title: '订单详情-个人中心'
    };
  },

  data() {
    return {
      loading: true,
      buttonLoading: false,
      total: 0,
      indent: {}
    };
  },

  mounted() {
    this.getDetail();
  },

  methods: {
    async getDetail() {
      if (!$nuxt.$route.query.id) {
        this.$message({
          message: '参数有误，请联系管理员',
          type: 'error'
        });
        $nuxt.$router.go(-1);
        return false;
      }

      await Promise.all([Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_0__[/* detail */ "e"])($nuxt.$route.query.id)]).then(([indentData]) => {
        this.indent = indentData;
        this.total = 0;
        let specification = null;
        this.indent.goods_list.forEach(item => {
          this.total += item.price * item.number;

          if (item.good_sku) {
            specification = null;
            item.good_sku.product_sku.forEach(item2 => {
              if (specification) {
                specification += item2.value + ';';
              } else {
                specification = item2.value + ';';
              }
            });
            item.specification = specification.substr(0, specification.length - 1);
          }
        });
        this.total = Number(this.total.toFixed(2));
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },

    // 确认收货
    confirmReceipt() {
      this.$confirm('是否确认收货？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true;
        Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_0__[/* receipt */ "i"])(this.indent.id).then(response => {
          this.buttonLoading = false;
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.getDetail();
        }).catch(() => {
          this.buttonLoading = false;
        });
      }).catch(() => {});
    },

    goBack() {
      $nuxt.$router.go(-1);
    }

  }
});

/***/ }),

/***/ 297:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(379);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("64b1f837", content, true, context)
};

/***/ }),

/***/ 378:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_style_index_0_id_fade4054_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(297);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_style_index_0_id_fade4054_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_style_index_0_id_fade4054_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_style_index_0_id_fade4054_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_style_index_0_id_fade4054_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 379:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".specification[data-v-fade4054]{color:#999}.top[data-v-fade4054]{margin-top:20px}.right .li[data-v-fade4054],.top[data-v-fade4054]{display:flex;flex-direction:row;justify-content:space-between}.right .li[data-v-fade4054]{font-size:12px;color:#999;line-height:45px}.right .li .name[data-v-fade4054]{text-align:right;flex:1}.right .li .value[data-v-fade4054]{min-width:100px;text-align:right;color:#fa524c}.right .li .total[data-v-fade4054]{position:relative;top:-5px}.right .li .total span[data-v-fade4054]{font-size:30px}.address .min-title[data-v-fade4054]{margin-bottom:20px}.address .li[data-v-fade4054]{display:flex;line-height:25px;font-size:12px}.address .li .name[data-v-fade4054]{width:80px;text-align:right}.address .li .value[data-v-fade4054]{color:#999}.steps-box-time .steps[data-v-fade4054]{display:flex;font-size:12px;line-height:25px;margin-top:5px}.steps-box-time .steps div[data-v-fade4054]{flex:1;text-align:center}.steps-box .title[data-v-fade4054]{color:#fa524c;margin-bottom:10px}.steps-box .steps[data-v-fade4054]{display:flex;border-radius:5px;background-color:#e1e1e1;font-size:12px;line-height:25px}.steps-box .steps .on[data-v-fade4054]{background-color:#fa524c;color:#fff;border-radius:5px}.steps-box .steps div[data-v-fade4054]{flex:1}.steps-box .steps div .chunk[data-v-fade4054]{text-align:center}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 428:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/indent/detail.vue?vue&type=template&id=fade4054&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_c('el-page-header',{attrs:{"content":"订单详情"},on:{"back":_vm.goBack}}),_vm._ssrNode(" "),_c('div',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}]},[_vm._ssrNode("<div class=\"top\" data-v-fade4054>","</div>",[_vm._ssrNode("<div class=\"order-number\" data-v-fade4054>"+_vm._ssrEscape("订单号："+_vm._s(_vm.indent.identification))+"</div> "),_vm._ssrNode("<div class=\"operation\" data-v-fade4054>","</div>",[(_vm.indent.state === 1)?_vm._ssrNode("<div style=\"margin-bottom: 5px;\" data-v-fade4054>","</div>",[_c('el-button',{attrs:{"loading":_vm.buttonLoading,"size":"mini"}},[_vm._v("取消订单")])],1):_vm._e(),_vm._ssrNode(" "),(_vm.indent.state === 1)?_c('NuxtLink',{attrs:{"to":{ path: '/money/pay', query: { id: _vm.indent.id }}}},[_c('el-button',{attrs:{"loading":_vm.buttonLoading,"size":"mini","type":"danger"}},[_vm._v("立即付款")])],1):_vm._e(),_vm._ssrNode(" "),(_vm.indent.state === 3)?_vm._ssrNode("<div data-v-fade4054>","</div>",[_c('el-button',{attrs:{"loading":_vm.buttonLoading,"size":"mini","type":"danger"},on:{"click":function($event){return _vm.confirmReceipt()}}},[_vm._v("确认收货")])],1):_vm._e()],2)],2),_vm._ssrNode(" "),_c('el-divider'),_vm._ssrNode(" <div class=\"steps-box\" data-v-fade4054><div class=\"title\" data-v-fade4054>"+_vm._ssrEscape(_vm._s(_vm.indent.state_show))+"</div> <div class=\"steps\" data-v-fade4054><div"+(_vm._ssrClass(null,{on:_vm.indent.created_at}))+" data-v-fade4054><div class=\"chunk\" data-v-fade4054>下单</div></div> <div"+(_vm._ssrClass(null,{on:_vm.indent.pay_time}))+" data-v-fade4054><div class=\"chunk\" data-v-fade4054>付款</div> <div class=\"name\" data-v-fade4054></div></div> <div"+(_vm._ssrClass(null,{on:_vm.indent.shipping_time}))+" data-v-fade4054><div class=\"chunk\" data-v-fade4054>配货</div> <div class=\"name\" data-v-fade4054></div></div> <div"+(_vm._ssrClass(null,{on:_vm.indent.state === 5 || _vm.indent.state === 11}))+" data-v-fade4054><div class=\"chunk\" data-v-fade4054>交易成功</div> <div class=\"name\" data-v-fade4054></div></div></div></div> <div class=\"steps-box-time\" data-v-fade4054><div class=\"steps\" data-v-fade4054><div data-v-fade4054><div class=\"chunk\" data-v-fade4054>"+_vm._ssrEscape(_vm._s(_vm.indent.created_at))+"</div></div> <div data-v-fade4054><div class=\"chunk\" data-v-fade4054>"+_vm._ssrEscape(_vm._s(_vm.indent.pay_time))+"</div></div> <div data-v-fade4054><div class=\"chunk\" data-v-fade4054>"+_vm._ssrEscape(_vm._s(_vm.indent.shipping_time))+"</div></div> <div data-v-fade4054><div class=\"chunk\" data-v-fade4054>"+_vm._ssrEscape(_vm._s(_vm.indent.state === 5 ? _vm.indent.confirm_time : ''))+"</div></div></div></div> "),_c('el-table',{ref:"table",staticClass:"table",attrs:{"data":_vm.indent.goods_list}},[_c('el-table-column',{attrs:{"align":"center","width":"100"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('NuxtLink',{attrs:{"to":{ path: ("/product/detail/" + (scope.row.good_id))}}},[_c('el-image',{staticClass:"image",attrs:{"src":_vm._f("smallImage")(scope.row.img,80),"fit":"cover"}})],1)]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"商品名称"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('NuxtLink',{attrs:{"to":{ path: ("/product/detail/" + (scope.row.good_id))}}},[_c('p',[_vm._v(_vm._s(scope.row.name))]),_vm._v(" "),_c('p',{staticClass:"specification"},[_vm._v(_vm._s(scope.row.specification))])])]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"单价","width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n          "+_vm._s(_vm._f("thousands")(scope.row.price))+"\n        ")]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"数量","width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n          "+_vm._s(scope.row.number)+"\n        ")]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"小计","width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n          "+_vm._s(_vm._f("thousands")((scope.row.price * scope.row.number)))+"\n        ")]}}])})],1),_vm._ssrNode(" "),_c('el-divider'),_vm._ssrNode(" "+((_vm.indent.good_location)?("<div class=\"address\" data-v-fade4054><div class=\"min-title\" data-v-fade4054>收货信息</div> <div class=\"li\" data-v-fade4054><div class=\"name\" data-v-fade4054>姓名：</div> <div class=\"value\" data-v-fade4054>"+_vm._ssrEscape(_vm._s(_vm.indent.good_location.name))+"</div></div> <div class=\"li\" data-v-fade4054><div class=\"name\" data-v-fade4054>联系电话：</div> <div class=\"value\" data-v-fade4054>"+_vm._ssrEscape(_vm._s(_vm.indent.good_location.cellphone))+"</div></div> <div class=\"li\" data-v-fade4054><div class=\"name\" data-v-fade4054>收货地址：</div> <div class=\"value\" data-v-fade4054>"+_vm._ssrEscape("\n          "+_vm._s(_vm.indent.good_location.location)+"\n          ")+((_vm.indent.good_location.address)?("<span data-v-fade4054>"+_vm._ssrEscape("("+_vm._s(_vm.indent.good_location.address)+")")+"</span>"):"<!---->")+_vm._ssrEscape("\n          "+_vm._s(_vm.indent.good_location.house)+"\n        ")+"</div></div></div>"):"<!---->")+" "),_c('el-divider'),_vm._ssrNode(" "),(_vm.indent.refund_time)?_vm._ssrNode("<div data-v-fade4054>","</div>",[_vm._ssrNode("<div class=\"address\" data-v-fade4054><div class=\"min-title\" data-v-fade4054>退款方式</div> <div class=\"li\" data-v-fade4054><div class=\"name\" data-v-fade4054>退款方式：</div> <div class=\"value\" data-v-fade4054>"+_vm._ssrEscape(_vm._s(_vm.indent.refund_way))+"</div></div> <div class=\"li\" data-v-fade4054><div class=\"name\" data-v-fade4054>退款时间：</div> <div class=\"value\" data-v-fade4054>"+_vm._ssrEscape(_vm._s(_vm.indent.refund_time))+"</div></div> <div class=\"li\" data-v-fade4054><div class=\"name\" data-v-fade4054>退款金额：</div> <div class=\"value\" data-v-fade4054>"+_vm._ssrEscape(_vm._s(_vm.indent.refund_money))+"</div></div> <div class=\"li\" data-v-fade4054><div class=\"name\" data-v-fade4054>退款原因：</div> <div class=\"value\" data-v-fade4054>"+_vm._ssrEscape(_vm._s(_vm.indent.refund_reason))+"</div></div></div> "),_c('el-divider')],2):_vm._e(),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"address\" data-v-fade4054>","</div>",[_vm._ssrNode("<div class=\"min-title\" data-v-fade4054>其它</div> <div class=\"li\" data-v-fade4054><div class=\"name\" data-v-fade4054>备注：</div> <div class=\"value\" data-v-fade4054>"+_vm._ssrEscape(_vm._s(_vm.indent.remark ? _vm.indent.remark : '无'))+"</div></div> "),(_vm.indent.integral_draw_log)?_vm._ssrNode("<div class=\"li\" data-v-fade4054>","</div>",[_vm._ssrNode("<div class=\"name\" data-v-fade4054>中奖信息：</div> "),_vm._ssrNode("<div class=\"value\" data-v-fade4054>","</div>",[_vm._ssrNode("\n          参与\n          "),_c('NuxtLink',{attrs:{"to":{ path: ("/user/integralDraw?id=" + (_vm.indent.integral_draw_log.integral_draw.id))}}},[_vm._v("\n            "+_vm._s(_vm.indent.integral_draw_log.integral_draw.name)+"\n          ")]),_vm._ssrNode(_vm._ssrEscape("\n            抽奖获得奖品：("+_vm._s(_vm.indent.integral_draw_log.integral_prize.name)+")\n\n        "))],2)],2):_vm._e()],2),_vm._ssrNode(" "),_c('el-divider'),_vm._ssrNode(" <div class=\"right\" data-v-fade4054><div class=\"li\" data-v-fade4054><div class=\"name\" data-v-fade4054>商品总价：</div> <div class=\"value\" data-v-fade4054>"+_vm._ssrEscape(_vm._s(_vm._f("thousands")(_vm.total))+"元")+"</div></div> "+((_vm.indent.coupon_money)?("<div class=\"li\" data-v-fade4054><div class=\"name\" data-v-fade4054>优惠金额：</div> <div class=\"value\" data-v-fade4054>"+_vm._ssrEscape("-"+_vm._s(_vm._f("thousands")(_vm.indent.coupon_money/100))+"元")+"</div></div>"):"<!---->")+" "+((!_vm.indent.integral_draw_log)?("<div class=\"li\" data-v-fade4054><div class=\"name\" data-v-fade4054>运费：</div> "+((_vm.indent.carriage>0)?("<div class=\"value\" data-v-fade4054>"+_vm._ssrEscape(_vm._s(_vm._f("thousands")(_vm.indent.carriage))+"元")+"</div>"):("<div class=\"value\" data-v-fade4054>免运费</div>"))+"</div>"):"<!---->")+" "+((_vm.indent.integralPrice)?("<div class=\"li\" data-v-fade4054><div class=\"name\" data-v-fade4054>积分抵扣：</div> <div class=\"value\" data-v-fade4054>"+_vm._ssrEscape("-"+_vm._s(_vm._f("thousands")(_vm.indent.integralPrice))+"元")+"</div></div>"):"<!---->")+" <div class=\"li\" data-v-fade4054><div class=\"name\" data-v-fade4054>应付金额：</div> <div class=\"value total\" data-v-fade4054><span data-v-fade4054>"+_vm._ssrEscape(_vm._s(_vm._f("thousands")(_vm.indent.total)))+"</span>元</div></div></div>")],2)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/user/indent/detail.vue?vue&type=template&id=fade4054&scoped=true&

// EXTERNAL MODULE: ./pages/user/indent/js/detail.js
var detail = __webpack_require__(296);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/indent/detail.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var detailvue_type_script_lang_js_ = (detail["default"]);
// CONCATENATED MODULE: ./pages/user/indent/detail.vue?vue&type=script&lang=js&
 /* harmony default export */ var indent_detailvue_type_script_lang_js_ = (detailvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/user/indent/detail.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(378)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  indent_detailvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "fade4054",
  "7b0c9201"
  
)

/* harmony default export */ var indent_detail = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=detail.js.map