exports.ids = [52];
exports.modules = {

/***/ 257:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./plugins/request.js
var request = __webpack_require__(2);

// CONCATENATED MODULE: ./api/browse.js
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

function getList(query) {
  return Object(request["a" /* default */])({
    url: 'browse',
    method: 'GET',
    params: query
  });
}
// EXTERNAL MODULE: ./api/user.js
var user = __webpack_require__(45);

// EXTERNAL MODULE: ./api/goodIndent.js
var goodIndent = __webpack_require__(27);

// CONCATENATED MODULE: ./pages/user/js/portal.js



/* harmony default export */ var portal = __webpack_exports__["default"] = ({
  layout: 'user',
  head() {
    return {
      title: this.$t('header.top.personal_center')
    };
  },
  async asyncData(ctx) {
    try {} catch (err) {
      ctx.$errorHandler(err);
    }
  },
  data() {
    return {
      loading: true,
      user: {},
      browseList: [],
      quantity: {
        all: 0,
        obligation: 0,
        waitdeliver: 0,
        waitforreceiving: 0
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      await Promise.all([getList({
        limit: 7,
        sort: '-updated_at'
      }), Object(user["c" /* detail */])(), Object(goodIndent["i" /* quantity */])()]).then(([browseData, userData, quantityData]) => {
        this.browseList = browseData.data;
        this.user = userData;
        this.quantity = quantityData;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    }
  }
});

/***/ })

};;
//# sourceMappingURL=portal.js.map