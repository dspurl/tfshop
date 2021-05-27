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

<style lang='scss' scoped>
  @import "./scss/detail";
</style>

<script>
  import js from './js/detail'
  export default js
</script>
