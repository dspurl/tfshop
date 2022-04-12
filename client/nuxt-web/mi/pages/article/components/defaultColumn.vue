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
      <div class="left" v-if="data.breadcrumb.length>0">
        <div class="dt">{{data.breadcrumb[data.breadcrumb.length-1].name}}</div>
        <NuxtLink class="dd" :class="{on: data.column.id === item.id}" v-for="(item, index) in data.menu" :key="index" :to="{ path: `/article/list/${item.id}`}">{{item.name}}</NuxtLink>
      </div>
      <div class="right">
        <div v-loading="loading" class="list-box">
          <NuxtLink class="li" v-for="(item, index) in data.paginate.data" :key="index" :to="{ path: `/article/detail/${item.id}`}">
            <div class="name">{{item.name}}</div>
            <div class="time">{{item.created_at.split(" ")[0]}}</div>
          </NuxtLink>
          <pagination v-if="data.paginate.total>0" :total="data.paginate.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "../scss/defaultColumn";
</style>
<script>
  import js from '../js/defaultColumn'
  export default js
</script>
