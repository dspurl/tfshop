<template>
  <div class="box">
    <div class="container user-portal">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>小米全面屏电视65英寸 E65X</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  /*head () {
    return {
      title: '个人中心',
      meta: [
        { hid: 'index', name: 'dsshop-快速开发商城网店系统', content: '商城网店系统|商城|网店|免费商城|免费网店' },
        { name: 'viewport', content: 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0' },
        { hid: 'description', name: 'description', content: 'dsshop-快速开发商城网店系统' }
      ]
    }
  },*/
  data() {
    return {
    
    }
  },
  async asyncData (ctx) {
    try {
    
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  mounted() {
    // Cookies.set('cesi', 1111111111)
    // console.log('Cookies',Cookies.get('cesi'))
    // this.store.set('dsshopApply', { name:'测试abcdd' })
    // console.log(this.$store.state.hasLogin)
    // this.store.clearAll()
    // this.store.set('user', { name:'测试Marcus' })
    // console.log(this.store.get('user'))
  },
  methods: {
  
  }
}
</script>
<style lang='scss' scoped>
  .user-portal{
    .breadcrumb{
      margin: 20px 0 20px 0;
    }
  }
</style>
