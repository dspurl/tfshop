exports.ids = [74,77];
exports.modules = {

/***/ 178:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return detail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return winning; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);

function getList(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'integralDraw',
    method: 'GET',
    params: query
  });
}
function detail(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'integralDraw/' + id,
    method: 'GET'
  });
}
function winning(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'integralWinning/' + id,
    method: 'GET'
  });
}

/***/ }),

/***/ 179:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(192);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("f9155e7a", content, true, context)
};

/***/ }),

/***/ 183:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/integralDraw/components/winningResults.vue?vue&type=template&id=e1acb00e&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.visible)?_c('div',[_vm._ssrNode("<div class=\"v-modal\" data-v-e1acb00e></div> "),_vm._ssrNode("<div class=\"result-box\" data-v-e1acb00e>","</div>",[_vm._ssrNode("<div class=\"result\" data-v-e1acb00e>","</div>",[_vm._ssrNode("<div class=\"title\" data-v-e1acb00e>"+_vm._ssrEscape(_vm._s(_vm.data.state ? '中奖啦' : '未中奖'))+"</div> "),_vm._ssrNode("<div class=\"prize-icon\" data-v-e1acb00e>","</div>",[_c('el-image',{staticStyle:{"max-width":"120px","max-height":"120px"},attrs:{"src":_vm.data.img,"lazy":"","fit":"scale-down"}})],1),_vm._ssrNode(" "+((_vm.data.state)?("<div class=\"prize-title\" data-v-e1acb00e>恭喜您</div> <div class=\"prize-name\" data-v-e1acb00e>"+_vm._ssrEscape("获得了"+_vm._s(_vm.data.name))+"</div>"):("<div class=\"prize-title\" data-v-e1acb00e>很遗憾，大奖与您擦肩而过 请再接再厉!</div>")))],2),_vm._ssrNode(" <div class=\"close-box\" data-v-e1acb00e><i class=\"el-icon-circle-close\" data-v-e1acb00e></i></div>")],2)],2):_vm._e()}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/user/integralDraw/components/winningResults.vue?vue&type=template&id=e1acb00e&scoped=true&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/integralDraw/components/winningResults.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var winningResultsvue_type_script_lang_js_ = ({
  name: "WinningResults",
  props: {
    data: {
      type: Object,
      default: function () {
        return {};
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      dialogVisible: false
    };
  },

  mounted() {},

  methods: {
    close() {
      this.$emit('update:visible', false);
    }

  }
});
// CONCATENATED MODULE: ./pages/user/integralDraw/components/winningResults.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_winningResultsvue_type_script_lang_js_ = (winningResultsvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/user/integralDraw/components/winningResults.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(191)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_winningResultsvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "e1acb00e",
  "2e3fce30"
  
)

/* harmony default export */ var winningResults = __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 186:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/integral.8cc6202.png";

/***/ }),

/***/ 187:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/none.948f7c7.png";

/***/ }),

/***/ 191:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_winningResults_vue_vue_type_style_index_0_id_e1acb00e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(179);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_winningResults_vue_vue_type_style_index_0_id_e1acb00e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_winningResults_vue_vue_type_style_index_0_id_e1acb00e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_winningResults_vue_vue_type_style_index_0_id_e1acb00e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_winningResults_vue_vue_type_style_index_0_id_e1acb00e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 192:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_GET_URL_IMPORT___ = __webpack_require__(40);
var ___CSS_LOADER_URL_IMPORT_0___ = __webpack_require__(193);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".v-modal[data-v-e1acb00e]{z-index:2002}.result-box[data-v-e1acb00e]{position:fixed;top:0;right:0;bottom:0;left:0;overflow:auto;margin:0;z-index:2003}.result-box .result[data-v-e1acb00e]{text-align:center;position:relative;background:#fff;border-radius:2px;box-sizing:border-box;width:500px;margin:10vh auto 10px;background:url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") no-repeat;background-size:100%;height:600px}.result-box .result .title[data-v-e1acb00e]{font-weight:400;color:#fff;padding-top:60px;font-size:38px}.result-box .result .prize-icon[data-v-e1acb00e]{padding-top:120px}.result-box .result .prize-title[data-v-e1acb00e]{margin-top:50px;font-size:33px;font-weight:400;color:#282727;padding:0 40px}.result-box .result .prize-name[data-v-e1acb00e]{font-size:25px;font-weight:400;color:#474c4d;margin-top:10px;padding:0 40px}.result-box .close-box[data-v-e1acb00e]{text-align:center;color:#fff;font-size:40px}.result-box .close-box .el-icon-circle-close[data-v-e1acb00e]{cursor:pointer}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 193:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/result_bg.9403dc8.png";

/***/ }),

/***/ 223:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/bg2.7166adc.png";

/***/ }),

/***/ 224:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/button.d4dfda2.png";

/***/ }),

/***/ 225:
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ4AAACeCAMAAAD0W0NJAAAAAXNSR0IArs4c6QAAAGZQTFRFAAAA/////////////////////////////Pz8/////////////////f39/////////f39/////f39/f39/v7+/v7+/v7+/v7+/v7+/////v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+8iiUuwAAACF0Uk5TAAMEBQcQEUxOTldYf4CAlJWVlperrK2uyMjo6err+fv890tnbwAAATNJREFUeNrt3clOw0AURNGK4yaDMZ2BwY7bwe//f5IFJgmwRUoh3fqCI6sXXt0nfa1e565McedNpcvrWj+XHsew2dim77rtKax22t7gFruw26G66J7DcC+LmbcPy+3ndxemayQpFVdeSZLasF0rLUdf3rjUKoy3UnbmZXXOvF7FmVc0OfPeFdaDBw8ePHjw4MGDBw8ePHjw4MGDBw8ePHjw4MGDBw8ePHjw4MGDBw8ePHjw4MGDBw8ePHjw4MGDBw8ePHjw4MGDBw8ePHjw4MGDBw8ePHjw4MGDBw8ePHjw/oZnnQc8e8cVB/c0pXXYc+eeRTWPyponeZ2Dxg+S1Ljyms9c9cFTd5xb39Wro+7tmko3/H7H6r9k8CWl1umIwFP6deWg3uR+ON/9H2Xo8+Z6guEDGOZ5PsSnuRwAAAAASUVORK5CYII="

/***/ }),

/***/ 247:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/integralDraw/components/dsLuckyGrid.vue?vue&type=template&id=34b66f7d&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_c('LuckyGrid',{ref:"myLucky",attrs:{"width":"400px","height":"400px","prizes":_vm.prizes,"blocks":_vm.blocks,"buttons":_vm.buttons,"activeStyle":_vm.activeStyle,"defaultStyle":_vm.defaultStyle,"defaultConfig":_vm.defaultConfig},on:{"start":_vm.startCallback,"end":_vm.endCallback}}),_vm._ssrNode(" "),_c('winning-results',{attrs:{"visible":_vm.dialogVisible,"data":_vm.prizeResults},on:{"update:visible":function($event){_vm.dialogVisible=$event}}})],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/user/integralDraw/components/dsLuckyGrid.vue?vue&type=template&id=34b66f7d&scoped=true&

// EXTERNAL MODULE: ./api/integralDraw.js
var integralDraw = __webpack_require__(178);

// EXTERNAL MODULE: ./pages/user/integralDraw/components/winningResults.vue + 4 modules
var winningResults = __webpack_require__(183);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/user/integralDraw/components/dsLuckyGrid.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var dsLuckyGridvue_type_script_lang_js_ = ({
  name: "DsLuckyGrid",
  components: {
    winningResults: winningResults["default"]
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },

  data() {
    return {
      dialogVisible: false,
      prizeResults: {},
      blocks: [{
        padding: '40px',
        imgs: [{
          src: __webpack_require__(223),
          width: '100%',
          height: '100%'
        }]
      }],
      prizes: [],
      buttons: [{
        x: 1,
        y: 1,
        background: 'rgba(0,0,0,0)',
        imgs: [{
          src: __webpack_require__(224),
          width: '100%',
          height: '100%'
        }]
      }],
      activeStyle: {
        background: '#FFDE2B'
      },
      defaultStyle: {},
      defaultConfig: {
        speed: 1
      }
    };
  },

  created() {
    let src = '';
    const grid = [{
      x: 0,
      y: 0
    }, {
      x: 1,
      y: 0
    }, {
      x: 2,
      y: 0
    }, {
      x: 2,
      y: 1
    }, {
      x: 2,
      y: 2
    }, {
      x: 1,
      y: 2
    }, {
      x: 0,
      y: 2
    }, {
      x: 0,
      y: 1
    }];
    this.data.integral_prize.forEach((item, index) => {
      switch (item.model_type) {
        case "App\\Models\\v1\\GoodSku":
          src = item.resource.img;
          break;

        case "App\\Models\\v1\\IntegralConfiguration":
          src = __webpack_require__(186);
          break;

        default:
          src = __webpack_require__(187);
      }

      this.prizes.push({
        x: grid[index].x,
        y: grid[index].y,
        imgs: [{
          src: __webpack_require__(225),
          top: '6px',
          width: '90px',
          height: '90px'
        }, {
          src: src,
          width: '50%',
          top: '15px'
        }],
        fonts: [{
          text: item.name,
          top: '70px',
          fontSize: '12px',
          lengthLimit: '80%',
          lineClamp: 2
        }]
      });
    });
  },

  methods: {
    startCallback() {
      if (this.data.tries && this.data.has_draw > this.data.tries) {
        this.$message.error(`当日抽奖已超过${this.data.tries}次，请明日再来`);
        return false;
      }

      Object(integralDraw["c" /* winning */])(this.data.id).then(item => {
        this.$refs.myLucky.play();
        this.$refs.myLucky.stop(item);
      });
    },

    // 抽奖结束会触发end回调
    endCallback(prize) {
      this.prizeResults = {
        state: prize.fonts[0].text !== '谢谢参与',
        name: prize.fonts[0].text,
        img: prize.imgs[1].src
      };
      this.dialogVisible = true;
      this.$emit('refresh');
    }

  }
});
// CONCATENATED MODULE: ./pages/user/integralDraw/components/dsLuckyGrid.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_dsLuckyGridvue_type_script_lang_js_ = (dsLuckyGridvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/user/integralDraw/components/dsLuckyGrid.vue



function injectStyles (context) {
  
  
}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_dsLuckyGridvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "34b66f7d",
  "38b32385"
  
)

/* harmony default export */ var dsLuckyGrid = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=dsLuckyGrid.js.map