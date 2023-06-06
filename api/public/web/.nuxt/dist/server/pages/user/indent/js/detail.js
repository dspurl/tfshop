exports.ids = [44];
exports.modules = {

/***/ 239:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_goodIndent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(27);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',
  head() {
    return {
      title: `${this.$t('money.pay.order_details')}-${this.$t('header.top.personal_center')}`
    };
  },
  data() {
    return {
      loading: true,
      buttonLoading: false,
      total: 0,
      indent: {
        total: 0,
        good_code: []
      },
      isType: true,
      code_type: 0
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      if (!$nuxt.$route.query.id) {
        this.$message({
          message: this.$t('common.arguments'),
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
            this.code_type = item.good_sku.code_type;
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
          if (item.good.type === 2 || item.good.type === 3) {
            this.isType = false;
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
      this.$confirm(this.$t('hint.whether_confirm', {
        attribute: this.$t('indent.receiving')
      }), this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true;
        Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_0__[/* receipt */ "j"])(this.indent.id).then(response => {
          this.buttonLoading = false;
          this.$message({
            message: this.$t('common.success'),
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
    },
    doCopy(item) {
      this.$copyText(item).then(message => {
        this.$message({
          message: this.$t('indent.copy'),
          type: 'success'
        });
      }).catch(err => {
        console.log('失败');
      });
    },
    // 下载文件
    goDownload() {
      this.buttonLoading = true;
      Object(_api_goodIndent__WEBPACK_IMPORTED_MODULE_0__[/* download */ "f"])(this.indent.id).then(response => {
        window.open("http://dsshop.test/api/v1/app/" + 'indentDownload/' + response);
      }).finally(() => {
        this.buttonLoading = false;
      });
    }
  }
});

/***/ })

};;
//# sourceMappingURL=detail.js.map