exports.ids = [39,49];
exports.modules = {

/***/ 229:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(45);
/* harmony import */ var _api_login__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(44);


/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',
  head() {
    return {
      title: `${this.$t('user.cellphone')}-${this.$t('header.top.personal_center')}`
    };
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
      buttonLoading: false,
      loading: true,
      disabled: false,
      codename: this.$t('find_password.get_code'),
      seconds: '',
      cellphone: '',
      unit: '',
      user: {},
      ruleForm: {
        cellphone: '',
        code: '',
        state: 2
      },
      rules: {
        cellphone: [{
          required: true,
          message: this.$t('hint.error.import', {
            attribute: this.$t('cellphone.new')
          }),
          trigger: 'blur'
        }, {
          validator: validateCellphone,
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: this.$t('hint.error.import', {
            attribute: this.$t('find_password.verification_code')
          }),
          trigger: 'blur'
        }]
      }
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    async getUser() {
      await Promise.all([Object(_api_user__WEBPACK_IMPORTED_MODULE_0__[/* detail */ "c"])(this.listQuery)]).then(([userData]) => {
        this.user = userData;
        this.cellphone = JSON.parse(JSON.stringify(userData.cellphone));
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },
    // 获取验证码
    getCode() {
      const that = this;
      this.buttonLoading = true;
      Object(_api_login__WEBPACK_IMPORTED_MODULE_1__[/* cellphoneCode */ "b"])(this.ruleForm).then(response => {
        // 开始倒计时
        this.seconds = 60;
        this.codename = '';
        this.unit = 's';
        this.disabled = true;
        this.buttonLoading = false;
        this.timer = setInterval(function () {
          that.seconds = that.seconds - 1;
          if (that.seconds === 0) {
            // 读秒结束 清空计时器
            clearInterval(that.timer);
            that.seconds = '';
            that.codename = this.$t('find_password.get_code');
            that.unit = '';
            that.codeDisabled = false;
          }
        }, 1000);
        // 模拟验证码发送
        if (response.code) {
          that.ruleForm.code = response.code;
        }
      }).catch(() => {
        this.buttonLoading = false;
      });
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          this.buttonLoading = true;
          Object(_api_login__WEBPACK_IMPORTED_MODULE_1__[/* changeCellphone */ "c"])(this.ruleForm).then(response => {
            this.loading = false;
            this.buttonLoading = false;
            this.getUser();
            this.$refs['ruleForm'].resetFields();
            this.$message({
              message: this.$t('common.success'),
              type: 'success'
            });
          }).catch(() => {
            this.loading = false;
            this.buttonLoading = false;
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
});

/***/ }),

/***/ 230:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(285);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("08eee6da", content, true, context)
};

/***/ }),

/***/ 284:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_cellphone_vue_vue_type_style_index_0_id_7a0d2623_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(230);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_cellphone_vue_vue_type_style_index_0_id_7a0d2623_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_cellphone_vue_vue_type_style_index_0_id_7a0d2623_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_cellphone_vue_vue_type_style_index_0_id_7a0d2623_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_cellphone_vue_vue_type_style_index_0_id_7a0d2623_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 285:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".ruleForm[data-v-7a0d2623]{width:500px}.ruleForm .code-button[data-v-7a0d2623]{position:absolute;right:5px;top:6px}.user-title[data-v-7a0d2623]{color:#757575;font-weight:400;font-size:18px;margin-bottom:20px}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 326:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/cellphone.vue?vue&type=template&id=7a0d2623&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_vm._ssrNode("<div class=\"user-title\" data-v-7a0d2623>"+_vm._ssrEscape(_vm._s(_vm.$t('user.cellphone')))+"</div> "),_vm._ssrNode("<div class=\"padding-top-20\" data-v-7a0d2623>","</div>",[_c('el-form',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}],ref:"ruleForm",staticClass:"ruleForm",attrs:{"model":_vm.ruleForm,"rules":_vm.rules,"label-width":"200px"}},[_c('el-form-item',{attrs:{"label":_vm.$t('cellphone.current')}},[_vm._v("\n        "+_vm._s(_vm.cellphone)+"\n      ")]),_vm._v(" "),_c('el-form-item',{attrs:{"label":_vm.$t('cellphone.new'),"prop":"cellphone"}},[_c('el-input',{attrs:{"maxlength":"11","clearable":"","placeholder":_vm.$t('hint.error.import', {attribute: _vm.$t('cellphone.new')})},model:{value:(_vm.ruleForm.cellphone),callback:function ($$v) {_vm.$set(_vm.ruleForm, "cellphone", $$v)},expression:"ruleForm.cellphone"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":_vm.$t('find_password.verification_code'),"prop":"code"}},[_c('el-input',{attrs:{"maxlength":"5","placeholder":_vm.$t('hint.error.import', {attribute: _vm.$t('find_password.verification_code')}),"clearable":""},model:{value:(_vm.ruleForm.code),callback:function ($$v) {_vm.$set(_vm.ruleForm, "code", $$v)},expression:"ruleForm.code"}}),_vm._v(" "),_c('el-button',{staticClass:"code-button",attrs:{"loading":_vm.buttonLoading,"type":"danger","round":"","size":"mini","disabled":_vm.disabled},on:{"click":_vm.getCode}},[_vm._v(_vm._s(_vm.codename + _vm.seconds + _vm.unit))])],1),_vm._v(" "),_c('el-form-item',[_c('el-button',{attrs:{"loading":_vm.buttonLoading,"type":"danger"},on:{"click":function($event){return _vm.submitForm('ruleForm')}}},[_vm._v(_vm._s(_vm.$t('cellphone.confirm_modification')))]),_vm._v(" "),_c('el-button',{attrs:{"loading":_vm.buttonLoading},on:{"click":function($event){return _vm.resetForm('ruleForm')}}},[_vm._v(_vm._s(_vm.$t('cellphone.reset')))])],1)],1)],1)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/user/cellphone.vue?vue&type=template&id=7a0d2623&scoped=true&

// EXTERNAL MODULE: ./pages/user/js/cellphone.js
var cellphone = __webpack_require__(229);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/cellphone.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var cellphonevue_type_script_lang_js_ = (cellphone["default"]);
// CONCATENATED MODULE: ./pages/user/cellphone.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_cellphonevue_type_script_lang_js_ = (cellphonevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(3);

// CONCATENATED MODULE: ./pages/user/cellphone.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(284)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  user_cellphonevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "7a0d2623",
  "fd1e5f68"
  
)

/* harmony default export */ var user_cellphone = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=cellphone.js.map