<template>
  <div class="box">
    <img :src="require('assets/img/404.png')"/>
    <div class="explain">
      <div class="name">您访问的页面出错了~</div>
      <div class="link">
        <span @click="go('/')">去首页</span>
        <el-divider direction="vertical"></el-divider>
        <span @click="go(-1)">返回上一页</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    head () {
      return {
        title:'您访问的页面出错了-'  + process.env.APP_NAME,
      }
    },
    methods: {
      go(path){
        if (path === -1) {
          $nuxt.$router.go(-1)
        } else {
          $nuxt.$router.push('/');
        }

      }
    }
  }
</script>
<style lang='scss' scoped>
  .box{
    text-align: center;
    position: relative;
    .explain{
      position: absolute;
      bottom: 100px;
      width: 100%;
      text-align: center;
      .name{
        font-size: 18px;
        margin: 15px 0;
        text-align: center;
      }
      .link{
        span{
          color: $font-color-main;
          cursor:pointer;
        }
      }
    }

  }
</style>
