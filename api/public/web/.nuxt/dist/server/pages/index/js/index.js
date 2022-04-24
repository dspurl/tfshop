exports.ids = [40];
exports.modules = {

/***/ 178:
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

/***/ 324:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./api/good.js
var good = __webpack_require__(178);

// EXTERNAL MODULE: ./plugins/request.js
var request = __webpack_require__(2);

// CONCATENATED MODULE: ./api/banner.js

function getList(query) {
  return Object(request["a" /* default */])({
    url: 'banner',
    method: 'GET',
    params: query
  });
}
// CONCATENATED MODULE: ./pages/index/js/index.js


/* harmony default export */ var js = __webpack_exports__["default"] = ({
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
      let [goodData, bannerData, categoryData, recommendCategoryData] = await Promise.all([Object(good["b" /* getList */])({
        limit: 10,
        is_recommend: 1
      }), getList({
        limit: 5,
        type: 0,
        state: 0,
        sort: '+sort'
      }), Object(good["c" /* goodCategory */])({
        tree: true
      }), Object(good["c" /* goodCategory */])({
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
        Object(good["b" /* getList */])({
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
      getList({
        limit: 1,
        type: 1,
        state: 0,
        sort: '+sort'
      }).then(response => {
        this.banner = response.data[0];
        this.banner.url = this.banner.url ? this.banner.url.replace('?id=', '/') : '';
      });
    }

  }
});

/***/ })

};;
//# sourceMappingURL=index.js.map