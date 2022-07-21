<template >
  <div>
    <iframe
      ref="iframe"
      :style="{
        height: iframeHeight + 'px',
        pointerEvents: 'auto',
      }"
      :src="iframeUrl"
      class="page-iframe"
      frameborder="no"
      @load="init"/>
  </div>
</template>
<style lang="scss" scoped>
.sidebar-container{
  display: none;
}
.page-iframe {
  position: relative;
  width: 100%;
  z-index: 10;
}
</style>
<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'PageDesign',
  data() {
    return {
      widgetInfoList: [],
      iframeHeight: 667,
      iframeUrl: 'http://localhost:8083/#/login',
      initIframe: false
    }
  },
  methods: {
    // 发送信息，同步初始化iframe
    init() {
      console.log('初始化...')
      this.messageInit()
    },
    // 发送信息，当前商城配置数据
    messageInit() {
      this.$refs.iframe.contentWindow.postMessage(
        {
          even: 'init',
          params: {
            Authorization: getToken('token_type') + ' ' + getToken('access_token')
          }
        },
        '*'
      )
    }
  }
}
</script>
