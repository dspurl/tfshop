<template>
  <view v-if="visible">
    <view class="cu-modal show"></view>
    <view class="result-box">
      <view class="result">
        <view class="title">{{ data.state ? '中奖啦' : '未中奖' }}</view>
        <view class="prize-icon">
		  <image class="icon" :src="data.img" mode="aspectFit" lazy-load></image>
		</view>
        <template v-if="data.state">
          <view class="prize-title">恭喜您</view>
          <view class="prize-name">获得了{{data.name}}</view>
        </template>
        <template v-else>
          <view class="prize-title">很遗憾，大奖与您擦肩而过 请再接再厉!</view>
        </template>
      </view>
      <view class="close-box">
        <i class="cuIcon-roundclose text-white" @click="close"></i>
      </view>
    </view>
  </view>
</template>
<style lang='scss' scoped>

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
    border-radius: 2rpx;
    box-sizing: border-box;
    width: 500rpx;
    margin: 30vh auto 10rpx;
    background: url('../assets/result_bg.png') no-repeat;
    background-size: 100%;
    height: 600rpx;

    .title {
      font-weight: 400;
      color: #FFFFFF;
      padding-top: 60rpx;
      font-size: 38rpx;
    }

    .prize-icon {
      padding-top: 120rpx;
	  .icon{
		  max-width: 120rpx;
		  max-height: 120rpx;
		  margin: 0 auto;
	  }
    }

    .prize-title {
      margin-top: 50rpx;
      font-size: 33rpx;
      font-weight: 400;
      color: #282727;
      padding: 0 40rpx;
    }

    .prize-name {
      font-size: 25rpx;
      font-weight: 400;
      color: #474C4D;
      margin-top: 10rpx;
      padding: 0 40rpx;
    }
  }

  .close-box {
    text-align: center;
    color: #FFFFFF;
    .cuIcon-roundclose {
      cursor: pointer;
	  font-size: 60rpx;
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
