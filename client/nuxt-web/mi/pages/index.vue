<template>
  <div class="box">
    <!--分类-->
    <div class="top">
      <div class="container">
        <div class="classify">
          <template v-if="categoryStyle">
            <div class="nave" @mouseenter="naveCut(-1)" @mouseleave="naveShiftOut">
              <div class="nave-li" :class="{on:naveOn === index}" v-for="(item, index) in categoryList" :key="index" @mouseover="naveCut(index)">{{item.name}}<i class="iconfont dsshop-youjiantou"></i></div>
              <!-- 二级分类-->
              <div class="secondary-navigation" v-if="categoryStyle === 1">
                <div class="list" v-for="(item, index) in categorySublevel" :key="index">
                  <NuxtLink class="dt">{{item.name}}<i class="iconfont dsshop-youjiantou"></i></NuxtLink>
                  <div class="dd">
                    <NuxtLink class="li" v-for="(item2, index2) in item.children" :key="index2" :to="{ path: 'product/list', query: { pid: item2.id, title: item2.name }}">{{item2.name}}</NuxtLink>
                  </div>
                </div>
              </div>
              <div class="secondary-navigation2" v-else-if="categoryStyle === 2">
                <NuxtLink class="li" :to="{ path: 'product/list', query: { pid: item.id, title: item.name }}" v-for="(item, index) in categorySublevel" :key="index">
                  <el-image
                    class="image"
                    :src="item.resources.img | smallImage(80)"
                    fit="scale-down"/>
                  <div class="name">{{item.name}}</div>
                </NuxtLink>
              </div>
              <!-- 二级导航 end-->
            </div>
          </template>
          <template v-else>
            <div class="nave">
              <NuxtLink style="color: #fff" v-for="(item, index) in categoryList" :key="index" :to="{ path: `/product/list/${item.id}`, query: { name: item.name }}">
                <div class="nave-li">
                  {{item.name}}
                </div>
              </NuxtLink>
            </div>
          </template>
          <el-carousel class="banner" height="460px" arrow="never">
            <el-carousel-item v-for="(item, index) in bannerList" :key="index">
              <NuxtLink v-if="item.url" :to="item.url.split('pages/').join('')">
                <el-image class="image" :src="item.resources.img"/>
              </NuxtLink>
              <el-image v-else class="image" :src="item.resources.img"/>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>
    <!--分类 end-->
    <!--推荐-->
    <div class="recommend container">
      <div class="title">{{$t('index.recommend')}}</div>
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
    <!--推荐 end-->
    <!-- 广告-->
    <div class="container advertising" v-if="banner">
      <NuxtLink v-if="banner.url" :to="banner.url.split('pages/').join('')">
        <el-image
          fit="cover"
          :src="banner.resources.img"/>
      </NuxtLink>
      <el-image
        v-else
        fit="cover"
        :src="banner.resources.img"/>
    </div>
    <!--分类推荐-->
    <div class="recommend container" v-for="(fitem, findex) in recommendCategoryList" :key="findex">
      <div class="title-box">
        <div class="min-title">{{fitem.name}}</div>
        <NuxtLink class="more" :to="{ path: `/product/list/${fitem.id}`, query: { name: fitem.name }}">{{$t('index.view_more')}}>></NuxtLink>
      </div>
      <div class="list">
        <NuxtLink class="li" v-for="(item, index) in recommendGoodList[findex]" :key="index" :to="{ path: `/product/detail/${item.id}`}">
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
    <!--分类推荐 end-->
  </div>
</template>

<style lang='scss' scoped>
  @import "./index/scss/index";
</style>

<script>
import js from './index/js/index'
export default js
</script>
