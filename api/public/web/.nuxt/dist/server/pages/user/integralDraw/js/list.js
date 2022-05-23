exports.ids = [80];
exports.modules = {

/***/ 177:
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

/***/ 301:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_integralDraw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(177);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',

  head() {
    return {
      title: '积分抽奖-个人中心'
    };
  },

  data() {
    return {
      loading: true,
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        sort: '-created_at'
      },
      integralDraw: []
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    getData() {
      this.loading = true;
      this.listQuery.integral_draw_id = $nuxt.$route.query.id;
      Object(_api_integralDraw__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "b"])(this.listQuery).then(item => {
        this.integralDraw = item.data;
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
//# sourceMappingURL=list.js.map