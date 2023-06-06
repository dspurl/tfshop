<template>
  <div class="box">
    <img :src="require('assets/img/503.png')"/>
    <div class="explain">
      <div class="name">{{$t('down')}}</div>
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
