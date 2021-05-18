<template>
  <div class="header">
    <!-- 顶部导航-->
    <div class="site-topbar">
      <div class="container">
        <div class="topbar-nav">
          <div class="menu">
            <div class="li">微信小程序
              <div class="appcode">
                <img class="padding" src="~/assets/img/miniweixin.jpg"/>
                <p>微信小程序</p>
              </div>
            </div>
            <div class="li">h5
              <div class="appcode">
                <img src="~/assets/img/h5.png"/>
                <p>h5</p>
              </div>
            </div>
            <div class="li">下载APP
              <div class="appcode">
                <img src="~/assets/img/android.png"/>
                <p>安卓APP</p>
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
                      <li><NuxtLink class="a" to="/user/portal">个人中心</NuxtLink></li>
                      <li><NuxtLink class="a" to="/user/collect">我的收藏</NuxtLink></li>
                      <li><div class="a" @click="logout">退出登录</div></li>
                    </ul>
                  </div>
                </el-collapse-transition>
              </div>
              <NuxtLink class="li" to="/user/indent/list">我的订单</NuxtLink>
            </template>
            <template v-else>
              <div class="li" @click="goLogin">登录</div>
              <NuxtLink class="li" to="/pass/register">注册</NuxtLink>
            </template>
            <NuxtLink class="li" to="/user/notice/list">消息通知</NuxtLink>
            <div class="li cart" :class="{ on: shoppingCart.length > 0 }" @mouseenter="userCart" @mouseleave="userCartOut">
              <NuxtLink :to="{ path: '/cart'}"><div class="cart-navigation"><i class="iconfont" :class="shoppingCart.length > 0 ? 'dsshop-gouwuche1' : 'dsshop-gouwuche'"></i>购物车({{$nuxt.$store.state.shoppingCartNumber}})</div></NuxtLink>
              <el-collapse-transition>
                <div class="cart-box" v-show="cartActive" v-loading="cartLoading">
                <template v-if="shoppingCart.length > 0">
                  <div class="cart-list">
                    <div class="cart-li" v-for="(item, index) in shoppingCart" :key="index">
                      <NuxtLink class="image" :to="{ path: '/product/detail', query: { id: item.good_id }}">
                      <el-image
                        :src="item.img"
                        fit="scale-down"/>
                      </NuxtLink>
                      <NuxtLink :to="{ path: '/product/detail', query: { id: item.good_id }}" class="title">
                        {{item.name}}
                      </NuxtLink>
                      <div class="price">{{item.price}}元 × {{item.number}}</div>
                      <div class="close"><i class="el-icon-delete" @click="deleteCart(index)"></i></div>
                      <div class="invalid" v-if="item.invalid">
                        商品已失效
                      </div>
                    </div>
                  </div>
                  <div class="cart-total">
                    <div class="number">
                      <div class="name">共 {{ $nuxt.$store.state.shoppingCartNumber }} 件商品</div>
                      <div class="price"><span>{{ shoppingTotal }}</span>元</div>
                    </div>
                    <div class="operation">
                      <NuxtLink :to="{ path: '/cart'}"><el-button type="danger">去购物车结算</el-button></NuxtLink>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="msg-empty">购物车中还没有商品，赶紧选购吧！</div>
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
