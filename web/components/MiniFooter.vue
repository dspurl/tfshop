<template>
  <div class="min-footer">
    <div class="links">
      <NuxtLink to="/pass/login">关于我们</NuxtLink>
      <el-divider direction="vertical"></el-divider>
      <NuxtLink to="/pass/login">联系我们</NuxtLink>
      <el-divider direction="vertical"></el-divider>
      <NuxtLink to="/pass/login">友情链接</NuxtLink>
    </div>
    <!-- 版权信息-->
    <div class="copyright">
      <div class="container">
        <span>Copyright © 2008-2021 DSSHOP</span>
        <el-divider direction="vertical"></el-divider>
        <a href="http://beian.miit.gov.cn/" target="_blank">浙ICP备110120119</a>
      </div>
    </div>
    <!-- 版权信息end -->
  </div>
</template>

<style lang='scss'>
  .min-footer{
    background-color: #ffffff;
    .links{
      font-size: 14px;
      text-align: center;
      padding:20px 0 0 0;
      a:hover{
        color: #FA436A;
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
