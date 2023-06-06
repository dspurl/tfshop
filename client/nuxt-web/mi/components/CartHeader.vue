<template>
  <div class="min-header">
    <div class="container">
      <NuxtLink to="/"><img class="logo" src="~/assets/img/logo.png"/></NuxtLink>
      <div class="title">{{$store.state.cartTitle}}</div>
      <div class="right">
        <template v-if="$store.state.hasLogin">
          <div class="right-box">
            <div class="li user" :class="{ 'user-active': userActive }" @mouseenter="userMenu" @mouseleave="userMenuOut">
              <NuxtLink to="/user/portal" class="user-name"><span>{{ user.nickname ? user.nickname : user.cellphone }}</span><i class="iconfont dsshop-xia"></i></NuxtLink>
              <el-collapse-transition>
                <div class="user-menu-wrapper" v-show="userActive">
                  <ul class="user-menu">
                    <li><NuxtLink class="a" to="/user/portal">{{$t('header.top.personal_center')}}</NuxtLink></li>
                    <li><NuxtLink class="a" to="/user/collect">{{$t('header.top.collection')}}</NuxtLink></li>
                    <li><div class="a" @click="logout">{{$t('header.top.logout')}}</div></li>
                  </ul>
                </div>
              </el-collapse-transition>
            </div>
            <NuxtLink class="li" to="/user/indent/list">{{$t('header.top.order')}}</NuxtLink>
          </div>
        </template>
        <template v-else>
          <NuxtLink to="/pass/login">{{$t('header.top.login')}}</NuxtLink>
          <el-divider direction="vertical"></el-divider>
          <NuxtLink to="/pass/register">{{$t('header.top.register')}}</NuxtLink>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/CartHeader";
</style>

<script>
import js from './js/CartHeader'
export default js
</script>

