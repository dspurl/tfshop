<template>
  <div class="box">
    <div class="user-title">我的订单</div>
    <div class="padding-top-20">
      <el-tabs v-model="listQuery.index" @tab-click="getReloadList">
        <el-tab-pane label="全部订单" name="0"></el-tab-pane>
        <el-tab-pane label="待支付" name="1"></el-tab-pane>
        <el-tab-pane label="待发货" name="2"></el-tab-pane>
        <el-tab-pane label="待收货" name="3"></el-tab-pane>
      </el-tabs>
      <div class="indent-list" v-loading="loading">
        <div class="navigation">
          <div class="good">宝贝</div>
          <div class="total">实付款</div>
          <div class="state">交易状态</div>
          <div class="operation">交易操作</div>
        </div>
        <div class="li" v-for="(item, index) in goodIndentList" :key="index">
          <div class="top">
            <div class="time">{{item.created_at}}</div>
            <div class="odd">订单号: <span>{{item.identification}}</span></div>
            <div class="delete"v-if="item.state===4 || item.state===5 || item.state===6 || item.state===7" @click="deleteOrder(item)"><i class="el-icon-delete"></i></div>
          </div>
          <div class="details">
            <div class="good">
              <div class="good-li"  v-for="(item2, index2) in item.goods_list" :key="index2">
                <NuxtLink :to="{ path: '/product/detail', query: { id: item2.good_id }}">
                  <el-image
                    class="image"
                    :src="item2.img | smallImage(80)"
                    fit="cover"/>
                </NuxtLink>
                <div class="good-name">
                  <NuxtLink :to="{ path: '/product/detail', query: { id: item2.good_id }}">{{item2.name}}</NuxtLink>
                  <div class="price">￥{{item2.price}} x {{item2.number}}</div>
                  <div class="specification">{{item2.specification}}</div>
                </div>
              </div>
            </div>
            <div class="total">
              <div>
                <div>￥{{item.total | thousands}}</div>
                <div class="freight">(含运费：￥{{item.carriage?item.carriage: 0 | thousands}})</div>
              </div>
            </div>
            <div class="state">
              <div>
                <div>{{item.state_show}}</div>
                <NuxtLink :to="{ path: '/user/indent/detail', query: { id: item.id }}">订单详情</NuxtLink>
              </div>
            </div>
            <div class="operation">
              <div>
                <NuxtLink :to="{ path: '/money/pay', query: { id: item.id }}" v-if="item.state === 1"><div class="button"><el-button type="danger" size="mini" round>立即付款</el-button></div></NuxtLink>
                <div v-if="item.state === 3" class="button"><el-button :loading="buttonLoading" type="danger" size="mini" round @click="confirmReceipt(item)">确认收货</el-button></div>
                <div v-if="item.state === 1" class="button"><el-button :loading="buttonLoading" size="mini" round @click="cancelOrder(item)">取消订单</el-button></div>
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
