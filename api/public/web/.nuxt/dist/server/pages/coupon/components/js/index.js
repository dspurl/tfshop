exports.ids = [32];
exports.modules = {

/***/ 177:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getUserList; });
/* unused harmony export count */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return create; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);


function getList(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'coupon',
    method: 'GET',
    params: query
  });
}
function getUserList(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'coupon/user',
    method: 'GET',
    params: query
  });
}
function count() {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'coupon/user/count',
    method: 'GET'
  });
}
function create(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'coupon',
    method: 'POST',
    data
  });
}

/***/ }),

/***/ 211:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_coupon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(177);

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'CouponIndex',

  data() {
    return {
      tableLoading: false,
      checkboxAll: false,
      loading: true,
      buttonLoading: false,
      list: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        sort: '-created_at'
      }
    };
  },

  mounted() {
    if ($nuxt.$store.state.hasLogin) {
      this.getList();
    }
  },

  methods: {
    async getList() {
      this.loading = true;
      await Promise.all([Object(_api_coupon__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "b"])(this.listQuery)]).then(([data]) => {
        this.list = data.data;
        this.total = data.total;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },

    popover() {
      if (!$nuxt.$store.state.hasLogin) {
        $nuxt.$store.commit('loginCheck');
        return false;
      }
    },

    // 领取
    getCreate(item) {
      this.buttonLoading = true;
      Object(_api_coupon__WEBPACK_IMPORTED_MODULE_0__[/* create */ "a"])(item).then(() => {
        this.getList();
        this.buttonLoading = false;
        this.$message({
          message: '领取成功',
          type: 'success'
        });
      });
    }

  }
});

/***/ })

};;
//# sourceMappingURL=index.js.map