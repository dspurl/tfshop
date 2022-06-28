exports.ids = [49,47];
exports.modules = {

/***/ 273:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(351);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("2d58b930", content, true, context)
};

/***/ }),

/***/ 326:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./api/login.js
var login = __webpack_require__(39);

// EXTERNAL MODULE: ./plugins/request.js
var request = __webpack_require__(2);

// EXTERNAL MODULE: external "qs"
var external_qs_ = __webpack_require__(7);
var external_qs_default = /*#__PURE__*/__webpack_require__.n(external_qs_);

// CONCATENATED MODULE: ./api/sweepLogin.js


function code() {
  return Object(request["a" /* default */])({
    url: 'sweepLogin',
    method: 'GET'
  });
}
function verify(data) {
  data = external_qs_default.a.parse(data);
  return Object(request["a" /* default */])({
    url: 'sweepLogin/verify',
    method: 'POST',
    data
  });
}
function index(data) {
  data = external_qs_default.a.parse(data);
  return Object(request["a" /* default */])({
    url: 'sweepLogin',
    method: 'POST',
    data
  });
}
// EXTERNAL MODULE: ./api/plugin.js
var api_plugin = __webpack_require__(38);

// EXTERNAL MODULE: external "vuex"
var external_vuex_ = __webpack_require__(13);

// CONCATENATED MODULE: ./pages/pass/js/login.js




/* harmony default export */ var js_login = __webpack_exports__["default"] = ({
  layout: 'login',

  head() {
    return {
      title: '登录' + '-' + "DSSHOP商城-跨终端商城解决方案"
    };
  },

  async asyncData(ctx) {
    try {
      let isSweepLogin = false;
      await Object(api_plugin["a" /* verifyPlugin */])('sweepLogin').then(response => {
        isSweepLogin = response.sweepLogin;
      });
      return {
        isSweepLogin: isSweepLogin
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
      isSweepLogin: false,
      method: 1,
      codeLoading: false,
      codeImg: '',
      codeTimer: null,
      codeState: 0,
      codeTime: 0,
      codeUuid: 0,
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
      }
    };
  },

  beforeDestroy() {
    clearInterval(this.codeTimer);
  },

  methods: { ...Object(external_vuex_["mapMutations"])(['login']),

    setMethod(index) {
      this.method = index;

      if (index === 2) {
        this.getCode();
      }
    },

    // 获取二维码
    getCode() {
      this.codeLoading = true;
      this.codeState = 0;

      if (this.codeTimer) {
        clearInterval(this.codeTimer);
      }

      code().then(response => {
        this.codeImg = response.code;
        this.codeTime = response.expires_in;
        this.codeUuid = response.uuid;
        this.codeTimer = setInterval(this.getRefreshCode, 2000);
      }).finally(() => {
        this.codeLoading = false;
      });
    },

    // 刷新登录状态
    getRefreshCode() {
      this.codeTime = this.codeTime - 1;

      if (this.codeTime === 0) {
        clearInterval(this.codeTimer);
        this.codeState = 4;
      } else {
        verify({
          uuid: this.codeUuid
        }).then(response => {
          this.codeState = response.state;

          if (this.codeState !== 0 && this.codeState !== 1) {
            clearInterval(this.codeTimer);
          }

          if (this.codeState === 2) {
            index({
              uuid: this.codeUuid
            }).then(response => {
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
    },

    toLogin() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          Object(login["f" /* login */])(this.ruleForm).then(response => {
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

/***/ 350:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_21179ad1_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(273);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_21179ad1_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_21179ad1_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_21179ad1_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_21179ad1_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 351:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".banner-panel[data-v-21179ad1]{width:100%;height:588px;background-repeat:no-repeat;background-position:top;position:relative}.banner-panel .qr-code[data-v-21179ad1]{text-align:center;margin-top:30px}.banner-panel .qr-code .qr[data-v-21179ad1]{position:relative;margin:0 auto;border:1px solid #f4f4f4;padding:8px;width:155px;height:155px}.banner-panel .qr-code .qr .lose-efficacy[data-v-21179ad1]{position:absolute;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,.7)}.banner-panel .qr-code .qr .lose-efficacy .name[data-v-21179ad1]{margin-top:50px;color:#fff;font-size:16px}.banner-panel .qr-code .qr .lose-efficacy .flush[data-v-21179ad1]{margin-top:10px}.banner-panel .qr-code .explain[data-v-21179ad1]{font-size:12px;margin:20px 0}.banner-panel .qr-code .explain span[data-v-21179ad1]{color:#fa524c;margin:0 5px}.banner-panel .qr-code .advantage[data-v-21179ad1]{display:flex;color:#999;justify-content:center}.banner-panel .qr-code .advantage div[data-v-21179ad1]{margin:0 10px}.banner-panel .qr-code .advantage div i[data-v-21179ad1]{padding-right:3px;color:#e2e1e5}.banner-panel .link[data-v-21179ad1]{position:absolute;left:0;top:0;display:block;height:588px;width:800px}.banner-panel .form[data-v-21179ad1]{margin:40px 0;height:508px}.banner-panel .form .login-method[data-v-21179ad1]{text-align:center;font-size:26px;padding:30px 0}.banner-panel .form .login-method span[data-v-21179ad1]{cursor:pointer}.banner-panel .form .login-method .on[data-v-21179ad1],.banner-panel .form .login-method span[data-v-21179ad1]:hover{color:#fa524c}.banner-panel .form .button[data-v-21179ad1]{width:100%}.banner-panel .form .other[data-v-21179ad1]{margin-top:50px;text-align:center}.banner-panel .form .other a[data-v-21179ad1]{color:#999}.banner-panel .form .other a[data-v-21179ad1]:hover{color:#fa524c}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 415:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/pass/login.vue?vue&type=template&id=21179ad1&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"login"},[_vm._ssrNode("<div class=\"banner-panel\" style=\"background-image: url('//cdn.cnbj1.fds.api.mi-img.com/mi-mall/72644d9b8031286de3cc74e151aefd90.jpg');\" data-v-21179ad1>","</div>",[_vm._ssrNode("<div class=\"container\" data-v-21179ad1>","</div>",[_c('el-row',{attrs:{"gutter":24}},[_c('el-col',{attrs:{"span":8,"offset":16}},[_c('NuxtLink',{staticClass:"link",attrs:{"to":"/pass/login"}}),_vm._v(" "),_c('el-card',{staticClass:"form",attrs:{"shadow":"hover"}},[_c('div',{staticClass:"login-method"},[_c('span',{class:{on:_vm.method === 1},on:{"click":function($event){return _vm.setMethod(1)}}},[_vm._v("账号登录")]),_vm._v(" "),(_vm.isSweepLogin)?[_c('el-divider',{attrs:{"direction":"vertical"}}),_vm._v(" "),_c('span',{class:{on:_vm.method === 2},on:{"click":function($event){return _vm.setMethod(2)}}},[_vm._v("扫码登录")])]:_vm._e()],2),_vm._v(" "),(_vm.method === 1)?_c('div',[_c('el-form',{ref:"ruleForm",attrs:{"model":_vm.ruleForm,"rules":_vm.rules}},[_c('el-form-item',{attrs:{"prop":"cellphone"}},[_c('el-input',{attrs:{"maxlength":"11","placeholder":"请输入手机号码","clearable":""},model:{value:(_vm.ruleForm.cellphone),callback:function ($$v) {_vm.$set(_vm.ruleForm, "cellphone", $$v)},expression:"ruleForm.cellphone"}},[_c('i',{staticClass:"iconfont dsshop-ziyuan",attrs:{"slot":"prefix"},slot:"prefix"})])],1),_vm._v(" "),_c('el-form-item',{attrs:{"prop":"password"}},[_c('el-input',{attrs:{"placeholder":"请输入密码","show-password":"","clearable":""},model:{value:(_vm.ruleForm.password),callback:function ($$v) {_vm.$set(_vm.ruleForm, "password", $$v)},expression:"ruleForm.password"}},[_c('i',{staticClass:"iconfont dsshop-mima",attrs:{"slot":"prefix"},slot:"prefix"})])],1),_vm._v(" "),_c('el-form-item',[_c('el-checkbox',{model:{value:(_vm.ruleForm.remember),callback:function ($$v) {_vm.$set(_vm.ruleForm, "remember", $$v)},expression:"ruleForm.remember"}},[_vm._v("记住密码")])],1),_vm._v(" "),_c('el-button',{staticClass:"button",attrs:{"type":"danger","loading":_vm.loading},on:{"click":_vm.toLogin}},[_vm._v("登录")])],1),_vm._v(" "),_c('div',{staticClass:"other"},[_c('NuxtLink',{attrs:{"to":"/pass/register"}},[_vm._v("立即注册")]),_vm._v(" "),_c('el-divider',{attrs:{"direction":"vertical"}}),_vm._v(" "),_c('NuxtLink',{attrs:{"to":"/pass/findPassword"}},[_vm._v("忘记密码？")])],1)],1):_c('div',[_c('div',{staticClass:"qr-code"},[_c('div',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.codeLoading),expression:"codeLoading"}],staticClass:"qr"},[_c('el-image',{staticClass:"image",attrs:{"src":_vm.codeImg,"fit":"scale-down"}}),_vm._v(" "),(_vm.codeState === 1)?_c('div',{staticClass:"lose-efficacy"},[_c('div',{staticClass:"name"},[_vm._v("扫码成功")]),_vm._v(" "),_c('el-button',{staticClass:"flush",attrs:{"size":"mini","type":"danger"},on:{"click":function($event){return _vm.getCode()}}},[_vm._v("重新扫码")])],1):(_vm.codeState === 3)?_c('div',{staticClass:"lose-efficacy"},[_c('div',{staticClass:"name"},[_vm._v("扫码失败")]),_vm._v(" "),_c('el-button',{staticClass:"flush",attrs:{"size":"mini","type":"danger"},on:{"click":function($event){return _vm.getCode()}}},[_vm._v("重新扫码")])],1):(_vm.codeState === 4)?_c('div',{staticClass:"lose-efficacy"},[_c('div',{staticClass:"name"},[_vm._v("二维码已失效")]),_vm._v(" "),_c('el-button',{staticClass:"flush",attrs:{"size":"mini","type":"danger"},on:{"click":function($event){return _vm.getCode()}}},[_vm._v("刷新")])],1):_vm._e()],1),_vm._v(" "),(_vm.codeState === 1)?_c('div',{staticClass:"explain"},[_vm._v("请在手机完成授权登录")]):(_vm.codeState === 3)?_c('div',{staticClass:"explain"},[_vm._v("您拒绝授权，尝试重新扫码")]):_c('div',{staticClass:"explain"},[_vm._v("使用"),_c('span',[_vm._v("微信")]),_vm._v("扫描二维码")]),_vm._v(" "),_c('div',{staticClass:"advantage"},[_c('div',[_c('i',{staticClass:"iconfont dsshop-kuai"}),_vm._v("更快")]),_vm._v(" "),_c('div',[_c('i',{staticClass:"iconfont dsshop-anquanzhuye"}),_vm._v("更安全")]),_vm._v(" "),_c('div',[_c('i',{staticClass:"iconfont dsshop-shurukuang"}),_vm._v("免输入")])])])])])],1)],1)],1)])])}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/pass/login.vue?vue&type=template&id=21179ad1&scoped=true&

// EXTERNAL MODULE: ./pages/pass/js/login.js + 1 modules
var login = __webpack_require__(326);

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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  
  var style0 = __webpack_require__(350)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pass_loginvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "21179ad1",
  "2f44f4af"
  
)

/* harmony default export */ var pass_login = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=login.js.map