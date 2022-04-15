<template>
  <view class="box">
    <LuckyGrid
      ref="myLucky"
      width="600rpx"
      height="600rpx"
      :prizes="prizes"
      :blocks="blocks"
      :buttons="buttons"
      :activeStyle="activeStyle"
      :defaultStyle="defaultStyle"
      :defaultConfig="defaultConfig"
      @start="startCallback"
      @end="endCallback"
    />
    <winning-results :visible.sync="dialogVisible" :data="prizeResults"/>
  </view>
</template>
<style lang='scss' scoped>
</style>
<script>
import LuckyGrid from '@lucky-canvas/uni/lucky-grid'
import {winning} from '@/api/integralDraw'
import winningResults from "./winningResults";

export default {
  name: "DsLuckyGrid",
  components: {
    winningResults,
	LuckyGrid
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
          src: require('../assets/bg2.png'),
          width: '100%',
          height: '100%'
        }]
      }],
      prizes: [],
      buttons: [
        {
          x: 1, y: 1,
          background: 'rgba(0,0,0,0)',
          imgs: [{
            src: require('../assets/button.png'),
            width: '100%',
            height: '100%',
          }],
        },
      ],
      activeStyle: {
        background: '#FFDE2B'
      },
      defaultStyle: {},
      defaultConfig: {
        speed: 1
      },
    }
  },
  created() {
    let src = ''
    const grid = [
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 2, y: 0},
      {x: 2, y: 1},
      {x: 2, y: 2},
      {x: 1, y: 2},
      {x: 0, y: 2},
      {x: 0, y: 1},
    ]
    this.data.integral_prize.forEach((item, index) => {
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

      this.prizes.push({
        x: grid[index].x, y: grid[index].y, imgs: [{
          src: 'https://dsshop.dswjcms.com/h5/static/integralDraw/grid.png',
          top: '12rpx',
          width: '140rpx',
          height: '140rpx'
        }, {
          src: src,
          width: '50%',
          top: '20rpx'
        }],
        fonts: [{
          text: item.name,
          top: '105rpx',
          fontSize: '20rpx',
          lengthLimit: '80%',
          lineClamp: 2
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
      this.prizeResults = {
        state: prize.fonts[0].text !== '谢谢参与',
        name: prize.fonts[0].text,
        img: prize.imgs[1].src
      }
      this.dialogVisible = true
      this.$emit('refresh')
    }
  }
}
</script>
