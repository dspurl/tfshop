exports.ids = [29];
exports.modules = {

/***/ 221:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_login__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);
/* harmony import */ var _api_banner__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(46);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(17);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(vuex__WEBPACK_IMPORTED_MODULE_2__);



/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'login',
  head() {
    return {
      title: this.$t('header.top.login') + '-' + "DSSHOP商城-轻量级易扩展低代码开源商城系统"
    };
  },
  async asyncData(ctx) {
    try {
      let banner = {};
      await Object(_api_banner__WEBPACK_IMPORTED_MODULE_1__[/* getList */ "a"])({
        limit: 1,
        type: 2,
        state: 0,
        sort: '+sort'
      }).then(response => {
        if (response.total === 1) {
          banner = response.data[0];
          banner.url = banner.url ? banner.url.replace('?id=', '/') : '';
        }
      });
      return {
        banner: banner
      };
    } catch (err) {
      ctx.$errorHandler(err);
    }
  },
  data() {
    const validateCellphone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('hint.error.import', {
          attribute: this.$t('find_password.cellphone')
        })));
      } else {
        const myreg = /^1[3456789]\d{9}$/;
        if (!myreg.test(value)) {
          callback(new Error(this.$t('hint.error.wrong_format', {
            attribute: this.$t('find_password.cellphone')
          })));
        }
        callback();
      }
    };
    return {
      method: 1,
      ruleForm: {
        cellphone: '',
        password: '',
        remember: false
      },
      loading: false,
      rules: {
        cellphone: [{
          validator: validateCellphone,
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: this.$t('hint.error.import', {
            attribute: this.$t('find_password.password')
          }),
          trigger: 'blur'
        }, {
          min: 5,
          message: this.$t('find_password.password.length'),
          trigger: 'blur'
        }]
      },
      banner: {}
    };
  },
  beforeDestroy() {
    clearInterval(this.codeTimer);
  },
  methods: {
    ...Object(vuex__WEBPACK_IMPORTED_MODULE_2__["mapMutations"])(['login']),
    setMethod(index) {
      this.method = index;
    },
    toLogin() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          Object(_api_login__WEBPACK_IMPORTED_MODULE_0__[/* login */ "f"])(this.ruleForm).then(response => {
            response.remember = this.ruleForm.remember;
            this.login(response);
            this.$message({
              message: this.$t('find_password.login_successfully'),
              type: 'success'
            });
            this.loading = false;
            const route = this.store.get('route');
            if (route) {
              this.store.remove('route');
              this.$router.replace({
                path: route.path,
                query: route.query
              });
            } else {
              $nuxt.$router.replace('/user/portal');
            }
          }).catch(() => {
            this.loading = false;
          });
        }
      });
    }
  }
});

/***/ })

};;
//# sourceMappingURL=login.js.map