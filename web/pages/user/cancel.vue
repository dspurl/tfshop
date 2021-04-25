<template>
  <div class="box">
    <div class="user-title">注销申请</div>
    <div v-loading="loading">
      <el-card class="card">
        <div class="title">请确认您的账号是否满足以下注销条件</div>
        <div class="condition">
          <div class="name">账号处于安全状态</div>
          <div class="explain">账号处于正常状态，没有被封号等账户限制。</div>
        </div>
        <el-divider></el-divider>
        <div class="condition">
          <div class="name">账号无进行中的任何纠纷</div>
          <div class="explain">本账号无任何账号纠纷，包括投诉、举报或被投诉、被举报等。</div>
        </div>
        <el-divider></el-divider>
        <div class="condition">
          <div class="name">账号无未完成的业务</div>
          <div class="explain">没有正在进行中，或者尚未确认完成的交易。</div>
        </div>
        <div class="notice">
          <el-checkbox v-model="checked" @change="agree">我已阅读并知晓了<span class="text-red">《账号注册须知》</span></el-checkbox>
        </div>
        <div class="button">
          <el-button @click="cancel()" :disabled="disabled" type="danger">确认申请</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {cancel} from '@/api/user'
export default {
  layout: 'user',
  head () {
    return {
      title: '注销账户-个人中心',
    }
  },
  data() {
    return {
      loading: false,
      checked: false,
      disabled: true
    }
  },
  mounted() {

  },
  methods: {
    //注销提交
    cancel(){
      cancel(this.ruleForm).then(response => {
        this.loading = false;
        $nuxt.$store.commit('logout');
        this.$message({
          message: '注销成功',
          type: 'success'
        });
        this.$router.replace('/')
      }).catch(() => {
        this.loading = false
      })
    },
    agree(){
      if(this.checked){
        this.disabled = false
      }else{
        this.disabled = true
      }
    }
  }
}
</script>
<style lang='scss' scoped>
  .card{
    margin: 30px auto 0;
    width: 600px;
    .title{
      text-align: center;
      font-size: 20px;
      margin-bottom: 30px;
      margin-top:20px;
    }
    .condition{
      .name{
        font-size: 16px;
        margin-bottom: 5px;
      }
      .explain{
        font-size: 12px;
      }
    }
    .notice{
      margin:20px 0 20px 0;
      text-align: center;
      .text-red{
        color: #fa524c;
      }
    }
    .button{
      text-align: center;
    }
  }
  .user-title{
    color: #757575;
    font-weight: 400;
    font-size: 18px;
    margin-bottom: 20px;
  }
</style>
