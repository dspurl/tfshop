<template>
  <div class="box">
    <div class="cart container">
      <div class="empty-cart">
        <img :src="require('assets/img/payment-success.png')"/>
      </div>
      <div class="instructions">
        <div class="title">支付成功！</div>
        <div class="login" v-if="!$store.state.hasLogin">登录后将显示您之前加入的商品</div>
        <div class="operation">
          <NuxtLink class="li" to="/category/list"><el-button type="danger" plain>继续购物</el-button></NuxtLink>
          <NuxtLink class="li" to="/user/indent/list"><el-button type="danger">我的订单</el-button></NuxtLink>
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
