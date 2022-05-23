exports.ids = [47];
exports.modules = {

/***/ 325:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./api/login.js
var login = __webpack_require__(38);

// EXTERNAL MODULE: ./plugins/request.js
var request = __webpack_require__(2);

// EXTERNAL MODULE: external "qs"
var external_qs_ = __webpack_require__(7);
var external_qs_default = /*#__PURE__*/__webpack_require__.n(external_qs_);

// CONCATENATED MODULE: ./api/sweepLogin.js


function code() {
  return Object(request["a" /* default */])({
    url: 'sweepLogin',
    method: 'GET'
  });
}
function verify(data) {
  data = external_qs_default.a.parse(data);
  return Object(request["a" /* default */])({
    url: 'sweepLogin/verify',
    method: 'POST',
    data
  });
}
function index(data) {
  data = external_qs_default.a.parse(data);
  return Object(request["a" /* default */])({
    url: 'sweepLogin',
    method: 'POST',
    data
  });
}
// EXTERNAL MODULE: ./api/plugin.js
var api_plugin = __webpack_require__(37);

// EXTERNAL MODULE: external "vuex"
var external_vuex_ = __webpack_require__(13);

// CONCATENATED MODULE: ./pages/pass/js/login.js




/* harmony default export */ var js_login = __webpack_exports__["default"] = ({
  layout: 'login',

  head() {
    return {
      title: '登录' + '-' + "DSSHOP商城-跨终端商城解决方案"
    };
  },

  async asyncData(ctx) {
    try {
      let isSweepLogin = false;
      await Object(api_plugin["a" /* verifyPlugin */])('sweepLogin').then(response => {
        isSweepLogin = response.sweepLogin;
      });
      return {
        isSweepLogin: isSweepLogin
      };
    } catch (err) {
      ctx.$errorHandler(err);
    }
  },

  data() {
    const validateCellphone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else {
        const myreg = /^1[3456789]\d{9}$/;

        if (!myreg.test(value)) {
          callback(new Error('手机号格式有误'));
        }

        callback();
      }
    };

    return {
      isSweepLogin: false,
      method: 1,
      codeLoading: false,
      codeImg: '',
      codeTimer: null,
      codeState: 0,
      codeTime: 0,
      codeUuid: 0,
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
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 5,
          message: '密码长度必须大于5位',
          trigger: 'blur'
        }]
      }
    };
  },

  beforeDestroy() {
    clearInterval(this.codeTimer);
  },

  methods: { ...Object(external_vuex_["mapMutations"])(['login']),

    setMethod(index) {
      this.method = index;

      if (index === 2) {
        this.getCode();
      }
    },

    // 获取二维码
    getCode() {
      this.codeLoading = true;
      this.codeState = 0;

      if (this.codeTimer) {
        clearInterval(this.codeTimer);
      }

      code().then(response => {
        this.codeImg = response.code;
        this.codeTime = response.expires_in;
        this.codeUuid = response.uuid;
        this.codeTimer = setInterval(this.getRefreshCode, 2000);
      }).finally(() => {
        this.codeLoading = false;
      });
    },

    // 刷新登录状态
    getRefreshCode() {
      this.codeTime = this.codeTime - 1;

      if (this.codeTime === 0) {
        clearInterval(this.codeTimer);
        this.codeState = 4;
      } else {
        verify({
          uuid: this.codeUuid
        }).then(response => {
          this.codeState = response.state;

          if (this.codeState !== 0 && this.codeState !== 1) {
            clearInterval(this.codeTimer);
          }

          if (this.codeState === 2) {
            index({
              uuid: this.codeUuid
            }).then(response => {
              this.login(response);
              this.$message({
                message: '登录成功',
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
    },

    toLogin() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          Object(login["f" /* login */])(this.ruleForm).then(response => {
            response.remember = this.ruleForm.remember;
            this.login(response);
            this.$message({
              message: '登录成功',
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