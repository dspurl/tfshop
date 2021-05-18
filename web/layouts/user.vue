<template>
  <div class="body">
    <Header />
    <div class="container user-portal">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item>
          <NuxtLink :to="{ path: '/' }">
            首页
          </NuxtLink>
        </el-breadcrumb-item>
        <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="user-box">
        <!-- 导航-->
        <div class="navigation">
          <div class="menu-box" v-for="(item, index) in menuList" :key="index">
            <div class="title">{{ item.name }}</div>
            <ul class="list">
              <li v-if="item.children" v-for="(item2, index2) in item.children" :key="index2"><NuxtLink :class="{ active: item2.active }" :to="{ path: item2.path, query: item2.query}">{{item2.name}}</NuxtLink></li>
            </ul>
          </div>
        </div>
        <!-- 导航 end-->
        <!-- 主体-->
        <div class="main-box">
          <Nuxt />
        </div>
        <!-- 主体-->
      </div>
    </div>
    <Footer />
    <el-backtop/>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/user";
</style>

<script>
import js from './js/user'
export default js
</script>
