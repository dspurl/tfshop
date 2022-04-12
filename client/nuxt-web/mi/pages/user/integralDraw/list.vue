<template>
  <div class="box">
    <div class="user-title">积分抽奖</div>
    <div class="padding-top-20" v-loading="loading">
      <div class="recommend">
        <div class="list">
          <div class="li" v-for="(item, index) in integralDraw" :key="index">
            <el-card class="card" shadow="never">
              <NuxtLink :to="{ path: `/user/integralDraw?id=${item.id}`}">
                <div class="icon">
                  <span v-if="item.type === 1" class="dsshop ds-turntable"
                        :class="{failure: item.is_hidden === 0}"></span>
                  <span v-else-if="item.type === 2" class="dsshop ds-sudoku"
                        :class="{failure: item.is_hidden === 0}"></span>
                  <span v-else class="dsshop ds-slot_machine" :class="{failure: item.is_hidden === 0}"></span>
                </div>
              </NuxtLink>
              <NuxtLink :to="{ path: `/user/integralDraw?id=${item.id}`}">
                <div class="name">{{ item.name }}</div>
              </NuxtLink>
            </el-card>
          </div>
        </div>
      </div>
      <div class="operation">
        <pagination v-if="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    class="pagination" @pagination="getData"/>
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
