<template>
  <div class="box">
    <el-breadcrumb class="breadcrumb container" separator="/">
      <el-breadcrumb-item>
        <NuxtLink :to="{ path: '/' }">
          首页
        </NuxtLink>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="listQuery.pid">商品分类</el-breadcrumb-item>
      <el-breadcrumb-item v-else>搜索结果</el-breadcrumb-item>
      <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-if="total">
      <div class="screen-box">
        <div class="screen container">
          <el-link :underline="false" :class="{on: !listQuery.sort}" @click="tabClick()">综合</el-link>
          <el-divider class="divider" direction="vertical"></el-divider>
          <el-link :underline="false" :class="{on: listQuery.sort === '-sales'}" @click="tabClick('sales')">销量</el-link>
          <el-divider class="divider" direction="vertical"></el-divider>
          <el-link class="f-sort" :underline="false" @click="tabClick('order_price')">
            <span class="fs-tit">价格</span>
            <em class="fs-up">
              <i class="up el-icon-caret-top" :class="{on: listQuery.sort === '+order_price'}"></i>
              <i class="below el-icon-caret-bottom" :class="{on: listQuery.sort === '-order_price'}"></i>
            </em>
          </el-link>
        </div>
      </div>
      <div class="product-list container" v-loading="loading">
        <div class="list">
          <NuxtLink class="li" v-for="(item, index) in goodList" :key="index" :to="{ path: '/product/detail', query: { id: item.id }}">
            <el-card class="card" shadow="hover">
              <el-image
                class="image"
                :src="item.resources.img | smallImage(200)"
                fit="cover"
                lazy/>
              <div class="name">{{item.name}}</div>
              <div class="price">
                <div class="symbol">¥</div>
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
      <div v-if="listQuery.pid">抱歉，“{{title}}”分类下暂无商品，换个分类搜搜吧</div>
      <div v-else>抱歉，没有找到商品“{{title}}”，换个词搜搜吧</div>
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
