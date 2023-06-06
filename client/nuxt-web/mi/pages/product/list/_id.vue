<template>
  <div class="box">
    <el-breadcrumb class="breadcrumb container" separator="/">
      <el-breadcrumb-item>
        <NuxtLink :to="{ path: '/' }">
          {{$t('header.top.nav_list.home')}}
        </NuxtLink>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="listQuery.pid">{{$t('product.classify')}}</el-breadcrumb-item>
      <el-breadcrumb-item v-else>{{$t('product.search_result')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-if="total">
      <div class="screen-box">
        <div class="screen container">
          <el-link :underline="false" :class="{on: !listQuery.sort}" @click="tabClick()">{{$t('product.sort.synthesize')}}</el-link>
          <el-divider class="divider" direction="vertical"></el-divider>
          <el-link :underline="false" :class="{on: listQuery.sort === '-sales'}" @click="tabClick('sales')">{{$t('product.sort.sales')}}</el-link>
          <el-divider class="divider" direction="vertical"></el-divider>
          <el-link class="f-sort" :underline="false" @click="tabClick('order_price')">
            <span class="fs-tit">{{$t('product.sort.price')}}</span>
            <em class="fs-up">
              <i class="up el-icon-caret-top" :class="{on: listQuery.sort === '+order_price'}"></i>
              <i class="below el-icon-caret-bottom" :class="{on: listQuery.sort === '-order_price'}"></i>
            </em>
          </el-link>
        </div>
      </div>
      <div class="product-list container" v-loading="loading">
        <div class="list">
          <NuxtLink class="li" v-for="(item, index) in goodList" :key="index" :to="{ path: `/product/detail/${item.id}`}">
            <el-card class="card" shadow="hover">
              <el-image
                class="image"
                :src="item.resources.img | smallImage(200)"
                fit="cover"
                lazy/>
              <div class="name">{{item.name}}</div>
              <div class="price">
                <div class="symbol">{{$t('common.unit')}}</div>
                <div class="value">{{item.order_price | thousands}}</div>
              </div>
            </el-card>
          </NuxtLink>
        </div>
      </div>
      <div class="operation container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"/>
      </div>
    </div>
    <div class="no-goods" v-else>
      <img :src="require('assets/img/no-goods.png')"/>
      <div v-if="listQuery.pid">{{$t('product.classified_no_commodity', {title: title})}}</div>
      <div v-else>{{$t('product._no_commodity', {title: title})}}</div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/_id";
</style>

<script>
import js from './js/_id'
export default js
</script>
