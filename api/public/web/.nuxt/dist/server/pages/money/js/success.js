exports.ids = [24];
exports.modules = {

/***/ 217:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'cart',
  middleware: 'auth',
  head() {
    return {
      title: this.$t('money.success') + '-' + "DSSHOP商城-轻量级易扩展低代码开源商城系统"
    };
  },
  data() {
    return {};
  },
  mounted() {
    $nuxt.$store.commit('setCartTitle', this.$t('money.success'));
  },
  methods: {
    go(path) {
      $nuxt.$router.push(path);
    }
  }
});

/***/ })

};;
//# sourceMappingURL=success.js.map