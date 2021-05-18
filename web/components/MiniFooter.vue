<template>
  <div class="min-footer">
    <!-- 版权信息-->
    <div class="copyright">
      <div class="container">
        <span>Copyright © 2020-{{year}} {{domain}}</span>
        <el-divider direction="vertical"></el-divider>
        <a href="http://beian.miit.gov.cn/" target="_blank">{{icp}}</a>
      </div>
    </div>
    <!-- 版权信息end -->
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/MiniFooter";
</style>

<script>
import js from './js/MiniFooter'
export default js
</script>
