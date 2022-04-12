<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="listQuery.username" placeholder="用户名" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="抽奖名称">
          <el-input v-model="listQuery.integral_draw_name" placeholder="抽奖名称" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="奖品">
          <el-input v-model="listQuery.prize" placeholder="抽奖名称" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="listQuery.timeInterval"
            :picker-options="pickerOptions"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange">
      <el-table-column label="ID" prop="id" sortable="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户" prop="user_id">
        <template slot-scope="scope">
          <span>{{ scope.row.user.name }}({{ scope.row.user_id }})</span>
        </template>
      </el-table-column>
      <el-table-column label="抽奖名称" prop="integral_draw_id">
        <template slot-scope="scope">
          <span>{{ scope.row.integral_draw.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖品" prop="integral_prize_id">
        <template slot-scope="scope">
          <span v-if="scope.row.integral_prize_id">{{ scope.row.integral_prize.name }}</span>
          <span v-else>未中奖</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state" sortable="state">
        <template slot-scope="scope">
          <span>{{ scope.row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column label="抽奖时间" prop="created_at" sortable="created_at">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagination-operation">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
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
