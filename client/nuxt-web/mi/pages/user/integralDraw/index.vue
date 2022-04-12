<template>
  <div v-loading="loading">
    <div v-if="data">
      <div class="user-title">{{ data.name }}</div>
      <div class="main">
        <div class="draw-box" :class="{failure: !data.is_hidden}">
          <ds-lucky-wheel v-if="data.type === 1" ref="myLuckyWheel" :data="data" @refresh="handleFilter()"/>
          <ds-lucky-grid v-else-if="data.type === 2" ref="myLuckyGrid" :data="data" @refresh="handleFilter()"/>
          <ds-slot-machine v-else-if="data.type === 3" ref="mySlotMachine" :data="data" @refresh="handleFilter()"/>
        </div>
        <div class="popup" v-if="!data.is_hidden"></div>
      </div>
      <el-row class="explain-box" :gutter="12">
        <el-col :span="14">
          <el-card shadow="never">
            <div class="time">活动时间：{{ data.start_time }} - {{ data.end_time }}</div>
            <div class="explain">{{data.explain}}</div>
          </el-card>
        </el-col>
      </el-row>
      <div class="padding-top-20">
        <el-table
          :data="integralDrawLog"
          @sort-change="sortChange"
          ref="table"
          border
          v-loading="tableLoading"
          class="table">
          <el-table-column label="奖品">
            <template slot-scope="scope">
              <span>{{ scope.row.integral_prize.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户" prop="type">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column label="中奖时间" prop="created_at" sortable="created_at">
            <template slot-scope="scope">
              <span>{{ scope.row.created_at }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="operation">
          <pagination v-if="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getData"/>
        </div>
      </div>
    </div>
    <div v-else>
      <div style="text-align: center;">~没有找到抽奖活动</div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
@import "scss/index";
</style>
<script>
import js from './js/index'
export default js
</script>
