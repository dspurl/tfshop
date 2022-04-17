exports.ids = [33];
exports.modules = {

/***/ 175:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getUserList; });
/* unused harmony export count */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return create; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);


function getList(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'coupon',
    method: 'GET',
    params: query
  });
}
function getUserList(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'coupon/user',
    method: 'GET',
    params: query
  });
}
function count() {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'coupon/user/count',
    method: 'GET'
  });
}
function create(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'coupon',
    method: 'POST',
    data
  });
}

/***/ }),

/***/ 208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_coupon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(175);

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'CouponUse',
  props: {
    money: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      tableLoading: false,
      checkboxAll: false,
      loading: true,
      buttonLoading: false,
      list: [],
      total: 0,
      couponMoney: 0,
      couponIndex: null,
      visible: false,
      listQuery: {
        limit: 100,
        money: 0,
        index: 1,
        page: 1,
        sort: '-created_at'
      }
    };
  },

  watch: {
    money(newVal) {
      this.listQuery.money = newVal;
      this.getList();
    }

  },
  methods: {
    async getList() {
      this.loading = true;
      await Promise.all([Object(_api_coupon__WEBPACK_IMPORTED_MODULE_0__[/* getUserList */ "c"])(this.listQuery)]).then(([data]) => {
        data.data.forEach((item, index) => {
          switch (item.coupon.type) {
            case 1:
              item.cost = item.coupon.cost / 100;

              if (item.cost > this.couponMoney) {
                this.couponMoney = item.cost;
                this.couponIndex = index;
              }

              break;

            case 2:
              item.cost = item.coupon.cost / 100;

              if (item.cost > this.couponMoney) {
                this.couponMoney = item.cost;
                this.couponIndex = index;
              }

              break;

            case 3:
              item.cost = this.listQuery.money * item.coupon.cost / 10000;

              if (item.cost > this.couponMoney) {
                this.couponMoney = item.cost;
                this.couponIndex = index;
              }

              break;
          }

          if (item.coupon.sill) {
            item.sill = '满' + item.coupon.sill / 100 + '可用';
          } else {
            item.sill = '无门槛';
          }
        });
        this.list = data.data;
        this.total = data.total;
        this.loading = false;
        this.$emit('select', this.list[this.couponIndex]);
      }).catch(error => {
        this.loading = false;
      });
    },

    // 选择优惠券
    select(item, index) {
      this.couponIndex = index;
      this.visible = false;
      this.$emit('select', item);
    }

  }
});

/***/ })

};;
//# sourceMappingURL=use.js.map