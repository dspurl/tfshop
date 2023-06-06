<template>
  <div class="box">
    <div class="user-title">{{$t('header.top.order')}}</div>
    <div class="padding-top-20">
      <el-tabs v-model="listQuery.index" @tab-click="getReloadList">
        <el-tab-pane :label="$t('indent.all_orders')" name="0"></el-tab-pane>
        <el-tab-pane :label="$t('indent.unpaid')" name="1"></el-tab-pane>
        <el-tab-pane :label="$t('indent.shipped')" name="2"></el-tab-pane>
        <el-tab-pane :label="$t('indent.receivings')" name="3"></el-tab-pane>
        <el-tab-pane :label="$t('indent.completed')" name="5"></el-tab-pane>
      </el-tabs>
      <div class="indent-list" v-loading="loading">
        <div class="navigation">
          <div class="good">{{$t('indent.treasure')}}</div>
          <div class="total">{{$t('indent.disbursements')}}</div>
          <div class="state">{{$t('indent.status')}}</div>
          <div class="operation">{{$t('indent.operation')}}</div>
        </div>
        <div class="li" v-for="(item, index) in goodIndentList" :key="index">
          <div class="top">
            <div class="time">{{item.created_at}}</div>
            <div class="odd">{{$t('money.pay.order_number')}}: <span>{{item.identification}}</span></div>
            <div class="delete"v-if="item.state===4 || item.state===5 || item.state===6 || item.state===7" @click="deleteOrder(item)"><i class="el-icon-delete"></i></div>
          </div>
          <div class="details">
            <div class="good">
              <div class="good-li"  v-for="(item2, index2) in item.goods_list" :key="index2">
                <NuxtLink :to="{ path: `/product/detail/${item2.good_id}`}">
                  <el-image
                    class="image"
                    :src="item2.img | smallImage(80)"
                    fit="cover"/>
                </NuxtLink>
                <div class="good-name">
                  <NuxtLink :to="{ path: `/product/detail/${item2.good_id}`}">{{item2.name}}</NuxtLink>
                  <div class="price">{{$t('common.unit')}}{{item2.price}} x {{item2.number}}</div>
                  <div class="specification">{{item2.specification}}</div>
                </div>
                <div class="type" v-if="item2.good">{{item2.good.type}}</div>
              </div>
            </div>
            <div class="total">
              <div>
                <div>{{$t('common.unit')}}{{item.total | thousands}}</div>
                <div class="freight">({{$t('indent.icash')}}：{{$t('common.unit')}}{{item.carriage?item.carriage: 0 | thousands}})</div>
              </div>
            </div>
            <div class="state">
              <div>
                <div>{{item.state_show}}</div>
                <NuxtLink :to="{ path: '/user/indent/detail', query: { id: item.id }}">{{$t('money.pay.order_details')}}</NuxtLink>
              </div>
            </div>
            <div class="operation">
              <div>
                <NuxtLink :to="{ path: '/money/pay', query: { id: item.id }}" v-if="item.state === 1"><div class="button"><el-button type="danger" size="mini" round>{{$t('indent.payment')}}</el-button></div></NuxtLink>
                <div v-if="item.state === 3" class="button"><el-button :loading="buttonLoading" type="danger" size="mini" round @click="confirmReceipt(item)">{{$t('indent.confirm_receipt')}}</el-button></div>
                <div v-if="item.state === 1" class="button"><el-button :loading="buttonLoading" size="mini" round @click="cancelOrder(item)">{{$t('indent.cancel_order')}}</el-button></div>
              </div>
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
