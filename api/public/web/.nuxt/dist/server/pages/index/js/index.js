exports.ids = [22];
exports.modules = {

/***/ 169:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return detail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return goodCategory; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);

function getList(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'good',
    method: 'GET',
    params: query
  });
}
function detail(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'good/' + id,
    method: 'GET'
  });
}
function goodCategory(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'goodCategory',
    method: 'GET',
    params: query
  });
}

/***/ }),

/***/ 241:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_good__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(169);
/* harmony import */ var _api_banner__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(38);


/* harmony default export */ __webpack_exports__["default"] = ({
  data() {
    return {
      categoryStyle: 0,
      naveOn: null,
      goodList: [],
      banner: '',
      bannerList: [],
      categoryList: [],
      categorySublevel: [],
      recommendCategoryList: [],
      recommendGoodList: []
    };
  },

  async asyncData(ctx) {
    try {
      let [goodData, bannerData, categoryData, recommendCategoryData] = await Promise.all([Object(_api_good__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "b"])({
        limit: 10,
        is_recommend: 1
      }), Object(_api_banner__WEBPACK_IMPORTED_MODULE_1__[/* getList */ "a"])({
        limit: 5,
        type: 0,
        state: 0,
        sort: '+sort'
      }), Object(_api_good__WEBPACK_IMPORTED_MODULE_0__[/* goodCategory */ "c"])({
        tree: true
      }), Object(_api_good__WEBPACK_IMPORTED_MODULE_0__[/* goodCategory */ "c"])({
        is_recommend: 1
      })]);
      bannerData.data.forEach(item => {
        item.url = item.url ? item.url.replace('?id=', '/') : '';
      });
      return {
        goodList: goodData.data,
        bannerList: bannerData.data,
        categoryList: categoryData,
        recommendCategoryList: recommendCategoryData
      };
    } catch (err) {
      ctx.$errorHandler(err);
    }
  },

  mounted() {
    this.categoryGood();
    this.getBanner();
  },

  methods: {
    // 分类切换
    naveCut(index) {
      if (index !== -1) {
        this.naveOn = index;

        if (this.categoryList[index].children) {
          //存在子类目
          if (this.categoryList[index].children[0].resources) {
            this.categorySublevel = this.categoryList[index].children;
            this.categoryStyle = 2;
          } else {
            //存在三级
            this.categorySublevel = this.categoryList[index].children;
            this.categoryStyle = 1;
          }
        } else {
          this.categorySublevel = [];
        }
      }
    },

    // 获取分类商品
    categoryGood() {
      this.recommendCategoryList.forEach((item, index) => {
        this.recommendGoodList[index] = [];
        Object(_api_good__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "b"])({
          limit: 10,
          category_id: item.id
        }).then(response => {
          this.recommendGoodList[index] = response.data;
          this.$forceUpdate();
        });
      });
    },

    // 分类移出
    naveShiftOut() {
      this.naveOn = null;
      this.categoryStyle = 0;
    },

    // 首页广告
    getBanner() {
      Object(_api_banner__WEBPACK_IMPORTED_MODULE_1__[/* getList */ "a"])({
        limit: 1,
        type: 1,
        state: 0,
        sort: '+sort'
      }).then(response => {
        this.banner = response.data[0];

        if (this.banner) {
          this.banner.url = this.banner.url ? this.banner.url.replace('?id=', '/') : '';
        }
      });
    }

  }
});

/***/ })

};;
//# sourceMappingURL=index.js.map