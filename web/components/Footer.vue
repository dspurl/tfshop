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
  .footer{
    background-color: #ffffff;
    .copyright{
      padding:20px 0 20px 0;
      background-color: #f4f4f4;
      color: #999;
      font-size: 12px;
    }
    .links{
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      .li{
        width: 25%;
        text-align: center;
        .dt{
          display: block;
          line-height: 40px;
        }
        .dd{
          line-height: 35px;
          font-size: 12px;
        }
      }
    }
    .safeguard{
      padding:20px;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      .li{
        display: flex;
        width: 25%;
        line-height: 40px;
        justify-content: center;
        .iconfont{
          font-size: 32px;
          margin-right: 5px;
        }
      }
    }
  }
</style>
