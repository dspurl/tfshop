<template>
  <view class="box">
    <SlotMachine
      ref="myLucky"
      width="600rpx"
      height="400rpx"
      :prizes="prizes"
      :blocks="blocks"
      :slots="slots"
      :defaultConfig="defaultConfig"
      @end="endCallback"
    />
    <button class="button cu-btn round bg-orange" type="warning" round @click="startCallback()">开始抽奖</button>
    <winning-results :visible.sync="dialogVisible" :data="prizeResults"/>
  </view>
</template>
<style lang='scss' scoped>
.box {
  background: url("../assets/bg4.png") no-repeat;
  background-size: 100%;
  margin: 0 30rpx;
  padding: 40rpx 40rpx 40rpx 40rpx;
  height: 804rpx;
  text-align: center;

  .button {
    margin-top: 20rpx;
    width: 400rpx;
  }
}
</style>
<script>
import SlotMachine from '@lucky-canvas/uni/slot-machine'
import winningResults from "./winningResults";
import {winning} from '@/api/integralDraw'

export default {
  name: "DsSlotMachine",
  components: {
    winningResults,
	SlotMachine
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      prizeResults: {},
      blocks: [{
        padding: '20px',
        imgs: [{
          src: require('../assets/bg3.png'),
          width: '100%',
          height: '100%'
        }]
      }],
      prizes: [],
      slots: [
        {speed: 20},
        {speed: 20, direction: -1},
        {speed: 20},
      ],
      defaultConfig: {
        rowSpacing: '20rpx'
      }
    }
  },
  created() {
    let src = ''
    this.data.integral_prize.forEach(item => {
      switch (item.model_type) {
        case "App\\Models\\v1\\GoodSku":
          src = item.resource.img
          break
        case "App\\Models\\v1\\IntegralConfiguration":
          src = require('../assets/integral.png')
          break
        default:
          src = require('../assets/none.png')
      }
      this.prizes.push(
        {
          background: '#ffffff',
          borderRadius: '10px',
		  fonts: [{text: item.name, fontSize: '24rpx', lineClamp: 1, top: '120rpx'}],
          imgs: [{
            width: '60%',
            top: '10px',
            src: src
          }]
        })
    })
  },
  methods: {
    startCallback() {
      if (this.data.tries && this.data.has_draw > this.data.tries) {
        this.$api.msg(`当日抽奖已超过${this.data.tries}次，请明日再来`)
        return false
      }
      const that = this
      winning(this.data.id,function(res){
      	that.$refs.myLucky.play()
      	that.$refs.myLucky.stop(res)
      })
    },
    // 抽奖结束会触发end回调
    endCallback(prize) {
      if (prize) {
        this.prizeResults = {
          state: true,
          name: prize.fonts[0].text,
          img: prize.imgs[0].src
        }
        this.dialogVisible = true
      }
      this.$emit('refresh')
    }
  }
}
</script>
