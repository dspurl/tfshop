<template>
  <div class="header">
    <!-- 顶部导航-->
    <div class="site-topbar">
      <div class="container">
        <div class="topbar-nav">
          <div class="menu">
            <div class="li">{{$t('header.top.wechat_mini_program')}}
              <div class="appcode">
                <img class="padding" src="~/assets/img/miniweixin.jpg"/>
                <p>{{$t('header.top.wechat_mini_program')}}</p>
              </div>
            </div>
            <div class="li">{{$t('header.top.h5')}}
              <div class="appcode">
                <img src="~/assets/img/h5.png"/>
                <p>{{$t('header.top.h5')}}</p>
              </div>
            </div>
            <div class="li">{{$t('header.top.app')}}
              <div class="appcode">
                <img src="~/assets/img/android.png"/>
                <p>{{$t('header.top.android')}}</p>
              </div>
            </div>

          </div>
          <div class="login">
            <template v-if="user.cellphone">
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
            </template>
            <template v-else>
              <div class="li" @click="goLogin">{{$t('header.top.login')}}</div>
            </template>
            <NuxtLink class="li" to="/user/notice/list">{{$t('header.top.message')}}</NuxtLink>
            <NuxtLink
              class="li"
              v-for="locale in availableLocales"
              :key="locale.code"
              :to="switchLocalePath(locale.code)"><span @click="handleChangeLang(locale.code)">{{ locale.name }}</span></NuxtLink>
            <div class="li cart" :class="{ on: $nuxt.$store.state.shoppingCartNumber }" @mouseenter="userCart" @mouseleave="userCartOut">
              <NuxtLink :to="{ path: '/cart'}"><div class="cart-navigation"><i class="iconfont" :class="$nuxt.$store.state.shoppingCartNumber > 0 ? 'dsshop-gouwuche1' : 'dsshop-gouwuche'"></i>{{$t('header.top.cart')}}({{$nuxt.$store.state.shoppingCartNumber}})</div></NuxtLink>
              <el-collapse-transition>
                <div class="cart-box" v-show="cartActive" v-loading="cartLoading">
                <template v-if="$nuxt.$store.state.shoppingCartNumber">
                  <div class="cart-list">
                    <div class="cart-li" v-for="(item, index) in shoppingCart" :key="index">
                      <NuxtLink class="image" :to="{ path: `/product/detail/${item.good_id}`}">
                      <el-image
                        :src="item.img"
                        fit="scale-down"/>
                      </NuxtLink>
                      <NuxtLink :to="{ path: `/product/detail/${item.good_id}`}" class="title">
                        {{item.name}}
                      </NuxtLink>
                      <div class="price">{{item.price}}{{$t('common.monetary_unit')}} × {{item.number}}</div>
                      <div class="close"><i class="el-icon-delete" @click="deleteCart(index)"></i></div>
                      <div class="invalid" v-if="item.invalid">
                        {{$t('header.top.failure_of_goods')}}
                      </div>
                    </div>
                  </div>
                  <div class="cart-total">
                    <div class="number">
                      <div class="name">{{$t('header.top.common', { number: $nuxt.$store.state.shoppingCartNumber})}}</div>
                      <div class="price"><span>{{ shoppingTotal }}</span>{{$t('common.monetary_unit')}}</div>
                    </div>
                    <div class="operation">
                      <NuxtLink :to="{ path: '/cart'}"><el-button type="danger">{{$t('header.top.settle')}}</el-button></NuxtLink>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="msg-empty">{{$t('header.top.no_goods_cart')}}</div>
                </template>
              </div>
              </el-collapse-transition>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 顶部导航 end-->
    <!-- 导航-->
    <div class="container">
      <div class="top-nav">
        <NuxtLink class="li" to="/"><img class="logo" src="~/assets/img/logo.png"/></NuxtLink>
        <div class="nav">
          <div class="menu">
            <NuxtLink class="li" :class="index === navActive ? 'active' : ''" v-for="(item, index) in navList" :key="index" :to="{ path: item.path, query: item.query}">{{item.name}}</NuxtLink>
          </div>
          <el-form :model="searchRuleForm" :rules="rules" ref="searchRuleForm" label-width="100px" class="searchRuleForm" @submit.native.prevent>
            <el-form-item prop="keyword">
              <el-input placeholder="" v-model="searchRuleForm.keyword" class="input-with-select">
                <el-button class="button-search" slot="append" icon="el-icon-search" native-type="submit" @click="search"/>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 导航 end-->
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/Header";
</style>

<script>
import js from './js/Header'
export default js
</script>
