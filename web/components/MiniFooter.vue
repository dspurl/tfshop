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
<script>
  export default {
    data() {
      return {
        icp: process.env.APP_ICP,
        year: new Date().getFullYear(),
        domain: process.env.APP_SHORT_NAME
      }
    }
  }
</script>
<style lang='scss' scoped>
  .min-footer{
    background-color: #ffffff;
    .links{
      font-size: 14px;
      text-align: center;
      padding:20px 0 0 0;
      a:hover{
        color: $font-color-main;
      }
    }
    .copyright{
      text-align: center;
      padding:20px 0 20px 0;
      color: #999;
      font-size: 12px;
    }
  }
</style>
