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
                    <li><NuxtLink class="a" to="/user/portal">个人中心</NuxtLink></li>
                    <li><NuxtLink class="a" to="/user/collect">我的收藏</NuxtLink></li>
                    <li><div class="a" @click="logout">退出登录</div></li>
                  </ul>
                </div>
              </el-collapse-transition>
            </div>
            <NuxtLink class="li" to="/user/indent/list">我的订单</NuxtLink>
          </div>
        </template>
        <template v-else>
          <NuxtLink to="/pass/login">登录</NuxtLink>
          <el-divider direction="vertical"></el-divider>
          <NuxtLink to="/pass/register">注册</NuxtLink>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        user:{},
        userActive: false,
      }
    },
    mounted() {
      this.userInfo()
    },
    methods: {
      userInfo(){
        if(this.$store.state.hasLogin){
          this.user = this.store.get(process.env.CACHE_PR + 'UserInfo')
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
    }
  }
</script>
<style lang='scss' scoped>
  .min-header{
    background-color: #ffffff;
    padding: 10px 0 10px 0;
    border-bottom: 2px solid $font-color-main;
    .container{
      display: flex;
      position: relative;
      .logo{
        width: 80px;
        height: 80px;
      }
      .title{
        font-size: 28px;
        line-height: 80px;
        margin-left:10px;
      }
      .right{
        position: absolute;
        right: 0;
        top:35px;
        font-size: 12px;
        a{
          color: #757575;
        }
        a:hover{
          color: $font-color-main;
        }
        .right-box{
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
              color: $font-color-main;
            }
          }
          .li:hover{
            color: $font-color-main;
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
              color: $font-color-main;
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
              color: $font-color-main;
            }
          }
        }
      }
    }
  }
</style>
