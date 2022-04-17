exports.ids = [10,12];
exports.modules = {

/***/ 310:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _plugins_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'AvatarImage',
  props: {
    imgData: {
      type: Object,
      default: function () {
        return {
          type: 1,
          size: 1024 * 1024 * 2,
          specification: [80, 150]
        };
      }
    },
    format: {
      type: Array,
      default: function () {
        return ['image/jpeg', 'image/gif', 'image/png', 'image/bmp'];
      }
    },
    file: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      url: "http://dsshop.test/api/v1/app/" + 'uploadPictures',
      imgHeaders: {
        'apply-secret': "base64:szoJ3mSx/5U7zOsJfU7s4pSahiwdh01x6badmz5FtCM=",
        'Authorization': 'Bearer ' + Object(_plugins_auth__WEBPACK_IMPORTED_MODULE_0__[/* getToken */ "a"])('token')
      }
    };
  },

  watch: {},

  mounted() {},

  methods: {
    // 图片列表上传成功
    handleSuccessList(res, file) {
      this.$emit('getFile', file);
    },

    // 图片列表图片格式大小验证
    beforeUploadList(file) {
      const isLt = file.size < this.imgData.size;

      if (this.format.indexOf(file.type) === -1) {
        this.$message.error('请上传正确的文件格式');
        return false;
      }

      if (!isLt) {
        this.$message.error('上传文件大小不能超过 ' + file.size / 1024 / 1024 + 'MB!');
      }

      return isLt;
    }

  }
});

/***/ }),

/***/ 311:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(394);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("23642621", content, true, context)
};

/***/ }),

/***/ 393:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AvatarImage_vue_vue_type_style_index_0_id_11a1bfbc_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(311);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AvatarImage_vue_vue_type_style_index_0_id_11a1bfbc_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AvatarImage_vue_vue_type_style_index_0_id_11a1bfbc_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AvatarImage_vue_vue_type_style_index_0_id_11a1bfbc_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AvatarImage_vue_vue_type_style_index_0_id_11a1bfbc_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 394:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".avatar-uploader-icon[data-v-11a1bfbc]{display:flex;align-items:center;justify-content:center;height:100%;width:100%}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 430:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/Upload/AvatarImage.vue?vue&type=template&id=11a1bfbc&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-upload',{staticClass:"avatar-uploader",attrs:{"action":_vm.url,"data":_vm.imgData,"headers":_vm.imgHeaders,"show-file-list":false,"on-success":_vm.handleSuccessList,"before-upload":_vm.beforeUploadList}},[(_vm.file)?[(_vm.imgData.type === 1)?_c('el-image',{attrs:{"src":_vm.file,"fit":"cover"}}):_c('i',{staticClass:"el-icon-folder avatar-uploader-icon"})]:_c('i',{staticClass:"el-icon-plus avatar-uploader-icon"})],2)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./components/Upload/AvatarImage.vue?vue&type=template&id=11a1bfbc&scoped=true&

// EXTERNAL MODULE: ./components/Upload/js/avatarImage.js
var avatarImage = __webpack_require__(310);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/Upload/AvatarImage.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var AvatarImagevue_type_script_lang_js_ = (avatarImage["default"]);
// CONCATENATED MODULE: ./components/Upload/AvatarImage.vue?vue&type=script&lang=js&
 /* harmony default export */ var Upload_AvatarImagevue_type_script_lang_js_ = (AvatarImagevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./components/Upload/AvatarImage.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(393)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  Upload_AvatarImagevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "11a1bfbc",
  "0ccf4444"
  
)

/* harmony default export */ var AvatarImage = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=upload-avatar-image.js.map