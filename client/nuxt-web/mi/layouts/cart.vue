<template>
  <div class="body">
    <CartHeader />
    <Nuxt />
    <Footer />
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/cart";
</style>

<script>
import js from './js/cart'
export default js
</script>
