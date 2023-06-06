exports.ids = [60,53];
exports.modules = {

/***/ 207:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/portrait.2250589.gif";

/***/ }),

/***/ 236:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(45);
/* harmony import */ var _api_login__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(44);
/* harmony import */ var _plugins_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);



/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',
  head() {
    return {
      title: `${this.$t('user.info')}-${this.$t('header.top.personal_center')}`
    };
  },
  data() {
    return {
      disabled: false,
      codename: this.$t('find_password.get_code'),
      seconds: '',
      unit: '',
      uploadFile: {
        url: "http://dsshop.test/api/v1/app/" + 'uploadPictures',
        header: {
          'apply-secret': "base64:szoJ3mSx/5U7zOsJfU7s4pSahiwdh01x6badmz5FtCM=",
          'Authorization': 'Bearer ' + Object(_plugins_auth__WEBPACK_IMPORTED_MODULE_2__[/* getToken */ "a"])('token')
        },
        data: {
          type: 1,
          size: 1024 * 1024 * 2
        }
      },
      loading: true,
      buttonLoading: false,
      centerDialogVisible: false,
      imgProgressPercent: 0,
      imgProgress: false,
      dialogType: '',
      dialogTitle: '',
      ruleForm: {},
      user: {},
      collectList: [],
      rules: {
        portrait: [{
          required: true,
          message: this.$t('userinfo.portrait'),
          trigger: 'blur'
        }],
        nickname: [{
          required: true,
          message: this.$t('hint.error.import', {
            attribute: this.$t('userinfo.nickname')
          }),
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: this.$t('hint.error.import', {
            attribute: this.$t('userinfo.email')
          }),
          trigger: 'blur'
        }, {
          type: 'email',
          message: this.$t('hint.error.wrong_format', {
            attribute: this.$t('userinfo.email')
          }),
          trigger: ['blur', 'change']
        }],
        code: [{
          required: true,
          message: this.$t('hint.error.import', {
            attribute: this.$t('find_password.verification_code')
          }),
          trigger: 'blur'
        }, {
          type: 'number',
          message: this.$t('find_password.verification_code.number', {
            attribute: this.$t('find_password.verification_code')
          })
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
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.dialogType === 'email') {
            Object(_api_login__WEBPACK_IMPORTED_MODULE_1__[/* verifyEmail */ "i"])(this.ruleForm).then(response => {
              this.buttonLoading = false;
              this.centerDialogVisible = false;
              this.getUser();
              this.$message({
                message: this.$t('common.success'),
                type: 'success'
              });
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            Object(_api_user__WEBPACK_IMPORTED_MODULE_0__[/* edit */ "d"])(this.ruleForm).then(response => {
              this.buttonLoading = false;
              this.centerDialogVisible = false;
              this.getUser();
              this.$message({
                message: this.$t('common.success'),
                type: 'success'
              });
            }).catch(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    modification(type) {
      this.centerDialogVisible = true;
      this.dialogType = type;
      switch (type) {
        case 'portrait':
          this.dialogTitle = this.$t('userinfo.amend_portrait');
          this.ruleForm = {
            portrait: this.user.portrait
          };
          break;
        case 'nickname':
          this.dialogTitle = this.$t('userinfo.amend_nickname');
          this.ruleForm = {
            nickname: this.user.nickname
          };
          break;
        case 'email':
          this.dialogTitle = this.$t('userinfo.amend_email');
          this.ruleForm = {
            email: this.user.email,
            code: ''
          };
          break;
      }
    },
    handleAvatarSuccess(res, file) {
      this.ruleForm.portrait = file.response;
      this.imgProgress = false;
      this.imgProgressPercent = 0;
    },
    // 上传时
    handleProgress(file, fileList) {
      this.imgProgressPercent = file.percent;
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (['image/jpeg', 'image/gif', 'image/png', 'image/bmp'].indexOf(file.type) === -1) {
        this.$message.error(this.$t('userinfo.error.image'));
        return false;
      }
      if (!isLt2M) {
        this.$message.error(this.$t('userinfo.error.image.size'));
      }
      this.imgProgress = true;
      return isLt2M;
    },
    // 获取验证码
    getCode() {
      const that = this;
      this.buttonLoading = true;
      Object(_api_login__WEBPACK_IMPORTED_MODULE_1__[/* emailCode */ "d"])(this.ruleForm).then(response => {
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
            that.disabled = false;
          }
        }, 1000);
        // 模拟验证码发送
        if (response.code) {
          that.ruleForm.code = response.code;
        }
      }).catch(() => {
        this.buttonLoading = false;
      });
    }
  }
});

/***/ }),

/***/ 237:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(293);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(6).default
module.exports.__inject__ = function (context) {
  add("d9345aac", content, true, context)
};

/***/ }),

/***/ 292:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_userinfo_vue_vue_type_style_index_0_id_211ab290_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(237);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_userinfo_vue_vue_type_style_index_0_id_211ab290_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_userinfo_vue_vue_type_style_index_0_id_211ab290_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_userinfo_vue_vue_type_style_index_0_id_211ab290_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_userinfo_vue_vue_type_style_index_0_id_211ab290_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 293:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(5);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".portrait[data-v-211ab290]{cursor:pointer}.ruleForm[data-v-211ab290]{width:500px}.ruleForm .avatar-uploader-icon[data-v-211ab290]{line-height:190px;margin:auto}.ruleForm .code-button[data-v-211ab290]{position:absolute;right:5px;top:6px}.ruleForm a[data-v-211ab290]{position:relative;top:-1px}.user-title[data-v-211ab290]{color:#757575;font-weight:400;font-size:18px;margin-bottom:20px}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 330:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/userinfo.vue?vue&type=template&id=211ab290&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_vm._ssrNode("<div class=\"user-title\" data-v-211ab290>"+_vm._ssrEscape(_vm._s(_vm.$t('user.info')))+"</div> "),_vm._ssrNode("<div class=\"padding-top-20\" data-v-211ab290>","</div>",[_c('el-form',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}],attrs:{"label-width":"200px"}},[_c('el-form-item',{attrs:{"label":_vm.$t('userinfo.head_portrait'),"prop":"portrait"}},[_c('el-avatar',{attrs:{"size":80}},[_c('img',{staticClass:"portrait",attrs:{"src":_vm.user.portrait ? _vm.user.portrait : __webpack_require__(207)},on:{"click":function($event){return _vm.modification('portrait')}}})])],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":_vm.$t('userinfo.nickname'),"prop":"nickname"}},[_c('span',[_vm._v(_vm._s(_vm.user.nickname ? _vm.user.nickname : _vm.$t('userinfo.not_set')))]),_vm._v(" "),_c('el-link',{attrs:{"type":"primary","underline":false},on:{"click":function($event){return _vm.modification('nickname')}}},[_vm._v(_vm._s(_vm.$t('common.amend')))])],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":_vm.$t('userinfo.email'),"prop":"email"}},[_c('span',[_vm._v(_vm._s(_vm.user.email ? _vm.user.email : _vm.$t('userinfo.not_bound')))]),_vm._v(" "),_c('el-link',{attrs:{"type":"primary","underline":false},on:{"click":function($event){return _vm.modification('email')}}},[_vm._v(_vm._s(_vm.$t('common.amend')))])],1)],1)],1),_vm._ssrNode(" "),_c('el-dialog',{attrs:{"title":_vm.dialogTitle,"visible":_vm.centerDialogVisible,"close-on-click-modal":false,"width":"600px"},on:{"update:visible":function($event){_vm.centerDialogVisible=$event}}},[_c('el-form',{ref:"ruleForm",staticClass:"ruleForm",attrs:{"model":_vm.ruleForm,"rules":_vm.rules,"label-width":"100px"}},[(_vm.dialogType === 'portrait')?[_c('el-form-item',{attrs:{"label":_vm.$t('userinfo.head_portrait'),"prop":"portrait"}},[_c('el-upload',{staticClass:"avatar-uploader",attrs:{"show-file-list":false,"on-success":_vm.handleAvatarSuccess,"before-upload":_vm.beforeAvatarUpload,"on-progress":_vm.handleProgress,"action":_vm.uploadFile.url,"headers":_vm.uploadFile.header,"data":_vm.uploadFile.data}},[(_vm.imgProgress)?_c('span',[_c('el-progress',{staticClass:"progress-img",attrs:{"percentage":_vm.imgProgressPercent,"type":"circle"}})],1):_c('span',[(_vm.ruleForm.portrait)?_c('img',{staticClass:"avatar",attrs:{"src":_vm.ruleForm.portrait}}):_c('i',{staticClass:"el-icon-plus avatar-uploader-icon"})]),_vm._v(" "),_c('div',{staticClass:"el-upload__tip",attrs:{"slot":"tip"},slot:"tip"},[_vm._v(_vm._s(_vm.$t('hint.tip.upload', {rmvb: 'jpg/png/gif',size: '2M'})))])])],1)]:(_vm.dialogType === 'nickname')?[_c('el-form-item',{attrs:{"label":_vm.$t('userinfo.nickname'),"prop":"nickname"}},[_c('el-input',{attrs:{"maxlength":"30","placeholder":_vm.$t('hint.error.import', {attribute: _vm.$t('userinfo.nickname')}),"clearable":""},model:{value:(_vm.ruleForm.nickname),callback:function ($$v) {_vm.$set(_vm.ruleForm, "nickname", $$v)},expression:"ruleForm.nickname"}})],1)]:[_c('el-form-item',{attrs:{"label":_vm.$t('userinfo.email'),"prop":"email"}},[_c('el-input',{attrs:{"maxlength":"255","placeholder":_vm.$t('hint.error.import', {attribute: _vm.$t('userinfo.email')}),"clearable":""},model:{value:(_vm.ruleForm.email),callback:function ($$v) {_vm.$set(_vm.ruleForm, "email", $$v)},expression:"ruleForm.email"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":_vm.$t('find_password.verification_code'),"prop":"code"}},[_c('el-input',{attrs:{"maxlength":"5","placeholder":_vm.$t('hint.error.import', {attribute: _vm.$t('find_password.verification_code')}),"clearable":""},model:{value:(_vm.ruleForm.code),callback:function ($$v) {_vm.$set(_vm.ruleForm, "code", _vm._n($$v))},expression:"ruleForm.code"}}),_vm._v(" "),_c('el-button',{staticClass:"code-button",attrs:{"loading":_vm.buttonLoading,"type":"danger","round":"","size":"mini","disabled":_vm.disabled},on:{"click":_vm.getCode}},[_vm._v(_vm._s(_vm.codename + _vm.seconds + _vm.unit))])],1)]],2),_vm._v(" "),_c('span',{staticClass:"dialog-footer",attrs:{"slot":"footer"},slot:"footer"},[_c('el-button',{attrs:{"loading":_vm.buttonLoading},on:{"click":function($event){_vm.centerDialogVisible = false}}},[_vm._v(_vm._s(_vm.$t('common.cancel')))]),_vm._v(" "),_c('el-button',{attrs:{"loading":_vm.buttonLoading,"type":"danger"},on:{"click":_vm.submitForm}},[_vm._v(_vm._s(_vm.$t('common.confirm')))])],1)],1)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/user/userinfo.vue?vue&type=template&id=211ab290&scoped=true&

// EXTERNAL MODULE: ./pages/user/js/userinfo.js
var userinfo = __webpack_require__(236);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/userinfo.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var userinfovue_type_script_lang_js_ = (userinfo["default"]);
// CONCATENATED MODULE: ./pages/user/userinfo.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_userinfovue_type_script_lang_js_ = (userinfovue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(3);

// CONCATENATED MODULE: ./pages/user/userinfo.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(292)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  user_userinfovue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "211ab290",
  "6a41b1a9"
  
)

/* harmony default export */ var user_userinfo = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=userinfo.js.map