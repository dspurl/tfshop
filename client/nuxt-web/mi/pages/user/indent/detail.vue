<template>
  <div class="box">
    <el-page-header @back="goBack" content="订单详情">
    </el-page-header>
    <div v-loading="loading">
      <div class="top">
        <div class="order-number">订单号：{{indent.identification}}</div>
        <div class="operation">
          <div style="margin-bottom: 5px;" v-if="indent.state === 1"><el-button :loading="buttonLoading" size="mini">取消订单</el-button></div>
          <NuxtLink :to="{ path: '/money/pay', query: { id: indent.id }}" v-if="indent.state === 1"><el-button :loading="buttonLoading" size="mini" type="danger">立即付款</el-button></NuxtLink>
          <div v-if="indent.state === 3"><el-button :loading="buttonLoading" size="mini" type="danger" @click="confirmReceipt()">确认收货</el-button></div>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="steps-box">
        <div class="title">{{indent.state_show}}</div>
        <div class="steps">
          <div :class="{on:indent.created_at}">
            <div class="chunk">下单</div>
          </div>
          <div :class="{on:indent.pay_time}">
            <div class="chunk">付款</div>
            <div class="name"></div>
          </div>
          <div v-if="isType" :class="{on:indent.shipping_time}">
            <div class="chunk">配货</div>
            <div class="name"></div>
          </div>
          <div :class="{on:indent.state === 5 || indent.state === 11}">
            <div class="chunk">交易成功</div>
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
          label="商品名称">
          <template slot-scope="scope">
            <NuxtLink :to="{ path: `/product/detail/${scope.row.good_id}`}">
              <p>{{scope.row.name}}</p>
              <p class="specification">{{scope.row.specification}}</p>
            </NuxtLink>
          </template>
        </el-table-column>
        <el-table-column
          label="单价"
          width="150"
          align="center">
          <template slot-scope="scope">
            {{scope.row.price| thousands}}
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
          width="150"
          align="center">
          <template slot-scope="scope">
            {{scope.row.number}}
          </template>
        </el-table-column>
        <el-table-column
          label="小计"
          width="150"
          align="center">
          <template slot-scope="scope">
            {{(scope.row.price * scope.row.number) | thousands}}
          </template>
        </el-table-column>
      </el-table>
      <el-divider></el-divider>
      <template v-if="indent.good_location">
        <div class="address">
          <div class="min-title">收货信息</div>
          <div class="li">
            <div class="name">姓名：</div>
            <div class="value">{{indent.good_location.name}}</div>
          </div>
          <div class="li">
            <div class="name">联系电话：</div>
            <div class="value">{{indent.good_location.cellphone}}</div>
          </div>
          <div class="li">
            <div class="name">收货地址：</div>
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
          <div class="min-title">退款方式</div>
          <div class="li">
            <div class="name">退款方式：</div>
            <div class="value">{{indent.refund_way}}</div>
          </div>
          <div class="li">
            <div class="name">退款时间：</div>
            <div class="value">{{indent.refund_time}}</div>
          </div>
          <div class="li">
            <div class="name">退款金额：</div>
            <div class="value">{{indent.refund_money}}</div>
          </div>
          <div class="li">
            <div class="name">退款原因：</div>
            <div class="value">{{indent.refund_reason}}</div>
          </div>
        </div>
        <el-divider></el-divider>
      </div>
      <!-- 网盘 -->
      <div class="code-box" v-if="indent.good_code.length">
        <div class="min-title">{{code_type ? '网盘' : '卡密'}}</div>
        <div class="code-list">
          <div class="li" v-for="(item,index) in indent.good_code" :key="index">
            <div class="name" v-if="item.name">{{code_type ? '网盘地址' : '卡号'}}：{{ item.name }}<span class="el-icon-copy-document" @click="doCopy(item.name)"></span></div>
            <div class="value">{{code_type ? '提取码' : '卡密'}}：{{ item.code }}<span class="el-icon-copy-document" @click="doCopy(item.code)"></span></div>
          </div>
        </div>
        <el-divider></el-divider>
      </div>
      <div class="address">
        <div class="min-title">其它</div>
        <div class="li">
          <div class="name">备注：</div>
          <div class="value">{{indent.remark ? indent.remark : '无'}}</div>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="right">
        <div class="li">
          <div class="name">商品总价：</div>
          <div class="value">{{total | thousands}}元</div>
        </div>
        <div class="li" v-if="indent.coupon_money">
          <div class="name">优惠金额：</div>
          <div class="value">-{{indent.coupon_money/100 | thousands}}元</div>
        </div>
        <div class="li" v-if="!indent.integral_draw_log">
          <div class="name">运费：</div>
          <div class="value" v-if="indent.carriage>0">{{indent.carriage | thousands}}元</div>
          <div class="value" v-else>免运费</div>
        </div>
        <div class="li">
          <div class="name">应付金额：</div>
          <div class="value total"><span>{{indent.total | thousands}}</span>元</div>
        </div>
      </div>
      <div class="download" v-if="indent.download">
        <el-button type="danger" @click="goDownload" v-loading="buttonLoading">下载</el-button>
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
