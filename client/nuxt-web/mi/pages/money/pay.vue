<template>
  <div class="box">
    <div class="money-pay">
      <el-card class="container" shadow="always" v-loading="loading">
        <div class="pay-order">
          <div class="el-icon-circle-check"></div>
          <div class="order-info">
            <div class="title">{{$t('money.pay.success')}}</div>
            <div class="warn">{{$t('money.please')}}<span>
              <no-ssr>
                <vue-countdown @end="getList" v-if="list.overtime_time" :time="list.overtime_time * 1000" v-slot="{ days, hours, minutes, seconds }">
                  {{ days }} {{$t('money.day')}} {{ hours }} {{$t('money.hour')}} {{ minutes }} {{$t('money.minute')}} {{ seconds }} {{$t('money.second')}}
                </vue-countdown>
              </no-ssr>
            </span>{{$t('money.pay.complete_payment')}}</div>
            <div class="address" v-show="!detail" v-if="list.good_location">{{$t('money.pay.receiving')}}：{{list.good_location.name}} {{list.good_location.cellphone}} {{list.good_location.location}}<template v-if="list.good_location.address">({{ list.good_location.address }})</template></div>
            <div class="order-details" v-show="detail" v-if="list.good_location">
              <el-divider></el-divider>
              <ul>
                <li>
                  <div class="label">{{$t('money.pay.order_number')}}：</div>
                  <div class="content"><span class="on">{{list.identification}}</span></div>
                </li>
                <li>
                  <div class="label">{{$t('money.pay.receiving')}}：</div>
                  <div class="content">{{list.good_location.name}} {{list.good_location.cellphone}} {{list.good_location.location}}<template v-if="list.good_location.address">({{ list.good_location.address }})</template></div>
                </li>
                <li>
                  <div class="label">{{$t('indent.name')}}：</div>
                  <div class="content"><span v-for="(item, index) in list.goods_list" :key="index">{{item.good.name}} </span></div>
                </li>
              </ul>
            </div>
            <div class="fright">
              <div class="total">{{$t('indent.payroll')}}：<div class="price"><span>{{(list.total ? list.total : 0)| thousands}}</span>{{$t('common.monetary_unit')}}</div></div>
              <div v-if="list.good_location" class="show-detail" @click="showDetail">{{$t('money.pay.order_details')}}<i class="iconfont dsshop-xia"></i></div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="container mode-payment-box" shadow="always" v-loading="loading">
        <div class="title">{{$t('money.pay.mode_payment')}}</div>
        <el-divider></el-divider>
        <div class="min-title">{{$t('money.pay.payment')}}</div>
        <div class="list">
          <div class="li" v-loading="buttonLoading" @click="payment('weixin')">
            <el-image
              class="image"
              :src="require('assets/img/weixin-pay.jpg')"
              fit="cover"/>
          </div>
          <div class="li" v-loading="buttonLoading" v-if="list.user" @click="payment(1)">
            {{$t('money.pay.prepaid_deposit')}}（{{list.user.money| thousands}}）
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog
        :title="$t('money.pay.weixin')"
        :visible.sync="centerDialogVisible"
        :close-on-click-modal="false"
        width="400px"
        center>
        <div class="vue-qrcode">
          <vue-qrcode :value="qrcode" :options="{ width: 250 }"></vue-qrcode>
        </div>
        <div slot="footer" class="dialog-footer">
          <div>{{$t('money.pay.please_use')}}<span class="main-color">{{$t('money.pay.wechat')}}</span>{{$t('money.pay.rich_scan')}}</div>
          <div>{{$t('money.pay.qr_complete_payment')}}</div>
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
