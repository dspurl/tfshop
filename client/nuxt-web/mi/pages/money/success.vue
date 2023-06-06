<template>
  <div class="box">
    <div class="cart container">
      <div class="empty-cart">
        <img :src="require('assets/img/payment-success.png')"/>
      </div>
      <div class="instructions">
        <div class="title">{{$t('money.success')}}！</div>
        <div class="login" v-if="!$store.state.hasLogin">{{$t('money.success.after_login')}}</div>
        <div class="operation">
          <NuxtLink class="li" to="/category/list"><el-button type="danger" plain>{{$t('money.success.go_on_shopping')}}</el-button></NuxtLink>
          <NuxtLink class="li" to="/user/indent/list"><el-button type="danger">{{$t('header.top.order')}}</el-button></NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/success";
</style>

<script>
import js from './js/success'
export default js
</script>
