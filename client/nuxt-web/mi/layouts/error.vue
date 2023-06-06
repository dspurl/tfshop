<template>
  <div class="box">
    <img :src="require('assets/img/404.png')"/>
    <div class="explain">
      <div class="name">{{$t('error.title')}}</div>
      <div class="link">
        <span @click="go('/')">{{$t('error.home')}}</span>
        <el-divider direction="vertical"></el-divider>
        <span @click="go(-1)">{{$t('error.back')}}</span>
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
