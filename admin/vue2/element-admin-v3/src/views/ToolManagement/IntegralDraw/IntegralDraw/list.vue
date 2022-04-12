<template>
  <div class="app-container">
    <div class="filter-container">
      <router-link v-permission="$store.jurisdiction.IntegralDrawCreate" :to="'IntegralDrawCreate'">
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
      <el-table-column label="名称" prop="name">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="抽奖类型" prop="type">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="说明" prop="explain" width="400">
        <template slot-scope="scope">
          <div class="explain" v-html="scope.row.explain"/>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" prop="start_time">
        <template slot-scope="scope">
          <span>{{ scope.row.start_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" prop="end_time">
        <template slot-scope="scope">
          <span>{{ scope.row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="is_hidden">
        <template slot-scope="scope">
          <span>{{ scope.row.is_hidden }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="250" fixed="right">
        <template slot-scope="scope">
          <router-link v-permission="$store.jurisdiction.IntegralDrawEdit" :to="{ path: 'IntegralDrawEdit', query: { id: scope.row.id }}">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
              <el-button type="primary" icon="el-icon-edit" circle/>
            </el-tooltip>
          </router-link>
          <router-link v-permission="$store.jurisdiction.IntegralDrawLogList" :to="{ path: '/toolManagement/integralDrawLog/integralDrawLogList', query: { integral_draw_id: scope.row.id }}">
            <el-tooltip class="item" effect="dark" content="抽奖记录" placement="top-start">
              <el-button icon="el-icon-date" circle/>
            </el-tooltip>
          </router-link>
          <el-tooltip v-permission="$store.jurisdiction.IntegralDrawDestroy" class="item" effect="dark" content="删除" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagination-operation">
      <div class="operation">
        <el-button size="mini" @click="handleCheckAllChange">全选/反选</el-button>
        <el-button v-permission="$store.jurisdiction.IntegralDrawDestroy" :loading="formLoading" size="mini" type="danger" @click="handleAllDelete()">删除</el-button>
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
