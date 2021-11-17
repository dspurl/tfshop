<template>
  <div class="body">
    <Header />
    <template v-if="!isDev">
      <Nuxt keep-alive/>
    </template>
    <template v-else>
      <Nuxt/>
    </template>

    <Footer />
    <el-backtop/>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/default";
</style>

<script>
import js from './js/default'
export default js
</script>
