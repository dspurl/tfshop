exports.ids = [20];
exports.modules = {

/***/ 241:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'DefaultColumn',
  props: {
    data: {
      type: Object,
      default: {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    listQuery: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {};
  },

  watch: {},

  mounted() {},

  methods: {
    getList() {
      this.$emit('getList');
    }

  }
});

/***/ })

};;
//# sourceMappingURL=defaultColumn.js.map