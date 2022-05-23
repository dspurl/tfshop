<template>
  <div class="box">
    <div class="container product-detail">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item>
          <NuxtLink :to="{ path: '/' }">
            首页
          </NuxtLink>
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ goodDetail.name }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="product-box">
        <div class="picture">
          <el-carousel :autoplay="false" arrow="always" height="450px" indicator-position="outside">
            <el-carousel-item v-for="(item, index) in resources_many" :key="index">
              <template v-if="item.type === 'img'">
                <el-image class="image" fit="scale-down" :src="item.img" :preview-src-list="resources_many_img"></el-image>
              </template>
              <template v-else>
                <VueVideo :sources="item.img" :poster="poster"/>
              </template>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="parameter">
          <div class="title">{{goodDetail.name}}</div>
          <div v-if="goodDetail.short_description" class="description">{{goodDetail.short_description}}</div>
          <!-- 秒杀-->
          <div class="seckill-box" v-if="isSeckill">
            <div class="list-box" :class="{'active': goodDetail.state === 1}">
              <div class="name">
                <i class="el-icon-alarm-clock"/>
                <template v-if="goodDetail.state === 1">
                  <div class="tt">限时秒杀</div>
                </template>
                <template v-else>
                  <div class="tt">限时秒杀</div>
                  <div class="time">{{goodDetail.seckill_time | moment('MM-DD HH:mm')}}</div>
                </template>
              </div>
              <div class="times">
                <div class="nn">{{ goodDetail.state === 1 ? '距离结束' : '距离开始还剩'}}</div>
                <count-down-time class="background-box" v-slot="timeObj" :time="goodDetail.seckillTime" @end="endTime()">
                  <template v-if="timeObj.d>0"><div class="background">{{ timeObj.d }}</div>天</template><div class="background">{{ timeObj.hh }}</div>:<div class="background">{{ timeObj.mm }}</div>:<div class="background">{{ timeObj.ss }}</div>
                </count-down-time>
              </div>
            </div>
            <div class="abstract">{{goodDetail.abstract}}</div>
          </div>
          <!-- 秒杀 end-->
          <div class="price-box">
            <!-- 已选择规则-->
            <template v-if="specificationDefaultDisplay.price_show">
              <template v-if="goodDetail.price_show && specificationDefaultDisplay.price_show">
                <div class="price" v-if="specificationDefaultDisplay.price_show.length > 1"><span class="symbol">¥</span>{{specificationDefaultDisplay.price_show[0] | thousands}} - {{specificationDefaultDisplay.price_show[1] | thousands}}</div>
                <div class="price" v-else-if="specificationDefaultDisplay.price_show.length === 1"><span class="symbol">¥</span>{{specificationDefaultDisplay.price_show[0] | thousands}}</div>
              </template>
            </template>
            <!-- 未选择规则-->
            <template v-else>
              <template v-if="goodDetail.price_show">
                <div class="price" v-if="goodDetail.price_show.length > 1"><span class="symbol">¥</span>{{ goodDetail.price_show[0] | thousands }} - {{ goodDetail.price_show[1] | thousands }}</div>
                <div class="price" v-else-if="goodDetail.price_show.length === 1"><span class="symbol">¥</span>{{ goodDetail.price_show[0] | thousands }}</div>
              </template>
              <template v-if="goodDetail.market_price_show">
                <div class="m-price" v-if="goodDetail.market_price_show.length > 1"><span class="symbol">¥</span>{{ goodDetail.market_price_show[1] | thousands }}</div>
                <div class="m-price" v-else-if="goodDetail.market_price_show.length === 1"><span class="symbol">¥</span>{{ goodDetail.market_price_show[0] | thousands }}</div>
              </template>
            </template>
          </div>
          <el-divider></el-divider>
          <div class="sku">
            <sku ref="sku" :getList="goodDetail" @purchasePattern="purchasePattern"></sku>
          </div>
          <div class="purchase_number" v-if="goodDetail.purchase_number">每次限拍{{ goodDetail.purchase_number }}件</div>
          <el-divider></el-divider>
          <div class="shipping-address">

          </div>
          <div class="operation">
            <el-button type="danger" plain @click="buy(true)" :disabled="isSeckill && goodDetail.state === 0">立即购买</el-button>
            <template v-if="!isSeckill">
              <el-button type="danger" @click="buy(false)">加入购物车</el-button>
              <coupon v-if="isCoupon"></coupon>
            </template>
            <template v-else>
              <el-button type="info" :class="{'product-detail-on' : collect}" icon="el-icon-star-off" @click="toCollect">收藏</el-button>
            </template>
          </div>
          <el-tag v-if="goodDetail.integral_commodity_count && !isSeckill" type="warning" style="margin-top:20px;">可积分抵扣</el-tag>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <!-- 详情-->
    <div class="product-box">
      <div class="tab">
        <span :class="{on:tab === 1}" @click="cutTab(1)">商品详情</span>
        <template v-if="isComment">
          <el-divider direction="vertical"></el-divider>
          <span :class="{on:tab === 2}" @click="cutTab(2)">评价({{commentTotal}})</span>
        </template>
      </div>
      <div class="detail-box">
        <div class="container" v-loading="tabLoading">
          <div v-if="tab === 1" v-html="goodDetail.details"></div>
          <div v-else-if="tab === 2">
            <Comment v-if="isComment"></Comment>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss'>
  .product-detail-on .el-icon-star-off{
    color: #fa524c;
  }
</style>

<style lang='scss' scoped>
  @import "./scss/_id";
</style>

<script>
import js from './js/_id'
export default js
</script>
