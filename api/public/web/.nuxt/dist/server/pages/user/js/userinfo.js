exports.ids = [90];
exports.modules = {

/***/ 181:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return detail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return edit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return cancel; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);


function detail() {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'user',
    method: 'GET'
  });
}
function edit(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'user',
    method: 'POST',
    data
  });
}
function cancel(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'cancel',
    method: 'POST',
    data
  });
}

/***/ }),

/***/ 291:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(181);
/* harmony import */ var _api_login__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(39);
/* harmony import */ var _plugins_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);



/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',

  head() {
    return {
      title: '个人资料-个人中心'
    };
  },

  data() {
    return {
      disabled: false,
      codename: '获取验证码',
      seconds: '',
      unit: '',
      uploadFile: {
        url: "http://dsshop.test/api/v1/app/" + 'uploadPictures',
        header: {
          'apply-secret': "base64:szoJ3mSx/5U7zOsJfU7s4pSahiwdh01x6badmz5FtCM=",
          'Authorization': 'Bearer ' + Object(_plugins_auth__WEBPACK_IMPORTED_MODULE_2__[/* getToken */ "a"])('token')
        },
        data: {
          type: 1,
          size: 1024 * 1024 * 2
        }
      },
      loading: true,
      buttonLoading: false,
      centerDialogVisible: false,
      imgProgressPercent: 0,
      imgProgress: false,
      dialogType: '',
      dialogTitle: '',
      ruleForm: {},
      user: {},
      collectList: [],
      rules: {
        portrait: [{
          required: true,
          message: '请上传头像',
          trigger: 'blur'
        }],
        nickname: [{
          required: true,
          message: '请设置昵称',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: '请设置邮箱',
          trigger: 'blur'
        }, {
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: ['blur', 'change']
        }],
        code: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }, {
          type: 'number',
          message: '验证码必须为数字'
        }]
      }
    };
  },

  mounted() {
    this.getUser();
  },

  methods: {
    async getUser() {
      await Promise.all([Object(_api_user__WEBPACK_IMPORTED_MODULE_0__[/* detail */ "b"])(this.listQuery)]).then(([userData]) => {
        this.user = userData;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },

    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;

          if (this.dialogType === 'email') {
            Object(_api_login__WEBPACK_IMPORTED_MODULE_1__[/* verifyEmail */ "i"])(this.ruleForm).then(response => {
              this.buttonLoading = false;
              this.centerDialogVisible = false;
              this.getUser();
              this.$message({
                message: '保存成功',
                type: 'success'
              });
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            Object(_api_user__WEBPACK_IMPORTED_MODULE_0__[/* edit */ "c"])(this.ruleForm).then(response => {
              this.buttonLoading = false;
              this.centerDialogVisible = false;
              this.getUser();
              this.$message({
                message: '保存成功',
                type: 'success'
              });
            }).catch(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },

    modification(type) {
      this.centerDialogVisible = true;
      this.dialogType = type;

      switch (type) {
        case 'portrait':
          this.dialogTitle = '修改头像';
          this.ruleForm = {
            portrait: this.user.portrait
          };
          break;

        case 'nickname':
          this.dialogTitle = '修改昵称';
          this.ruleForm = {
            nickname: this.user.nickname
          };
          break;

        case 'email':
          this.dialogTitle = '修改邮箱';
          this.ruleForm = {
            email: this.user.email,
            code: ''
          };
          break;
      }
    },

    handleAvatarSuccess(res, file) {
      this.ruleForm.portrait = file.response;
      this.imgProgress = false;
      this.imgProgressPercent = 0;
    },

    // 上传时
    handleProgress(file, fileList) {
      this.imgProgressPercent = file.percent;
    },

    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (['image/jpeg', 'image/gif', 'image/png', 'image/bmp'].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的图片格式');
        return false;
      }

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }

      this.imgProgress = true;
      return isLt2M;
    },

    // 获取验证码
    getCode() {
      const that = this;
      this.buttonLoading = true;
      Object(_api_login__WEBPACK_IMPORTED_MODULE_1__[/* emailCode */ "d"])(this.ruleForm).then(response => {
        // 开始倒计时
        this.seconds = 60;
        this.codename = '';
        this.unit = 's';
        this.disabled = true;
        this.buttonLoading = false;
        this.timer = setInterval(function () {
          that.seconds = that.seconds - 1;

          if (that.seconds === 0) {
            // 读秒结束 清空计时器
            clearInterval(that.timer);
            that.seconds = '';
            that.codename = '获取验证码';
            that.unit = '';
            that.disabled = false;
          }
        }, 1000); // 模拟验证码发送

        if (response.code) {
          that.ruleForm.code = response.code;
        }
      }).catch(() => {
        this.buttonLoading = false;
      });
    }

  }
});

/***/ })

};;
//# sourceMappingURL=userinfo.js.map