<template>
	<div>
    <el-popover
      placement="bottom"
      width="400"
      trigger="click"
      @show="popover">
      <div class="ul">
        <div class="li" v-for="(item,index) in list" :key="index">
          <div class="money"><span v-if="item.type !== 3">￥</span>{{ item.cost/100 }}<span v-if="item.type === 3">%</span></div>
          <div class="explain">
            <div class="name">{{ item.explain }}</div>
            <div class="time" v-if="item.end_time">{{ item.start_time | moment('YYYY.MM.DD') }} - {{item.end_time | moment('YYYY.MM.DD')}}</div>
            <div class="time" v-else>不限</div>
          </div>
          <el-button class="button" type="primary" size="mini" @click="getCreate(item)" :loading="buttonLoading" :disabled="item.limit_get > 0 && item.user_coupon_count >= item.limit_get">{{item.limit_get > 0 && item.user_coupon_count >= item.limit_get ? '已领' : '领取'}}</el-button>
        </div>
      </div>
      <el-tag
        class="tag"
        slot="reference"
        type="danger"
        effect="plain">
        优惠券
      </el-tag>
    </el-popover>
	</div>
</template>
<style lang='scss' scoped>
  @import "./scss/index";
</style>

<script>
  import js from './js/index'
  export default js
</script>
