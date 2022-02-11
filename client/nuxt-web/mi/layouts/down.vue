<template>
  <div class="box">
    <img :src="require('assets/img/503.png')"/>
    <div class="explain">
      <div class="name">网站正在维护中，无法为您提供服务，为此感到抱歉~</div>
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
