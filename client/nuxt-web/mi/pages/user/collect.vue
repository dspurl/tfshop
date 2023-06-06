<template>
  <div class="box">
    <div class="user-title">{{$t('header.top.collection')}}</div>
    <div class="padding-top-20" v-loading="loading">
      <div class="recommend">
        <div class="list">
          <div class="li" v-for="(item, index) in collectList" :key="index">
            <el-card class="card" shadow="never">
              <NuxtLink :to="{ path: `/product/detail/${item.good_id}`}">
                <el-image
                  class="image"
                  :src="item.good.resources.img | smallImage(200)"
                  fit="cover"
                  lazy/>
                <div class="name">{{item.good.name}}</div>
              </NuxtLink>
              <div class="delete" :title="$t('common.delete')">
                <i @click.stop="destroy(item.id)" class="iconfont dsshop-shanchu"></i>
              </div>
            </el-card>
          </div>
        </div>
      </div>
      <div class="operation">
        <pagination v-if="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/collect";
</style>

<script>
import js from './js/collect'
export default js
</script>
