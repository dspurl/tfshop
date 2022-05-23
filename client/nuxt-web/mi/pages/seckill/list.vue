<template>
  <div class="box">
    <div class="container">
      <!-- 面包屑 -->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item>
          <NuxtLink :to="{ path: '/' }">
            首页
          </NuxtLink>
        </el-breadcrumb-item>
        <el-breadcrumb-item>限时秒杀</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 面包屑end -->
      <!-- 菜单 -->
      <div class="tab-list">
        <div @click="cutTab(index)" class="tab-item" :class="{'active': active === index}" v-for="(item,index) in times" :key="index">
          <div class="time">{{ item.label }}</div>
          <div class="right">
            <template v-if="item.active">
              <div class="name" v-if="active === index">正在秒杀</div>
              <div class="state" v-else>进行中</div>
              <div class="finish" v-if="active === index">
                <div class="name">距结束</div>
                <count-down-time v-slot="timeObj" :time="time" @end="endTime()">
                  {{ timeObj.hh }}:{{ timeObj.mm }}:{{ timeObj.ss }}
                </count-down-time>
              </div>
            </template>
            <template v-else>
              <div class="name" v-if="active === index">即将开始</div>
              <div class="state" v-else>即将开始</div>
              <div class="finish" v-if="active === index">
                <div class="name">距开始</div>
                <count-down-time v-slot="timeObj" :time="time">
                  {{ timeObj.hh }}:{{ timeObj.mm }}:{{ timeObj.ss }}
                </count-down-time>
              </div>
            </template>
          </div>
        </div>
      </div>
      <!-- 菜单 end -->
      <!-- 列表 -->
      <div class="no-data" v-if="list.length === 0">
        <el-image
          style="height: 300px"
          :src="require('assets/img/no-data.png')"
          fit="scale-down"></el-image>
        <div class="name">暂无秒杀商品</div>
      </div>
      <div v-else class="commodity-list-box">
        <div class="commodity-item" v-for="(item,index) in list" :key="index">
          <el-card class="card" shadow="hover">
            <NuxtLink :to="{ path: `/product/detail/${item.good_id}`}">
              <el-image
                class="image"
                :src="item.resources.img | smallImage(300)"
                fit="scale-down"
                lazy/>
            </NuxtLink>
            <NuxtLink :to="{ path: `/product/detail/${item.good_id}`}">
              <div class="name">{{ item.name }}</div>
            </NuxtLink>
            <NuxtLink :to="{ path: `/product/detail/${item.good_id}`}">
              <div class="abstract">{{ item.abstract }}</div>
            </NuxtLink>
            <div class="info">
              <div class="left">
                <div class="price">
                  <div class="symbol">¥</div>
                  <div class="value">{{ item.price[0] | thousands }}</div>
                </div>
                <div class="progress-box">
                  <div>已售{{ item.progress }}%</div>
                  <el-progress :show-text="false" class="progress" :percentage="item.progress"></el-progress>
                </div>
              </div>
              <div class="right">
                <NuxtLink :to="{ path: `/product/detail/${item.good_id}`}">
                  <el-button v-if="item.state === 2" size="small" type="info" disabled>已结束</el-button>
                  <el-button v-else size="small" type="danger" :disabled="item.state === 0">{{item.state === 1 ? '立即抢购' : '即将开始'}}</el-button>
                </NuxtLink>
              </div>
            </div>
          </el-card>
        </div>
        <div class="operation container">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listQuery.page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="listQuery.limit"
            :hide-on-single-page="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"/>
        </div>
      </div>
      <!-- 列表 end -->
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
