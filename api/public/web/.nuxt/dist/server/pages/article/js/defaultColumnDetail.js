exports.ids = [21];
exports.modules = {

/***/ 238:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'DefaultColumnDetail',
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
//# sourceMappingURL=defaultColumnDetail.js.map