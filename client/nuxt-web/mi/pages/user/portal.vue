<template>
  <div class="box" v-loading="loading">
    <div class="portal-main">
      <div class="user-card">
        <el-avatar :size="80" >
          <img :src="user.portrait ? user.portrait : require('assets/img/portrait.gif')"/>
        </el-avatar>
        <div class="card-box">
          <div class="username">{{ user.cellphone ? (user.nickname ? user.nickname : user.cellphone) : '游客' }}</div>
          <div class="money">余额：{{ (user.money ? user.money : 0) | thousands }}</div>
          <div class="money" v-if="isIntegral">积分：{{ user.integral ? user.integral.available : 0 }}<span class="integral-money">(约¥{{ user.integralMoney }})</span></div>
          <NuxtLink class="personal" to="/user/userinfo">修改个人信息></NuxtLink>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="indent-box">
      <div class="li">
        <div class="icon bg-blue"><i class="iconfont dsshop-icon-"></i></div>
        <div class="describe">
          <div class="name">待支付的订单：<span>{{ quantity.obligation ? quantity.obligation : 0 }}</span></div>
          <NuxtLink class="link" :to="{ path: '/user/indent/list', query: { index: 1 }}">查看待支付订单 ></NuxtLink>
        </div>
      </div>
      <div class="li">
        <div class="icon bg-purple"><i class="iconfont dsshop-daifahuo"></i></div>
        <div class="describe">
          <div class="name">待发货的订单：<span>{{ quantity.waitdeliver ? quantity.waitdeliver : 0 }}</span></div>
          <NuxtLink class="link" :to="{ path: '/user/indent/list', query: { index: 2 }}">查看待发货订单 ></NuxtLink>
        </div>
      </div>
      <div class="li">
        <div class="icon bg-pink"><i class="iconfont dsshop-daipingjia"></i></div>
        <div class="describe">
          <div class="name">待收货的订单：<span>{{ quantity.waitforreceiving ? quantity.waitforreceiving : 0 }}</span></div>
          <NuxtLink class="link" :to="{ path: '/user/indent/list', query: { index: 3 }}">查看待收货订单 ></NuxtLink>
        </div>
      </div>
      <div class="li" v-if="isComment">
        <div class="icon bg-olive"><i class="iconfont dsshop-daipingjia"></i></div>
        <div class="describe">
          <div class="name">待评价的订单：<span>{{ quantity.remainEvaluated ? quantity.remainEvaluated : 0 }}</span></div>
          <NuxtLink class="link" :to="{ path: '/user/indent/list', query: { index: 10 }}">查看待评价订单 ></NuxtLink>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="user-title">浏览历史</div>
    <div class="browse-box">
      <NuxtLink class="card" v-for="(item, index) in browseList" :key="index" :to="{ path: `/product/detail/${item.good_id}`}">
        <el-image
          class="image"
          :src="item.good.resources.img | smallImage(200)"
          fit="cover"
          lazy/>
        <div class="name">{{item.good.name}}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/portal";
</style>

<script>
import js from './js/portal'
export default js
</script>
