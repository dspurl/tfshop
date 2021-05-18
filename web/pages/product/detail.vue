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
          <el-divider></el-divider>
          <div class="shipping-address">

          </div>
          <div class="operation">
            <el-button type="danger" plain @click="buy(true)">立即购买</el-button>
            <el-button type="danger" @click="buy(false)">加入购物车</el-button>
            <el-button type="info" :class="{'product-detail-on' : collect}" icon="el-icon-star-off" @click="toCollect">收藏</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <!-- 详情-->
    <div class="product-box">
      <div class="tab">
        <span :class="{on:tab === 1}" @click="cutTab(1)">商品详情</span>
<!--        <el-divider direction="vertical"></el-divider>-->
<!--        <span :class="{on:tab === 2}" @click="cutTab(2)">商品规格</span>-->
      </div>
      <div class="detail-box">
        <div class="container" v-loading="tabLoading">
          <div v-if="tab === 1" v-html="goodDetail.details"></div>
          <div v-else-if="tab === 2">

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
  @import "./scss/detail";
</style>

<script>
import js from './js/detail'
export default js
</script>
