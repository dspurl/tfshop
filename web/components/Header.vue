<template>
  <div class="header">
    <!-- 顶部导航-->
    <div class="site-topbar">
      <div class="container">
        <div class="topbar-nav">
          <div class="menu"></div>
          <div class="login">
            <template v-if="user.cellphone">
              <div class="li user" :class="{ 'user-active': userActive }" @mouseover="userMenu" @mouseleave="userMenuOut">
                <NuxtLink to="/user/portal" class="user-name"><span>{{ user.nickname ? user.nickname : user.cellphone }}</span><i class="iconfont dsshop-xia"></i></NuxtLink>
                <div class="user-menu-wrapper">
                  <ul class="user-menu" :style="{height: userActive ? '100px' : 0}">
                    <li><NuxtLink class="a" to="/user/portal">个人中心</NuxtLink></li>
                    <li><NuxtLink class="a" to="/user/portal">我的收藏</NuxtLink></li>
                    <li><div class="a" @click="logout">退出登录</div></li>
                  </ul>
                </div>
              </div>
              <NuxtLink class="li" to="/pass/login">我的订单</NuxtLink>
            </template>
            <template v-else>
              <NuxtLink class="li" to="/pass/login">登录</NuxtLink>
              <NuxtLink class="li" to="/pass/register">注册</NuxtLink>
            </template>
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
            <NuxtLink class="li" :class="index === navActive ? 'active' : ''" v-for="(item, index) in navList" :key="index" :to="{ path: item.path, query: item.query}">{{item.name}}</NuxtLink>
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
      navList: [
        { name: '首页', path: '/' },
        { name: '帮助中心', path: '/new', query: { id: 1 } },
        { name: '视频', path: '/video' },
        { name: '直播', path: '/live' }
      ],
      navActive: -1,
      searchRuleForm: {
        keyword: ''
      },
      userActive: false,
      user:{},
      rules: {
        keyword: [
          { required: true, message: '请输入关键字', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.setNavActive()
    this.userInfo()
  },
  methods: {
    setNavActive(){
      for (let i=0;i<this.navList.length;i++)
      {
        if(this.navList[i].path.split('\/')[1]  === this.$route.path.split('\/')[1]){
          this.navActive = i
          break
        }
      }
    },
    userMenu(){
      this.userActive = true
    },
    userMenuOut(){
      this.userActive = false
    },
    logout(){
      this.$store.commit('logout')
      this.$router.go(0)
    },
    submitForm(){

    },
    userInfo(){
      if(this.$store.state.hasLogin){
        this.user = this.store.get(process.env.CACHE_PR + 'UserInfo')
        console.log('user',this.user)
      }
    }
  }
}
</script>
<style lang='scss' scoped>
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
        .active{
          color: #FA436A;
        }
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
        a{
          color: #b0b0b0;
          .iconfont{
            font-size: 12px;
            margin-left:10px;
            position: relative;
            top:1px;
          }
        }
        a:hover{
          color: #ffffff;
        }
      }
      .user{
        a{
          display: flex;
          padding: 0 10px 0 10px;
          span{
            display: inline-block;
            width: 70px;
            text-align: center;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }
      }
      .user-menu-wrapper{
        background: #fff;
      }
      .user-menu{
        overflow: hidden;
        padding-bottom: 10px;
        .a{
          padding: 3px 30px;
          color: #757575;
          line-height: 2;
          cursor:pointer;
        }
        .a:hover{
          color: #fa524c;
        }
      }
      .user-active{
        .user-name {
          background: #fff;
          color: #757575;
          width: 110px;
          text-align: center;
        }
        .user-name:hover{
          color: #fa524c;
        }
      }
      .li:hover{
        color: #ffffff;
      }
      .cart{
        color: #b0b0b0;
        background: #424242;
        line-height: 39px;
        height: 39px;
      }
      .cart:hover{
        color: #fa524c;
      }
    }
  }
</style>
