exports.ids = [28];
exports.modules = {

/***/ 219:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_login__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'login',
  head() {
    return {
      title: this.$t('ind_password.title') + '-' + "DSSHOP商城-轻量级易扩展低代码开源商城系统"
    };
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
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('find_password.password.reenter')));
      } else if (value !== this.ruleForm.password) {
        callback(new Error(this.$t('find_password.password.inconformity')));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        cellphone: '',
        password: '',
        code: '',
        rPassword: '',
        state: 1
      },
      codename: this.$t('find_password.get_code'),
      seconds: '',
      unit: '',
      loading: false,
      codeDisabled: false,
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
        }],
        code: [{
          required: true,
          message: this.$t('hint.error.import', {
            attribute: this.$t('find_password.verification_code')
          }),
          trigger: 'blur'
        }, {
          type: 'number',
          message: this.$t('find_password.verification_code.number', {
            attribute: this.$t('find_password.verification_code')
          })
        }],
        rPassword: [{
          validator: validatePass,
          trigger: 'blur'
        }]
      }
    };
  },
  methods: {
    // 获取验证码
    getCode() {
      const that = this;
      Object(_api_login__WEBPACK_IMPORTED_MODULE_0__[/* cellphoneCode */ "b"])(this.ruleForm).then(response => {
        // 开始倒计时
        this.seconds = 60;
        this.codename = '';
        this.unit = 's';
        this.codeDisabled = true;
        this.timer = setInterval(function () {
          that.seconds = that.seconds - 1;
          if (that.seconds === 0) {
            // 读秒结束 清空计时器
            clearInterval(that.timer);
            that.seconds = '';
            that.codename = this.$t('find_password.get_code');
            that.unit = '';
            that.codeDisabled = false;
          }
        }, 1000);
        // 模拟短信发送
        if (response.code) {
          that.ruleForm.code = response.code;
        }
      }).catch(() => {});
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          Object(_api_login__WEBPACK_IMPORTED_MODULE_0__[/* findPassword */ "e"])(this.ruleForm).then(() => {
            this.$message({
              message: this.$t('find_password.reset_successfully'),
              type: 'success'
            });
            this.loading = false;
            $nuxt.$router.replace('/pass/login');
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
//# sourceMappingURL=findPassword.js.map