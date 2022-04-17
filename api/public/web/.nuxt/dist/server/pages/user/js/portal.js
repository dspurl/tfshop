exports.ids = [86];
exports.modules = {

/***/ 179:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return detail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return edit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return cancel; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);


function detail() {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'user',
    method: 'GET'
  });
}
function edit(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'user',
    method: 'POST',
    data
  });
}
function cancel(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'cancel',
    method: 'POST',
    data
  });
}

/***/ }),

/***/ 321:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./plugins/request.js
var request = __webpack_require__(2);

// CONCATENATED MODULE: ./api/browse.js

function getList(query) {
  return Object(request["a" /* default */])({
    url: 'browse',
    method: 'GET',
    params: query
  });
}
// EXTERNAL MODULE: ./api/user.js
var user = __webpack_require__(179);

// EXTERNAL MODULE: ./api/goodIndent.js
var goodIndent = __webpack_require__(22);

// EXTERNAL MODULE: ./api/plugin.js
var api_plugin = __webpack_require__(39);

// CONCATENATED MODULE: ./pages/user/js/portal.js




/* harmony default export */ var portal = __webpack_exports__["default"] = ({
  layout: 'user',

  head() {
    return {
      title: '个人中心'
    };
  },

  async asyncData(ctx) {
    try {
      let [verifyPluginData] = await Promise.all([Object(api_plugin["a" /* verifyPlugin */])(['integral', 'comment'])]);
      return {
        isIntegral: verifyPluginData.integral,
        isComment: verifyPluginData.comment
      };
    } catch (err) {
      ctx.$errorHandler(err);
    }
  },

  data() {
    return {
      isIntegral: false,
      isComment: false,
      loading: true,
      user: {},
      browseList: [],
      quantity: {
        all: 0,
        obligation: 0,
        waitdeliver: 0,
        waitforreceiving: 0
      }
    };
  },

  mounted() {
    this.getList();
  },

  methods: {
    async getList() {
      await Promise.all([getList({
        limit: 7,
        sort: '-updated_at'
      }), Object(user["b" /* detail */])(), Object(goodIndent["h" /* quantity */])()]).then(([browseData, userData, quantityData]) => {
        this.browseList = browseData.data;
        this.user = userData;
        this.quantity = quantityData;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    }

  }
});

/***/ })

};;
//# sourceMappingURL=portal.js.map