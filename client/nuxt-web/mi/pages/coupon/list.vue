<template>
  <div class="box">
    <div class="user-title">我的优惠券</div>
    <el-tabs class="padding-top-20" v-model="listQuery.index" @tab-click="getReloadList">
      <el-tab-pane label="全部" name="0"></el-tab-pane>
      <el-tab-pane label="未使用" name="1"></el-tab-pane>
      <el-tab-pane label="已使用" name="2"></el-tab-pane>
      <el-tab-pane label="已失效" name="3"></el-tab-pane>
    </el-tabs>
    <div v-loading="loading">
        <div class="list">
          <div class="li" v-for="(item,index) in list" :key="index">
            <div class="top" :class="{on: !item.state}">
              <div class="money" v-if="item.coupon.type === 3">{{ item.coupon.cost/100 }}<span>%</span></div>
              <div class="money" v-else><span>¥</span>{{ item.coupon.cost/100 | thousands }}</div>
              <div class="name">{{item.coupon.name}}</div>
              <div class="time" v-if="item.coupon.end_time">{{ item.coupon.end_time | moment('YYYY.MM.DD')}}</div>
              <div class="time" v-else>不限</div>
            </div>
            <div class="style-six"></div>
            <div class="explain">
              <div class="dl"><div class="dt">使用条件:</div><div class="dd">{{ item.coupon.explain }}</div></div>
              <div class="dl" v-if="item.coupon.end_time"><div class="dt">有效时间:</div><div class="dd">{{item.created_at | moment('YYYY.MM.DD')}} 至 {{item.coupon.end_time | moment('YYYY.MM.DD')}}</div></div>
              <div class="dl" v-else><div class="dt">有效时间:</div><div class="dd">不限</div></div>
              <div class="button" v-if="!item.state">
                <NuxtLink :to="{ path: '/product/list'}">
                  <el-button size="mini" type="primary" round>立即使用</el-button>
                </NuxtLink>
              </div>
              <div class="icon">
                <div class="iconfont icon-yishiyong" v-if="item.state === 1"></div>
                <div class="iconfont icon-yiguoqi" v-if="item.state === 2"></div>
              </div>
            </div>
          </div>
        </div>
      <div class="operation">
        <pagination v-if="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/list";
</style>

<script>
  import js from './js/list'
  export default js
</script>
