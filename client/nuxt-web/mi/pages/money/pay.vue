<template>
  <div class="box">
    <div class="money-pay">
      <el-card class="container" shadow="always" v-loading="loading">
        <div class="pay-order">
          <div class="el-icon-circle-check"></div>
          <div class="order-info">
            <div class="title">订单提交成功！去付款咯～</div>
            <div class="warn">请在<span>
              <no-ssr>
                <vue-countdown @end="getList" v-if="list.overtime_time" :time="list.overtime_time * 1000" v-slot="{ days, hours, minutes, seconds }">
                  {{ days }} 天 {{ hours }} 小时 {{ minutes }} 分 {{ seconds }} 秒
                </vue-countdown>
              </no-ssr>
            </span>内完成支付, 超时后将取消订单</div>
            <div class="address" v-show="!detail" v-if="list.good_location">收货信息：{{list.good_location.name}} {{list.good_location.cellphone}} {{list.good_location.location}}<template v-if="list.good_location.address">({{ list.good_location.address }})</template></div>
            <div class="order-details" v-show="detail" v-if="list.good_location">
              <el-divider></el-divider>
              <ul>
                <li>
                  <div class="label">订单号：</div>
                  <div class="content"><span class="on">{{list.identification}}</span></div>
                </li>
                <li>
                  <div class="label">收货信息：</div>
                  <div class="content">{{list.good_location.name}} {{list.good_location.cellphone}} {{list.good_location.location}}<template v-if="list.good_location.address">({{ list.good_location.address }})</template></div>
                </li>
                <li>
                  <div class="label">商品名称：</div>
                  <div class="content"><span v-for="(item, index) in list.goods_list" :key="index">{{item.good.name}} </span></div>
                </li>
              </ul>
            </div>
            <div class="fright">
              <div class="total">应付总额：<div class="price"><span>{{(list.total ? list.total : 0)| thousands}}</span>元</div></div>
              <div v-if="list.good_location" class="show-detail" @click="showDetail">订单详情<i class="iconfont dsshop-xia"></i></div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="container mode-payment-box" shadow="always" v-loading="loading">
        <div class="title">选择以下支付方式付款</div>
        <el-divider></el-divider>
        <div class="min-title">支付方式</div>
        <div class="list">
          <div class="li" v-loading="buttonLoading" @click="payment('weixin')">
            <el-image
              class="image"
              :src="require('assets/img/weixin-pay.jpg')"
              fit="cover"/>
          </div>
          <div class="li" v-loading="buttonLoading" v-if="list.user" @click="payment(1)">
            预存款支付（{{list.user.money| thousands}}）
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog
        title="微信支付"
        :visible.sync="centerDialogVisible"
        :close-on-click-modal="false"
        width="400px"
        center>
        <div class="vue-qrcode">
          <vue-qrcode :value="qrcode" :options="{ width: 250 }"></vue-qrcode>
        </div>
        <div slot="footer" class="dialog-footer">
          <div>请使用<span class="main-color">微信</span>扫一扫</div>
          <div>二维码完成支付</div>
        </div>
    </el-dialog>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/pay";
</style>

<script>
import js from './js/pay'
export default js
</script>
