exports.ids = [51];
exports.modules = {

/***/ 233:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_login__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',
  head() {
    return {
      title: `${this.$t('user.password')}-${this.$t('header.top.personal_center')}`
    };
  },
  data() {
    const validateNowPassword = (rule, value, callback) => {
      if (value === this.ruleForm.nowPassword) {
        callback(new Error(this.$t('password.not_identical')));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('find_password.password.reenter')));
      } else if (value !== this.ruleForm.password) {
        callback(new Error(this.$t('find_password.password.inconformity')));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      ruleForm: {
        nowPassword: '',
        password: '',
        rPassword: ''
      },
      rules: {
        nowPassword: [{
          required: true,
          message: this.$t('hint.error.import', {
            attribute: this.$t('password.current_password')
          }),
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: this.$t('hint.error.import', {
            attribute: this.$t('find_password.new_password')
          }),
          trigger: 'blur'
        }, {
          validator: validateNowPassword,
          trigger: 'blur'
        }],
        rPassword: [{
          required: true,
          message: this.$t('hint.error.import', {
            attribute: this.$t('find_password.confirm_password')
          }),
          trigger: 'blur'
        }, {
          validator: validatePassword,
          trigger: 'blur'
        }]
      }
    };
  },
  mounted() {},
  methods: {
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          Object(_api_login__WEBPACK_IMPORTED_MODULE_0__[/* amendPassword */ "a"])(this.ruleForm).then(response => {
            this.loading = false;
            this.$refs['ruleForm'].resetFields();
            this.$message({
              message: this.$t('common.success'),
              type: 'success'
            });
          }).catch(() => {
            this.loading = false;
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
});

/***/ })

};;
//# sourceMappingURL=password.js.map