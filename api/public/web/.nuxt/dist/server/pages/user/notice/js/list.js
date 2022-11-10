exports.ids = [56];
exports.modules = {

/***/ 187:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return detail; });
/* unused harmony export unread */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return destroy; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_1__);


function getList(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'notification',
    method: 'GET',
    params: query
  });
}
function detail(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'notification/detail/' + id,
    method: 'GET'
  });
}
function unread(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'notification/unread',
    method: 'GET',
    params: query
  });
}
function read(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'notification/read/0',
    method: 'POST',
    data
  });
}
function destroy(data) {
  data = qs__WEBPACK_IMPORTED_MODULE_1___default.a.parse(data);
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'notification/destroy/0',
    method: 'POST',
    data
  });
}

/***/ }),

/***/ 234:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_notification__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(187);

/* harmony default export */ __webpack_exports__["default"] = ({
  layout: 'user',

  head() {
    return {
      title: '消息通知-个人中心'
    };
  },

  data() {
    return {
      tableLoading: false,
      checkboxAll: false,
      loading: true,
      buttonLoading: false,
      noticeList: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        sort: '-created_at',
        pc: true
      },
      multipleSelection: []
    };
  },

  mounted() {
    this.getList();
  },

  methods: {
    async getList() {
      this.tableLoading = true;
      await Promise.all([Object(_api_notification__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "c"])(this.listQuery)]).then(([notificationData]) => {
        this.noticeList = notificationData.data;
        this.total = notificationData.total;
        this.loading = false;
        this.tableLoading = false;
      }).catch(error => {
        this.loading = false;
        this.tableLoading = false;
      });
    },

    handleCheckAllChange() {
      this.$refs.table.toggleAllSelection();
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleAllDelete() {
      // 批量删除
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择需要操作的内容',
          type: 'error'
        });
        return false;
      }

      this.$confirm('是否确认删除选中内容？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true;
        Object(_api_notification__WEBPACK_IMPORTED_MODULE_0__[/* destroy */ "a"])(this.multipleSelection).then(response => {
          this.buttonLoading = false;
          this.handleFilter();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }).catch(() => {
          this.buttonLoading = false;
        });
      }).catch(() => {});
    },

    handleAllRead() {
      // 批量标记为已读
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择需要操作的内容',
          type: 'error'
        });
        return false;
      }

      this.buttonLoading = true;
      Object(_api_notification__WEBPACK_IMPORTED_MODULE_0__[/* read */ "d"])(this.multipleSelection).then(response => {
        this.buttonLoading = false;
        this.getList();
        this.$message({
          message: '标记成功',
          type: 'success'
        });
      }).catch(() => {
        this.buttonLoading = false;
      });
    },

    sortChange(data) {
      const {
        prop,
        order
      } = data;

      if (order === 'ascending') {
        this.listQuery.sort = '+' + prop;
      } else if (order === 'descending') {
        this.listQuery.sort = '-' + prop;
      } else {
        this.listQuery.sort = null;
      }

      this.handleFilter();
    },

    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    }

  }
});

/***/ })

};;
//# sourceMappingURL=list.js.map