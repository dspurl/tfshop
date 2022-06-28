exports.ids = [43,41];
exports.modules = {

/***/ 268:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(344);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("7b4ed3f0", content, true, context)
};

/***/ }),

/***/ 325:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./api/goodIndent.js
var goodIndent = __webpack_require__(22);

// EXTERNAL MODULE: ./plugins/request.js
var request = __webpack_require__(2);

// EXTERNAL MODULE: external "qs"
var external_qs_ = __webpack_require__(7);
var external_qs_default = /*#__PURE__*/__webpack_require__.n(external_qs_);

// CONCATENATED MODULE: ./api/pay.js


function unifiedPayment(data) {
  data = external_qs_default.a.parse(data);
  return Object(request["a" /* default */])({
    url: 'unifiedPayment',
    method: 'POST',
    data
  });
}
function balancePay(data) {
  data = external_qs_default.a.parse(data);
  return Object(request["a" /* default */])({
    url: 'balancePay',
    method: 'POST',
    data
  });
}
// EXTERNAL MODULE: external "@chenfengyuan/vue-countdown"
var vue_countdown_ = __webpack_require__(170);
var vue_countdown_default = /*#__PURE__*/__webpack_require__.n(vue_countdown_);

// EXTERNAL MODULE: external "@chenfengyuan/vue-qrcode"
var vue_qrcode_ = __webpack_require__(171);
var vue_qrcode_default = /*#__PURE__*/__webpack_require__.n(vue_qrcode_);

// CONCATENATED MODULE: ./pages/money/js/pay.js




/* harmony default export */ var pay = __webpack_exports__["default"] = ({
  components: {
    VueCountdown: vue_countdown_default.a,
    VueQrcode: vue_qrcode_default.a
  },
  layout: 'cart',
  middleware: 'auth',

  head() {
    return {
      title: '支付订单' + '-' + "DSSHOP商城-跨终端商城解决方案"
    };
  },

  data() {
    return {
      loading: true,
      detail: false,
      centerDialogVisible: false,
      buttonLoading: false,
      qrcode: '',
      timer: null,
      list: {}
    };
  },

  mounted() {
    $nuxt.$store.commit('setCartTitle', '支付订单');
    this.getList();
  },

  methods: {
    getList() {
      Object(goodIndent["h" /* pay */])($nuxt.$route.query.id).then(response => {
        if (response.state !== 1) {
          // 订单发生改变时，直接跳转到结果页
          if (response.state === 4) {
            // $nuxt.$router.replace('/user/indent/list')
            $nuxt.$router.replace({
              path: '/user/indent/detail',
              query: {
                id: $nuxt.$route.query.id
              }
            });
          } else {
            $nuxt.$router.replace('/money/success');
          }
        }

        this.loading = false;
        this.list = response;
      }).catch(error => {
        this.$message({
          message: '请求参数有误',
          type: 'error'
        });
      });
    },

    // 显示详情
    showDetail() {
      this.detail = !this.detail;
    },

    // 支付
    payment(type) {
      this.buttonLoading = true;

      if (type === 1) {
        // 余额支付
        balancePay({
          id: $nuxt.$route.query.id
        }).then(response => {
          this.buttonLoading = false;
          $nuxt.$router.replace('/money/success');
        });
      } else {
        unifiedPayment({
          id: $nuxt.$route.query.id,
          platform: type,
          trade_type: 'NATIVE',
          type: 'goodsIndent'
        }).then(response => {
          this.centerDialogVisible = true;
          this.qrcode = response.code_url;
          this.buttonLoading = false;

          if (this.timer) {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
              this.getList();
            }, 5000);
          } else {
            this.timer = setInterval(() => {
              this.getList();
            }, 5000);
          }
        }).catch(error => {
          this.$message({
            message: '支付配置有误，请检查',
            type: 'error'
          });
        });
      }
    }

  },

  destroyed() {
    clearInterval(this.timer);
  }

});

/***/ }),

/***/ 342:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/weixin-pay.ee5865e.jpg";

/***/ }),

/***/ 343:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_pay_vue_vue_type_style_index_0_id_40e52894_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(268);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_pay_vue_vue_type_style_index_0_id_40e52894_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_pay_vue_vue_type_style_index_0_id_40e52894_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_pay_vue_vue_type_style_index_0_id_40e52894_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_pay_vue_vue_type_style_index_0_id_40e52894_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 344:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".vue-qrcode[data-v-40e52894]{text-align:center}.main-color[data-v-40e52894]{margin-left:5px;margin-right:5px;color:#fa524c}.money-pay[data-v-40e52894]{margin:40px 0}.mode-payment-box[data-v-40e52894]{margin-top:30px}.mode-payment-box .title[data-v-40e52894]{font-size:18px;margin-top:10px}.mode-payment-box .min-title[data-v-40e52894]{font-size:16px;color:#616161;margin-bottom:20px}.mode-payment-box .list[data-v-40e52894]{display:flex;margin-bottom:20px}.mode-payment-box .list .li[data-v-40e52894]{border:1px solid #e0e0e0;text-align:center;cursor:pointer;overflow:hidden;min-width:174px;height:60px;line-height:60px;margin-left:14px;padding-left:10px;padding-right:10px}.mode-payment-box .list .li.on[data-v-40e52894],.mode-payment-box .list .li[data-v-40e52894]:hover{border-color:#fa524c}.pay-order[data-v-40e52894]{margin-top:20px;margin-bottom:20px;display:flex}.pay-order .el-icon-circle-check[data-v-40e52894]{font-size:80px;color:#83c44e;margin-left:30px;margin-right:30px}.pay-order .order-info[data-v-40e52894]{position:relative;flex:1;color:#616161;margin-bottom:5px;margin-right:20px;line-height:2;font-size:14px}.pay-order .order-info .title[data-v-40e52894]{margin-bottom:10px;font-size:24px;font-weight:400;line-height:36px}.pay-order .order-info .warn span[data-v-40e52894]{color:#fa524c;margin:0 5px}.pay-order .order-info .fright[data-v-40e52894]{position:absolute;top:10px;right:0}.pay-order .order-info .fright .show-detail[data-v-40e52894]{cursor:pointer;text-align:right;margin-right:5px}.pay-order .order-info .fright .show-detail[data-v-40e52894]:hover{color:#fa524c}.pay-order .order-info .fright .total[data-v-40e52894]{display:flex;line-height:30px}.pay-order .order-info .fright .total .price[data-v-40e52894]{position:relative;top:-5px;color:#fa524c}.pay-order .order-info .fright .total .price span[data-v-40e52894]{font-size:24px}.pay-order .order-info .fright .iconfont[data-v-40e52894]{position:relative;left:5px;font-size:12px}.pay-order .order-info .order-details li[data-v-40e52894]{display:flex}.pay-order .order-info .order-details li .label[data-v-40e52894]{width:80px}.pay-order .order-info .order-details li .content .on[data-v-40e52894]{color:#fa524c}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 412:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/money/pay.vue?vue&type=template&id=40e52894&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_vm._ssrNode("<div class=\"money-pay\" data-v-40e52894>","</div>",[_c('el-card',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}],staticClass:"container",attrs:{"shadow":"always"}},[_c('div',{staticClass:"pay-order"},[_c('div',{staticClass:"el-icon-circle-check"}),_vm._v(" "),_c('div',{staticClass:"order-info"},[_c('div',{staticClass:"title"},[_vm._v("订单提交成功！去付款咯～")]),_vm._v(" "),_c('div',{staticClass:"warn"},[_vm._v("请在"),_c('span',[_c('no-ssr',[(_vm.list.overtime_time)?_c('vue-countdown',{attrs:{"time":_vm.list.overtime_time * 1000},on:{"end":_vm.getList},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var days = ref.days;
var hours = ref.hours;
var minutes = ref.minutes;
var seconds = ref.seconds;
return [_vm._v("\n                "+_vm._s(days)+" 天 "+_vm._s(hours)+" 小时 "+_vm._s(minutes)+" 分 "+_vm._s(seconds)+" 秒\n              ")]}}],null,false,1850809108)}):_vm._e()],1)],1),_vm._v("内完成支付, 超时后将取消订单")]),_vm._v(" "),(_vm.list.good_location)?_c('div',{directives:[{name:"show",rawName:"v-show",value:(!_vm.detail),expression:"!detail"}],staticClass:"address"},[_vm._v("收货信息："+_vm._s(_vm.list.good_location.name)+" "+_vm._s(_vm.list.good_location.cellphone)+" "+_vm._s(_vm.list.good_location.location)),(_vm.list.good_location.address)?[_vm._v("("+_vm._s(_vm.list.good_location.address)+")")]:_vm._e()],2):_vm._e(),_vm._v(" "),(_vm.list.good_location)?_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.detail),expression:"detail"}],staticClass:"order-details"},[_c('el-divider'),_vm._v(" "),_c('ul',[_c('li',[_c('div',{staticClass:"label"},[_vm._v("订单号：")]),_vm._v(" "),_c('div',{staticClass:"content"},[_c('span',{staticClass:"on"},[_vm._v(_vm._s(_vm.list.identification))])])]),_vm._v(" "),_c('li',[_c('div',{staticClass:"label"},[_vm._v("收货信息：")]),_vm._v(" "),_c('div',{staticClass:"content"},[_vm._v(_vm._s(_vm.list.good_location.name)+" "+_vm._s(_vm.list.good_location.cellphone)+" "+_vm._s(_vm.list.good_location.location)),(_vm.list.good_location.address)?[_vm._v("("+_vm._s(_vm.list.good_location.address)+")")]:_vm._e()],2)]),_vm._v(" "),_c('li',[_c('div',{staticClass:"label"},[_vm._v("商品名称：")]),_vm._v(" "),_c('div',{staticClass:"content"},_vm._l((_vm.list.goods_list),function(item,index){return _c('span',{key:index},[_vm._v(_vm._s(item.good.name)+" ")])}),0)])])],1):_vm._e(),_vm._v(" "),_c('div',{staticClass:"fright"},[_c('div',{staticClass:"total"},[_vm._v("应付总额："),_c('div',{staticClass:"price"},[_c('span',[_vm._v(_vm._s(_vm._f("thousands")((_vm.list.total ? _vm.list.total : 0))))]),_vm._v("元")])]),_vm._v(" "),(_vm.list.good_location)?_c('div',{staticClass:"show-detail",on:{"click":_vm.showDetail}},[_vm._v("订单详情"),_c('i',{staticClass:"iconfont dsshop-xia"})]):_vm._e()])])])]),_vm._ssrNode(" "),_c('el-card',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}],staticClass:"container mode-payment-box",attrs:{"shadow":"always"}},[_c('div',{staticClass:"title"},[_vm._v("选择以下支付方式付款")]),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('div',{staticClass:"min-title"},[_vm._v("支付方式")]),_vm._v(" "),_c('div',{staticClass:"list"},[_c('div',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.buttonLoading),expression:"buttonLoading"}],staticClass:"li",on:{"click":function($event){return _vm.payment('weixin')}}},[_c('el-image',{staticClass:"image",attrs:{"src":__webpack_require__(342),"fit":"cover"}})],1),_vm._v(" "),(_vm.list.user)?_c('div',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.buttonLoading),expression:"buttonLoading"}],staticClass:"li",on:{"click":function($event){return _vm.payment(1)}}},[_vm._v("\n          预存款支付（"+_vm._s(_vm._f("thousands")(_vm.list.user.money))+"）\n        ")]):_vm._e()])],1)],2),_vm._ssrNode(" "),_c('el-dialog',{attrs:{"title":"微信支付","visible":_vm.centerDialogVisible,"close-on-click-modal":false,"width":"400px","center":""},on:{"update:visible":function($event){_vm.centerDialogVisible=$event}}},[_c('div',{staticClass:"vue-qrcode"},[_c('vue-qrcode',{attrs:{"value":_vm.qrcode,"options":{ width: 250 }}})],1),_vm._v(" "),_c('div',{staticClass:"dialog-footer",attrs:{"slot":"footer"},slot:"footer"},[_c('div',[_vm._v("请使用"),_c('span',{staticClass:"main-color"},[_vm._v("微信")]),_vm._v("扫一扫")]),_vm._v(" "),_c('div',[_vm._v("二维码完成支付")])])])],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/money/pay.vue?vue&type=template&id=40e52894&scoped=true&

// EXTERNAL MODULE: ./pages/money/js/pay.js + 1 modules
var pay = __webpack_require__(325);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/money/pay.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var payvue_type_script_lang_js_ = (pay["default"]);
// CONCATENATED MODULE: ./pages/money/pay.vue?vue&type=script&lang=js&
 /* harmony default export */ var money_payvue_type_script_lang_js_ = (payvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/money/pay.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(343)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  money_payvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "40e52894",
  "5356006a"
  
)

/* harmony default export */ var money_pay = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=pay.js.map