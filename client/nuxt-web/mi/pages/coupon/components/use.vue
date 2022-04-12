<template>
	<div>
    <div class="coupon">
      <el-popover
        placement="bottom"
        width="400"
        trigger="click"
        v-model="visible">
        <div class="ul">
          <div class="li" v-for="(item,index) in list" :key="index">
            <div class="money"><span>￥</span>{{ item.cost }}</div>
            <div class="explain">
              <div class="name">{{ item.coupon.explain }}</div>
              <div class="time" v-if="item.coupon.end_time">有效期至{{item.coupon.end_time | moment('YYYY.MM.DD')}}</div>
              <div class="time" v-else>不限</div>
            </div>
            <el-button class="button" type="primary" size="mini" @click="select(item, index)" :loading="buttonLoading" :disabled="couponIndex === index">{{couponIndex === index ? '已选' : '选择'}}</el-button>
          </div>
        </div>
        <div class="tag" slot="reference">
          <template v-if="list[couponIndex]">
            {{list[couponIndex].coupon.name}}
          </template>
          <template v-else>
            选择优惠券
          </template>
          <i class="el-icon-caret-bottom"></i>
        </div>
      </el-popover>
    </div>
	</div>
</template>
<style lang='scss' scoped>
  @import "./scss/use";
</style>

<script>
  import js from './js/use'
  export default js
</script>
