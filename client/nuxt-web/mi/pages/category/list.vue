<template>
  <div class="box">
    <el-breadcrumb class="breadcrumb container" separator="/">
      <el-breadcrumb-item>
        <NuxtLink :to="{ path: '/' }">
          {{$t('header.top.nav_list.home')}}
        </NuxtLink>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('category.all')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="category-box">
      <div class="category-list container" v-for="(item, index) in goodCategory" :key="index">
        <NuxtLink class="title" :to="{ path: `/product/list/${item.id}`, query: { title: item.name }}">
          {{item.name}}
        </NuxtLink>
        <template v-if="item.level === 3">
          <div class="category-list-box" v-for="(item2, index2) in item.children" :key="index2">
            <NuxtLink class="min-title" :to="{ path: `/product/list/${item2.id}`, query: { title: item2.name }}">
              {{item2.name}}
            </NuxtLink>
            <div class="list">
              <div class="li" v-for="(item3, index3) in item2.children" :key="index3">
                <NuxtLink :to="{ path: `/product/list/${item3.id}`, query: { title: item3.name }}">
                  <el-image
                    class="image"
                    :src="item3.resources.img"
                    fit="scale-down"/>
                  <div class="name">{{item3.name}}</div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="category-list-box">
            <div class="list">
              <div class="li" v-for="(item2, index2) in item.children" :key="index2">
                <NuxtLink :to="{ path: `/product/list/${item2.id}`, query: { title: item2.name }}">
                  <el-image
                    class="image"
                    :src="item2.resources.img"
                    fit="scale-down"/>
                  <div class="name">{{item2.name}}</div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>
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
