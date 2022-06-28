exports.ids = [54];
exports.modules = {

/***/ 180:
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

/***/ 311:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_good__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(180);

/* harmony default export */ __webpack_exports__["default"] = ({
  data() {
    return {
      goodList: [],
      listQuery: {},
      loading: false,
      total: 0,
      title: ''
    };
  },

  async asyncData(ctx) {
    try {
      const {
        query,
        params
      } = ctx;
      const listQuery = {
        limit: 20,
        page: 1,
        sort: '',
        category_id: params.id,
        title: params.id ? '' : query.title
      };
      let [goodData] = await Promise.all([Object(_api_good__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "b"])(listQuery)]);
      return {
        goodList: goodData.data,
        total: goodData.total,
        listQuery: listQuery,
        title: query.title ? query.title : '全部商品'
      };
    } catch (err) {
      ctx.$errorHandler(err);
    }
  },

  head() {
    return {
      title: this.title + (this.listQuery.pid ? '-商品分类-' : '-搜索结果-') + "DSSHOP商城-跨终端商城解决方案"
    };
  },

  methods: {
    getList() {
      this.loading = true;
      Promise.all([Object(_api_good__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "b"])(this.listQuery)]).then(([goodData]) => {
        this.goodList = goodData.data;
        this.total = goodData.total;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },

    //筛选点击
    tabClick(index) {
      if (index) {
        if (index === 'sales') {
          this.listQuery.sort = '-sales';
        } else {
          if (this.listQuery.sort !== '+order_price') {
            this.listQuery.sort = '+order_price';
          } else {
            this.listQuery.sort = '-order_price';
          }
        }
      } else {
        this.listQuery.sort = '';
      }

      this.listQuery.page = 1;
      this.getList();
    },

    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },

    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    }

  }
});

/***/ })

};;
//# sourceMappingURL=_id.js.map