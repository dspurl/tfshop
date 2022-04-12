<template>
  <div>
    <el-breadcrumb class="container breadcrumb" separator="/">
      <el-breadcrumb-item>
        <NuxtLink :to="{ path: '/' }">
          首页
        </NuxtLink>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="data.breadcrumb.length>0" v-for="(item, index) in data.breadcrumb" :key="index">
        <NuxtLink :to="{ path: `/article/list/${item.id}`}">
          {{item.name}}
        </NuxtLink>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="box container">
      <div class="right">
        <div v-loading="loading" class="list-box">
          <div class="title">{{data.column.name}}</div>
          <div class="content" v-html="data.column.column_property.details"></div>
          <div class="time">{{data.column.created_at.split(" ")[0]}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../scss/defaultColumnDetail";
</style>
<script>
  import js from '../js/defaultColumnDetail'
  export default js
</script>
