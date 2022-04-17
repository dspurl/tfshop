exports.ids = [85];
exports.modules = {

/***/ 282:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_login__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(37);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',

  head() {
    return {
      title: '修改密码-个人中心'
    };
  },

  data() {
    const validateNowPassword = (rule, value, callback) => {
      if (value === this.ruleForm.nowPassword) {
        callback(new Error('新密码不能和旧密码相同!'));
      } else {
        callback();
      }
    };

    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
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
          message: '请输入当前密码',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入新密码',
          trigger: 'blur'
        }, {
          validator: validateNowPassword,
          trigger: 'blur'
        }],
        rPassword: [{
          required: true,
          message: '请输入确认密码',
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
              message: '修改成功',
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