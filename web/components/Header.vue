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
<script>
import { addShoppingCart, synchronizationInventory } from '@/api/goodIndent'
export default {
  data() {
    const validateRemark = (rule, value, callback) => {
      const flag = new RegExp("[`~!@#$^&*()=|{}':'\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘：”“'。？ ]");
      if(flag.test(value)){
        return callback(new Error('不允许输入非法字符'));
      }else{
        callback();
      }
    };
    return {
      navList: [
        { name: '首页', path: '/' },
        { name: '全部分类', path: '/category/list' }
      ],
      shoppingCart: [],
      cartOriginalList: [],
      cartLoading: false,
      shoppingTotal: 0,
      navActive: -1,
      searchRuleForm: {
        keyword: ''
      },
      cartActive: false,
      userActive: false,
      user:{},
      rules: {
        keyword: [
          { validator: validateRemark, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal){
        this.setNavActive(val.path)
      },
      deep: true
    }
  },
  mounted() {
    this.setNavActive($nuxt.$route.path)
    this.userInfo()
    if(this.$store.state.hasLogin) {
      this.getShoppingCart()
    }
    this.searchRuleForm.keyword = $nuxt.$store.state.setSearchKeyword
  },
  methods: {
    // 获取购物车
    getShoppingCart(){
      this.cartLoading = true
      let cartList = this.store.get(process.env.CACHE_PR + 'CartList') ? Object.values(this.store.get(process.env.CACHE_PR + 'CartList')) : [];
      let total = 0;
      synchronizationInventory().then(response => {
        this.cartLoading = false;
        this.cartOriginalList = response
        cartList = Object.values(response)
        for(const k in cartList){
          cartList[k].checked = true
          cartList[k].loaded = 'loaded'
          if(cartList[k].good_sku){
            cartList[k].good_sku.skus.forEach(item=>{
              if(cartList[k].specification){
                cartList[k].specification+= item.v + ';'
              }else{
                cartList[k].specification = item.v + ';'
              }

            })
            cartList[k].specification = cartList[k].specification.substr(0,cartList[k].specification.length-1)
          }
          if(cartList[k].good.is_delete === 1 || cartList[k].good.is_show !== 1){
            cartList[k].invalid = true
          }
          total += cartList[k].price * cartList[k].number;
        }
        this.shoppingCart = cartList;
        $nuxt.$store.commit('setShoppingCartNumber', Object.values(cartList).length)
        this.shoppingTotal = Number(total.toFixed(2));
      }).catch(() => {
        this.cartLoading = false
      })
    },
    setNavActive(path){
      for (let i=0;i<this.navList.length;i++)
      {
        if(this.navList[i].path.split('\/')[1]  === path.split('\/')[1]){
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
    userCart(){
      this.cartActive = true
      if(this.$store.state.hasLogin){
        this.getShoppingCart()
      }
    },
    userCartOut(){
      this.cartActive = false
    },
    goLogin(){
      $nuxt.store.set('route', { path:$nuxt.$route.path, query:$nuxt.$route.query })
      $nuxt.$router.replace('/pass/login')
    },
    logout(){
      $nuxt.$store.commit('logout')
      $nuxt.$router.go(0)
    },
    submitForm(){

    },
    userInfo(){
      if($nuxt.$store.state.hasLogin){
        this.user = $nuxt.store.get(process.env.CACHE_PR + 'UserInfo')
      }
    },
    // 删除商品
    deleteCart(index){
      if(this.shoppingCart[index].good_sku_id){
        delete this.cartOriginalList[this.shoppingCart[index].good_sku_id]
      }else{
        delete this.cartOriginalList['good_'+this.shoppingCart[index].good_id]
      }

      this.shoppingCart.splice(index, 1)
      this.store.set(process.env.CACHE_PR + 'CartList',this.cartOriginalList)
      addShoppingCart(this.cartOriginalList)
      this.getShoppingCart()
    },
    // 搜索
    search(){
      this.$refs['searchRuleForm'].validate((valid) => {
        if (valid) {
          $nuxt.$store.commit('setSearchKeyword', this.searchRuleForm.keyword)
          this.$router.push({
            path: `/product/list`,
            query: { title: this.searchRuleForm.keyword }
          })
        }
      });
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
      width: 60px;
      height: 60px;
      margin-top:10px;
      margin-bottom: 10px;
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
          color: $font-color-main;
        }
        .li{
          padding: 0 10px 0 10px;
        }
        .li:hover{
          color: $font-color-main;
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
      display: flex;
      .li{
        padding: 0 10px 0 10px;
        line-height: 40px;
        color: #b0b0b0;
        cursor: pointer;
        position: relative;
        .appcode{
          display: none;
          position: absolute;
          left: -30px;
          box-shadow: 0 1px 5px #aaa;
          text-align: center;
          font-size: 14px;
          line-height: 14px;
          color: #333;
          background-color: #ffffff;
          .padding{
            padding:10px;
          }
          p{
            padding-bottom: 10px;
          }
          img{
            width: 120px;
          }
        }
      }
      .li:hover{
        color: #ffffff;
        .appcode{
          display: block;
        }
      }
    }
    .login{
      justify-content: right;
      display: flex;
      .li{
        padding:0 10px 0 10px;
        line-height: 40px;
        color: #b0b0b0;
        cursor:pointer;
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
      .li:hover{
        color: #ffffff;
      }
      .cart{
        color: #b0b0b0;
        background: #424242;
        line-height: 40px;
        height: 40px;
        position: relative;
        .iconfont{
          margin-right: 5px;
        }
        .cart-navigation{
          cursor:pointer;
        }
        .cart-box{
          position: absolute;
          background-color: #ffffff;
          width: 300px;
          box-shadow: 0 2px 10px #999999;
          overflow: hidden;
          right: 0;
          .cart-list{
            padding:10px;
            .cart-li{
              font-size: 12px;
              display: flex;
              align-items: center;
              color: #424242;
              border-bottom: 1px solid #e0e0e0;
              position: relative;
              .image{
                margin-top:20px;
                width: 45px;
                margin-right: 10px;
                image{
                  width: 100%;
                }
              }
              .title{
                line-height: 18px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                margin-right: 20px;
                width: 120px;
                color: #424242;
              }
              .title:hover{
                color: $font-color-main;
              }
              .price{
                width: 80px;
              }
              .close{
                flex-shrink: 0;
                width: 12px;
                color: #b0b0b0;
                cursor:pointer;
              }
              .close:hover{
                color: $font-color-main;
              }
              .invalid{
                position: absolute;
                left: 0;
                top: 0;
                background: rgba(0, 0, 0, 0.3);
                width: 100%;
                height: 100%;
                color: #ffffff;
                font-size: 16px;
                text-align: center;
                padding-top:20px;
              }
            }
            .cart-li:last-child{
              border-bottom:none;
            }
          }
          .msg-empty{
            padding: 20px 0 20px;
            color: #424242;
            text-align: center;
          }
          .cart-total{
            padding: 15px 20px;
            background: #fafafa;
            display: flex;
            .number{
              flex:1;
              font-size: 12px;
              color: #424242;
              .name{
                line-height: normal;
              }
              .price{
                line-height: normal;
                color: $font-color-main;
                span{
                  font-size: 22px;
                }
              }
            }
            .operation{
              width: 126px;
            }
          }
        }
      }
      .cart:hover{
        color: $font-color-main;
      }
      .cart.on{
        background-color: $font-color-main;
        color: #ffffff;
        .cart-navigation{
          color: #ffffff;
        }
      }
    }
  }
</style>
