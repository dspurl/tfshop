exports.ids = [47,1,2];
exports.modules = {

/***/ 180:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(188);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("1b91cea2", content, true, context)
};

/***/ }),

/***/ 182:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return edit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return destroy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return freight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return defaultSet; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);
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
    url: 'shipping',
    method: 'GET',
    params: query
  });
}
function create(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'shipping',
    method: 'POST',
    data
  });
}
function edit(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'shipping/' + data.id,
    method: 'POST',
    data
  });
}
function destroy(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'shipping/destroy/' + id,
    method: 'POST'
  });
}
function freight(id, data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'shipping/freight/' + id,
    method: 'POST',
    data
  });
}
function defaultSet(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'shipping/default/set',
    method: 'POST',
    data
  });
}

/***/ }),

/***/ 183:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_shipping__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(182);

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'AddressList',
  props: {
    select: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateCellphone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('hint.error.import', {
          attribute: this.$t('find_password.cellphone')
        })));
      } else {
        const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (!myreg.test(value)) {
          callback(new Error(this.$t('hint.error.wrong_format', {
            attribute: this.$t('find_password.cellphone')
          })));
        }
        callback();
      }
    };
    return {
      src: 'https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=' + "" + '&referer=myapp',
      // https://lbs.qq.com
      restaurants: [],
      buttonLoading: false,
      loading: false,
      dialogTitle: this.$t('address.add'),
      centerDialogVisible: false,
      list: [],
      ruleForm: {
        location: '',
        address: '',
        name: '',
        house: '',
        cellphone: '',
        latitude: '',
        longitude: ''
      },
      rules: {
        name: [{
          required: true,
          message: this.$t('hint.error.import', {
            attribute: this.$t('address.name')
          }),
          trigger: 'blur'
        }],
        cellphone: [{
          required: true,
          message: this.$t('hint.error.import', {
            attribute: this.$t('find_password.cellphone')
          }),
          trigger: 'blur'
        }, {
          validator: validateCellphone,
          trigger: 'blur'
        }],
        house: [{
          required: true,
          message: this.$t('hint.error.import', {
            attribute: this.$t('address.house')
          }),
          trigger: 'blur'
        }]
      }
    };
  },
  watch: {},
  mounted() {
    this.getList();
    window.addEventListener('message', this.handleSelect);
  },
  methods: {
    async getList() {
      this.loading = true;
      await Object(_api_shipping__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "f"])({
        sort: '-defaults'
      }).then(response => {
        this.loading = false;
        this.list = response.data;
        this.list.forEach(item => {
          if (item.defaults) {
            item.on = true;
            this.$emit('selectedAddress', item);
          } else {
            item.on = false;
          }
        });
      }).catch(() => {
        this.loading = false;
      });
    },
    // 切换地址
    switchAddress(res) {
      if (this.select) {
        this.list.forEach(item => {
          item.on = false;
        });
        res.on = true;
        this.$emit('selectedAddress', res);
        this.$forceUpdate();
      }
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.ruleForm.id) {
            Object(_api_shipping__WEBPACK_IMPORTED_MODULE_0__[/* edit */ "d"])(this.ruleForm).then(response => {
              this.buttonLoading = false;
              this.centerDialogVisible = false;
              this.$refs['ruleForm'].resetFields();
              this.getList();
              this.$message({
                message: this.$t('hint.succeed.win', {
                  attribute: this.$t('common.amend')
                }),
                type: 'success'
              });
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            if (!this.ruleForm.longitude) {
              this.$message.error(this.$t('hint.error.selects', {
                attribute: this.$t('address.location')
              }));
            }
            Object(_api_shipping__WEBPACK_IMPORTED_MODULE_0__[/* create */ "a"])(this.ruleForm).then(response => {
              this.buttonLoading = false;
              this.centerDialogVisible = false;
              this.$refs['ruleForm'].resetFields();
              this.getList();
              this.$message({
                message: this.$t('hint.succeed.win', {
                  attribute: this.$t('common.add')
                }),
                type: 'success'
              });
            }).catch(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    defaultAddress(item) {
      this.$confirm(this.$t('address.is_default'), this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true;
        Object(_api_shipping__WEBPACK_IMPORTED_MODULE_0__[/* defaultSet */ "b"])(item).then(response => {
          this.buttonLoading = false;
          this.getList();
          this.$message({
            message: this.$t('common.success'),
            type: 'success'
          });
        }).catch(() => {
          this.buttonLoading = false;
        });
      }).catch(() => {});
    },
    deleteAddress(item) {
      if (item.defaults) {
        this.$message({
          message: this.$t('address.delete.confirm'),
          type: 'error'
        });
        return;
      }
      this.$confirm(this.$t('address.delete.title'), this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true;
        Object(_api_shipping__WEBPACK_IMPORTED_MODULE_0__[/* destroy */ "c"])(item.id).then(response => {
          this.buttonLoading = false;
          this.getList();
          this.$message({
            message: this.$t('hint.succeed.win', {
              attribute: this.$t('common.delete')
            }),
            type: 'success'
          });
        }).catch(() => {
          this.buttonLoading = false;
        });
      }).catch(() => {});
    },
    updateAddress(item) {
      if (item.id) {
        this.ruleForm = item;
        this.dialogTitle = this.$t('address.amend');
      } else {
        this.ruleForm = {
          location: '',
          address: '',
          name: '',
          house: '',
          cellphone: '',
          latitude: '',
          longitude: ''
        };
        this.dialogTitle = this.$t('address.add');
      }
      this.centerDialogVisible = true;
    },
    handleSelect(event) {
      const loc = event.data;
      if (loc && loc.module === 'locationPicker') {
        //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
        this.ruleForm.location = loc.poiname;
        this.ruleForm.address = loc.poiaddress;
        this.ruleForm.longitude = loc.latlng.lng;
        this.ruleForm.latitude = loc.latlng.lat;
      }
    }
  }
});

/***/ }),

/***/ 186:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/Address/list.vue?vue&type=template&id=64fb7058&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}],staticClass:"address-list"},[_vm._l((_vm.list),function(item,index){return _vm._ssrNode("<div class=\"address-item\" data-v-64fb7058>","</div>",[_vm._ssrNode("<div"+(_vm._ssrClass("item-on",{on:item.on && _vm.select}))+" data-v-64fb7058>","</div>",[_vm._ssrNode("<div class=\"address-info\" data-v-64fb7058>","</div>",[_vm._ssrNode("<div class=\"name\" data-v-64fb7058>"+_vm._ssrEscape("\n              "+_vm._s(item.name)+"\n              ")+((item.defaults)?("<span data-v-64fb7058>"+_vm._ssrEscape(_vm._s(_vm.$t('address.default')))+"</span>"):"<!---->")+"</div> <div class=\"cellphone\" data-v-64fb7058>"+_vm._ssrEscape(_vm._s(item.cellphone))+"</div> <div class=\"address-con\" data-v-64fb7058>"+_vm._ssrEscape(_vm._s(item.location ? item.location + '(' : '')+_vm._s(item.address)+" "+_vm._s(item.house ? ')' + item.house : ''))+"</div> "),_vm._ssrNode("<div class=\"address-action\" data-v-64fb7058>","</div>",[(!_vm.select)?_c('el-link',{attrs:{"type":"danger","underline":false},on:{"click":function($event){return _vm.defaultAddress(item)}}},[_vm._v(_vm._s(_vm.$t('address.set_default')))]):_vm._e(),_vm._ssrNode(" "),_c('el-link',{attrs:{"type":"danger","underline":false},on:{"click":function($event){return _vm.updateAddress(item)}}},[_vm._v(_vm._s(_vm.$t('common.amend')))]),_vm._ssrNode(" "),(!_vm.select)?_c('el-link',{attrs:{"type":"danger","underline":false},on:{"click":function($event){return _vm.deleteAddress(item)}}},[_vm._v(_vm._s(_vm.$t('common.delete')))]):_vm._e()],2)],2)])])}),_vm._ssrNode(" <div class=\"address-item\" data-v-64fb7058><div class=\"item\" data-v-64fb7058><div class=\"add-desc\" data-v-64fb7058><div data-v-64fb7058><i class=\"el-icon-circle-plus\" data-v-64fb7058></i></div> <div data-v-64fb7058>"+_vm._ssrEscape(_vm._s(_vm.$t('address.add_new')))+"</div></div></div></div>")],2),_vm._ssrNode(" "),_c('el-dialog',{attrs:{"title":_vm.dialogTitle,"visible":_vm.centerDialogVisible,"close-on-click-modal":false,"width":"600px;height:500px;overflow-y: auto;"},on:{"update:visible":function($event){_vm.centerDialogVisible=$event}}},[_c('el-form',{ref:"ruleForm",staticClass:"ruleForm",attrs:{"model":_vm.ruleForm,"rules":_vm.rules,"label-width":"120px"}},[_c('el-form-item',{attrs:{"label":_vm.$t('address.name'),"prop":"name"}},[_c('el-input',{attrs:{"placeholder":_vm.$t('hint.error.import', { attribute: _vm.$t('address.name') }),"clearable":"","maxlength":"20"},model:{value:(_vm.ruleForm.name),callback:function ($$v) {_vm.$set(_vm.ruleForm, "name", $$v)},expression:"ruleForm.name"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":_vm.$t('find_password.cellphone'),"prop":"cellphone"}},[_c('el-input',{attrs:{"placeholder":_vm.$t('hint.error.import', { attribute: _vm.$t('find_password.cellphone') }),"clearable":"","maxlength":"11"},model:{value:(_vm.ruleForm.cellphone),callback:function ($$v) {_vm.$set(_vm.ruleForm, "cellphone", $$v)},expression:"ruleForm.cellphone"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":_vm.$t('address.location'),"prop":"location"}},[(_vm.ruleForm.longitude)?_c('div',[_vm._v(_vm._s(_vm.ruleForm.location)+"("+_vm._s(_vm.ruleForm.address)+")")]):_c('div',[_vm._v(_vm._s(_vm.$t('address.location.tip')))]),_vm._v(" "),(_vm.ruleForm.longitude)?_c('iframe',{staticClass:"iframe",attrs:{"height":"500","frameborder":"0","src":(_vm.src + "&coord=" + (_vm.ruleForm.latitude) + "," + (_vm.ruleForm.longitude))}}):_c('iframe',{staticClass:"iframe",attrs:{"height":"500","frameborder":"0","src":_vm.src}})]),_vm._v(" "),_c('el-form-item',{attrs:{"label":_vm.$t('address.house'),"prop":"house"}},[_c('el-input',{attrs:{"placeholder":_vm.$t('hint.error.import', { attribute: _vm.$t('address.house') }),"clearable":"","maxlength":"80"},model:{value:(_vm.ruleForm.house),callback:function ($$v) {_vm.$set(_vm.ruleForm, "house", $$v)},expression:"ruleForm.house"}})],1)],1),_vm._v(" "),_c('span',{staticClass:"dialog-footer",attrs:{"slot":"footer"},slot:"footer"},[_c('el-button',{attrs:{"loading":_vm.buttonLoading},on:{"click":function($event){_vm.centerDialogVisible = false}}},[_vm._v(_vm._s(_vm.$t('common.cancel')))]),_vm._v(" "),_c('el-button',{attrs:{"loading":_vm.buttonLoading,"type":"danger"},on:{"click":function($event){return _vm.submitForm('ruleForm')}}},[_vm._v(_vm._s(_vm.$t('common.confirm')))])],1)],1)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./components/Address/list.vue?vue&type=template&id=64fb7058&scoped=true&

// EXTERNAL MODULE: ./components/Address/js/list.js
var list = __webpack_require__(183);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/Address/list.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
// CONCATENATED MODULE: ./components/Address/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var Address_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(3);

// CONCATENATED MODULE: ./components/Address/list.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(187)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  Address_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "64fb7058",
  "75dc8bfa"
  
)

/* harmony default export */ var Address_list = __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 187:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_64fb7058_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(180);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_64fb7058_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_64fb7058_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_64fb7058_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_64fb7058_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 188:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".address-list[data-v-64fb7058]{display:flex;flex-wrap:wrap;align-content:center}.address-list .address-item[data-v-64fb7058]{width:25%;padding-right:10px;padding-bottom:10px}.address-list .address-item .item[data-v-64fb7058]{cursor:pointer;border:1px solid #e0e0e0;display:flex;justify-content:center;align-items:center;height:180px}.address-list .address-item .item .add-desc[data-v-64fb7058]{text-align:center;color:#b0b0b0}.address-list .address-item .item .add-desc i[data-v-64fb7058]{color:#e0e0e0;font-size:32px;margin-bottom:10px}.address-list .address-item .item:hover i[data-v-64fb7058]{color:#b0b0b0}.address-list .address-item .item-on[data-v-64fb7058]{cursor:pointer;border:1px solid #e0e0e0;display:flex;height:180px;padding:20px;position:relative}.address-list .address-item .item-on .address-info[data-v-64fb7058]{width:100%;font-size:14px;color:#757575}.address-list .address-item .item-on .address-info .name[data-v-64fb7058]{font-size:18px;margin-bottom:20px}.address-list .address-item .item-on .address-info .name span[data-v-64fb7058]{color:#fa524c;float:right;font-size:12px}.address-list .address-item .item-on .address-info .address-action[data-v-64fb7058]{position:absolute;bottom:20px;right:20px;display:none}.address-list .address-item .item-on:hover .address-action[data-v-64fb7058]{display:block}.address-list .address-item .item-on.on[data-v-64fb7058]{border:1px solid #fa524c}.iframe[data-v-64fb7058]{border:1px solid #dcdfe6}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 225:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_Address_list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(186);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',
  components: {
    addressList: _components_Address_list__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  head() {
    return {
      title: `${this.$t('user.site')}-${this.$t('header.top.personal_center')}`
    };
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {}
});

/***/ })

};;
//# sourceMappingURL=address.js.map