<template>
  <div class="footer">
    <!-- 服务-->
    <div class="safeguard container">
      <div class="li">
        <i class="iconfont dsshop-baoyou"/>
        <div>{{$t('footer.free_delivery')}}</div>
      </div>
      <div class="li">
        <i class="iconfont dsshop-shengqian"/>
        <div>{{$t('footer.low_price')}}</div>
      </div>
      <div class="li">
        <i class="iconfont dsshop-7tianwuliyoutuihuo"/>
        <div>{{$t('footer.returns')}}</div>
      </div>
      <div class="li">
        <i class="iconfont dsshop-zhengpinbaozheng"/>
        <div>{{$t('footer.quality_goods')}}</div>
      </div>
    </div>
    <!-- 版权信息-->
    <div class="copyright">
      <div class="container">
        <!-- 友情链接-->
        <div class="link-box" v-if="link.length">
          <div class="name">{{$t('footer.blogroll')}}：</div>
          <div class="list">
            <div class="item" v-for="(item,index) in link" :key="index">
              <a :href="item.url" target="_blank">{{ item.name }}</a>
            </div>
          </div>
        </div>
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
