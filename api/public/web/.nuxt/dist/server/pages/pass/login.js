exports.ids = [31,29];
exports.modules = {

/***/ 210:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_login__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(37);
/* harmony import */ var _api_banner__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(38);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(vuex__WEBPACK_IMPORTED_MODULE_2__);



/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'login',

  head() {
    return {
      title: '登录' + '-' + "DSSHOP商城-跨终端商城解决方案"
    };
  },

  async asyncData(ctx) {
    try {
      let banner = {};
      await Object(_api_banner__WEBPACK_IMPORTED_MODULE_1__[/* getList */ "a"])({
        limit: 1,
        type: 2,
        state: 0,
        sort: '+sort'
      }).then(response => {
        if (response.total === 1) {
          banner = response.data[0];
          banner.url = banner.url ? banner.url.replace('?id=', '/') : '';
        }
      });
      return {
        banner: banner
      };
    } catch (err) {
      ctx.$errorHandler(err);
    }
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

    return {
      method: 1,
      ruleForm: {
        cellphone: '',
        password: '',
        remember: false
      },
      loading: false,
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
        }]
      },
      banner: {}
    };
  },

  beforeDestroy() {
    clearInterval(this.codeTimer);
  },

  methods: { ...Object(vuex__WEBPACK_IMPORTED_MODULE_2__["mapMutations"])(['login']),

    setMethod(index) {
      this.method = index;
    },

    toLogin() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          Object(_api_login__WEBPACK_IMPORTED_MODULE_0__[/* login */ "f"])(this.ruleForm).then(response => {
            response.remember = this.ruleForm.remember;
            this.login(response);
            this.$message({
              message: '登录成功',
              type: 'success'
            });
            this.loading = false;
            const route = this.store.get('route');

            if (route) {
              this.store.remove('route');
              this.$router.replace({
                path: route.path,
                query: route.query
              });
            } else {
              $nuxt.$router.replace('/user/portal');
            }
          }).catch(() => {
            this.loading = false;
          });
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
var content = __webpack_require__(266);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("231cdee1", content, true, context)
};

/***/ }),

/***/ 265:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_148c1df0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(211);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_148c1df0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_148c1df0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_148c1df0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_148c1df0_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 266:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".banner-panel[data-v-148c1df0]{width:100%;height:588px;background-repeat:no-repeat;background-position:top;position:relative}.banner-panel .link[data-v-148c1df0]{position:absolute;left:0;top:0;display:block;height:588px;width:800px}.banner-panel .form[data-v-148c1df0]{margin:40px 0;height:508px}.banner-panel .form .login-method[data-v-148c1df0]{text-align:center;font-size:26px;padding:30px 0}.banner-panel .form .login-method span[data-v-148c1df0]{cursor:pointer}.banner-panel .form .login-method .on[data-v-148c1df0],.banner-panel .form .login-method span[data-v-148c1df0]:hover{color:#fa524c}.banner-panel .form .button[data-v-148c1df0]{width:100%}.banner-panel .form .other[data-v-148c1df0]{margin-top:50px;text-align:center}.banner-panel .form .other a[data-v-148c1df0]{color:#999}.banner-panel .form .other a[data-v-148c1df0]:hover{color:#fa524c}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 312:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/pass/login.vue?vue&type=template&id=148c1df0&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"login"},[_vm._ssrNode("<div class=\"banner-panel\""+(_vm._ssrStyle(null,{backgroundImage: ("url(" + (_vm.banner.resources.img) + ")")}, null))+" data-v-148c1df0>","</div>",[_vm._ssrNode("<div class=\"container\" data-v-148c1df0>","</div>",[_c('el-row',{attrs:{"gutter":24}},[_c('el-col',{attrs:{"span":8,"offset":16}},[_c('NuxtLink',{staticClass:"link",attrs:{"to":_vm.banner.url.split('pages/').join('')}}),_vm._v(" "),_c('el-card',{staticClass:"form",attrs:{"shadow":"hover"}},[_c('div',{staticClass:"login-method"},[_c('span',{class:{on:_vm.method === 1},on:{"click":function($event){return _vm.setMethod(1)}}},[_vm._v("账号登录")])]),_vm._v(" "),(_vm.method === 1)?_c('div',[_c('el-form',{ref:"ruleForm",attrs:{"model":_vm.ruleForm,"rules":_vm.rules}},[_c('el-form-item',{attrs:{"prop":"cellphone"}},[_c('el-input',{attrs:{"maxlength":"11","placeholder":"请输入手机号码","clearable":""},model:{value:(_vm.ruleForm.cellphone),callback:function ($$v) {_vm.$set(_vm.ruleForm, "cellphone", $$v)},expression:"ruleForm.cellphone"}},[_c('i',{staticClass:"iconfont dsshop-ziyuan",attrs:{"slot":"prefix"},slot:"prefix"})])],1),_vm._v(" "),_c('el-form-item',{attrs:{"prop":"password"}},[_c('el-input',{attrs:{"placeholder":"请输入密码","show-password":"","clearable":""},model:{value:(_vm.ruleForm.password),callback:function ($$v) {_vm.$set(_vm.ruleForm, "password", $$v)},expression:"ruleForm.password"}},[_c('i',{staticClass:"iconfont dsshop-mima",attrs:{"slot":"prefix"},slot:"prefix"})])],1),_vm._v(" "),_c('el-form-item',[_c('el-checkbox',{model:{value:(_vm.ruleForm.remember),callback:function ($$v) {_vm.$set(_vm.ruleForm, "remember", $$v)},expression:"ruleForm.remember"}},[_vm._v("记住密码")])],1),_vm._v(" "),_c('el-button',{staticClass:"button",attrs:{"type":"danger","loading":_vm.loading},on:{"click":_vm.toLogin}},[_vm._v("登录")])],1),_vm._v(" "),_c('div',{staticClass:"other"},[_c('NuxtLink',{attrs:{"to":"/pass/register"}},[_vm._v("立即注册")]),_vm._v(" "),_c('el-divider',{attrs:{"direction":"vertical"}}),_vm._v(" "),_c('NuxtLink',{attrs:{"to":"/pass/findPassword"}},[_vm._v("忘记密码？")])],1)],1):_vm._e()])],1)],1)],1)])])}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/pass/login.vue?vue&type=template&id=148c1df0&scoped=true&

// EXTERNAL MODULE: ./pages/pass/js/login.js
var login = __webpack_require__(210);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/pass/login.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var loginvue_type_script_lang_js_ = (login["default"]);
// CONCATENATED MODULE: ./pages/pass/login.vue?vue&type=script&lang=js&
 /* harmony default export */ var pass_loginvue_type_script_lang_js_ = (loginvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/pass/login.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(265)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pass_loginvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "148c1df0",
  "2f44f4af"
  
)

/* harmony default export */ var pass_login = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=login.js.map