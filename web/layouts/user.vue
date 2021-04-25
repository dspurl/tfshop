<template>
  <div class="body">
    <Header />
    <div class="container user-portal">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item>
          <NuxtLink :to="{ path: '/' }">
            首页
          </NuxtLink>
        </el-breadcrumb-item>
        <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="user-box">
        <!-- 导航-->
        <div class="navigation">
          <div class="menu-box" v-for="(item, index) in menuList" :key="index">
            <div class="title">{{ item.name }}</div>
            <ul class="list">
              <li v-if="item.children" v-for="(item2, index2) in item.children" :key="index2"><NuxtLink :class="{ active: item2.active }" :to="{ path: item2.path, query: item2.query}">{{item2.name}}</NuxtLink></li>
            </ul>
          </div>
        </div>
        <!-- 导航 end-->
        <!-- 主体-->
        <div class="main-box">
          <Nuxt />
        </div>
        <!-- 主体-->
      </div>
    </div>
    <Footer />
    <el-backtop/>
  </div>
</template>
<script>
  export default {
    middleware: 'auth',
    data() {
      return {
        menuList: [
          {
            name: '个人中心',
            children: [
              { name: '我的个人中心', path: '/user/portal', active: false },
              { name: '消息通知', path: '/user/notice/list', active: false},
              { name: '我的收藏', path: '/user/collect', active: false},
              { name: '地址管理', path: '/user/address', active: false},
              { name: '我的账单', path: '/user/finance/list', active: false}
            ]
          },
          {
            name: '订单管理',
            children: [
              { name: '我的订单', path: '/user/indent/list', active: false }
            ]
          },
          {
            name: '账户管理',
            children: [
              { name: '个人资料', path: '/user/userinfo', active: false },
              { name: '修改密码', path: '/user/password', active: false },
              { name: '修改手机号', path: '/user/cellphone', active: false },
              { name: '注销服务', path: '/user/cancel', active: false}
            ]
          }
        ],
        menuActive: -1
      }
    },
    mounted() {
      this.setMenuActive($nuxt.$route.path)
    },
    watch: {
      $route: {
        handler: function(val, oldVal){
          this.setMenuActive(val.path)
        },
        deep: true
      }
    },
    methods: {
      setMenuActive(path) {
        for (let i = 0; i < this.menuList.length; i++) {
          if(this.menuList[i].children.length>0){
            for (let j = 0; j < this.menuList[i].children.length; j++) {
              if (this.menuList[i].children[j].path.split('\/')[2] === path.split('\/')[2]) {
                this.menuList[i].children[j].active = true
              } else {
                this.menuList[i].children[j].active = false
              }
            }
          }
        }
      }
    }
  }
</script>
<style lang='scss' scoped>
  .body {
    background-color: #f4f4f4;
  }
  .user-portal{
    .breadcrumb{
      margin: 20px 0 20px 0;
    }
  }
  .user-box{
    display: flex;
    align-items: flex-start;
    .navigation{
      width: 180px;
      background-color: #ffffff;
      padding:0 20px 20px 20px;
      margin-bottom: 20px;
      .menu-box{
        padding-top:20px;
        .title{
          font-size: 16px;
          font-weight: 400;
          line-height: 52px;
          color: #333;
        }
        .list{
          li{
            padding: 6px 0;
            a{
              color: #757575;
              font-size: 12px;
            }
            .active{
              color: $font-color-main;
            }
            a:hover{
              color: #333;
            }
          }
        }
      }
    }
    .main-box{
      flex:1;
      background-color: #ffffff;
      margin: 0 0 20px 10px;
      padding: 30px 20px 30px 20px;
    }
  }
</style>
