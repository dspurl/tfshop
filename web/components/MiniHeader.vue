<template>
  <div class="min-header">
    <div class="container">
      <NuxtLink to="/"><img class="logo" src="~/assets/img/logo.png"/></NuxtLink>
      <NuxtLink to="/"><div class="title">DSSHOP商城</div></NuxtLink>
    </div>
  </div>
</template>

<style lang='scss' scoped>
  .min-header{
    background-color: #ffffff;
    padding: 10px 0 10px 0;
    .container{
      display: flex;
      .logo{
        width: 60px;
        height: 60px;
        margin-top:10px;
        margin-bottom: 10px;
      }
      .title{
        font-size: 28px;
        line-height: 80px;
        margin-left:10px;
      }
    }
  }
</style>
