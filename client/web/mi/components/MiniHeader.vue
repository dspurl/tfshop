<template>
  <div class="min-header">
    <div class="container">
      <NuxtLink to="/"><img class="logo" src="~/assets/img/logo.png"/></NuxtLink>
      <NuxtLink to="/"><div class="title">DSSHOP商城</div></NuxtLink>
    </div>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/MiniHeader";
</style>

<script>
import js from './js/MiniHeader'
export default js
</script>
