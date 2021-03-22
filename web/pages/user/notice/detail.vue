<template>
  <div class="box">
    <div class="user-title">消息通知-详情</div>
    <div v-loading="loading">
      <el-card shadow="hover" class="card" v-if="notice.data">
        <div class="title">{{ notice.data.title }}</div>
        <template v-if="notice.data.type === 2">
          <div class="text-money-name">付款金额</div>
          <div class="text-money-value">{{notice.data.price/100 | thousands}}</div>
        </template>
        <div class="padding-bottom" v-if="notice.data.list.length > 0" v-for="(item, index) in notice.data.list" :key="index">
          <div class="text-gray padding-right">{{item.keyword}}</div>
          <div>{{item.data}}</div>
        </div>
        <div class="introduce" v-if="notice.data.remark">
          {{notice.data.remark}}
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
      title: '个人中心-消息通知',
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
        this.$router.go(-1)
        return false
      }
      await Promise.all([
        detail($nuxt.$route.query.id)
      ]).then(([notificationData]) => {
        this.notice = notificationData
        this.loading = false
      }).catch((error) => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang='scss' scoped>
  .user-title{
    color: #757575;
    font-weight: 400;
    font-size: 18px;
    margin-bottom: 20px;
  }
  .card{
    margin:0 auto;
    width: 600px;
  }
</style>
