exports.ids = [48];
exports.modules = {

/***/ 227:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(45);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',
  head() {
    return {
      title: `${this.$t('unsubscribe')}-${this.$t('header.top.personal_center')}`
    };
  },
  data() {
    return {
      loading: false,
      checked: false,
      disabled: true
    };
  },
  mounted() {},
  methods: {
    //注销提交
    cancel() {
      Object(_api_user__WEBPACK_IMPORTED_MODULE_0__[/* cancel */ "b"])(this.ruleForm).then(response => {
        this.loading = false;
        $nuxt.$store.commit('logout');
        this.$message({
          message: this.$t('unsubscribe.success'),
          type: 'success'
        });
        this.$router.replace('/');
      }).catch(() => {
        this.loading = false;
      });
    },
    agree() {
      if (this.checked) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    }
  }
});

/***/ })

};;
//# sourceMappingURL=cancel.js.map