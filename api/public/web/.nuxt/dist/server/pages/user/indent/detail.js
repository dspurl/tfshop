exports.ids = [43,44];
exports.modules = {

/***/ 239:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_goodIndent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(27);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',
  head() {
    return {
      title: `${this.$t('money.pay.order_details')}-${this.$t('header.top.personal_center')}`
    };
  },
  data() {
    return {
      loading: true,
      buttonLoading: false,
      total: 0,
      indent: {
        total: 0,
        good_code: []
      },
      isType: true,
      code_type: 0
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      if (!$nuxt.$route.query.id) {
        this.$message({
          message: this.$t('common.arguments'),
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
            this.code_type = item.good_sku.code_type;
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
          if (item.good.type === 2 || item.good.type === 3) {
            this.isType = false;
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
      this.$confirm(this.$t('hint.whether_confirm', {
        attribute: this.$t('indent.receiving')
      }), this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true;
        Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_0__[/* receipt */ "j"])(this.indent.id).then(response => {
          this.buttonLoading = false;
          this.$message({
            message: this.$t('common.success'),
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
    },
    doCopy(item) {
      this.$copyText(item).then(message => {
        this.$message({
          message: this.$t('indent.copy'),
          type: 'success'
        });
      }).catch(err => {
        console.log('失败');
      });
    },
    // 下载文件
    goDownload() {
      this.buttonLoading = true;
      Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_0__[/* download */ "f"])(this.indent.id).then(response => {
        window.open("http://dsshop.test/api/v1/app/" + 'indentDownload/' + response);
      }).finally(() => {
        this.buttonLoading = false;
      });
    }
  }
});

/***/ }),

/***/ 240:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(297);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("01f7efc0", content, true, context)
};

/***/ }),

/***/ 296:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_style_index_0_id_5d4fd88c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(240);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_style_index_0_id_5d4fd88c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_style_index_0_id_5d4fd88c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_style_index_0_id_5d4fd88c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_detail_vue_vue_type_style_index_0_id_5d4fd88c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 297:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".specification[data-v-5d4fd88c]{color:#999}.top[data-v-5d4fd88c]{display:flex;flex-direction:row;justify-content:space-between;margin-top:20px}.top .operation[data-v-5d4fd88c]{text-align:right}.right .li[data-v-5d4fd88c]{display:flex;flex-direction:row;justify-content:space-between;font-size:12px;color:#999;line-height:45px}.right .li .name[data-v-5d4fd88c]{text-align:right;flex:1}.right .li .value[data-v-5d4fd88c]{min-width:100px;text-align:right;color:#fa524c}.right .li .total[data-v-5d4fd88c]{position:relative;top:-5px}.right .li .total span[data-v-5d4fd88c]{font-size:30px}.address .min-title[data-v-5d4fd88c]{margin-bottom:20px}.address .li[data-v-5d4fd88c]{display:flex;line-height:25px;font-size:12px}.address .li .name[data-v-5d4fd88c]{width:120px;text-align:right}.address .li .value[data-v-5d4fd88c]{color:#999}.steps-box-time .steps[data-v-5d4fd88c]{display:flex;font-size:12px;line-height:25px;margin-top:5px}.steps-box-time .steps div[data-v-5d4fd88c]{flex:1;text-align:center}.steps-box .title[data-v-5d4fd88c]{color:#fa524c;margin-bottom:10px}.steps-box .steps[data-v-5d4fd88c]{display:flex;border-radius:5px;background-color:#e1e1e1;font-size:12px;line-height:25px}.steps-box .steps .on[data-v-5d4fd88c]{background-color:#fa524c;color:#fff;border-radius:5px}.steps-box .steps div[data-v-5d4fd88c]{flex:1}.steps-box .steps div .chunk[data-v-5d4fd88c]{text-align:center}.code-box .min-title[data-v-5d4fd88c]{line-height:45px}.code-box .code-list[data-v-5d4fd88c]{font-size:12px}.code-box .code-list .li[data-v-5d4fd88c]{display:flex;line-height:25px}.code-box .code-list .li .el-icon-copy-document[data-v-5d4fd88c]{margin-left:10px;cursor:pointer}.code-box .code-list .li .name[data-v-5d4fd88c]{margin-right:50px}.download[data-v-5d4fd88c]{text-align:right}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 332:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/indent/detail.vue?vue&type=template&id=5d4fd88c&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_c('el-page-header',{attrs:{"content":_vm.$t('money.pay.order_details')},on:{"back":_vm.goBack}}),_vm._ssrNode(" "),_c('div',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}]},[_vm._ssrNode("<div class=\"top\" data-v-5d4fd88c>","</div>",[_vm._ssrNode("<div class=\"order-number\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('money.pay.order_number'))+"："+_vm._s(_vm.indent.identification))+"</div> "),_vm._ssrNode("<div class=\"operation\" data-v-5d4fd88c>","</div>",[(_vm.indent.state === 1)?_vm._ssrNode("<div style=\"margin-bottom: 5px;\" data-v-5d4fd88c>","</div>",[_c('el-button',{attrs:{"loading":_vm.buttonLoading,"size":"mini"}},[_vm._v(_vm._s(_vm.$t('indent.cancel_order')))])],1):_vm._e(),_vm._ssrNode(" "),(_vm.indent.state === 1)?_c('NuxtLink',{attrs:{"to":{ path: '/money/pay', query: { id: _vm.indent.id }}}},[_c('el-button',{attrs:{"loading":_vm.buttonLoading,"size":"mini","type":"danger"}},[_vm._v(_vm._s(_vm.$t('indent.payment')))])],1):_vm._e(),_vm._ssrNode(" "),(_vm.indent.state === 3)?_vm._ssrNode("<div data-v-5d4fd88c>","</div>",[_c('el-button',{attrs:{"loading":_vm.buttonLoading,"size":"mini","type":"danger"},on:{"click":function($event){return _vm.confirmReceipt()}}},[_vm._v(_vm._s(_vm.$t('indent.confirm_receipt')))])],1):_vm._e()],2)],2),_vm._ssrNode(" "),_c('el-divider'),_vm._ssrNode(" <div class=\"steps-box\" data-v-5d4fd88c><div class=\"title\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.indent.state_show))+"</div> <div class=\"steps\" data-v-5d4fd88c><div"+(_vm._ssrClass(null,{on:_vm.indent.created_at}))+" data-v-5d4fd88c><div class=\"chunk\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.orders')))+"</div></div> <div"+(_vm._ssrClass(null,{on:_vm.indent.pay_time}))+" data-v-5d4fd88c><div class=\"chunk\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.payments')))+"</div> <div class=\"name\" data-v-5d4fd88c></div></div> "+((_vm.isType)?("<div"+(_vm._ssrClass(null,{on:_vm.indent.shipping_time}))+" data-v-5d4fd88c><div class=\"chunk\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.distribution')))+"</div> <div class=\"name\" data-v-5d4fd88c></div></div>"):"<!---->")+" <div"+(_vm._ssrClass(null,{on:_vm.indent.state === 5 || _vm.indent.state === 11}))+" data-v-5d4fd88c><div class=\"chunk\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.trade_successfully')))+"</div> <div class=\"name\" data-v-5d4fd88c></div></div></div></div> <div class=\"steps-box-time\" data-v-5d4fd88c><div class=\"steps\" data-v-5d4fd88c><div data-v-5d4fd88c><div class=\"chunk\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.indent.created_at))+"</div></div> <div data-v-5d4fd88c><div class=\"chunk\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.indent.pay_time))+"</div></div> "+((_vm.isType)?("<div data-v-5d4fd88c><div class=\"chunk\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.indent.shipping_time))+"</div></div>"):"<!---->")+" <div data-v-5d4fd88c><div class=\"chunk\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.indent.state === 5 ? _vm.indent.confirm_time : ''))+"</div></div></div></div> "),_c('el-table',{ref:"table",staticClass:"table",attrs:{"data":_vm.indent.goods_list}},[_c('el-table-column',{attrs:{"align":"center","width":"100"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('NuxtLink',{attrs:{"to":{ path: ("/product/detail/" + (scope.row.good_id))}}},[_c('el-image',{staticClass:"image",attrs:{"src":_vm._f("smallImage")(scope.row.img,80),"fit":"cover"}})],1)]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":_vm.$t('indent.name')},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('NuxtLink',{attrs:{"to":{ path: ("/product/detail/" + (scope.row.good_id))}}},[_c('p',[_vm._v(_vm._s(scope.row.name))]),_vm._v(" "),_c('p',{staticClass:"specification"},[_vm._v(_vm._s(scope.row.specification))])])]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":_vm.$t('indent.price'),"width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n          "+_vm._s(_vm._f("thousands")(scope.row.price))+"\n        ")]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":_vm.$t('indent.number'),"width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n          "+_vm._s(scope.row.number)+"\n        ")]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":_vm.$t('indent.subtotal'),"width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n          "+_vm._s(_vm._f("thousands")((scope.row.price * scope.row.number)))+"\n        ")]}}])})],1),_vm._ssrNode(" "),_c('el-divider'),_vm._ssrNode(" "),(_vm.indent.odd)?[_vm._ssrNode("<div class=\"address\" data-v-5d4fd88c><div class=\"min-title\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.logistics')))+"</div> <div class=\"li\" data-v-5d4fd88c><div class=\"name\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.logistics_company'))+"：")+"</div> <div class=\"value\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.indent.dhl.name))+"</div></div> <div class=\"li\" data-v-5d4fd88c><div class=\"name\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.waybill_number'))+"：")+"</div> <div class=\"value\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.indent.odd))+"</div></div></div> "),_c('el-divider')]:_vm._e(),_vm._ssrNode(" "),(_vm.indent.good_location)?[_vm._ssrNode("<div class=\"address\" data-v-5d4fd88c><div class=\"min-title\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('money.pay.receiving')))+"</div> <div class=\"li\" data-v-5d4fd88c><div class=\"name\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.compellation'))+"：")+"</div> <div class=\"value\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.indent.good_location.name))+"</div></div> <div class=\"li\" data-v-5d4fd88c><div class=\"name\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.phone'))+"：")+"</div> <div class=\"value\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.indent.good_location.cellphone))+"</div></div> <div class=\"li\" data-v-5d4fd88c><div class=\"name\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.shipping_address'))+"：")+"</div> <div class=\"value\" data-v-5d4fd88c>"+_vm._ssrEscape("\n            "+_vm._s(_vm.indent.good_location.location)+"\n            ")+((_vm.indent.good_location.address)?("<span data-v-5d4fd88c>"+_vm._ssrEscape("("+_vm._s(_vm.indent.good_location.address)+")")+"</span>"):"<!---->")+_vm._ssrEscape("\n            "+_vm._s(_vm.indent.good_location.house)+"\n          ")+"</div></div></div> "),_c('el-divider')]:_vm._e(),_vm._ssrNode(" "),(_vm.indent.refund_time)?_vm._ssrNode("<div data-v-5d4fd88c>","</div>",[_vm._ssrNode("<div class=\"address\" data-v-5d4fd88c><div class=\"min-title\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.refund_method')))+"</div> <div class=\"li\" data-v-5d4fd88c><div class=\"name\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.refund_method'))+"：")+"</div> <div class=\"value\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.indent.refund_way))+"</div></div> <div class=\"li\" data-v-5d4fd88c><div class=\"name\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.refund_time'))+"：")+"</div> <div class=\"value\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.indent.refund_time))+"</div></div> <div class=\"li\" data-v-5d4fd88c><div class=\"name\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.refund_amount'))+"：")+"</div> <div class=\"value\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.indent.refund_money))+"</div></div> <div class=\"li\" data-v-5d4fd88c><div class=\"name\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.refund_refund'))+"：")+"</div> <div class=\"value\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.indent.refund_reason))+"</div></div></div> "),_c('el-divider')],2):_vm._e(),_vm._ssrNode(" "),(_vm.indent.good_code.length)?_vm._ssrNode("<div class=\"code-box\" data-v-5d4fd88c>","</div>",[_vm._ssrNode("<div class=\"min-title\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.code_type ? _vm.$t('good.code_type.web_disk') : _vm.$t('good.code_type.carmi')))+"</div> <div class=\"code-list\" data-v-5d4fd88c>"+(_vm._ssrList((_vm.indent.good_code),function(item,index){return ("<div class=\"li\" data-v-5d4fd88c>"+((item.name)?("<div class=\"name\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.code_type ? _vm.$t('good.good_code.url') : _vm.$t('good.good_code.card_number'))+"："+_vm._s(item.name))+"<span class=\"el-icon-copy-document\" data-v-5d4fd88c></span></div>"):"<!---->")+" <div class=\"value\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.code_type ? _vm.$t('good.web_disk.code') : _vm.$t('good.code_type.carmi'))+"："+_vm._s(item.code))+"<span class=\"el-icon-copy-document\" data-v-5d4fd88c></span></div></div>")}))+"</div> "),_c('el-divider')],2):_vm._e(),_vm._ssrNode(" <div class=\"address\" data-v-5d4fd88c><div class=\"min-title\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.other')))+"</div> <div class=\"li\" data-v-5d4fd88c><div class=\"name\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.remark'))+"：")+"</div> <div class=\"value\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.indent.remark ? _vm.indent.remark : _vm.$t('indent.without')))+"</div></div></div> "),_c('el-divider'),_vm._ssrNode(" <div class=\"right\" data-v-5d4fd88c><div class=\"li\" data-v-5d4fd88c><div class=\"name\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.total'))+"：")+"</div> <div class=\"value\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm._f("thousands")(_vm.total))+_vm._s(_vm.$t('common.monetary_unit')))+"</div></div> "+((_vm.indent.coupon_money)?("<div class=\"li\" data-v-5d4fd88c><div class=\"name\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.discount_amount'))+"：")+"</div> <div class=\"value\" data-v-5d4fd88c>"+_vm._ssrEscape("-"+_vm._s(_vm._f("thousands")(_vm.indent.coupon_money/100))+_vm._s(_vm.$t('common.monetary_unit')))+"</div></div>"):"<!---->")+" "+((!_vm.indent.integral_draw_log)?("<div class=\"li\" data-v-5d4fd88c><div class=\"name\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.freight'))+"：")+"</div> "+((_vm.indent.carriage>0)?("<div class=\"value\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm._f("thousands")(_vm.indent.carriage))+_vm._s(_vm.$t('common.monetary_unit')))+"</div>"):("<div class=\"value\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.free_shipping')))+"</div>"))+"</div>"):"<!---->")+" <div class=\"li\" data-v-5d4fd88c><div class=\"name\" data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm.$t('indent.amount_payable'))+"：")+"</div> <div class=\"value total\" data-v-5d4fd88c><span data-v-5d4fd88c>"+_vm._ssrEscape(_vm._s(_vm._f("thousands")(_vm.indent.total)))+"</span>"+_vm._ssrEscape(_vm._s(_vm.$t('common.monetary_unit')))+"</div></div></div> "),(_vm.indent.download)?_vm._ssrNode("<div class=\"download\" data-v-5d4fd88c>","</div>",[_c('el-button',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.buttonLoading),expression:"buttonLoading"}],attrs:{"type":"danger"},on:{"click":_vm.goDownload}},[_vm._v(_vm._s(_vm.$t('indent.download')))])],1):_vm._e()],2)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/user/indent/detail.vue?vue&type=template&id=5d4fd88c&scoped=true&

// EXTERNAL MODULE: ./pages/user/indent/js/detail.js
var detail = __webpack_require__(239);

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
//
//
//
//
//
//
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
var componentNormalizer = __webpack_require__(3);

// CONCATENATED MODULE: ./pages/user/indent/detail.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(296)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  indent_detailvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "5d4fd88c",
  "7b0c9201"
  
)

/* harmony default export */ var indent_detail = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=detail.js.map