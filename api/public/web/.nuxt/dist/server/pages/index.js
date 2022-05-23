exports.ids = [39,40,55];
exports.modules = {

/***/ 179:
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

/***/ 187:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/seckill/components/CountDownTime.vue?vue&type=template&id=8477b946&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._t("default",null,null,{
    d: _vm.days,
    h: _vm.hours,
    m: _vm.mins,
    s: _vm.seconds,
    hh: ("00" + _vm.hours).slice(-2),
    mm: ("00" + _vm.mins).slice(-2),
    ss: ("00" + _vm.seconds).slice(-2)
  })],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/seckill/components/CountDownTime.vue?vue&type=template&id=8477b946&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/seckill/components/CountDownTime.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var CountDownTimevue_type_script_lang_js_ = ({
  name: 'BaseCounter',
  props: {
    // 后台返回的时间戳
    time: {
      type: Number | String,
      default: 0
    },
    refreshCounter: {
      type: Number | String,
      default: 0
    },
    // 到期时间
    end: {
      type: Number | String,
      default: 0
    },
    // 区分传入的事秒还是毫秒
    isMiniSecond: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 将获取到的时候进行转化，不管time是毫秒还是秒都转化成秒
    // 「+」’号。接口返回的一串数字有时候是字符串的形式，有时候是数字的形式（~不能过分相信后端同学，必须自己做好防范~）。所以通过前面加个‘「+」’号 通通转化为数字。
    duration() {
      // 处理传入到期时间
      if (this.end) {
        let end = String(this.end).length >= 13 ? +this.end : +this.end * 1000;
        end -= Date.now();
        return end;
      } // 处理入剩余时间


      return this.isMiniSecond ? Math.round(+this.time / 1000) : Math.round(+this.time);
    }

  },

  data() {
    return {
      days: '0',
      hours: '00',
      mins: '00',
      seconds: '00',
      timer: null,
      curTime: 0 // 当前的时刻，也就是显示在页面上的那个时刻

    };
  },

  methods: {
    // 将duration转化成天数，小时，分钟，秒数的方法
    durationFormatter(time) {
      if (!time) return {
        ss: 0
      };
      let t = time;
      const ss = t % 60;
      t = (t - ss) / 60;
      if (t < 1) return {
        ss
      };
      const mm = t % 60;
      t = (t - mm) / 60;
      if (t < 1) return {
        mm,
        ss
      };
      const hh = t % 24;
      t = (t - hh) / 24;
      if (t < 1) return {
        hh,
        mm,
        ss
      };
      const dd = t;
      return {
        dd,
        hh,
        mm,
        ss
      };
    },

    // 开始执行倒计时的方法
    countDown() {
      // 记录下当前时间
      this.curTime = Date.now();
      this.getTime(this.duration);
    },

    // 倒计时方法
    getTime(time) {
      this.timer && clearTimeout(this.timer);

      if (time < 0) {
        this.$emit('end', true);
        return;
      }

      const {
        dd,
        hh,
        mm,
        ss
      } = this.durationFormatter(time);
      this.days = dd || 0;
      this.hours = hh || 0;
      this.mins = mm || 0;
      this.seconds = ss || 0;
      this.timer = setTimeout(() => {
        /*
          出于节能的考虑, 部分浏览器在进入后台时(或者失去焦点时), 「会将 setTimeout 等定时任务暂停 待用户回到浏览器时, 才会重新激活定时任务」
          说是暂停, 其实应该说是延迟, 1s 的任务延迟到 2s, 2s 的延迟到 5s, 实际情况因浏览器而异。
          原来如此，看来不能每次都只是减1这么简单了（毕竟你把浏览器切到后台之后setTimeout就冷却了，等几秒后切回，然后执行setTimeout，只是减了一秒而已）。
        */
        // now 是 setTimeout的回调函数执行的时候的那个时刻。记录当前这个setTimeout的回调函数执行的时间点。
        const now = Date.now(); // 当前这个setTimeout的回调函数执行的时刻距离上 页面上的剩余时间上一次变化的时间段」。其实也就是 「当前这个setTimeout的回调函数执行的时刻距离上 一个setTimeout的回调函数执行的时刻时间段。」
        // 记录当前这个setTimeout的回调函数执行的时间点距离页面上开始 渲染 剩余时间的 这一段时间。其实此时的diffTime就是=1。

        const diffTime = Math.floor((now - this.curTime) / 1000); // 在手机端页面回退到后台的时候不会计时，对比时间差，大于1s的重置倒计时

        const step = diffTime > 1 ? diffTime : 1; // 将curTime的值变成当前这个setTimeout的回调函数执行的时间点。

        this.curTime = now;
        this.getTime(time - step);
      }, 1000);
    }

  },

  mounted() {
    this.countDown();
  },

  watch: {
    duration() {
      this.countDown();
    },

    refreshCounter() {
      this.countDown();
    }

  }
});
/*
  // 原创连接https://mp.weixin.qq.com/s/Edk-0pVDZWOkkfZ2mPiCnw
  总结：
    1、 为什么要「用setTimeout来模拟setInterval的行为」？
        可以看看setInterval有什么缺点：
        定时器指定的时间间隔，表示的是何时将定时器的代码添加到消息队列，而不是合适执行代码，所以真正何时执行代码的时间是不能保证的，而是取决于何时被主线程的事件循环取到并执行。
        setInterval(fun, n) // 每隔n秒把fun事件推到消息队列中；
        setInterval有两个缺点：（1）使用setInterval时，某些间隔会被跳过；（2）可能有多个定时器会连续执行；
        可以这么理解：每个setTimeout产生的任务会直接push到任务队列中，而setInterval在每次把任务push到任务队列前，都要进行一下判断看上次的任务是否仍在队列中；因而采用setTimeout来规避上面的缺点。

    2、为什么要clearTimeout(this.timer)
        假设现在页面显示的是活动一的时间，这时，执行到setTimeout，在「一秒后」就会把setTimeout里的回调函数放到任务队列中，「注意是一秒后哦」！这时，然而，在这一秒的开头，我们点击了活动二按钮，这时候的活动二的时间就会传入倒计时组件中，然后触发countDown(),也就调用this.getTime(this.duration);，然后执行到setTimeout，也会一秒后把回调函数放到任务队列中。
        这时，任务队列中就会有两个setTimeout的回调函数了。等待一秒过去，两个回调函数相继执行，我们就会看到页面上的时间一下子背减了2，实际上是很快速地进行了两遍减1的操作。
        这就是为什么要添加上this.timer && clearTimeout(this.timer);这一句的原因了。就是要把上一个setTimeout清除掉。
*/
// CONCATENATED MODULE: ./pages/seckill/components/CountDownTime.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_CountDownTimevue_type_script_lang_js_ = (CountDownTimevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/seckill/components/CountDownTime.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_CountDownTimevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  "c92fe214"
  
)

/* harmony default export */ var CountDownTime = __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 189:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return detail; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);

function getList(query) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'seckill',
    method: 'GET',
    params: query
  });
}
function detail(id) {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])({
    url: 'seckill/' + id,
    method: 'GET'
  });
}

/***/ }),

/***/ 314:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(400);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(4).default
module.exports.__inject__ = function (context) {
  add("1dff1c0e", content, true, context)
};

/***/ }),

/***/ 329:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./api/good.js
var good = __webpack_require__(179);

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
// EXTERNAL MODULE: external "moment"
var external_moment_ = __webpack_require__(155);
var external_moment_default = /*#__PURE__*/__webpack_require__.n(external_moment_);

// EXTERNAL MODULE: ./pages/seckill/components/CountDownTime.vue + 4 modules
var CountDownTime = __webpack_require__(187);

// EXTERNAL MODULE: ./api/seckill.js
var seckill = __webpack_require__(189);

// EXTERNAL MODULE: ./api/plugin.js
var api_plugin = __webpack_require__(37);

// CONCATENATED MODULE: ./pages/index/js/index.js






/* harmony default export */ var js = __webpack_exports__["default"] = ({
  components: {
    CountDownTime: CountDownTime["default"]
  },

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
      recommendGoodList: [],
      isSeckill: false,
      seckill: [],
      seckillTime: 0,
      seckillActiveTime: '',
      seckillLoading: false
    };
  },

  async asyncData(ctx) {
    try {
      let time = external_moment_default()().format('YYYY-MM-DD HH:00:00');

      if (external_moment_default()().format('HH') % 2 !== 0) {
        time = external_moment_default()().subtract(1, 'hour').format('YYYY-MM-DD HH:00:00');
      }

      let endTime = (external_moment_default()(time, "YYYY-MM-DD HH:00:00").add(2, 'hour') - external_moment_default()().valueOf()) / 1000;
      let [goodData, bannerData, categoryData, recommendCategoryData, verifyPluginData] = await Promise.all([Object(good["b" /* getList */])({
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
      }), Object(api_plugin["a" /* verifyPlugin */])(['seckill'])]);
      bannerData.data.forEach(item => {
        item.url = item.url ? item.url.replace('?id=', '/') : '';
      });
      return {
        goodList: goodData.data,
        bannerList: bannerData.data,
        categoryList: categoryData,
        recommendCategoryList: recommendCategoryData,
        seckillActiveTime: external_moment_default()(time, "YYYY-MM-DD HH:00:00").format('HH:00'),
        seckillTime: endTime,
        isSeckill: verifyPluginData.seckill
      };
    } catch (err) {
      ctx.$errorHandler(err);
    }
  },

  mounted() {
    this.categoryGood();
    this.getBanner();

    if (this.isSeckill) {
      this.endSeckillTime();
    }
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
    },

    // 秒杀倒计时结束
    endSeckillTime() {
      this.seckillLoading = true;
      let time = external_moment_default()().format('YYYY-MM-DD HH:00:00');

      if (external_moment_default()().format('HH') % 2 !== 0) {
        time = external_moment_default()().subtract(1, 'hour').format('YYYY-MM-DD HH:00:00');
      }

      this.seckillActiveTime = external_moment_default()(time, "YYYY-MM-DD HH:00:00").format('HH:00');
      this.seckillTime = (external_moment_default()(time, "YYYY-MM-DD HH:00:00").add(2, 'hour') - external_moment_default()().valueOf()) / 1000;
      Object(seckill["b" /* getList */])({
        limit: 5,
        time: time,
        sort: '-id',
        state: 1
      }).then(response => {
        this.seckill = response.data;
      }).finally(() => {
        this.seckillLoading = false;
      });
    }

  }
});

/***/ }),

/***/ 399:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_456e86a5_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(314);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_456e86a5_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_456e86a5_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_456e86a5_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_sass_resources_loader_lib_loader_js_ref_7_oneOf_1_4_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_456e86a5_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 400:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(3);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".advertising[data-v-456e86a5]{margin-top:20px}.seckill-box[data-v-456e86a5]{display:flex;width:1200px;margin:0 auto}.seckill-box .countdown-box[data-v-456e86a5]{width:190px;background:#fa524c;color:#fff;text-align:center;padding:50px 0 30px}.seckill-box .countdown-box .tt[data-v-456e86a5]{font-size:25px;margin-bottom:20px}.seckill-box .countdown-box .el-icon-alarm-clock[data-v-456e86a5]{font-size:35px;margin-bottom:20px}.seckill-box .countdown-box .describe[data-v-456e86a5]{display:flex;justify-content:center}.seckill-box .countdown-box .describe .name[data-v-456e86a5]{margin-left:5px}.seckill-box .countdown-box .background-box[data-v-456e86a5]{display:flex;align-items:center;justify-content:center;margin-top:10px}.seckill-box .countdown-box .background-box .background[data-v-456e86a5]{color:#fff;line-height:24px;background:#000;font-size:14px;padding:0 5px;border-radius:5px;margin:0 5px}.seckill-box .seckill-list[data-v-456e86a5]{flex:1;display:flex;flex-wrap:wrap;align-content:flex-start}.seckill-box .seckill-list .li[data-v-456e86a5]{cursor:pointer;width:20%}.seckill-box .seckill-list .li .card .image[data-v-456e86a5]{width:100%;height:140px}.seckill-box .seckill-list .li .card .name[data-v-456e86a5]{font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.seckill-box .seckill-list .li .card .price[data-v-456e86a5]{display:flex;justify-content:center;margin-bottom:10px}.seckill-box .seckill-list .li .card .price .symbol[data-v-456e86a5]{font-size:12px;line-height:40px;color:#fa524c}.seckill-box .seckill-list .li .card .price .value[data-v-456e86a5]{color:#fa524c;line-height:35px}.seckill-box .seckill-list .li .card[data-v-456e86a5]:hover{transform:translateY(-5px)}.recommend[data-v-456e86a5]{margin-top:40px;width:1210px;position:relative;left:5px}.recommend .title-box[data-v-456e86a5]{display:flex}.recommend .title-box .min-title[data-v-456e86a5]{font-size:22px;color:#333;line-height:58px;flex:1}.recommend .title-box .more[data-v-456e86a5]{font-size:16px;line-height:58px;color:#424242;width:95px}.recommend .title-box .more[data-v-456e86a5]:hover{color:#fa524c}.recommend .title[data-v-456e86a5]{text-align:center;display:block;font-size:28px;margin-bottom:20px}.recommend .list[data-v-456e86a5]{display:flex;flex-wrap:wrap;align-content:flex-start}.recommend .list .li[data-v-456e86a5]{cursor:pointer;width:20%}.recommend .list .li .card[data-v-456e86a5]{margin:0 10px 10px 0}.recommend .list .li .card .image[data-v-456e86a5]{width:100%;height:190px}.recommend .list .li .card .name[data-v-456e86a5]{font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.recommend .list .li .card .price[data-v-456e86a5]{display:flex;justify-content:center;margin-bottom:10px}.recommend .list .li .card .price .symbol[data-v-456e86a5]{font-size:12px;line-height:40px;color:#fa524c}.recommend .list .li .card .price .value[data-v-456e86a5]{color:#fa524c;line-height:35px}.recommend .list .li .card[data-v-456e86a5]:hover{transform:translateY(-5px)}.top[data-v-456e86a5]{padding-bottom:20px}.top .container[data-v-456e86a5]{position:relative}.secondary-navigation2[data-v-456e86a5]{position:absolute;background-color:#fff;border:1px solid #e0e0e0;box-shadow:0 8px 16px #888;top:0;left:200px;z-index:10;width:1000px;height:460px;padding:20px;display:flex;flex-wrap:wrap;align-content:flex-start}.secondary-navigation2 .li[data-v-456e86a5]{font-size:12px;line-height:40px;display:flex;width:25%}.secondary-navigation2 .li .name[data-v-456e86a5]{margin-left:10px;margin-right:10px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:80px}.secondary-navigation2 .li[data-v-456e86a5]:hover{color:#fa524c}.secondary-navigation2 .image[data-v-456e86a5]{width:80px;height:80px}.secondary-navigation[data-v-456e86a5]{position:absolute;background-color:#fff;border:1px solid #e0e0e0;box-shadow:0 8px 16px rgba(0,0,0,.3);top:0;left:200px;z-index:10;width:1000px;height:460px;padding:20px;font-size:14px}.secondary-navigation .list[data-v-456e86a5]{line-height:40px;display:flex}.secondary-navigation .list .dt[data-v-456e86a5]{width:100px;text-align:right;font-weight:700;margin-right:10px}.secondary-navigation .list .dt .iconfont[data-v-456e86a5]{margin-left:5px;font-size:12px}.secondary-navigation .list .dt[data-v-456e86a5]:hover{color:#fa524c}.secondary-navigation .list .dd[data-v-456e86a5]{display:flex;flex:1}.secondary-navigation .list .dd .li[data-v-456e86a5]{padding:0 10px}.secondary-navigation .list .dd .li[data-v-456e86a5]:hover{color:#fa524c}.classify[data-v-456e86a5]{display:flex;background-color:#fff;position:relative}.classify .nave[data-v-456e86a5]{z-index:10;position:absolute;left:0;top:0;width:200px;color:#fff;padding-top:20px;height:460px;background:rgba(105,101,101,.6)}.classify .nave .nave-li[data-v-456e86a5]{cursor:pointer;padding:10px}.classify .nave .nave-li .iconfont[data-v-456e86a5]{float:right;position:relative;top:3px}.classify .nave .nave-li.on[data-v-456e86a5],.classify .nave .nave-li[data-v-456e86a5]:hover{color:#fff;background-color:#fa524c}.classify .banner[data-v-456e86a5]{flex:1}.classify .banner .image[data-v-456e86a5]{width:100%;height:100%}.el-carousel__item h3[data-v-456e86a5]{color:#475669;font-size:18px;opacity:.75;line-height:300px;margin:0}.el-carousel__item[data-v-456e86a5]:nth-child(2n){background-color:#99a9bf}.el-carousel__item[data-v-456e86a5]:nth-child(odd){background-color:#d3dce6}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 438:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/index.vue?vue&type=template&id=456e86a5&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"box"},[_vm._ssrNode("<div class=\"top\" data-v-456e86a5>","</div>",[_vm._ssrNode("<div class=\"container\" data-v-456e86a5>","</div>",[_vm._ssrNode("<div class=\"classify\" data-v-456e86a5>","</div>",[_vm._ssrNode("<div class=\"nave\" data-v-456e86a5>","</div>",[_vm._ssrNode((_vm._ssrList((_vm.categoryList),function(item,index){return ("<div"+(_vm._ssrClass("nave-li",{on:_vm.naveOn === index}))+" data-v-456e86a5>"+_vm._ssrEscape(_vm._s(item.name))+"<i class=\"iconfont dsshop-youjiantou\" data-v-456e86a5></i></div>")}))+" "),(_vm.categoryStyle === 1)?_vm._ssrNode("<div class=\"secondary-navigation\" data-v-456e86a5>","</div>",_vm._l((_vm.categorySublevel),function(item,index){return _vm._ssrNode("<div class=\"list\" data-v-456e86a5>","</div>",[_c('NuxtLink',{staticClass:"dt"},[_vm._v(_vm._s(item.name)),_c('i',{staticClass:"iconfont dsshop-youjiantou"})]),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"dd\" data-v-456e86a5>","</div>",_vm._l((item.children),function(item2,index2){return _c('NuxtLink',{key:index2,staticClass:"li",attrs:{"to":{ path: 'product/list', query: { pid: item2.id, title: item2.name }}}},[_vm._v(_vm._s(item2.name))])}),1)],2)}),0):(_vm.categoryStyle === 2)?_vm._ssrNode("<div class=\"secondary-navigation2\" data-v-456e86a5>","</div>",_vm._l((_vm.categorySublevel),function(item,index){return _c('NuxtLink',{key:index,staticClass:"li",attrs:{"to":{ path: 'product/list', query: { pid: item.id, title: item.name }}}},[_c('el-image',{staticClass:"image",attrs:{"src":_vm._f("smallImage")(item.resources.img,80),"fit":"scale-down"}}),_vm._v(" "),_c('div',{staticClass:"name"},[_vm._v(_vm._s(item.name))])],1)}),1):_vm._e()],2),_vm._ssrNode(" "),_c('el-carousel',{staticClass:"banner",attrs:{"height":"460px","arrow":"never"}},_vm._l((_vm.bannerList),function(item,index){return _c('el-carousel-item',{key:index},[(item.url)?_c('NuxtLink',{attrs:{"to":item.url.split('pages/').join('')}},[_c('el-image',{staticClass:"image",attrs:{"src":item.resources.img}})],1):_c('el-image',{staticClass:"image",attrs:{"src":item.resources.img}})],1)}),1)],2)])]),_vm._ssrNode(" "),(_vm.isSeckill && _vm.seckill.length)?_c('div',{directives:[{name:"loading",rawName:"v-loading",value:(_vm.seckillLoading),expression:"seckillLoading"}],staticClass:"seckill-box"},[_c('NuxtLink',{staticClass:"countdown-box",attrs:{"to":{ path: "/seckill/list"}}},[_c('div',{staticClass:"tt"},[_vm._v("限时秒杀")]),_vm._v(" "),_c('div',{staticClass:"el-icon-alarm-clock"}),_vm._v(" "),_c('div',{staticClass:"describe"},[_c('div',{staticClass:"time"},[_vm._v(_vm._s(_vm.seckillActiveTime)+"点场")]),_vm._v(" "),_c('div',{staticClass:"name"},[_vm._v("距结束")])]),_vm._v(" "),_c('div',{staticClass:"countdown"},[_c('count-down-time',{staticClass:"background-box",attrs:{"time":_vm.seckillTime},on:{"end":function($event){return _vm.endSeckillTime()}},scopedSlots:_vm._u([{key:"default",fn:function(timeObj){return [(timeObj.d>0)?[_c('div',{staticClass:"background"},[_vm._v(_vm._s(timeObj.d))]),_vm._v("天")]:_vm._e(),_c('div',{staticClass:"background"},[_vm._v(_vm._s(timeObj.hh))]),_vm._v(":"),_c('div',{staticClass:"background"},[_vm._v(_vm._s(timeObj.mm))]),_vm._v(":"),_c('div',{staticClass:"background"},[_vm._v(_vm._s(timeObj.ss))])]}}],null,false,4146670058)})],1)]),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"seckill-list\" data-v-456e86a5>","</div>",_vm._l((_vm.seckill),function(item,index){return _c('NuxtLink',{key:index,staticClass:"li",attrs:{"to":{ path: ("/product/detail/" + (item.good_id))}}},[_c('el-card',{staticClass:"card",attrs:{"shadow":"hover"}},[_c('el-image',{staticClass:"image",attrs:{"src":_vm._f("smallImage")(item.resources.img,200),"fit":"scale-down","lazy":""}}),_vm._v(" "),_c('div',{staticClass:"name"},[_vm._v(_vm._s(item.name))]),_vm._v(" "),_c('div',{staticClass:"price"},[_c('div',{staticClass:"symbol"},[_vm._v("¥")]),_vm._v(" "),_c('div',{staticClass:"value"},[_vm._v(_vm._s(_vm._f("thousands")(item.price[0])))])])],1)],1)}),1)],2):_vm._e(),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"recommend container\" data-v-456e86a5>","</div>",[_vm._ssrNode("<div class=\"title\" data-v-456e86a5>为你推荐</div> "),_vm._ssrNode("<div class=\"list\" data-v-456e86a5>","</div>",_vm._l((_vm.goodList),function(item,index){return _c('NuxtLink',{key:index,staticClass:"li",attrs:{"to":{ path: ("/product/detail/" + (item.id))}}},[_c('el-card',{staticClass:"card",attrs:{"shadow":"hover"}},[_c('el-image',{staticClass:"image",attrs:{"src":_vm._f("smallImage")(item.resources.img,200),"fit":"cover","lazy":""}}),_vm._v(" "),_c('div',{staticClass:"name"},[_vm._v(_vm._s(item.name))]),_vm._v(" "),_c('div',{staticClass:"price"},[_c('div',{staticClass:"symbol"},[_vm._v("¥")]),_vm._v(" "),_c('div',{staticClass:"value"},[_vm._v(_vm._s(_vm._f("thousands")(item.order_price)))])])],1)],1)}),1)],2),_vm._ssrNode(" "),(_vm.banner)?_vm._ssrNode("<div class=\"container advertising\" data-v-456e86a5>","</div>",[(_vm.banner.url)?_c('NuxtLink',{attrs:{"to":_vm.banner.url.split('pages/').join('')}},[_c('el-image',{attrs:{"fit":"cover","src":_vm.banner.resources.img}})],1):_c('el-image',{attrs:{"fit":"cover","src":_vm.banner.resources.img}})],1):_vm._e(),_vm._ssrNode(" "),_vm._l((_vm.recommendCategoryList),function(fitem,findex){return _vm._ssrNode("<div class=\"recommend container\" data-v-456e86a5>","</div>",[_vm._ssrNode("<div class=\"title-box\" data-v-456e86a5>","</div>",[_vm._ssrNode("<div class=\"min-title\" data-v-456e86a5>"+_vm._ssrEscape(_vm._s(fitem.name))+"</div> "),_c('NuxtLink',{staticClass:"more",attrs:{"to":{ path: ("/product/list/" + (fitem.id)), query: { title: fitem.name }}}},[_vm._v("查看更多>>")])],2),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"list\" data-v-456e86a5>","</div>",_vm._l((_vm.recommendGoodList[findex]),function(item,index){return _c('NuxtLink',{key:index,staticClass:"li",attrs:{"to":{ path: ("/product/detail/" + (item.id))}}},[_c('el-card',{staticClass:"card",attrs:{"shadow":"hover"}},[_c('el-image',{staticClass:"image",attrs:{"src":_vm._f("smallImage")(item.resources.img,200),"fit":"cover","lazy":""}}),_vm._v(" "),_c('div',{staticClass:"name"},[_vm._v(_vm._s(item.name))]),_vm._v(" "),_c('div',{staticClass:"price"},[_c('div',{staticClass:"symbol"},[_vm._v("¥")]),_vm._v(" "),_c('div',{staticClass:"value"},[_vm._v(_vm._s(_vm._f("thousands")(item.order_price)))])])],1)],1)}),1)],2)})],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/index.vue?vue&type=template&id=456e86a5&scoped=true&

// EXTERNAL MODULE: ./pages/index/js/index.js + 1 modules
var js = __webpack_require__(329);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var lib_vue_loader_options_pagesvue_type_script_lang_js_ = (js["default"]);
// CONCATENATED MODULE: ./pages/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var pagesvue_type_script_lang_js_ = (lib_vue_loader_options_pagesvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/index.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(399)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pagesvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "456e86a5",
  "1aeebd91"
  
)

/* harmony default export */ var pages = __webpack_exports__["default"] = (component.exports);

/***/ })

};;
//# sourceMappingURL=index.js.map