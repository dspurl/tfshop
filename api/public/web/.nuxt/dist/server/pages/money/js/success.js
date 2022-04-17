exports.ids = [42];
exports.modules = {

/***/ 265:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'cart',
  middleware: 'auth',

  head() {
    return {
      title: '支付成功' + '-' + "DSSHOP商城-跨终端商城解决方案"
    };
  },

  data() {
    return {};
  },

  mounted() {
    $nuxt.$store.commit('setCartTitle', '支付成功');
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