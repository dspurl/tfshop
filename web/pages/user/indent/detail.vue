<template>
  <div class="box">
    <el-page-header @back="goBack" content="订单详情">
    </el-page-header>
    <div v-loading="loading">
      <div class="top">
        <div class="order-number">订单号：21312312312321</div>
        <div class="operation">
          <el-button size="mini">取消订单</el-button>
          <el-button size="mini" type="danger">立即付款</el-button>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="steps-box">
        <div class="title">等待付款</div>
        <div class="steps">
          <div class="on">
            <div class="chunk">下单</div>
          </div>
          <div class="on">
            <div class="chunk">付款</div>
            <div class="name"></div>
          </div>
          <div class="">
            <div class="chunk">配货</div>
            <div class="name"></div>
          </div>
          <div class="">
            <div class="chunk">交易成功</div>
            <div class="name"></div>
          </div>
        </div>
      </div>
      <div class="steps-box-time">
        <div class="steps">
          <div>
            <div class="chunk">03月31日 15:34</div>
          </div>
          <div>
            <div class="chunk"></div>
          </div>
          <div>
            <div class="chunk"></div>
          </div>
          <div>
            <div class="chunk"></div>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="address">
        <div class="min-title">收货信息</div>
        <div class="li">
          <div class="name">姓名：</div>
          <div class="value">吴经理</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {detail} from '@/api/goodIndent'
export default {
  layout: 'user',
  head () {
    return {
      title: '订单详情-个人中心',
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
    }
  }
}
</script>
<style lang='scss' scoped>
  .top{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top:20px;
  }
  .steps-box-time{
    .steps{
      display: flex;
      font-size: 12px;
      line-height: 25px;
      margin-top:5px;
      div{
        flex:1;
        text-align: center;
      }
    }
  }
  .steps-box{
    .title{
      color: #fa524c;
      margin-bottom: 10px;
    }
    .steps{
      display:flex;
      border-radius:5px;
      background-color: #e1e1e1;
      font-size: 12px;
      line-height: 25px;
      .on{
        background-color: #fa524c;
        color: #ffffff;
        border-radius:5px;
      }
      div{
        flex:1;
        .chunk{
          text-align: center;
        }
      }
    }
  }
</style>
