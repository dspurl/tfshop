<template>
  <div class="footer">
    <!-- 服务-->
    <div class="safeguard container">
      <div class="li">
        <i class="iconfont dsshop-baoyou"/>
        <div>全场包邮</div>
      </div>
      <div class="li">
        <i class="iconfont dsshop-shengqian"/>
        <div>天天低价</div>
      </div>
      <div class="li">
        <i class="iconfont dsshop-7tianwuliyoutuihuo"/>
        <div>7天无理由退货</div>
      </div>
      <div class="li">
        <i class="iconfont dsshop-zhengpinbaozheng"/>
        <div>正品保证</div>
      </div>
    </div>
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
  @import "./scss/Footer";
</style>

<script>
import js from './js/Footer'
export default js
</script>
