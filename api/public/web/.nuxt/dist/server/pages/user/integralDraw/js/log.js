exports.ids = [81];
exports.modules = {

/***/ 188:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return good; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);

function getList(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'integralDrawLog',
    method: 'GET',
    params: query
  });
}
function good(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'integralDrawLogGood/' + id,
    method: 'GET'
  });
}

/***/ }),

/***/ 303:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_integralDrawLog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(188);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',

  head() {
    return {
      title: '抽奖-个人中心'
    };
  },

  data() {
    return {
      buttonLoading: false,
      loading: true,
      data: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        user: true
      }
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    getData() {
      this.loading = true;
      Object(_api_integralDrawLog__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "a"])(this.listQuery).then(item => {
        this.data = item.data;
        this.total = item.total;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },

    sortChange(data) {
      const {
        prop,
        order
      } = data;

      if (order === 'ascending') {
        this.listQuery.sort = '+' + prop;
      } else if (order === 'descending') {
        this.listQuery.sort = '-' + prop;
      } else {
        this.listQuery.sort = null;
      }

      this.handleFilter();
    },

    handleFilter() {
      this.listQuery.page = 1;
      this.getData();
    }

  }
});

/***/ })

};;
//# sourceMappingURL=log.js.map