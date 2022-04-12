<template>
  <div class="box">
    <SlotMachine
      ref="myLucky"
      width="400px"
      height="244px"
      :prizes="prizes"
      :blocks="blocks"
      :slots="slots"
      :defaultConfig="defaultConfig"
      @end="endCallback"
    />
    <el-button class="button" type="warning" round @click="startCallback()">开始抽奖</el-button>
    <winning-results :visible.sync="dialogVisible" :data="prizeResults"/>
  </div>
</template>
<style lang='scss' scoped>
.box {
  background: url("../assets/bg4.png") no-repeat;
  background-size: 100%;
  padding: 40px 40px 40px 40px;
  height: 404px;
  text-align: center;

  .button {
    margin-top: 25px;
    width: 200px;
  }
}
</style>
<script>
import winningResults from "./winningResults";
import {winning} from '@/api/integralDraw'

export default {
  name: "DsSlotMachine",
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
        padding: '25px',
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
        rowSpacing: '5px'
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
          fonts: [{text: item.name, fontSize: '12px', lineClamp: 2, top: '80px'}],
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
