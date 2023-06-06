exports.ids = [23];
exports.modules = {

/***/ 256:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./api/goodIndent.js
var goodIndent = __webpack_require__(27);

// EXTERNAL MODULE: ./plugins/request.js
var request = __webpack_require__(2);

// EXTERNAL MODULE: external "qs"
var external_qs_ = __webpack_require__(8);
var external_qs_default = /*#__PURE__*/__webpack_require__.n(external_qs_);

// CONCATENATED MODULE: ./api/pay.js
/** +----------------------------------------------------------------------
 * | DSSHOP [ 轻量级易扩展低代码开源商城系统 ]
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2023 https://www.dswjcms.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉DSSHOP相关版权
 * +----------------------------------------------------------------------
 * | Author: Purl <383354826@qq.com>
 * +----------------------------------------------------------------------
 */


function unifiedPayment(data) {
  data = external_qs_default.a.parse(data);
  return Object(request["a" /* default */])({
    url: 'unifiedPayment',
    method: 'POST',
    data
  });
}
function balancePay(data) {
  data = external_qs_default.a.parse(data);
  return Object(request["a" /* default */])({
    url: 'balancePay',
    method: 'POST',
    data
  });
}
// EXTERNAL MODULE: external "@chenfengyuan/vue-countdown"
var vue_countdown_ = __webpack_require__(176);
var vue_countdown_default = /*#__PURE__*/__webpack_require__.n(vue_countdown_);

// EXTERNAL MODULE: external "@chenfengyuan/vue-qrcode"
var vue_qrcode_ = __webpack_require__(177);
var vue_qrcode_default = /*#__PURE__*/__webpack_require__.n(vue_qrcode_);

// CONCATENATED MODULE: ./pages/money/js/pay.js




/* harmony default export */ var pay = __webpack_exports__["default"] = ({
  components: {
    VueCountdown: vue_countdown_default.a,
    VueQrcode: vue_qrcode_default.a
  },
  layout: 'cart',
  middleware: 'auth',
  head() {
    return {
      title: this.$t('money.title') + '-' + "DSSHOP商城-轻量级易扩展低代码开源商城系统"
    };
  },
  data() {
    return {
      loading: true,
      detail: false,
      centerDialogVisible: false,
      buttonLoading: false,
      qrcode: '',
      timer: null,
      list: {}
    };
  },
  mounted() {
    $nuxt.$store.commit('setCartTitle', this.$t('money.title'));
    this.getList();
  },
  methods: {
    getList() {
      Object(goodIndent["h" /* pay */])($nuxt.$route.query.id).then(response => {
        if (response.state !== 1) {
          // 订单发生改变时，直接跳转到结果页
          if (response.state === 4) {
            // $nuxt.$router.replace('/user/indent/list')
            $nuxt.$router.replace({
              path: '/user/indent/detail',
              query: {
                id: $nuxt.$route.query.id
              }
            });
          } else {
            $nuxt.$router.replace('/money/success');
          }
        }
        this.loading = false;
        this.list = response;
      }).catch(error => {
        this.$message({
          message: this.$t('common.arguments'),
          type: 'error'
        });
      });
    },
    // 显示详情
    showDetail() {
      this.detail = !this.detail;
    },
    // 支付
    payment(type) {
      this.buttonLoading = true;
      if (type === 1) {
        // 余额支付
        balancePay({
          id: $nuxt.$route.query.id
        }).then(response => {
          this.buttonLoading = false;
          $nuxt.$router.replace('/money/success');
        });
      } else {
        unifiedPayment({
          id: $nuxt.$route.query.id,
          platform: type,
          trade_type: 'NATIVE',
          type: 'goodsIndent'
        }).then(response => {
          this.centerDialogVisible = true;
          this.qrcode = response.code_url;
          this.buttonLoading = false;
          if (this.timer) {
            clearInterval(this.timer);
            this.timer = setInterval(() => {
              this.getList();
            }, 5000);
          } else {
            this.timer = setInterval(() => {
              this.getList();
            }, 5000);
          }
        }).catch(error => {
          this.$message({
            message: this.$t('money.error'),
            type: 'error'
          });
        });
      }
    }
  },
  destroyed() {
    clearInterval(this.timer);
  }
});

/***/ })

};;
//# sourceMappingURL=pay.js.map