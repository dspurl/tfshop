exports.ids = [30,28];
exports.modules = {

/***/ 182:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return detail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return good; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return create; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);


function detail(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'comment/detail/' + id,
    method: 'GET'
  });
}
function good(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'comment/good',
    method: 'GET',
    params: query
  });
}
function create(id, data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'comment/' + id,
    method: 'POST',
    data
  });
}

/***/ }),

/***/ 259:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_comment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(182);
/* harmony import */ var _plugins_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);


/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',

  head() {
    return {
      title: '订单评价-订单详情-个人中心'
    };
  },

  data() {
    return {
      loading: true,
      buttonLoading: false,
      total: 0,
      indent: {
        list: []
      },
      url: "http://dsshop.test/api/v1/app/" + 'uploadPictures',
      imgHeaders: {
        'apply-secret': "base64:szoJ3mSx/5U7zOsJfU7s4pSahiwdh01x6badmz5FtCM=",
        'Authorization': 'Bearer ' + Object(_plugins_auth__WEBPACK_IMPORTED_MODULE_1__[/* getToken */ "a"])('token')
      },
      imgData: {
        type: 1,
        size: 1024 * 1024 * 2,
        specification: [80, 150]
      }
    };
  },

  created() {
    console.log('111');
    this.getDetail();
  },

  methods: {
    async getDetail() {
      if (!$nuxt.$route.query.id) {}

      await Promise.all([Object(_api_comment__WEBPACK_IMPORTED_MODULE_0__[/* detail */ "b"])($nuxt.$route.query.id)]).then(([indentData]) => {
        indentData.forEach((item, index) => {
          this.indent.list.push({ ...item,
            score: null,
            details: null,
            resources: [],
            anonymity: 0,
            id: item.id
          });
        });
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },

    // 图片列表上传成功
    handleAvatarSuccessList(res, file, fileList, index) {
      this.indent.list[index].resources = fileList;
      this.imgProgress = false;
      this.imgProgressPercent = 0;
    },

    handleRemove(file, fileList, index) {
      this.indent.list[index].resources = fileList;
    },

    // 图片列表图片格式大小验证
    beforeAvatarUploadList(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (['image/jpeg', 'image/gif', 'image/png', 'image/bmp'].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的图片格式');
        return false;
      }

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }

      return isLt2M;
    },

    goBack() {
      $nuxt.$router.go(-1);
    },

    // 提交
    addComment() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          let list = JSON.parse(JSON.stringify(this.indent.list));

          for (let i = 0; i < list.length; i++) {
            if (list[i].score === 0) {
              this.$message.error('您还有未选择的星级评分');
              this.buttonLoading = false;
              return false;
            }

            list[i].resources = list[i].resources.map(item => {
              return item.response;
            });
          }

          Object(_api_comment__WEBPACK_IMPORTED_MODULE_0__[/* create */ "a"])($nuxt.$route.query.id, list).then(response => {
            $nuxt.$router.go(-1);
          }).catch(() => {
            this.buttonLoading = false;
          });
        } else {
          return false;
        }
      });
    }

  }
});

/***/ }),

/***/ 260:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(331);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("60f168ea", content, true, context)
};

/***/ }),

/***/ 330:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_score_vue_vue_type_style_index_0_id_2e8c1ea5_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(260);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_score_vue_vue_type_style_index_0_id_2e8c1ea5_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_score_vue_vue_type_style_index_0_id_2e8c1ea5_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_score_vue_vue_type_style_index_0_id_2e8c1ea5_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_score_vue_vue_type_style_index_0_id_2e8c1ea5_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 331:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".specification[data-v-2e8c1ea5]{color:#999}.top[data-v-2e8c1ea5]{display:flex;flex-direction:row;justify-content:space-between;margin-top:20px}.ruleForm .table[data-v-2e8c1ea5]{margin-bottom:20px}.ruleForm .rate[data-v-2e8c1ea5]{margin-top:10px}.right[data-v-2e8c1ea5]{text-align:right}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 400:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/comment/score.vue?vue&type=template&id=2e8c1ea5&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_c('el-page-header',{attrs:{"content":"订单评价"},on:{"back":_vm.goBack}}),_vm._ssrNode(" "),_c('div',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.loading),expression:"loading"}]},[_vm._ssrNode("<div class=\"top\" data-v-2e8c1ea5><div class=\"order-number\" data-v-2e8c1ea5>"+_vm._ssrEscape("订单号："+_vm._s(_vm.indent.identification))+"</div></div> "),_c('el-divider'),_vm._ssrNode(" "),_c('el-form',{ref:"ruleForm",staticClass:"ruleForm",attrs:{"model":_vm.indent,"label-width":"120px"}},_vm._l((_vm.indent.list),function(item,index){return _c('div',{key:index},[_c('el-table',{ref:"table",refInFor:true,staticClass:"table",attrs:{"data":[item]}},[_c('el-table-column',{attrs:{"align":"center","width":"100"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('NuxtLink',{attrs:{"to":{ path: '/product/detail', query: { id: scope.row.good_id }}}},[_c('el-image',{staticClass:"image",attrs:{"src":_vm._f("smallImage")(scope.row.img,80),"fit":"cover"}})],1)]}}],null,true)}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"商品名称"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('NuxtLink',{attrs:{"to":{ path: '/product/detail', query: { id: scope.row.good_id }}}},[_c('p',[_vm._v(_vm._s(scope.row.name))])])]}}],null,true)}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"单价","width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n              "+_vm._s(_vm._f("thousands")(scope.row.price))+"\n            ")]}}],null,true)}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"数量","width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n              "+_vm._s(scope.row.number)+"\n            ")]}}],null,true)}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"小计","width":"150","align":"center"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_vm._v("\n              "+_vm._s(_vm._f("thousands")((scope.row.price * scope.row.number)))+"\n            ")]}}],null,true)})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"综合评分：","prop":("list[" + index + "].score"),"rules":{ required: true, message: '您还有未选择的星级评分', trigger: 'change' }}},[_c('el-rate',{staticClass:"rate",attrs:{"show-text":""},model:{value:(item.score),callback:function ($$v) {_vm.$set(item, "score", $$v)},expression:"item.score"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"上传图片：","prop":"resources"}},[_c('el-upload',{attrs:{"limit":4,"action":_vm.url,"headers":_vm.imgHeaders,"on-success":function (response, file, fileList) { return _vm.handleAvatarSuccessList(response, file, fileList, index); },"on-remove":function (file, fileList) { return _vm.handleRemove(file, fileList, index); },"before-upload":_vm.beforeAvatarUploadList,"data":_vm.imgData,"file-list":item.resources,"multiple":"","list-type":"picture-card"}},[_c('i',{staticClass:"el-icon-plus",attrs:{"slot":"default"},slot:"default"})]),_vm._v(" "),_c('div',{staticClass:"el-upload__tip"},[_vm._v("最多可上传4张，每张不能大于2M")])],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"匿名评价","prop":("list[" + index + "].anonymity"),"rules":{ required: true, message: '是否匿名评价', trigger: 'change' }}},[_c('el-switch',{model:{value:(item.anonymity),callback:function ($$v) {_vm.$set(item, "anonymity", $$v)},expression:"item.anonymity"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"评价内容：","prop":("list[" + index + "].details"),"rules":{ required: true, message: '您还有未填写的评价内容', trigger: 'blur' }}},[_c('el-input',{attrs:{"type":"textarea","placeholder":"亲,您对这个商品满意吗？您的评价会帮助我们提供更好的服务哦~","maxlength":"500","autosize":{ minRows: 4},"show-word-limit":""},model:{value:(item.details),callback:function ($$v) {_vm.$set(item, "details", $$v)},expression:"item.details"}})],1),_vm._v(" "),_c('el-divider')],1)}),0),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"right\" data-v-2e8c1ea5>","</div>",[_c('el-button',{attrs:{"loading":_vm.buttonLoading,"type":"primary"},on:{"click":function($event){return _vm.addComment()}}},[_vm._v("提交评价")])],1)],2)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/comment/score.vue?vue&type=template&id=2e8c1ea5&scoped=true&

// EXTERNAL MODULE: ./pages/comment/js/score.js
var score = __webpack_require__(259);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/comment/score.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var scorevue_type_script_lang_js_ = (score["default"]);
// CONCATENATED MODULE: ./pages/comment/score.vue?vue&type=script&lang=js&
 /* harmony default export */ var comment_scorevue_type_script_lang_js_ = (scorevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/comment/score.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(330)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  comment_scorevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "2e8c1ea5",
  "366f4714"
  
)

/* harmony default export */ var comment_score = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=score.js.map