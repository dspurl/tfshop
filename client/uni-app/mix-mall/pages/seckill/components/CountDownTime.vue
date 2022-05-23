<template>
  <div class="background-box">
	<template v-if="days>0"><div class="background">{{ days }}</div>天</template><div class="background">{{ `00${hours}`.slice(-2) }}</div>:<div class="background">{{ `00${mins}`.slice(-2) }}</div>:<div class="background">{{ `00${seconds}`.slice(-2) }}</div>
  </div>
</template>

<script>
export default {
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
        let end = String(this.end).length >= 13 ? +this.end : +this.end * 1000
        end -= Date.now()
        return end
      }
      // 处理入剩余时间
      return this.isMiniSecond ? Math.round(+this.time / 1000) : Math.round(+this.time)
    }
  },

  data() {
    return {
      days: '0',
      hours: '00',
      mins: '00',
      seconds: '00',
      timer: null,
      curTime: 0
    }
  },

  methods: {
    // 将duration转化成天数，小时，分钟，秒数的方法
    durationFormatter(time) {
      if (!time) return {ss: 0};
      let t = time;
      const ss = t % 60;
      t = (t - ss) / 60;
      if (t < 1) return {ss};
      const mm = t % 60
      t = (t - mm) / 60
      if (t < 1) return {mm, ss}
      const hh = t % 24
      t = (t - hh) / 24
      if (t < 1) return {hh, mm, ss}
      const dd = t
      return {dd, hh, mm, ss}
    },
    // 开始执行倒计时的方法
    countDown() {
      // 记录下当前时间
      this.curTime = Date.now()
      this.getTime(this.duration)
    },
    // 倒计时方法
    getTime(time) { 
      this.timer && clearTimeout(this.timer)
      if (time < 0){
        this.$emit('end', true)
        return
      }
      const {dd, hh, mm, ss} = this.durationFormatter(time)
      this.days = dd || 0
      this.hours = hh || 0
      this.mins = mm || 0
      this.seconds = ss || 0
      this.timer = setTimeout(() => {
        const now = Date.now()
        const diffTime = Math.floor((now - this.curTime) / 1000)
        const step = diffTime > 1 ? diffTime : 1
        this.curTime = now
        this.getTime(time - step)
      }, 1000)
    }
  },

  mounted() {
    this.countDown()
  },

  watch: {
    duration() {
      this.countDown()
    },
    refreshCounter() {
      this.countDown()
    }
  }
}
</script>
<style lang='scss' scoped>
	.background-box{
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  .background{
		color: #ffffff;
		line-height: 40rpx;
		background: #000000;
		font-size: 24rpx;
		padding: 0 10rpx;
		border-radius: 10rpx;
		margin: 0 5rpx;
	  }
	}
</style>
