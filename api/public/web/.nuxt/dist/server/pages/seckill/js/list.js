exports.ids = [56,55];
exports.modules = {

/***/ 188:
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

/***/ 190:
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

/***/ 276:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api_seckill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(190);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(156);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_CountDownTime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(188);



/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    CountDownTime: _components_CountDownTime__WEBPACK_IMPORTED_MODULE_2__["default"]
  },

  data() {
    return {
      list: [],
      listQuery: {},
      loading: false,
      total: 0,
      time: 0,
      active: 0,
      times: []
    };
  },

  async asyncData(ctx) {
    try {
      let time = moment__WEBPACK_IMPORTED_MODULE_1___default()().format('YYYY-MM-DD HH:00:00');

      if (moment__WEBPACK_IMPORTED_MODULE_1___default()().format('HH') % 2 !== 0) {
        time = moment__WEBPACK_IMPORTED_MODULE_1___default()().subtract(1, 'hour').format('YYYY-MM-DD HH:00:00');
      }

      let times = [{
        label: `${moment__WEBPACK_IMPORTED_MODULE_1___default()(time, "YYYY-MM-DD HH:00:00").format('H')}:00`,
        value: moment__WEBPACK_IMPORTED_MODULE_1___default()(time, "YYYY-MM-DD HH:00:00").format('YYYY-MM-DD HH:00:00'),
        active: true
      }, {
        label: `${moment__WEBPACK_IMPORTED_MODULE_1___default()(time, "YYYY-MM-DD HH:00:00").add(2, 'hour').format('H')}:00`,
        value: moment__WEBPACK_IMPORTED_MODULE_1___default()(time, "YYYY-MM-DD HH:00:00").add(2, 'hour').format('YYYY-MM-DD HH:00:00'),
        active: false
      }, {
        label: `${moment__WEBPACK_IMPORTED_MODULE_1___default()(time, "YYYY-MM-DD HH:00:00").add(4, 'hour').format('H')}:00`,
        value: moment__WEBPACK_IMPORTED_MODULE_1___default()(time, "YYYY-MM-DD HH:00:00").add(4, 'hour').format('YYYY-MM-DD HH:00:00'),
        active: false
      }, {
        label: `${moment__WEBPACK_IMPORTED_MODULE_1___default()(time, "YYYY-MM-DD HH:00:00").add(6, 'hour').format('H')}:00`,
        value: moment__WEBPACK_IMPORTED_MODULE_1___default()(time, "YYYY-MM-DD HH:00:00").add(6, 'hour').format('YYYY-MM-DD HH:00:00'),
        active: false
      }, {
        label: `${moment__WEBPACK_IMPORTED_MODULE_1___default()(time, "YYYY-MM-DD HH:00:00").add(8, 'hour').format('H')}:00`,
        value: moment__WEBPACK_IMPORTED_MODULE_1___default()(time, "YYYY-MM-DD HH:00:00").add(8, 'hour').format('YYYY-MM-DD HH:00:00'),
        active: false
      }];
      const listQuery = {
        limit: 20,
        page: 1,
        sort: 'id',
        time: time
      };
      let [data] = await Promise.all([Object(_api_seckill__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "b"])(listQuery)]);
      return {
        times: times,
        list: data.data,
        total: data.total,
        listQuery: listQuery
      };
    } catch (err) {
      ctx.$errorHandler(err);
    }
  },

  created() {
    this.time = (moment__WEBPACK_IMPORTED_MODULE_1___default()(this.times[1].value).valueOf() - moment__WEBPACK_IMPORTED_MODULE_1___default()().valueOf()) / 1000;
  },

  head() {
    return {
      title: '限时秒杀-' + "DSSHOP商城-跨终端商城解决方案",
      meta: [{
        hid: 'index',
        name: "DSSHOP商城-跨终端商城解决方案",
        content: "商城网店系统,商城,网店,免费商城,免费网店"
      }, {
        hid: 'description',
        name: 'description',
        content: "免费开源可商用，快速搭建属于自己的独立商城网店系统，一次搭建适配多终端"
      }]
    };
  },

  methods: {
    getList() {
      this.loading = true;
      Promise.all([Object(_api_seckill__WEBPACK_IMPORTED_MODULE_0__[/* getList */ "b"])(this.listQuery)]).then(([data]) => {
        this.list = data.data;
        this.total = data.total;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },

    // 切换菜单
    cutTab(index) {
      this.active = index;
      let time = this.times[index].value;
      this.listQuery.time = this.times[index].value;

      if (index === 0) {
        this.listQuery.time = this.times[1].value;
      }

      this.time = (moment__WEBPACK_IMPORTED_MODULE_1___default()(time).valueOf() - moment__WEBPACK_IMPORTED_MODULE_1___default()().valueOf()) / 1000;
      this.getList();
    },

    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },

    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },

    endTime() {
      this.$router.go(0);
    }

  }
});

/***/ })

};;
//# sourceMappingURL=list.js.map