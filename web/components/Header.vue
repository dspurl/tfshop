<template>
  <div class="header">
    <!-- 顶部导航-->
    <div class="site-topbar">
      <div class="container">
        <div class="topbar-nav">
          <div class="menu"></div>
          <div class="login">
            <NuxtLink class="li" to="/pass/login">登录</NuxtLink>
            <NuxtLink class="li" to="/pass/register">注册</NuxtLink>
            <NuxtLink class="li" to="/pass/notification">消息通知</NuxtLink>
            <div class="li cart">
              <i class="iconfont dsshop-gouwuche"></i>购物车(0)
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
            <NuxtLink class="li" to="/pass/login">帮助中心</NuxtLink>
            <NuxtLink class="li" to="/pass/login">一级菜单</NuxtLink>
            <NuxtLink class="li" to="/pass/login">一级菜单</NuxtLink>
            <NuxtLink class="li" to="/pass/login">一级菜单</NuxtLink>
            <NuxtLink class="li" to="/pass/login">一级菜单</NuxtLink>
            <NuxtLink class="li" to="/pass/login">一级菜单</NuxtLink>
            <NuxtLink class="li" to="/pass/login">一级菜单</NuxtLink>
          </div>
          <el-form :model="searchRuleForm" :rules="rules" ref="searchRuleForm" label-width="100px" class="searchRuleForm" @submit.native.prevent>
            <el-form-item prop="keyword">
              <el-input placeholder="苹果电脑" v-model="searchRuleForm.keyword" class="input-with-select">
                <el-button class="button-search" slot="append" icon="el-icon-search"/>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 导航 end-->
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchRuleForm: {
        keyword: ''
      },
      rules: {
        keyword: [
          { required: true, message: '请输入关键字', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(){

    }
  }
}
</script>
<style lang='scss'>
  .header{
    background-color: #ffffff;
  }
  .top-nav{
    display: flex;
    .logo{
      width: 80px;
      height: 80px;
    }
    .nav{
      margin-left:50px;
      margin-top:20px;
      flex:1;
      display: flex;
      .menu{
        margin-top:10px;
        flex:1;
        .li{
          padding: 0 10px 0 10px;
        }
        .li:hover{
          color: #FA436A;
        }
      }
      .searchRuleForm{
        width: 400px;
        .button-search{
          background-color: #ffffff;
        }
      }
    }
  }
  .site-topbar{
    position: relative;
    z-index: 30;
    height: 40px;
    font-size: 12px;
    color: #b0b0b0;
    background: #333;
  }
  .topbar-nav{
    display: flex;
    .menu{
      flex:1;
    }
    .login{
      justify-content: right;
      display: flex;
      .li{
        padding:0 10px 0 10px;
        line-height: 40px;
        color: #b0b0b0;
      }
      .li:hover{
        color: #ffffff;
      }
      .cart{
        color: #b0b0b0;
        background: #424242;
        line-height: 39px;
      }
      .cart:hover{
        color: #fa524c;
      }
    }
  }
</style>
