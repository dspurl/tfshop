exports.ids = [1];
exports.modules = {

/***/ 173:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return edit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return destroy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return freight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return defaultSet; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);


function getList(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'shipping',
    method: 'GET',
    params: query
  });
}
function create(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'shipping',
    method: 'POST',
    data
  });
}
function edit(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'shipping/' + data.id,
    method: 'POST',
    data
  });
}
function destroy(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'shipping/destroy/' + id,
    method: 'POST'
  });
}
function freight(id, data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'shipping/freight/' + id,
    method: 'POST',
    data
  });
}
function defaultSet(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'shipping/default/set',
    method: 'POST',
    data
  });
}

/***/ }),

/***/ 174:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_shipping__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(173);

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'AddressList',
  props: {
    select: {
      type: Boolean,
      default: false
    }
  },

  data() {
    const validateCellphone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else {
        const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;

        if (!myreg.test(value)) {
          callback(new Error('手机号格式有误'));
        }

        callback();
      }
    };

    return {
      src: 'https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=' + "BHBBZ-25TCP-YRODO-VQXIO-RZKP6-AEBEC" + '&referer=myapp',
      // https://lbs.qq.com
      restaurants: [],
      buttonLoading: false,
      loading: false,
      dialogTitle: '添加收货地址',
      centerDialogVisible: false,
      list: [],
      ruleForm: {
        location: '',
        address: '',
        name: '',
        house: '',
        cellphone: '',
        latitude: '',
        longitude: ''
      },
      rules: {
        name: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }],
        cellphone: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          validator: validateCellphone,
          trigger: 'blur'
        }],
        house: [{
          required: true,
          message: '请输入门牌号',
          trigger: 'blur'
        }]
      }
    };
  },

  watch: {},

  mounted() {
    this.getList();
    window.addEventListener('message', this.handleSelect);
  },

  methods: {
    async getList() {
      this.loading = true;
      await Object(_api_shipping__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "f"])({
        sort: '-defaults'
      }).then(response => {
        this.loading = false;
        this.list = response.data;
        this.list.forEach(item => {
          if (item.defaults) {
            item.on = true;
            this.$emit('selectedAddress', item);
          } else {
            item.on = false;
          }
        });
      }).catch(() => {
        this.loading = false;
      });
    },

    // 切换地址
    switchAddress(res) {
      if (this.select) {
        this.list.forEach(item => {
          item.on = false;
        });
        res.on = true;
        this.$emit('selectedAddress', res);
        this.$forceUpdate();
      }
    },

    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;

          if (this.ruleForm.id) {
            Object(_api_shipping__WEBPACK_IMPORTED_MODULE_0__[/* edit */ "d"])(this.ruleForm).then(response => {
              this.buttonLoading = false;
              this.centerDialogVisible = false;
              this.$refs['ruleForm'].resetFields();
              this.getList();
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            if (!this.ruleForm.longitude) {
              this.$message.error('请选择地址');
            }

            Object(_api_shipping__WEBPACK_IMPORTED_MODULE_0__[/* create */ "a"])(this.ruleForm).then(response => {
              this.buttonLoading = false;
              this.centerDialogVisible = false;
              this.$refs['ruleForm'].resetFields();
              this.getList();
              this.$message({
                message: '添加成功',
                type: 'success'
              });
            }).catch(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },

    defaultAddress(item) {
      this.$confirm('是否设为默认？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true;
        Object(_api_shipping__WEBPACK_IMPORTED_MODULE_0__[/* defaultSet */ "b"])(item).then(response => {
          this.buttonLoading = false;
          this.getList();
          this.$message({
            message: '设置成功',
            type: 'success'
          });
        }).catch(() => {
          this.buttonLoading = false;
        });
      }).catch(() => {});
    },

    deleteAddress(item) {
      if (item.defaults) {
        this.$message({
          message: '默认地址无法删除',
          type: 'error'
        });
        return;
      }

      this.$confirm('确定要删除该地址吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true;
        Object(_api_shipping__WEBPACK_IMPORTED_MODULE_0__[/* destroy */ "c"])(item.id).then(response => {
          this.buttonLoading = false;
          this.getList();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }).catch(() => {
          this.buttonLoading = false;
        });
      }).catch(() => {});
    },

    updateAddress(item) {
      if (item.id) {
        this.ruleForm = item;
        this.dialogTitle = '修改收货地址';
      } else {
        this.ruleForm = {
          location: '',
          address: '',
          name: '',
          house: '',
          cellphone: '',
          latitude: '',
          longitude: ''
        };
        this.dialogTitle = '添加收货地址';
      }

      this.centerDialogVisible = true;
    },

    handleSelect(event) {
      const loc = event.data;

      if (loc && loc.module === 'locationPicker') {
        //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
        this.ruleForm.location = loc.poiname;
        this.ruleForm.address = loc.poiaddress;
        this.ruleForm.longitude = loc.latlng.lng;
        this.ruleForm.latitude = loc.latlng.lat;
      }
    }

  }
});

/***/ })

};;
//# sourceMappingURL=address-js-list.js.map