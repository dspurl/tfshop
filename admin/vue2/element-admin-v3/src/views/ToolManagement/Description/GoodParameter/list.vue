<template>
  <div class="app-container">
    <div class="filter-container">
      <router-link v-permission="$store.jurisdiction.GoodParameterCreate" :to="'GoodParameterCreate'">
        <el-button class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit">添加</el-button>
      </router-link>
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
      <el-table-column label="ID" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参数名" prop="value">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="250" fixed="right">
        <template slot-scope="scope">
          <router-link v-permission="$store.jurisdiction.GoodParameterEdit" :to="{ path: 'GoodParameterEdit', query: { id: scope.row.id }}">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button type="primary" icon="el-icon-edit" circle/>
            </el-tooltip>
          </router-link>
          <el-tooltip v-permission="$store.jurisdiction.GoodParameterDestroy" class="item" effect="dark" content="删除" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagination-operation">
      <div class="operation">
        <el-button size="mini" @click="handleCheckAllChange">全选/反选</el-button>
        <el-button v-permission="$store.jurisdiction.GoodParameterDestroy" :loading="formLoading" size="mini" type="danger" @click="handleAllDelete()">删除</el-button>
      </div>
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
