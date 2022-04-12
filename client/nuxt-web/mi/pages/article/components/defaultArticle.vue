<template>
  <div>
    <el-breadcrumb class="breadcrumb container" separator="/">
      <el-breadcrumb-item>
        <NuxtLink :to="{ path: '/' }">
          首页
        </NuxtLink>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <NuxtLink :to="{ path: `/article/list/${data.column.id}`}">
          {{data.column.name}}
        </NuxtLink>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{data.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="box container">
      <div>
        <div class="title">{{data.name}}</div>
        <div class="content" v-html="data.article_property.details"></div>
        <div class="time">{{data.created_at.split(" ")[0]}}</div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../scss/defaultArticle";
</style>
<script>
  import js from '../js/defaultArticle'
  export default js
</script>
