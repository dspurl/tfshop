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

<style lang='scss' scoped>
  @import "./scss/cancel";
</style>

<script>
import js from './js/cancel'
export default js
</script>
