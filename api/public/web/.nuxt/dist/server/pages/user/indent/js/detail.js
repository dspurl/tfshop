exports.ids = [69];
exports.modules = {

/***/ 296:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_goodIndent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',

  head() {
    return {
      title: '订单详情-个人中心'
    };
  },

  data() {
    return {
      loading: true,
      buttonLoading: false,
      total: 0,
      indent: {}
    };
  },

  mounted() {
    this.getDetail();
  },

  methods: {
    async getDetail() {
      if (!$nuxt.$route.query.id) {
        this.$message({
          message: '参数有误，请联系管理员',
          type: 'error'
        });
        $nuxt.$router.go(-1);
        return false;
      }

      await Promise.all([Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_0__[/* detail */ "e"])($nuxt.$route.query.id)]).then(([indentData]) => {
        this.indent = indentData;
        this.total = 0;
        let specification = null;
        this.indent.goods_list.forEach(item => {
          this.total += item.price * item.number;

          if (item.good_sku) {
            specification = null;
            item.good_sku.product_sku.forEach(item2 => {
              if (specification) {
                specification += item2.value + ';';
              } else {
                specification = item2.value + ';';
              }
            });
            item.specification = specification.substr(0, specification.length - 1);
          }
        });
        this.total = Number(this.total.toFixed(2));
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },

    // 确认收货
    confirmReceipt() {
      this.$confirm('是否确认收货？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true;
        Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_0__[/* receipt */ "i"])(this.indent.id).then(response => {
          this.buttonLoading = false;
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.getDetail();
        }).catch(() => {
          this.buttonLoading = false;
        });
      }).catch(() => {});
    },

    goBack() {
      $nuxt.$router.go(-1);
    }

  }
});

/***/ })

};;
//# sourceMappingURL=detail.js.map