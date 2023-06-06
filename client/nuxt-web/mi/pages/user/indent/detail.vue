<template>
  <div class="box">
    <el-page-header @back="goBack" :content="$t('money.pay.order_details')">
    </el-page-header>
    <div v-loading="loading">
      <div class="top">
        <div class="order-number">{{$t('money.pay.order_number')}}：{{indent.identification}}</div>
        <div class="operation">
          <div style="margin-bottom: 5px;" v-if="indent.state === 1"><el-button :loading="buttonLoading" size="mini">{{$t('indent.cancel_order')}}</el-button></div>
          <NuxtLink :to="{ path: '/money/pay', query: { id: indent.id }}" v-if="indent.state === 1"><el-button :loading="buttonLoading" size="mini" type="danger">{{$t('indent.payment')}}</el-button></NuxtLink>
          <div v-if="indent.state === 3"><el-button :loading="buttonLoading" size="mini" type="danger" @click="confirmReceipt()">{{$t('indent.confirm_receipt')}}</el-button></div>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="steps-box">
        <div class="title">{{indent.state_show}}</div>
        <div class="steps">
          <div :class="{on:indent.created_at}">
            <div class="chunk">{{$t('indent.orders')}}</div>
          </div>
          <div :class="{on:indent.pay_time}">
            <div class="chunk">{{$t('indent.payments')}}</div>
            <div class="name"></div>
          </div>
          <div v-if="isType" :class="{on:indent.shipping_time}">
            <div class="chunk">{{$t('indent.distribution')}}</div>
            <div class="name"></div>
          </div>
          <div :class="{on:indent.state === 5 || indent.state === 11}">
            <div class="chunk">{{$t('indent.trade_successfully')}}</div>
            <div class="name"></div>
          </div>
        </div>
      </div>
      <div class="steps-box-time">
        <div class="steps">
          <div>
            <div class="chunk">{{indent.created_at}}</div>
          </div>
          <div>
            <div class="chunk">{{indent.pay_time}}</div>
          </div>
          <div v-if="isType">
            <div class="chunk">{{indent.shipping_time}}</div>
          </div>
          <div>
            <div class="chunk">{{indent.state === 5 ? indent.confirm_time : ''}}</div>
          </div>
        </div>
      </div>
      <el-table
        :data="indent.goods_list"
        ref="table"
        class="table">
        <el-table-column
          align="center"
          width="100">
          <template slot-scope="scope">
            <NuxtLink :to="{ path: `/product/detail/${scope.row.good_id}`}">
              <el-image
                class="image"
                :src="scope.row.img | smallImage(80)"
                fit="cover"/>
            </NuxtLink>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('indent.name')">
          <template slot-scope="scope">
            <NuxtLink :to="{ path: `/product/detail/${scope.row.good_id}`}">
              <p>{{scope.row.name}}</p>
              <p class="specification">{{scope.row.specification}}</p>
            </NuxtLink>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('indent.price')"
          width="150"
          align="center">
          <template slot-scope="scope">
            {{scope.row.price| thousands}}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('indent.number')"
          width="150"
          align="center">
          <template slot-scope="scope">
            {{scope.row.number}}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('indent.subtotal')"
          width="150"
          align="center">
          <template slot-scope="scope">
            {{(scope.row.price * scope.row.number) | thousands}}
          </template>
        </el-table-column>
      </el-table>
      <el-divider></el-divider>
      <template v-if="indent.odd">
        <div class="address">
          <div class="min-title">{{$t('indent.logistics')}}</div>
          <div class="li">
            <div class="name">{{$t('indent.logistics_company')}}：</div>
            <div class="value">{{indent.dhl.name}}</div>
          </div>
          <div class="li">
            <div class="name">{{$t('indent.waybill_number')}}：</div>
            <div class="value">{{indent.odd}}</div>
          </div>
        </div>
        <el-divider></el-divider>
      </template>
      <template v-if="indent.good_location">
        <div class="address">
          <div class="min-title">{{$t('money.pay.receiving')}}</div>
          <div class="li">
            <div class="name">{{$t('indent.compellation')}}：</div>
            <div class="value">{{indent.good_location.name}}</div>
          </div>
          <div class="li">
            <div class="name">{{$t('indent.phone')}}：</div>
            <div class="value">{{indent.good_location.cellphone}}</div>
          </div>
          <div class="li">
            <div class="name">{{$t('indent.shipping_address')}}：</div>
            <div class="value">
              {{ indent.good_location.location }}
              <span v-if="indent.good_location.address">({{ indent.good_location.address }})</span>
              {{ indent.good_location.house }}
            </div>
          </div>
        </div>
        <el-divider></el-divider>
      </template>
      <div v-if="indent.refund_time">
        <div class="address">
          <div class="min-title">{{$t('indent.refund_method')}}</div>
          <div class="li">
            <div class="name">{{$t('indent.refund_method')}}：</div>
            <div class="value">{{indent.refund_way}}</div>
          </div>
          <div class="li">
            <div class="name">{{$t('indent.refund_time')}}：</div>
            <div class="value">{{indent.refund_time}}</div>
          </div>
          <div class="li">
            <div class="name">{{$t('indent.refund_amount')}}：</div>
            <div class="value">{{indent.refund_money}}</div>
          </div>
          <div class="li">
            <div class="name">{{$t('indent.refund_refund')}}：</div>
            <div class="value">{{indent.refund_reason}}</div>
          </div>
        </div>
        <el-divider></el-divider>
      </div>
      <!-- 网盘 -->
      <div class="code-box" v-if="indent.good_code.length">
        <div class="min-title">{{code_type ? $t('good.code_type.web_disk') : $t('good.code_type.carmi')}}</div>
        <div class="code-list">
          <div class="li" v-for="(item,index) in indent.good_code" :key="index">
            <div class="name" v-if="item.name">{{code_type ? $t('good.good_code.url') : $t('good.good_code.card_number')}}：{{ item.name }}<span class="el-icon-copy-document" @click="doCopy(item.name)"></span></div>
            <div class="value">{{code_type ? $t('good.web_disk.code') : $t('good.code_type.carmi')}}：{{ item.code }}<span class="el-icon-copy-document" @click="doCopy(item.code)"></span></div>
          </div>
        </div>
        <el-divider></el-divider>
      </div>
      <div class="address">
        <div class="min-title">{{$t('indent.other')}}</div>
        <div class="li">
          <div class="name">{{$t('indent.remark')}}：</div>
          <div class="value">{{indent.remark ? indent.remark : $t('indent.without')}}</div>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="right">
        <div class="li">
          <div class="name">{{$t('indent.total')}}：</div>
          <div class="value">{{total | thousands}}{{$t('common.monetary_unit')}}</div>
        </div>
        <div class="li" v-if="indent.coupon_money">
          <div class="name">{{$t('indent.discount_amount')}}：</div>
          <div class="value">-{{indent.coupon_money/100 | thousands}}{{$t('common.monetary_unit')}}</div>
        </div>
        <div class="li" v-if="!indent.integral_draw_log">
          <div class="name">{{$t('indent.freight')}}：</div>
          <div class="value" v-if="indent.carriage>0">{{indent.carriage | thousands}}{{$t('common.monetary_unit')}}</div>
          <div class="value" v-else>{{$t('indent.free_shipping')}}</div>
        </div>
        <div class="li">
          <div class="name">{{$t('indent.amount_payable')}}：</div>
          <div class="value total"><span>{{indent.total | thousands}}</span>{{$t('common.monetary_unit')}}</div>
        </div>
      </div>
      <div class="download" v-if="indent.download">
        <el-button type="danger" @click="goDownload" v-loading="buttonLoading">{{$t('indent.download')}}</el-button>
      </div>
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
