exports.ids = [37,1,2,33,34,38];
exports.modules = {

/***/ 175:
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

/***/ 180:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(194);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("17f2989c", content, true, context)
};

/***/ }),

/***/ 183:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return edit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return destroy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return freight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return defaultSet; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);


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

/***/ 186:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return good; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);

function getList(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'integralDrawLog',
    method: 'GET',
    params: query
  });
}
function good(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'integralDrawLogGood/' + id,
    method: 'GET'
  });
}

/***/ }),

/***/ 190:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_shipping__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(183);

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
        callback(new Error('请输入手机号'));
      } else {
        const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;

        if (!myreg.test(value)) {
          callback(new Error('手机号格式有误'));
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
      dialogTitle: '添加收货地址',
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
          message: '请输入姓名',
          trigger: 'blur'
        }],
        cellphone: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          validator: validateCellphone,
          trigger: 'blur'
        }],
        house: [{
          required: true,
          message: '请输入门牌号',
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
                message: '修改成功',
                type: 'success'
              });
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            if (!this.ruleForm.longitude) {
              this.$message.error('请选择地址');
            }

            Object(_api_shipping__WEBPACK_IMPORTED_MODULE_0__[/* create */ "a"])(this.ruleForm).then(response => {
              this.buttonLoading = false;
              this.centerDialogVisible = false;
              this.$refs['ruleForm'].resetFields();
              this.getList();
              this.$message({
                message: '添加成功',
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
      this.$confirm('是否设为默认？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true;
        Object(_api_shipping__WEBPACK_IMPORTED_MODULE_0__[/* defaultSet */ "b"])(item).then(response => {
          this.buttonLoading = false;
          this.getList();
          this.$message({
            message: '设置成功',
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
          message: '默认地址无法删除',
          type: 'error'
        });
        return;
      }

      this.$confirm('确定要删除该地址吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true;
        Object(_api_shipping__WEBPACK_IMPORTED_MODULE_0__[/* destroy */ "c"])(item.id).then(response => {
          this.buttonLoading = false;
          this.getList();
          this.$message({
            message: '删除成功',
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
        this.dialogTitle = '修改收货地址';
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
        this.dialogTitle = '添加收货地址';
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

/***/ 192:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/Address/list.vue?vue&type=template&id=5c109676&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}],staticClass:"address-list"},[_vm._l((_vm.list),function(item,index){return _vm._ssrNode("<div class=\"address-item\" data-v-5c109676>","</div>",[_vm._ssrNode("<div"+(_vm._ssrClass("item-on",{on:item.on && _vm.select}))+" data-v-5c109676>","</div>",[_vm._ssrNode("<div class=\"address-info\" data-v-5c109676>","</div>",[_vm._ssrNode("<div class=\"name\" data-v-5c109676>"+_vm._ssrEscape("\n              "+_vm._s(item.name)+"\n              ")+((item.defaults)?("<span data-v-5c109676>默认</span>"):"<!---->")+"</div> <div class=\"cellphone\" data-v-5c109676>"+_vm._ssrEscape(_vm._s(item.cellphone))+"</div> <div class=\"address-con\" data-v-5c109676>"+_vm._ssrEscape(_vm._s(item.location ? item.location + '(' : '')+_vm._s(item.address)+" "+_vm._s(item.house ? ')' + item.house : ''))+"</div> "),_vm._ssrNode("<div class=\"address-action\" data-v-5c109676>","</div>",[(!_vm.select)?_c('el-link',{attrs:{"type":"danger","underline":false},on:{"click":function($event){return _vm.defaultAddress(item)}}},[_vm._v("设为默认")]):_vm._e(),_vm._ssrNode(" "),_c('el-link',{attrs:{"type":"danger","underline":false},on:{"click":function($event){return _vm.updateAddress(item)}}},[_vm._v("修改")]),_vm._ssrNode(" "),(!_vm.select)?_c('el-link',{attrs:{"type":"danger","underline":false},on:{"click":function($event){return _vm.deleteAddress(item)}}},[_vm._v("删除")]):_vm._e()],2)],2)])])}),_vm._ssrNode(" <div class=\"address-item\" data-v-5c109676><div class=\"item\" data-v-5c109676><div class=\"add-desc\" data-v-5c109676><div data-v-5c109676><i class=\"el-icon-circle-plus\" data-v-5c109676></i></div> <div data-v-5c109676>添加新地址</div></div></div></div>")],2),_vm._ssrNode(" "),_c('el-dialog',{attrs:{"title":_vm.dialogTitle,"visible":_vm.centerDialogVisible,"close-on-click-modal":false,"width":"600px;height:500px;overflow-y: auto;"},on:{"update:visible":function($event){_vm.centerDialogVisible=$event}}},[_c('el-form',{ref:"ruleForm",staticClass:"ruleForm",attrs:{"model":_vm.ruleForm,"rules":_vm.rules,"label-width":"100px"}},[_c('el-form-item',{attrs:{"label":"联系人","prop":"name"}},[_c('el-input',{attrs:{"clearable":"","maxlength":"20","placeholder":"请输入姓名"},model:{value:(_vm.ruleForm.name),callback:function ($$v) {_vm.$set(_vm.ruleForm, "name", $$v)},expression:"ruleForm.name"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"手机号","prop":"cellphone"}},[_c('el-input',{attrs:{"clearable":"","maxlength":"11","placeholder":"请输入手机号"},model:{value:(_vm.ruleForm.cellphone),callback:function ($$v) {_vm.$set(_vm.ruleForm, "cellphone", $$v)},expression:"ruleForm.cellphone"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"地址","prop":"location"}},[(_vm.ruleForm.longitude)?_c('div',[_vm._v(_vm._s(_vm.ruleForm.location)+"("+_vm._s(_vm.ruleForm.address)+")")]):_c('div',[_vm._v("请在地图中选择地址")]),_vm._v(" "),(_vm.ruleForm.longitude)?_c('iframe',{staticClass:"iframe",attrs:{"height":"500","frameborder":"0","src":(_vm.src + "&coord=" + (_vm.ruleForm.latitude) + "," + (_vm.ruleForm.longitude))}}):_c('iframe',{staticClass:"iframe",attrs:{"height":"500","frameborder":"0","src":_vm.src}})]),_vm._v(" "),_c('el-form-item',{attrs:{"label":"门牌号","prop":"house"}},[_c('el-input',{attrs:{"clearable":"","maxlength":"80","placeholder":"请输入门牌号"},model:{value:(_vm.ruleForm.house),callback:function ($$v) {_vm.$set(_vm.ruleForm, "house", $$v)},expression:"ruleForm.house"}})],1)],1),_vm._v(" "),_c('span',{staticClass:"dialog-footer",attrs:{"slot":"footer"},slot:"footer"},[_c('el-button',{attrs:{"loading":_vm.buttonLoading},on:{"click":function($event){_vm.centerDialogVisible = false}}},[_vm._v("取 消")]),_vm._v(" "),_c('el-button',{attrs:{"loading":_vm.buttonLoading,"type":"danger"},on:{"click":function($event){return _vm.submitForm('ruleForm')}}},[_vm._v("确 定")])],1)],1)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./components/Address/list.vue?vue&type=template&id=5c109676&scoped=true&

// EXTERNAL MODULE: ./components/Address/js/list.js
var list = __webpack_require__(190);

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
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./components/Address/list.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(193)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  Address_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "5c109676",
  "75dc8bfa"
  
)

/* harmony default export */ var Address_list = __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 193:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_5c109676_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(180);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_5c109676_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_5c109676_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_5c109676_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_5c109676_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 194:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".address-list[data-v-5c109676]{display:flex;flex-wrap:wrap;align-content:center}.address-list .address-item[data-v-5c109676]{width:25%;padding-right:10px;padding-bottom:10px}.address-list .address-item .item[data-v-5c109676]{cursor:pointer;border:1px solid #e0e0e0;display:flex;justify-content:center;align-items:center;height:180px}.address-list .address-item .item .add-desc[data-v-5c109676]{text-align:center;color:#b0b0b0}.address-list .address-item .item .add-desc i[data-v-5c109676]{color:#e0e0e0;font-size:32px;margin-bottom:10px}.address-list .address-item .item:hover i[data-v-5c109676]{color:#b0b0b0}.address-list .address-item .item-on[data-v-5c109676]{cursor:pointer;border:1px solid #e0e0e0;display:flex;height:180px;padding:20px;position:relative}.address-list .address-item .item-on .address-info[data-v-5c109676]{width:100%;font-size:14px;color:#757575}.address-list .address-item .item-on .address-info .name[data-v-5c109676]{font-size:18px;margin-bottom:20px}.address-list .address-item .item-on .address-info .name span[data-v-5c109676]{color:#fa524c;float:right;font-size:12px}.address-list .address-item .item-on .address-info .address-action[data-v-5c109676]{position:absolute;bottom:20px;right:20px;display:none}.address-list .address-item .item-on:hover .address-action[data-v-5c109676]{display:block}.address-list .address-item .item-on.on[data-v-5c109676]{border:1px solid #fa524c}.iframe[data-v-5c109676]{border:1px solid #dcdfe6}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 197:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(216);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("1a6f2ee4", content, true, context)
};

/***/ }),

/***/ 208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_coupon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(175);

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

/***/ 215:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_use_vue_vue_type_style_index_0_id_27d1b77a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(197);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_use_vue_vue_type_style_index_0_id_27d1b77a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_use_vue_vue_type_style_index_0_id_27d1b77a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_use_vue_vue_type_style_index_0_id_27d1b77a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_use_vue_vue_type_style_index_0_id_27d1b77a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 216:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".coupon[data-v-27d1b77a]{display:flex;justify-content:flex-end}.coupon .tag[data-v-27d1b77a]{line-height:30px;cursor:pointer;border:1px dashed #fa524c;color:#fa524c;text-align:center;padding:0 10px}.ul .li[data-v-27d1b77a]{padding:10px;display:flex;align-items:flex-start}.ul .li .money[data-v-27d1b77a]{color:#fa524c;width:70px;text-align:center;border:1px dashed #fa524c;line-height:25px;padding:0 10px;margin:5px 10px 5px 0}.ul .li .explain[data-v-27d1b77a]{width:220px;padding-right:10px}.ul .li .explain .name[data-v-27d1b77a]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ul .li .button[data-v-27d1b77a]{margin-top:8px}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 241:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/coupon/components/use.vue?vue&type=template&id=27d1b77a&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._ssrNode("<div class=\"coupon\" data-v-27d1b77a>","</div>",[_c('el-popover',{attrs:{"placement":"bottom","width":"400","trigger":"click"},model:{value:(_vm.visible),callback:function ($$v) {_vm.visible=$$v},expression:"visible"}},[_c('div',{staticClass:"ul"},_vm._l((_vm.list),function(item,index){return _c('div',{key:index,staticClass:"li"},[_c('div',{staticClass:"money"},[_c('span',[_vm._v("￥")]),_vm._v(_vm._s(item.cost))]),_vm._v(" "),_c('div',{staticClass:"explain"},[_c('div',{staticClass:"name"},[_vm._v(_vm._s(item.coupon.explain))]),_vm._v(" "),(item.coupon.end_time)?_c('div',{staticClass:"time"},[_vm._v("有效期至"+_vm._s(_vm._f("moment")(item.coupon.end_time,'YYYY.MM.DD')))]):_c('div',{staticClass:"time"},[_vm._v("不限")])]),_vm._v(" "),_c('el-button',{staticClass:"button",attrs:{"type":"primary","size":"mini","loading":_vm.buttonLoading,"disabled":_vm.couponIndex === index},on:{"click":function($event){return _vm.select(item, index)}}},[_vm._v(_vm._s(_vm.couponIndex === index ? '已选' : '选择'))])],1)}),0),_vm._v(" "),_c('div',{staticClass:"tag",attrs:{"slot":"reference"},slot:"reference"},[(_vm.list[_vm.couponIndex])?[_vm._v("\n            "+_vm._s(_vm.list[_vm.couponIndex].coupon.name)+"\n          ")]:[_vm._v("\n            选择优惠券\n          ")],_vm._v(" "),_c('i',{staticClass:"el-icon-caret-bottom"})],2)])],1)])}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/coupon/components/use.vue?vue&type=template&id=27d1b77a&scoped=true&

// EXTERNAL MODULE: ./pages/coupon/components/js/use.js
var use = __webpack_require__(208);

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
  
  var style0 = __webpack_require__(215)
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

/***/ }),

/***/ 263:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(335);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("611e8cfa", content, true, context)
};

/***/ }),

/***/ 318:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./components/Address/list.vue + 4 modules
var list = __webpack_require__(192);

// EXTERNAL MODULE: ./api/shipping.js
var shipping = __webpack_require__(183);

// EXTERNAL MODULE: ./api/goodIndent.js
var goodIndent = __webpack_require__(22);

// EXTERNAL MODULE: ./pages/coupon/components/use.vue + 4 modules
var use = __webpack_require__(241);

// EXTERNAL MODULE: ./plugins/request.js
var request = __webpack_require__(2);

// EXTERNAL MODULE: external "qs"
var external_qs_ = __webpack_require__(7);
var external_qs_default = /*#__PURE__*/__webpack_require__.n(external_qs_);

// CONCATENATED MODULE: ./api/integralCommodity.js


function getDetail(data) {
  data = external_qs_default.a.parse(data);
  return Object(request["a" /* default */])({
    url: 'integralCommodity',
    method: 'POST',
    data
  });
}
// EXTERNAL MODULE: ./api/integralDrawLog.js
var integralDrawLog = __webpack_require__(186);

// EXTERNAL MODULE: ./api/plugin.js
var api_plugin = __webpack_require__(39);

// CONCATENATED MODULE: ./pages/indent/js/create.js







/* harmony default export */ var create = __webpack_exports__["default"] = ({
  components: {
    addressList: list["default"],
    coupon: use["default"]
  },
  layout: 'cart',
  middleware: 'auth',

  head() {
    return {
      title: '确认订单' + '-' + "DSSHOP商城-跨终端商城解决方案"
    };
  },

  data() {
    const validateRemark = (rule, value, callback) => {
      const flag = new RegExp("[`~!@#$^&*()=|{}':'\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘：”“'。？ ]");

      if (flag.test(value)) {
        return callback(new Error('不允许输入非法字符'));
      } else {
        callback();
      }
    };

    return {
      loading: true,
      buttonLoading: false,
      total: 0,
      ruleForm: {
        indentCommodity: [],
        address: {},
        remark: '',
        carriage: 0,
        user_coupon_id: 0,
        integral: 0,
        integral_draw_log_id: 0
      },
      couponMoney: 0,
      integralPrice: 0,
      integral: {
        available: 0,
        deductible: 0,
        parities: 0
      },
      rules: {
        remark: [{
          validator: validateRemark,
          trigger: 'blur'
        }]
      },
      verify: {
        coupon: false
      }
    };
  },

  async asyncData(ctx) {
    try {
      let [verifyPluginData] = await Promise.all([Object(api_plugin["a" /* verifyPlugin */])(['coupon'])]);
      return {
        verify: verifyPluginData
      };
    } catch (err) {
      ctx.$errorHandler(err);
    }
  },

  mounted() {
    $nuxt.$store.commit('setCartTitle', '确认订单');

    if ($nuxt.$route.query.integral_draw_log_id) {
      this.ruleForm.integral_draw_log_id = $nuxt.$route.query.integral_draw_log_id;
      this.getIntegralDrawGoodList();
    } else {
      this.getList();
    }
  },

  methods: {
    async getList() {
      let specification = null;
      this.ruleForm.indentCommodity = Object.values(this.store.get("DSSHOP-PC-" + 'OrderList'));
      const data = [];
      this.ruleForm.indentCommodity.forEach(item => {
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
          data.push({
            ids: item.good_id,
            price: item.good_sku.price,
            skuIds: item.good_sku_id
          });
        }
      });
      this.getDetailData(data);
    },

    //中奖奖品订单
    getIntegralDrawGoodList() {
      const data = [];
      Object(integralDrawLog["b" /* good */])(this.ruleForm.integral_draw_log_id).then(item => {
        let specification = null;
        this.ruleForm.indentCommodity = item;
        this.ruleForm.indentCommodity.forEach(item => {
          this.total += item.price * item.number;
          item.product_sku.forEach(item2 => {
            if (specification) {
              specification += item2.value + ';';
            } else {
              specification = item2.value + ';';
            }
          });
          item.specification = specification.substr(0, specification.length - 1);
          data.push({
            ids: item.good_id,
            price: item.price,
            skuIds: item.good_sku_id
          });
        });
      });
      this.getDetailData(data);
    },

    // 选择的地址
    selectedAddress(res) {
      this.buttonLoading = true;
      this.ruleForm.address = res;
      Object(shipping["e" /* freight */])(res.id, this.ruleForm.indentCommodity).then(response => {
        this.ruleForm.carriage = response.carriage;
        this.buttonLoading = false;
      });
    },

    // 提交订单
    submit() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (!this.ruleForm.address) {
            this.$message({
              message: '请选择地址',
              type: 'error'
            });
            return false;
          }

          this.buttonLoading = true;
          Object(goodIndent["c" /* create */])(this.ruleForm).then(response => {
            this.buttonLoading = false;
            this.store.remove("DSSHOP-PC-" + 'CartList');
            this.store.remove("DSSHOP-PC-" + 'OrderList');
            Object(goodIndent["a" /* addShoppingCart */])([]);
            $nuxt.$router.replace({
              path: '/money/pay',
              query: {
                id: response
              }
            });
          }).catch(() => {
            this.buttonLoading = false;
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    go() {
      $nuxt.$router.go(-1);
    },

    // 选择优惠券
    calcTotal(item) {
      if (item) {
        this.couponMoney = item.cost;
        this.ruleForm.user_coupon_id = item.id;
      }
    },

    // 获取积分商品信息
    getDetailData(row) {
      getDetail(row).then(response => {
        this.integral.available = response.available;
        this.integral.deductible = response.deductible;
        this.integral.parities = response.parities;

        if (this.integral.available >= this.integral.deductible) {
          this.ruleForm.integral = this.integral.deductible;
          this.integralPrice = this.integral.deductible * this.integral.parities * 100 / 100;
        } else {
          this.ruleForm.integral = this.integral.available;
          this.integralPrice = this.integral.available * this.integral.parities * 100 / 100;
        }
      });
    },

    // 自定义积分
    numberIntegral(value) {
      this.integralPrice = value * this.integral.parities * 100 / 100;
    }

  }
});

/***/ }),

/***/ 334:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_create_vue_vue_type_style_index_0_id_3b379ecf_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(263);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_create_vue_vue_type_style_index_0_id_3b379ecf_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_create_vue_vue_type_style_index_0_id_3b379ecf_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_create_vue_vue_type_style_index_0_id_3b379ecf_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_create_vue_vue_type_style_index_0_id_3b379ecf_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 335:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".remark[data-v-3b379ecf]{margin-top:30px}.specification[data-v-3b379ecf]{color:#999}.indent-create[data-v-3b379ecf]{margin-top:40px;margin-bottom:40px}.indent-create .address-box .title[data-v-3b379ecf]{color:#333;font-size:18px;margin-bottom:20px}.indent-create .address-box .address-box-list[data-v-3b379ecf]{margin-bottom:20px}.indent-create .address-box .count-detail[data-v-3b379ecf]{margin-top:50px;text-align:right}.indent-create .address-box .count-detail .bill-item[data-v-3b379ecf]{display:flex;justify-content:flex-end;line-height:35px;color:#757575;font-size:14px}.indent-create .address-box .count-detail .bill-item .bill-money[data-v-3b379ecf]{width:80px;color:#fa524c}.indent-create .address-box .count-detail .bill-item .bill-name[data-v-3b379ecf]{display:flex}.indent-create .address-box .count-detail .bill-item .bill-name .price[data-v-3b379ecf]{color:#fa524c;font-size:30px;position:relative;top:-5px;margin-right:5px;margin-left:5px}.indent-create .address-box .count-detail .bill-item .bill-name .unit[data-v-3b379ecf]{color:#fa524c}.indent-create .operation[data-v-3b379ecf]{display:flex;justify-content:flex-end}.integrall-popover[data-v-3b379ecf]{position:relative;top:0;margin-right:5px}.input-number[data-v-3b379ecf]{margin:0 5px}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 402:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/indent/create.vue?vue&type=template&id=3b379ecf&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_c('el-card',{staticClass:"container indent-create",attrs:{"shadow":"always"}},[_c('div',{staticClass:"address-box"},[_c('div',{staticClass:"title"},[_vm._v("收货地址")]),_vm._v(" "),_c('address-list',{staticClass:"address-box-list",attrs:{"select":true},on:{"selectedAddress":_vm.selectedAddress}}),_vm._v(" "),_c('div',{staticClass:"title"},[_vm._v("确认订单信息")]),_vm._v(" "),_c('el-table',{ref:"table",staticClass:"table",attrs:{"data":_vm.ruleForm.indentCommodity}},[_c('el-table-column',{attrs:{"align":"center","width":"100"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('NuxtLink',{attrs:{"to":{ path: ("/product/detail/" + (scope.row.good_id))}}},[_c('el-image',{staticClass:"image",attrs:{"src":_vm._f("smallImage")(scope.row.img,80),"fit":"cover"}})],1)]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"商品名称"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('NuxtLink',{attrs:{"to":{ path: ("/product/detail/" + (scope.row.good_id))}}},[_c('p',[_vm._v(_vm._s(scope.row.name))]),_vm._v(" "),_c('p',{staticClass:"specification"},[_vm._v(_vm._s(scope.row.specification))])])]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"单价","width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n            "+_vm._s(_vm._f("thousands")(scope.row.price))+"\n          ")]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"数量","width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n            "+_vm._s(scope.row.number)+"\n          ")]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"小计","width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n            "+_vm._s(_vm._f("thousands")((scope.row.price * scope.row.number)))+"\n          ")]}}])})],1),_vm._v(" "),_c('el-form',{ref:"ruleForm",staticClass:"remark",attrs:{"model":_vm.ruleForm,"rules":_vm.rules}},[_c('el-form-item',{attrs:{"prop":"remark"}},[_c('el-input',{attrs:{"type":"textarea","autosize":{ minRows: 2, maxRows: 4},"placeholder":"请输入备注信息","maxlength":"200","show-word-limit":""},model:{value:(_vm.ruleForm.remark),callback:function ($$v) {_vm.$set(_vm.ruleForm, "remark", $$v)},expression:"ruleForm.remark"}})],1)],1),_vm._v(" "),(!_vm.ruleForm.integral_draw_log_id && _vm.verify.coupon)?_c('coupon',{attrs:{"money":_vm.total},on:{"select":_vm.calcTotal}}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"count-detail"},[_c('div',{staticClass:"bill-item"},[_c('div',{staticClass:"bill-name"},[_vm._v("商品件数：")]),_vm._v(" "),_c('div',{staticClass:"bill-money"},[_vm._v(_vm._s(_vm.ruleForm.indentCommodity.length)+"件")])]),_vm._v(" "),_c('div',{staticClass:"bill-item"},[_c('div',{staticClass:"bill-name"},[_vm._v("商品总价：")]),_vm._v(" "),_c('div',{staticClass:"bill-money"},[_vm._v(_vm._s(_vm._f("thousands")(_vm.total))+"元")])]),_vm._v(" "),(!_vm.ruleForm.integral_draw_log_id)?_c('div',{staticClass:"bill-item"},[_c('div',{staticClass:"bill-name"},[_vm._v("优惠金额：")]),_vm._v(" "),_c('div',{staticClass:"bill-money"},[_vm._v("-"+_vm._s(_vm._f("thousands")(_vm.couponMoney))+"元")])]):_vm._e(),_vm._v(" "),(!_vm.ruleForm.integral_draw_log_id)?_c('div',{staticClass:"bill-item"},[_c('div',{staticClass:"bill-name"},[_vm._v("运费：")]),_vm._v(" "),_c('div',{staticClass:"bill-money"},[_vm._v(_vm._s(_vm._f("thousands")(_vm.ruleForm.carriage))+"元")])]):_vm._e(),_vm._v(" "),(_vm.integral.deductible && _vm.integral.available)?_c('div',{staticClass:"bill-item"},[_c('div',{staticClass:"bill-name"},[_c('el-popover',{attrs:{"placement":"top-start","width":"200","trigger":"hover","content":("你有个" + (_vm.integral.available) + "，可用" + (_vm.integral.deductible) + "个")}},[_c('i',{staticClass:"integrall-popover el-icon-warning-outline",attrs:{"slot":"reference"},slot:"reference"})]),_vm._v("\n            使用"),_c('el-input-number',{staticClass:"input-number",attrs:{"controls-position":"right","min":0,"max":_vm.integral.deductible > _vm.integral.available ? _vm.integral.available : _vm.integral.deductible},on:{"change":_vm.numberIntegral},model:{value:(_vm.ruleForm.integral),callback:function ($$v) {_vm.$set(_vm.ruleForm, "integral", $$v)},expression:"ruleForm.integral"}}),_vm._v("积分抵扣"+_vm._s(_vm.integralPrice)+"元：")],1),_vm._v(" "),_c('div',{staticClass:"bill-money"},[_vm._v("-"+_vm._s(_vm.integralPrice)+"元")])]):_vm._e(),_vm._v(" "),_c('div'),_vm._v(" "),_c('div',{staticClass:"bill-item",staticStyle:{"margin-top":"10px"}},[_c('div',{staticClass:"bill-name"},[_c('div',{staticClass:"name"},[_vm._v("应付总额：")]),_vm._v(" "),(_vm.ruleForm.integral_draw_log_id)?_c('div',{staticClass:"price"},[_vm._v("0.00")]):_c('div',{staticClass:"price"},[_vm._v(_vm._s(_vm._f("thousands")((((_vm.ruleForm.carriage+_vm.total-_vm.couponMoney)*100-_vm.integralPrice*100)/100))))]),_vm._v(" "),_c('div',{staticClass:"unit"},[_vm._v("元")])])])]),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('div',{staticClass:"operation"},[(!_vm.ruleForm.integral_draw_log_id)?_c('el-button',{attrs:{"plain":"","loading":_vm.buttonLoading},on:{"click":_vm.go}},[_vm._v("返回购物车")]):_vm._e(),_vm._v(" "),_c('el-button',{attrs:{"type":"danger","loading":_vm.buttonLoading},on:{"click":_vm.submit}},[_vm._v("去结算")])],1)],1)])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/indent/create.vue?vue&type=template&id=3b379ecf&scoped=true&

// EXTERNAL MODULE: ./pages/indent/js/create.js + 1 modules
var create = __webpack_require__(318);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/indent/create.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var createvue_type_script_lang_js_ = (create["default"]);
// CONCATENATED MODULE: ./pages/indent/create.vue?vue&type=script&lang=js&
 /* harmony default export */ var indent_createvue_type_script_lang_js_ = (createvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/indent/create.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(334)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  indent_createvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "3b379ecf",
  "b64b3a2a"
  
)

/* harmony default export */ var indent_create = __webpack_exports__["default"] = (component.exports);

/* nuxt-component-imports */
installComponents(component, {AddressList: __webpack_require__(192).default})


/***/ })

};;
//# sourceMappingURL=create.js.map