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

<style lang='scss' scoped>
  @import "./scss/error";
</style>

<script>
  import js from './js/error'
  export default js
</script>
