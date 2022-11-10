exports.ids = [41];
exports.modules = {

/***/ 249:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./plugins/request.js
var request = __webpack_require__(2);

// CONCATENATED MODULE: ./api/moneyLog.js

function getList(query) {
  return Object(request["a" /* default */])({
    url: 'moneyLog',
    method: 'GET',
    params: query
  });
}
function detail(id) {
  return Object(request["a" /* default */])({
    url: 'moneyLog/' + id,
    method: 'GET'
  });
}
// CONCATENATED MODULE: ./pages/user/finance/js/list.js

/* harmony default export */ var list = __webpack_exports__["default"] = ({
  layout: 'user',

  head() {
    return {
      title: '我的账单-个人中心'
    };
  },

  data() {
    return {
      tableLoading: false,
      buttonLoading: false,
      loading: false,
      moneyLogList: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        sort: '-created_at',
        month: '',
        type: 0
      }
    };
  },

  mounted() {
    this.getList();
  },

  methods: {
    async getList() {
      this.loading = true;
      await Promise.all([getList(this.listQuery)]).then(([goodIndent]) => {
        this.moneyLogList = goodIndent.paginate.data;
        this.total = goodIndent.paginate.total;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },

    getReloadList() {
      this.listQuery.page = 1;
      this.getList();
    }

  }
});

/***/ })

};;
//# sourceMappingURL=list.js.map