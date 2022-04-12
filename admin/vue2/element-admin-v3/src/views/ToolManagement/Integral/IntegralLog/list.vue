<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="关键字">
          <el-input v-model="listQuery.keyword" placeholder="用户手机号" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="listQuery.type" placeholder="类型" clearable>
            <el-option label="收入" value="0"/>
            <el-option label="支出" value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="listQuery.timeInterval"
            :picker-options="pickerOptions"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"/>
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
      <el-table-column
        type="selection"
        width="55"
        fixed="left"/>
      <el-table-column label="ID" prop="id" sortable="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户" prop="user_id">
        <template slot-scope="scope">
          <span>{{ scope.row.user.cellphone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" sortable="type">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作积分" prop="operation">
        <template slot-scope="scope">
          <span>{{ scope.row.operation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作说明" prop="remark">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" prop="created_at">
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
