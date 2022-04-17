exports.ids = [27];
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

/***/ 206:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_comment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(182);

/* harmony default export */ __webpack_exports__["default"] = ({
  data() {
    return {
      list: [],
      imgList: [],
      listQuery: {
        limit: 10,
        page: 1,
        good_id: 0,
        sort: '-created_at'
      },
      loading: false,
      total: 0
    };
  },

  mounted() {
    if (!$nuxt.$route.params.id) {
      this.$message.error('参数有误');
      $nuxt.$router.go(-1);
      return false;
    }

    this.listQuery.good_id = $nuxt.$route.params.id;
    this.getList();
  },

  methods: {
    getList() {
      this.loading = true;
      Promise.all([Object(_api_comment__WEBPACK_IMPORTED_MODULE_0__[/* good */ "c"])(this.listQuery)]).then(([data]) => {
        this.list = data.data;
        this.total = data.total;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    }

  }
});

/***/ })

};;
//# sourceMappingURL=list.js.map