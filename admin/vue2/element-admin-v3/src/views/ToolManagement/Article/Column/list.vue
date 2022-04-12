<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="栏目名称">
          <el-input v-model="listQuery.title" placeholder="栏目名称" clearable @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item label="类目" prop="pid">
          <el-cascader
            v-model="listQuery.pid"
            :options="categoryList"
            :props="{ checkStrictly: true, expandTrigger: 'hover' }"
            clearable/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
      <br>
      <router-link v-permission="$store.jurisdiction.ColumnCreate" :to="'ColumnCreate'">
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
      <el-table-column :label="$t('usuel.id')" sortable="custom" align="center" width="65" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="栏目名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上级类目" align="center" sortable="custom" prop="pid">
        <template slot-scope="scope">
          <span>{{ scope.row.column ? scope.row.column.name : '顶级类目' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否列表" align="center" sortable="custom" prop="is_list">
        <template slot-scope="scope">
          <span>{{ scope.row.is_list ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" sortable="custom" prop="created_at">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" sortable="custom" prop="is_show">
        <template slot-scope="scope">
          <span>{{ scope.row.is_show === 1 ? '显示' : '隐藏' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="250" fixed="right">
        <template slot-scope="scope">
          <router-link v-permission="$store.jurisdiction.ColumnEdit" :to="{ path: 'ColumnEdit', query: { id: scope.row.id }}">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button type="primary" icon="el-icon-edit" circle/>
            </el-tooltip>
          </router-link>
          <el-tooltip v-permission="$store.jurisdiction.ColumnDestroy" class="item" effect="dark" content="删除" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagination-operation">
      <div class="operation">
        <el-button size="mini" @click="handleCheckAllChange">全选/反选</el-button>
        <el-button v-permission="$store.jurisdiction.ColumnDestroy" :loading="formLoading" size="mini" type="danger" @click="handleAllDelete()">删除</el-button>
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
