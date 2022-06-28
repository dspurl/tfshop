exports.ids = [70];
exports.modules = {

/***/ 299:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_goodIndent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _api_plugin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(38);


/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',

  head() {
    return {
      title: '我的订单-个人中心'
    };
  },

  data() {
    return {
      tableLoading: false,
      buttonLoading: false,
      loading: false,
      goodIndentList: [],
      total: 0,
      isComment: false,
      isGroupPurchase: false,
      listQuery: {
        limit: 10,
        page: 1,
        index: '0',
        sort: '-created_at'
      }
    };
  },

  async asyncData(ctx) {
    try {
      let [verifyPluginData] = await Promise.all([Object(_api_plugin__WEBPACK_IMPORTED_MODULE_1__[/* verifyPlugin */ "a"])(['comment', 'groupPurchase'])]);
      return {
        isComment: verifyPluginData.comment,
        isGroupPurchase: verifyPluginData.groupPurchase
      };
    } catch (err) {
      ctx.$errorHandler(err);
    }
  },

  mounted() {
    if ($nuxt.$route.query.index) {
      this.listQuery.index = $nuxt.$route.query.index;
    }

    this.getList();
  },

  methods: {
    async getList() {
      this.loading = true;
      await Promise.all([Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "g"])(this.listQuery)]).then(([goodIndent]) => {
        this.goodIndentList = goodIndent.data;
        goodIndent.data.forEach(item => {
          item.goods_list.forEach(items => {
            if (items.good_sku) {
              items.good_sku.product_sku.forEach(item2 => {
                if (items.specification) {
                  items.specification += item2.value + ';';
                } else {
                  items.specification = item2.value + ';';
                }
              });
              items.specification = items.specification.substr(0, items.specification.length - 1);
            }
          });
        });
        this.total = goodIndent.total;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },

    getReloadList() {
      this.listQuery.page = 1;
      this.getList();
    },

    //取消订单
    cancelOrder(item) {
      this.$confirm('是否确认取消订单？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true;
        Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_0__[/* cancel */ "b"])(item.id).then(response => {
          this.buttonLoading = false;
          this.$message({
            message: '取消成功',
            type: 'success'
          });
          this.getReloadList();
        }).catch(() => {
          this.buttonLoading = false;
        });
      }).catch(() => {});
    },

    // 删除订单
    deleteOrder(item) {
      this.$confirm('是否确认删除订单？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true;
        Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_0__[/* destroy */ "d"])(item.id).then(response => {
          this.buttonLoading = false;
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getReloadList();
        }).catch(() => {
          this.buttonLoading = false;
        });
      }).catch(() => {});
    },

    // 确认收货
    confirmReceipt(item) {
      this.$confirm('是否确认收货？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true;
        Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_0__[/* receipt */ "j"])(item.id).then(response => {
          this.buttonLoading = false;
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.getReloadList();
        }).catch(() => {
          this.buttonLoading = false;
        });
      }).catch(() => {});
    }

  }
});

/***/ })

};;
//# sourceMappingURL=list.js.map