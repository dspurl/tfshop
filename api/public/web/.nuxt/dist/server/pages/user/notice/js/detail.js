exports.ids = [55];
exports.modules = {

/***/ 196:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return detail; });
/* unused harmony export unread */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return destroy; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);
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
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'notification',
    method: 'GET',
    params: query
  });
}
function detail(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'notification/detail/' + id,
    method: 'GET'
  });
}
function unread(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'notification/unread',
    method: 'GET',
    params: query
  });
}
function read(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'notification/read/0',
    method: 'POST',
    data
  });
}
function destroy(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'notification/destroy/0',
    method: 'POST',
    data
  });
}

/***/ }),

/***/ 243:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_notification__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(196);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',
  head() {
    return {
      title: `${this.$t('header.top.message')}-${this.$t('header.top.personal_center')}`
    };
  },
  data() {
    return {
      loading: true,
      notice: {}
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
      await Promise.all([Object(_api_notification__WEBPACK_IMPORTED_MODULE_0__[/* detail */ "b"])($nuxt.$route.query.id)]).then(([notificationData]) => {
        this.notice = notificationData;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },
    goBack() {
      $nuxt.$router.go(-1);
    },
    goNavigator(url) {
      // 为了兼容老版本
      uni.navigateTo({
        url: url.replace('pages', 'user')
      });
    }
  }
});

/***/ })

};;
//# sourceMappingURL=detail.js.map