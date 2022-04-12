<template>
  <div class="box">
    <LuckyWheel
      ref="myLucky"
      width="400px"
      height="400px"
      :prizes="prizes"
      :blocks="blocks"
      :buttons="buttons"
      :defaultStyle="defaultStyle"
      @start="startCallback"
      @end="endCallback"
    />
    <winning-results :visible.sync="dialogVisible" :data="prizeResults"/>
  </div>
</template>
<style lang='scss' scoped>

</style>
<script>
import {winning} from '@/api/integralDraw'
import winningResults from './winningResults'

export default {
  name: "DsLuckyWheel",
  components: {
    winningResults
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
        padding: '40px', background: '#617df2', imgs: [
          {
            src: require('../assets/bg.png'),
            width: '100%',
          }
        ]
      }],
      prizes: [],
      buttons: [
        {
          radius: '45%',
          imgs: [{
            src: require('../assets/buttons.png'),
            top: '-73.5px'
          }]
        }
      ],
      defaultStyle: {
        lineClamp: 2
      },
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
      this.prizes.push({
        fonts: [{text: item.name, top: '10px', lineClamp:2}], imgs: [{
          src: src,
          width: '50px',
          top: '50px'
        }], background: '#FFF3F3'
      })
    })
  },
  methods: {
    startCallback() {
      if (this.data.tries && this.data.has_draw > this.data.tries) {
        this.$message.error(`当日抽奖已超过${this.data.tries}次，请明日再来`);
        return false
      }
      winning(this.data.id).then((item) => {
        this.$refs.myLucky.play()
        this.$refs.myLucky.stop(item)
      })
    },
    // 抽奖结束会触发end回调
    endCallback(prize) {
      this.prizeResults = {
        state: prize.fonts[0].text !== '谢谢参与',
        name: prize.fonts[0].text,
        img: prize.imgs[0].src
      }
      this.dialogVisible = true
      this.$emit('refresh')
    }
  }
}
</script>
