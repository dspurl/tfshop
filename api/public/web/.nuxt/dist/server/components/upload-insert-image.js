exports.ids = [11,13];
exports.modules = {

/***/ 318:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _plugins_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'InsertImage',
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
    limit: {
      type: Number,
      default: 5
    },
    fileList: {
      type: Array,
      default: function () {
        return [];
      }
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
    handleSuccessList(res, file, fileList) {
      this.$emit('getFile', fileList);
    },

    handleRemove(file, fileList) {
      this.$emit('getFile', fileList);
    },

    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
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

/***/ 319:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(405);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("67fa09cc", content, true, context)
};

/***/ }),

/***/ 404:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_InsertImage_vue_vue_type_style_index_0_id_7b9a9e52_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(319);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_InsertImage_vue_vue_type_style_index_0_id_7b9a9e52_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_InsertImage_vue_vue_type_style_index_0_id_7b9a9e52_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_InsertImage_vue_vue_type_style_index_0_id_7b9a9e52_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_InsertImage_vue_vue_type_style_index_0_id_7b9a9e52_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 405:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 441:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/Upload/InsertImage.vue?vue&type=template&id=7b9a9e52&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-upload',{attrs:{"limit":_vm.limit,"action":_vm.url,"headers":_vm.imgHeaders,"on-success":_vm.handleSuccessList,"on-remove":_vm.handleRemove,"before-upload":_vm.beforeUploadList,"data":_vm.imgData,"file-list":_vm.fileList,"on-exceed":_vm.handleExceed,"multiple":"","list-type":"picture-card"}},[_c('i',{staticClass:"el-icon-plus",attrs:{"slot":"default"},slot:"default"})])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./components/Upload/InsertImage.vue?vue&type=template&id=7b9a9e52&scoped=true&

// EXTERNAL MODULE: ./components/Upload/js/insertImage.js
var insertImage = __webpack_require__(318);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/Upload/InsertImage.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var InsertImagevue_type_script_lang_js_ = (insertImage["default"]);
// CONCATENATED MODULE: ./components/Upload/InsertImage.vue?vue&type=script&lang=js&
 /* harmony default export */ var Upload_InsertImagevue_type_script_lang_js_ = (InsertImagevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./components/Upload/InsertImage.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(404)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  Upload_InsertImagevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "7b9a9e52",
  "2b666238"
  
)

/* harmony default export */ var InsertImage = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=upload-insert-image.js.map