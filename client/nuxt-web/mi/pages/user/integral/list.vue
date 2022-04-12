<template>
  <div class="box">
    <div class="user-title">积分明细</div>
    <el-form :inline="true" :model="listQuery" size="mini" class="form-inline">
      <el-form-item label="关键字">
        <el-input v-model="listQuery.keyword" placeholder="操作说明" clearable @keyup.enter.native="handleFilter" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="listQuery.type" placeholder="类型" clearable>
          <el-option label="收入" value="0"/>
          <el-option label="支出" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          style="position: relative;top:1px;"
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
    <div class="subtotal">
      <div class="item">入账合计：{{ income }}</div>
      <div class="item">出账合计：{{ expend }}</div>
    </div>
    <div class="padding-top-20">
      <el-table
        :data="list"
        @sort-change="sortChange"
        ref="table"
        border
        v-loading="loading"
        class="table">
        <el-table-column label="ID" prop="id" sortable="id">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type" sortable="type">
          <template slot-scope="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作积分" prop="operation" sortable="operation">
          <template slot-scope="scope">
            <span>{{ scope.row.operation }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作说明" prop="remark">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="operation">
        <pagination v-if="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
  @import "scss/list";
</style>
<script>
import js from './js/list'
export default js
</script>
