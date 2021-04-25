<template>
  <div class="box" v-loading="loading">
    <div class="portal-main">
      <div class="user-card">
        <el-avatar :size="80" >
          <img :src="user.portrait ? user.portrait : require('assets/img/portrait.gif')"/>
        </el-avatar>
        <div class="card-box">
          <div class="username">{{ user.cellphone ? (user.nickname ? user.nickname : user.cellphone) : '游客' }}</div>
          <div class="money">{{ (user.money ? user.money : 0) | thousands }}</div>
          <NuxtLink class="personal" to="/user/userinfo">修改个人信息></NuxtLink>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="indent-box">
      <div class="li">
        <div class="icon bg-blue"><i class="iconfont dsshop-icon-"></i></div>
        <div class="describe">
          <div class="name">待支付的订单：<span>{{ quantity.obligation ? quantity.obligation : 0 }}</span></div>
          <NuxtLink class="link" :to="{ path: '/user/indent/list', query: { index: 1 }}">查看待支付订单 ></NuxtLink>
        </div>
      </div>
      <div class="li">
        <div class="icon bg-purple"><i class="iconfont dsshop-daifahuo"></i></div>
        <div class="describe">
          <div class="name">待发货的订单：<span>{{ quantity.waitdeliver ? quantity.waitdeliver : 0 }}</span></div>
          <NuxtLink class="link" :to="{ path: '/user/indent/list', query: { index: 2 }}">查看待发货订单 ></NuxtLink>
        </div>
      </div>
      <div class="li">
        <div class="icon bg-pink"><i class="iconfont dsshop-daishouhuofuben"></i></div>
        <div class="describe">
          <div class="name">待收货的订单：<span>{{ quantity.waitforreceiving ? quantity.waitforreceiving : 0 }}</span></div>
          <NuxtLink class="link" :to="{ path: '/user/indent/list', query: { index: 3 }}">查看待收货订单 ></NuxtLink>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="user-title">浏览历史</div>
    <div class="browse-box">
      <NuxtLink class="card" v-for="(item, index) in browseList" :key="index" :to="{ path: '/product/detail', query: { id: item.good_id }}">
        <el-image
          class="image"
          :src="item.good.resources.img | smallImage(200)"
          fit="cover"
          lazy/>
        <div class="name">{{item.good.name}}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import {getList as getBrowseList} from '@/api/browse'
import {detail as getUserDetail} from '@/api/user'
import {quantity} from '@/api/goodIndent'
export default {
  layout: 'user',
  head () {
    return {
      title: '个人中心',
    }
  },
  data() {
    return {
      loading: true,
      user:{},
      browseList: [],
      quantity: {
        all: 0,
        obligation: 0,
        waitdeliver: 0,
        waitforreceiving: 0
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList(){
      await Promise.all([
        getBrowseList({
          limit: 7,
          sort: '-updated_at'
        }),
        getUserDetail(),
        quantity()
      ]).then(([browseData, userData, quantityData]) => {
        this.browseList = browseData.data;
        this.user = userData;
        this.quantity = quantityData;
        this.loading = false
      }).catch((error) => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang='scss' scoped>
  .indent-box{
    display: flex;
    .li{
      display: flex;
      margin-right: 20px;
      .icon{
        display: flex;
        justify-content: center;
        align-items:center;
        border-radius: 50%;
        width: 80px;
        height: 80px;
        margin-right: 10px;
        .iconfont{
          color: #ffffff;
          font-size: 40px;
        }
      }
      .describe{
        margin-top:15px;
        .name{
          font-size: 18px;
          font-weight: 400;
          margin-bottom: 5px;
          span{
            color: #fa524c;
          }
        }
        .link{
          font-size: 12px;
        }
        .link:hover{
          color: #fa524c;
        }
      }
    }
  }
  .browse-box{
    display: flex;
    .card{
      width: 135px;
      margin-right: 8px;
      border: 1px solid #EBEEF5;
      padding:10px;
      .image{
        width: 100%;
        height: 120px;
      }
      .name{
        font-size: 14px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
  }
  .user-title{
    color: #757575;
    font-weight: 400;
    font-size: 18px;
    margin-bottom: 10px;
  }
  .portal-main{
    display: flex;
    .user-card{
      display: flex;
      width: 400px;
      .card-box{
        margin-left:20px;
        .username{
          font-size: 22px;
          font-weight: 400;
          color: #616161;
          padding: 0 0 0 0;
        }
        .money{
          line-height: 25px;
          color: #616161;
        }
        .personal{
          font-size: 12px;
          color: #fa524c;
        }
      }
    }
  }
</style>
