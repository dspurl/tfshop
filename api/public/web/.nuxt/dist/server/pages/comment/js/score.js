exports.ids = [28];
exports.modules = {

/***/ 184:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return detail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return good; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return create; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);


function detail(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'comment/detail/' + id,
    method: 'GET'
  });
}
function good(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'comment/good',
    method: 'GET',
    params: query
  });
}
function create(id, data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'comment/' + id,
    method: 'POST',
    data
  });
}

/***/ }),

/***/ 263:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_comment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(184);
/* harmony import */ var _plugins_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);


/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',

  head() {
    return {
      title: '订单评价-订单详情-个人中心'
    };
  },

  data() {
    return {
      loading: true,
      buttonLoading: false,
      total: 0,
      indent: {
        list: []
      },
      url: "http://dsshop.test/api/v1/app/" + 'uploadPictures',
      imgHeaders: {
        'apply-secret': "base64:szoJ3mSx/5U7zOsJfU7s4pSahiwdh01x6badmz5FtCM=",
        'Authorization': 'Bearer ' + Object(_plugins_auth__WEBPACK_IMPORTED_MODULE_1__[/* getToken */ "a"])('token')
      },
      imgData: {
        type: 1,
        size: 1024 * 1024 * 2,
        specification: [80, 150]
      }
    };
  },

  created() {
    console.log('111');
    this.getDetail();
  },

  methods: {
    async getDetail() {
      if (!$nuxt.$route.query.id) {}

      await Promise.all([Object(_api_comment__WEBPACK_IMPORTED_MODULE_0__[/* detail */ "b"])($nuxt.$route.query.id)]).then(([indentData]) => {
        indentData.forEach((item, index) => {
          this.indent.list.push({ ...item,
            score: null,
            details: null,
            resources: [],
            anonymity: 0,
            id: item.id
          });
        });
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },

    // 图片列表上传成功
    handleAvatarSuccessList(res, file, fileList, index) {
      this.indent.list[index].resources = fileList;
      this.imgProgress = false;
      this.imgProgressPercent = 0;
    },

    handleRemove(file, fileList, index) {
      this.indent.list[index].resources = fileList;
    },

    // 图片列表图片格式大小验证
    beforeAvatarUploadList(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (['image/jpeg', 'image/gif', 'image/png', 'image/bmp'].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的图片格式');
        return false;
      }

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }

      return isLt2M;
    },

    goBack() {
      $nuxt.$router.go(-1);
    },

    // 提交
    addComment() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          let list = JSON.parse(JSON.stringify(this.indent.list));

          for (let i = 0; i < list.length; i++) {
            if (list[i].score === 0) {
              this.$message.error('您还有未选择的星级评分');
              this.buttonLoading = false;
              return false;
            }

            list[i].resources = list[i].resources.map(item => {
              return item.response;
            });
          }

          Object(_api_comment__WEBPACK_IMPORTED_MODULE_0__[/* create */ "a"])($nuxt.$route.query.id, list).then(response => {
            $nuxt.$router.go(-1);
          }).catch(() => {
            this.buttonLoading = false;
          });
        } else {
          return false;
        }
      });
    }

  }
});

/***/ })

};;
//# sourceMappingURL=score.js.map