<template>
  <div class="box" v-loading="loading">
  
  </div>
</template>

<script>
export default {
  layout: 'user',
  head () {
    return {
      title: '个人中心-消息通知',
      meta: [
        { hid: 'index', name: 'dsshop-快速开发商城网店系统', content: '商城网店系统|商城|网店|免费商城|免费网店' },
        { name: 'viewport', content: 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0' },
        { hid: 'description', name: 'description', content: 'dsshop-快速开发商城网店系统' }
      ]
    }
  },
  data() {
    return {
      loading: true
    }
  },
  mounted() {
  
  },
  methods: {
  
  }
}
</script>
<style lang='scss' scoped>

</style>
