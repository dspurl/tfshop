<template>
  <div class="box" v-loading="loading">
    <div class="portal-main">
      <div class="user-card">
        <el-avatar :size="80" >
          <img :src="user.portrait ? user.portrait : require('assets/img/portrait.gif')"/>
        </el-avatar>
        <div class="card-box">
          <div class="username">{{ user.cellphone ? (user.nickname ? user.nickname : user.cellphone) : $t('portal.tourist') }}</div>
          <div class="money">{{$t('portal.balance')}}：{{ (user.money ? user.money : 0) | thousands }}</div>
          <NuxtLink class="personal" to="/user/userinfo">{{$t('portal.personal')}}></NuxtLink>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="indent-box">
      <div class="li">
        <div class="icon bg-blue"><i class="iconfont dsshop-icon-"></i></div>
        <div class="describe">
          <div class="name">{{$t('portal.orders_paid')}}：<span>{{ quantity.obligation ? quantity.obligation : 0 }}</span></div>
          <NuxtLink class="link" :to="{ path: '/user/indent/list', query: { index: 1 }}">{{$t('hint.error.examine', {attribute: $t('portal.orders_paid')})}} ></NuxtLink>
        </div>
      </div>
      <div class="li">
        <div class="icon bg-purple"><i class="iconfont dsshop-daifahuo"></i></div>
        <div class="describe">
          <div class="name">{{$t('portal.orders_shipped')}}：<span>{{ quantity.waitdeliver ? quantity.waitdeliver : 0 }}</span></div>
          <NuxtLink class="link" :to="{ path: '/user/indent/list', query: { index: 2 }}">{{$t('hint.error.examine', {attribute: $t('portal.orders_shipped')})}} ></NuxtLink>
        </div>
      </div>
      <div class="li">
        <div class="icon bg-pink"><i class="iconfont dsshop-daipingjia"></i></div>
        <div class="describe">
          <div class="name">{{$t('portal.orders_receivingd')}}：<span>{{ quantity.waitforreceiving ? quantity.waitforreceiving : 0 }}</span></div>
          <NuxtLink class="link" :to="{ path: '/user/indent/list', query: { index: 3 }}">{{$t('hint.error.examine', {attribute: $t('portal.orders_receivingd')})}} ></NuxtLink>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="user-title">{{$t('portal.browsing_history')}}</div>
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
