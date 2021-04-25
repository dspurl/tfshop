<template>
  <div class="box">
    <el-page-header @back="goBack" content="详情">
    </el-page-header>
    <div v-loading="loading">
      <el-card shadow="hover" class="card" v-if="notice.data">
        <div class="title">{{ notice.data.title }}</div>
        <template v-if="notice.data.type === 2">
          <div class="text-money-name">付款金额</div>
          <div class="text-money-value">{{notice.data.price/100 | thousands}}</div>
        </template>
        <div class="card-list" v-if="notice.data.list.length > 0" v-for="(item, index) in notice.data.list" :key="index">
          <div class="card-list-title">{{item.keyword}}：</div>
          <div>{{item.data}}</div>
        </div>
        <div class="introduce" v-if="notice.data.remark">
          {{notice.data.remark}}
        </div>
        <el-divider></el-divider>
        <div class="link">
          <el-button v-if="notice.data.url" type="danger" @click="goNavigator(item.data.url)">查看详情</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {detail} from '@/api/notification'
export default {
  layout: 'user',
  head () {
    return {
      title: '消息通知-个人中心',
    }
  },
  data() {
    return {
      loading: true,
      notice:{}
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    async getDetail(){
      if(!$nuxt.$route.query.id){
        this.$message({
          message: '参数有误，请联系管理员',
          type: 'error'
        });
        $nuxt.$router.go(-1);
        return false
      }
      await Promise.all([
        detail($nuxt.$route.query.id)
      ]).then(([notificationData]) => {
        this.notice = notificationData;
        this.loading = false
      }).catch((error) => {
        this.loading = false
      })
    },
    goBack() {
      $nuxt.$router.go(-1)
    },
    goNavigator(url){
      // 为了兼容老版本
      uni.navigateTo({
        url: url.replace('pages','user')
      })
    },
  }
}
</script>
<style lang='scss' scoped>
  .card{
    margin: 30px auto 0;
    width: 600px;
    .title{
      font-size: 20px;
      margin-bottom: 30px;
    }
    .text-money-name{
      text-align: center;
      color: #999999;
    }
    .text-money-value{
      margin-top:10px;
      text-align: center;
      font-size: 30px;
      margin-bottom: 10px;
    }
    .card-list{
      display: flex;
      padding-bottom: 5px;
      font-size: 14px;
      .card-list-title{
        width:80px;
        text-align: right;
        margin-right:10px;
        color: #999999;
      }
    }
    .introduce{
      font-size: 14px;
      margin-top:20px;
      color: #999999;
    }
    .link{
      text-align: center;
    }
  }
</style>
