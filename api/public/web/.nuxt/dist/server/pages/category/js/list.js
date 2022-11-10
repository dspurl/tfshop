exports.ids = [17];
exports.modules = {

/***/ 169:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return detail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return goodCategory; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);

function getList(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'good',
    method: 'GET',
    params: query
  });
}
function detail(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'good/' + id,
    method: 'GET'
  });
}
function goodCategory(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'goodCategory',
    method: 'GET',
    params: query
  });
}

/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_good__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(169);

/* harmony default export */ __webpack_exports__["default"] = ({
  data() {
    return {
      goodCategory: []
    };
  },

  async asyncData(ctx) {
    try {
      let [goodCategoryData] = await Promise.all([Object(_api_good__WEBPACK_IMPORTED_MODULE_0__[/* goodCategory */ "c"])({
        tree: true
      })]);

      for (let item of goodCategoryData) {
        if (item.children) {
          item.level = 3;

          for (let item2 of item.children) {
            if (item2.resources) {
              item.level = 2;
            }

            break;
          }
        }
      }

      return {
        goodCategory: goodCategoryData
      };
    } catch (err) {
      ctx.$errorHandler(err);
    }
  },

  head() {
    return {
      title: '全部商品分类-' + "DSSHOP商城-跨终端商城解决方案"
    };
  },

  mounted() {},

  methods: {}
});

/***/ })

};;
//# sourceMappingURL=list.js.map