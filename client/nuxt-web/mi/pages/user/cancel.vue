<template>
  <div class="box">
    <div class="user-title">{{$t('cancel.apply_for')}}</div>
    <div v-loading="loading">
      <el-card class="card">
        <div class="title">{{$t('cancel.title')}}</div>
        <div class="condition">
          <div class="name">{{$t('cancel.safe_state')}}</div>
          <div class="explain">{{$t('cancel.astrict')}}</div>
        </div>
        <el-divider></el-divider>
        <div class="condition">
          <div class="name">{{$t('cancel.dispute')}}</div>
          <div class="explain">{{$t('cancel.no_dispute')}}</div>
        </div>
        <el-divider></el-divider>
        <div class="condition">
          <div class="name">{{$t('cancel.unfinished')}}</div>
          <div class="explain">{{$t('cancel.nothing_progress')}}</div>
        </div>
        <div class="notice">
          <el-checkbox v-model="checked" @change="agree">{{$t('cancel.know')}}<span class="text-red">《{{$t('cancel.notice')}}》</span></el-checkbox>
        </div>
        <div class="button">
          <el-button @click="cancel()" :disabled="disabled" type="danger">{{$t('cancel.affirm')}}</el-button>
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
