exports.ids = [50];
exports.modules = {

/***/ 186:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return detail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return destroy; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);


function getList(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'collect',
    method: 'GET',
    params: query
  });
}
function detail(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'collect/' + id,
    method: 'GET'
  });
}
function create(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'collect',
    method: 'POST',
    data
  });
}
function destroy(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'collect/destroy/' + id,
    method: 'POST'
  });
}

/***/ }),

/***/ 220:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_collect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(186);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',

  head() {
    return {
      title: '我的收藏-个人中心'
    };
  },

  data() {
    return {
      loading: true,
      collectList: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        sort: '-created_at'
      }
    };
  },

  mounted() {
    this.getList();
  },

  methods: {
    async getList() {
      this.loading = true;
      await Promise.all([Object(_api_collect__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "d"])(this.listQuery)]).then(([collectData]) => {
        this.collectList = collectData.data;
        this.total = collectData.total;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },

    destroy(id) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Object(_api_collect__WEBPACK_IMPORTED_MODULE_0__[/* destroy */ "b"])(id).then(response => {
          this.handleFilter();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }).catch(() => {});
      }).catch(() => {});
    },

    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    }

  }
});

/***/ })

};;
//# sourceMappingURL=collect.js.map