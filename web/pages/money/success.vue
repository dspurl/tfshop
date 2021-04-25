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

<script>
export default {
  layout: 'cart',
  middleware: 'auth',
  head () {
    return {
      title: '支付成功' + '-' + process.env.APP_NAME,
    }
  },
  data() {
    return {

    }
  },
  mounted() {
    $nuxt.$store.commit('setCartTitle', '支付成功');
  },
  methods: {
    go(path){
      $nuxt.$router.push(path);
    }
  }
}
</script>
<style lang='scss' scoped>
  .cart{
    margin-top:100px;
    margin-bottom: 100px;
    display: flex;
    position: relative;
    .empty-cart{
      img{
        width: 500px;
      }
    }
    .instructions{
      margin: 160px 0 0 50px;
      .title{
        font-size: 35px;
        color: #83c44e;
        line-height: 55px;
        font-weight: bold;
      }
      .login{
        font-size: 18px;
        line-height: 45px;
        color: #b0b0b0;
      }
      .operation{
        margin-top: 20px;
      }
    }
  }
</style>
