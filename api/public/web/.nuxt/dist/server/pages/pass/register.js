exports.ids = [50,48];
exports.modules = {

/***/ 273:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_login__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(38);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'login',

  head() {
    return {
      title: '注册' + '-' + "DSSHOP商城-跨终端商城解决方案"
    };
  },

  data() {
    const validateCellphone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else {
        const myreg = /^1[3456789]\d{9}$/;

        if (!myreg.test(value)) {
          callback(new Error('手机号格式有误'));
        }

        callback();
      }
    };

    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        cellphone: '',
        password: '',
        code: '',
        rPassword: ''
      },
      codename: '获取验证码',
      seconds: '',
      unit: '',
      loading: false,
      codeDisabled: false,
      rules: {
        cellphone: [{
          validator: validateCellphone,
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 5,
          message: '密码长度必须大于5位',
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }, {
          type: 'number',
          message: '验证码必须为数字'
        }],
        rPassword: [{
          validator: validatePass,
          trigger: 'blur'
        }]
      }
    };
  },

  methods: {
    // 获取验证码
    getCode() {
      if (!this.ruleForm.cellphone) {
        this.$message.error('请输入手机号');
        return false;
      }

      const that = this;
      Object(_api_login__WEBPACK_IMPORTED_MODULE_0__[/* cellphoneCode */ "b"])(this.ruleForm).then(response => {
        // 开始倒计时
        this.seconds = 60;
        this.codename = '';
        this.unit = 's';
        this.codeDisabled = true;
        this.timer = setInterval(function () {
          that.seconds = that.seconds - 1;

          if (that.seconds === 0) {
            // 读秒结束 清空计时器
            clearInterval(that.timer);
            that.seconds = '';
            that.codename = '获取验证码';
            that.unit = '';
            that.codeDisabled = false;
          }
        }, 1000); // 模拟短信发送

        if (response.code) {
          that.ruleForm.code = response.code;
        }
      }).catch(() => {});
    },

    toRegister() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          Object(_api_login__WEBPACK_IMPORTED_MODULE_0__[/* register */ "h"])(this.ruleForm).then(() => {
            this.$message({
              message: '注册成功',
              type: 'success'
            });
            this.loading = false;
            $nuxt.$router.replace('/pass/login');
          }).catch(() => {
            this.loading = false;
          });
        }
      });
    }

  }
});

/***/ }),

/***/ 274:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(352);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("12e508c8", content, true, context)
};

/***/ }),

/***/ 351:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_register_vue_vue_type_style_index_0_id_5ffd36cc_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(274);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_register_vue_vue_type_style_index_0_id_5ffd36cc_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_register_vue_vue_type_style_index_0_id_5ffd36cc_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_register_vue_vue_type_style_index_0_id_5ffd36cc_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_register_vue_vue_type_style_index_0_id_5ffd36cc_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 352:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "a[data-v-5ffd36cc]:hover{color:#fa524c}.register[data-v-5ffd36cc]{background-color:#f4f4f4;padding:30px 0}.register .form[data-v-5ffd36cc]{min-height:550px;width:850px;margin:30px auto;text-align:center}.register .form .title[data-v-5ffd36cc]{font-size:30px;margin:30px 0}.register .form .ruleForm[data-v-5ffd36cc]{margin:0 auto;width:350px}.register .form .ruleForm .button[data-v-5ffd36cc]{width:100%}.register .form .ruleForm .code-button[data-v-5ffd36cc]{position:absolute;right:5px;top:6px}.register .form .user-agreement[data-v-5ffd36cc]{margin-top:20px;font-size:12px;color:#999}.register .form .user-agreement a[data-v-5ffd36cc]{margin:0 5px}.register .form .go-login[data-v-5ffd36cc]{text-align:right;font-size:12px;color:#999;margin:10px 230px 0 0}.register .form .go-login a[data-v-5ffd36cc]{margin:0 5px}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 415:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/pass/register.vue?vue&type=template&id=5ffd36cc&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"register"},[_c('el-card',{staticClass:"form",attrs:{"shadow":"hover"}},[_c('div',{staticClass:"title"},[_vm._v("注册DSSHOP帐号")]),_vm._v(" "),_c('el-form',{ref:"ruleForm",staticClass:"ruleForm",attrs:{"model":_vm.ruleForm,"rules":_vm.rules}},[_c('el-form-item',{attrs:{"prop":"cellphone"}},[_c('el-input',{attrs:{"maxlength":"11","placeholder":"请输入手机号码","clearable":""},model:{value:(_vm.ruleForm.cellphone),callback:function ($$v) {_vm.$set(_vm.ruleForm, "cellphone", $$v)},expression:"ruleForm.cellphone"}},[_c('i',{staticClass:"iconfont dsshop-ziyuan",attrs:{"slot":"prefix"},slot:"prefix"})])],1),_vm._v(" "),_c('el-form-item',{attrs:{"prop":"code"}},[_c('el-input',{attrs:{"maxlength":"5","placeholder":"请输入验证码","clearable":""},model:{value:(_vm.ruleForm.code),callback:function ($$v) {_vm.$set(_vm.ruleForm, "code", $$v)},expression:"ruleForm.code"}},[_c('i',{staticClass:"iconfont dsshop-duanxinyanzhengma",attrs:{"slot":"prefix"},slot:"prefix"})]),_vm._v(" "),_c('el-button',{staticClass:"code-button",attrs:{"type":"danger","round":"","size":"mini","disabled":_vm.codeDisabled},on:{"click":_vm.getCode}},[_vm._v(_vm._s(_vm.codename + _vm.seconds + _vm.unit))])],1),_vm._v(" "),_c('el-form-item',{attrs:{"prop":"password"}},[_c('el-input',{attrs:{"placeholder":"请输入密码","show-password":"","clearable":""},model:{value:(_vm.ruleForm.password),callback:function ($$v) {_vm.$set(_vm.ruleForm, "password", $$v)},expression:"ruleForm.password"}},[_c('i',{staticClass:"iconfont dsshop-mima",attrs:{"slot":"prefix"},slot:"prefix"})])],1),_vm._v(" "),_c('el-form-item',{attrs:{"prop":"rPassword"}},[_c('el-input',{attrs:{"placeholder":"请确认密码","show-password":"","clearable":""},model:{value:(_vm.ruleForm.rPassword),callback:function ($$v) {_vm.$set(_vm.ruleForm, "rPassword", $$v)},expression:"ruleForm.rPassword"}},[_c('i',{staticClass:"iconfont dsshop-mima",attrs:{"slot":"prefix"},slot:"prefix"})])],1),_vm._v(" "),_c('el-button',{staticClass:"button",attrs:{"type":"danger","loading":_vm.loading},on:{"click":_vm.toRegister}},[_vm._v("注册")])],1),_vm._v(" "),_c('div',{staticClass:"go-login"},[_vm._v("已有账号？马上去"),_c('NuxtLink',{attrs:{"to":"/pass/login"}},[_vm._v("登录")])],1),_vm._v(" "),_c('div',{staticClass:"user-agreement"},[_vm._v("\n      已阅读并同意：DSSHOP "),_c('NuxtLink',{attrs:{"to":"/pass/register"}},[_vm._v("用户协议")]),_vm._v("和 "),_c('NuxtLink',{attrs:{"to":"/pass/register"}},[_vm._v("隐私政策")])],1)],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/pass/register.vue?vue&type=template&id=5ffd36cc&scoped=true&

// EXTERNAL MODULE: ./pages/pass/js/register.js
var register = __webpack_require__(273);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/pass/register.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var registervue_type_script_lang_js_ = (register["default"]);
// CONCATENATED MODULE: ./pages/pass/register.vue?vue&type=script&lang=js&
 /* harmony default export */ var pass_registervue_type_script_lang_js_ = (registervue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/pass/register.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(351)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pass_registervue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "5ffd36cc",
  "f0719c66"
  
)

/* harmony default export */ var pass_register = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=register.js.map