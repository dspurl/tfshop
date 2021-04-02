<template>
  <div class="app-container">
    <div class="detailColTitle"><p>商品名称</p></div>
    <div class="detailColValue"><p class="detailColDetail">{{ temp.name }}</p></div>
    <div class="detailColTitle"><p>货号</p></div>
    <div class="detailColValue"><p class="detailColDetail">{{ temp.keypoint }}</p></div>
    <div class="detailColTitle"><p>主图</p></div>
    <div class="detailColValue">
      <p class="detailColDetail">
        <img v-if="temp.img" :src="temp.img" class="avatar">
        <video-player
          v-if="temp.video"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
          class="video-player vjs-custom-skin"/>
      </p>
    </div>
    <div class="detailColTitle"><p>图片列表</p></div>
    <div v-if="temp.imgList" class="detailColValue">
      <div v-for="(item,index) in temp.imgList" :key="index" class="flex-sub">
        <el-image :src="item" :preview-src-list="[item]" style="width: 200px;height:200px;"/>
      </div>
    </div>
    <div class="detailColTitle"><p>详情</p></div>
    <div class="detailColValue">
      <div class="detailColDetail" v-html="temp.details"/>
    </div>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
  .el-form-item__content{
    color: rgb(190, 5, 5);
    width: 520px;
  }
   .detailColTitle {
        min-width: 120px;
        font-weight: bold;
        color: rgb(10, 141, 141);
  }
   .detailColDetail {
        min-width: 120px;
      color: rgb(190, 5, 5);
  }
</style>
<script>
import { detail } from '@/api/good'
import { getToken } from '@/utils/auth'
import 'video.js/dist/video-js.css'

export default {
  name: 'GoodDetail',
  data() {
    return {
      freight: [],
      sku: [],
      goods_brand: [],
      attributeMarket: [],
      dialogImageUrl: '',
      good_attribute: [],
      goods_type: [],
      id: '',
      listLoading: true,
      query: {
        token: this.$route.query.token,
        id: this.$route.query.id
      },
      temp: {},
      // 视频播放
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: '',
          src: '' // url地址
        }],
        poster: '', // 你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      }
    }
  },
  created() {
    this.id = this.$route.query.id
    this.detail()
  },
  methods: {
    detail() {
      this.loading = true
      detail(this.id ? this.id : 0, { category: getToken('applyCategory') }).then(response => {
        if (this.id > 0) {
          this.temp = response.data.goods
          if (this.temp.video) {
            this.playerOptions['sources'][0]['src'] = this.ruleForm.video
          }
          if (this.temp.poster) {
            this.playerOptions['poster'] = this.temp.poster
          }
        }
        this.goods_type = response.data.category
        this.freight = response.data.freight
        this.loading = false
      })
    }
  }
}
</script>
