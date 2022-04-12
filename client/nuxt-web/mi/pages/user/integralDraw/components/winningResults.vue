<template>
  <div v-if="visible">
    <div class="v-modal"></div>
    <div class="result-box">
      <div class="result">
        <div class="title">{{ data.state ? '中奖啦' : '未中奖' }}</div>
        <div class="prize-icon">
          <el-image :src="data.img" lazy fit="scale-down" style="max-width: 120px;max-height: 120px;"></el-image>
        </div>
        <template v-if="data.state">
          <div class="prize-title">恭喜您</div>
          <div class="prize-name">获得了{{data.name}}</div>
        </template>
        <template v-else>
          <div class="prize-title">很遗憾，大奖与您擦肩而过 请再接再厉!</div>
        </template>
      </div>
      <div class="close-box">
        <i class="el-icon-circle-close" @click="close"></i>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
.v-modal {
  z-index: 2002;
}

.result-box {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 2003;

  .result {
    text-align: center;
    position: relative;
    background: #fff;
    border-radius: 2px;
    box-sizing: border-box;
    width: 500px;
    margin: 10vh auto 10px;
    background: url('../assets/result_bg.png') no-repeat;
    background-size: 100%;
    height: 600px;

    .title {
      font-weight: 400;
      color: #FFFFFF;
      padding-top: 60px;
      font-size: 38px;
    }

    .prize-icon {
      padding-top: 120px;
    }

    .prize-title {
      margin-top: 50px;
      font-size: 33px;
      font-weight: 400;
      color: #282727;
      padding: 0 40px;
    }

    .prize-name {
      font-size: 25px;
      font-weight: 400;
      color: #474C4D;
      margin-top: 10px;
      padding: 0 40px;
    }
  }

  .close-box {
    text-align: center;
    color: #FFFFFF;
    font-size: 40px;

    .el-icon-circle-close {
      cursor: pointer;
    }
  }
}
</style>
<script>
export default {
  name: "WinningResults",
  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
    }
  },
  mounted() {

  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
