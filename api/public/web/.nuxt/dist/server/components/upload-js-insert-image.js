exports.ids = [13];
exports.modules = {

/***/ 254:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _plugins_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'InsertImage',
  props: {
    imgData: {
      type: Object,
      default: function () {
        return {
          type: 1,
          size: 1024 * 1024 * 2,
          specification: [80, 150]
        };
      }
    },
    format: {
      type: Array,
      default: function () {
        return ['image/jpeg', 'image/gif', 'image/png', 'image/bmp'];
      }
    },
    limit: {
      type: Number,
      default: 5
    },
    fileList: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data() {
    return {
      url: "http://dsshop.test/api/v1/app/" + 'uploadPictures',
      imgHeaders: {
        'apply-secret': "base64:szoJ3mSx/5U7zOsJfU7s4pSahiwdh01x6badmz5FtCM=",
        'Authorization': 'Bearer ' + Object(_plugins_auth__WEBPACK_IMPORTED_MODULE_0__[/* getToken */ "a"])('token')
      }
    };
  },
  watch: {},
  mounted() {},
  methods: {
    // 图片列表上传成功
    handleSuccessList(res, file, fileList) {
      this.$emit('getFile', fileList);
    },
    handleRemove(file, fileList) {
      this.$emit('getFile', fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(this.$t('good.file.warning', {
        limit: this.limit,
        length: files.length,
        total: files.length + fileList.length
      }));
    },
    // 图片列表图片格式大小验证
    beforeUploadList(file) {
      const isLt = file.size < this.imgData.size;
      if (this.format.indexOf(file.type) === -1) {
        this.$message.error(this.$t('good.file.error'));
        return false;
      }
      if (!isLt) {
        this.$message.error(this.$t('good.file.size.error') + file.size / 1024 / 1024 + 'MB!');
      }
      return isLt;
    }
  }
});

/***/ })

};;
//# sourceMappingURL=upload-js-insert-image.js.map