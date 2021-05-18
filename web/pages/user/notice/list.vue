<template>
  <div class="box">
    <div class="user-title">消息通知</div>
    <div class="padding-top-20" v-loading="loading">
      <el-table
        :data="noticeList"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
        ref="table"
        border
        v-loading="tableLoading"
        class="table">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="data.title"
          label="标题">
          <template slot-scope="scope">
            <NuxtLink :class="{on: !scope.row.read_at}" :to="{ path: '/user/notice/detail', query: { id: scope.row.id }}">
              <span v-if="!scope.row.read_at">●</span>{{scope.row.data.title}}
            </NuxtLink>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="时间"
          width="180"
          sortable>
        </el-table-column>
        <el-table-column
          prop="data.typeShow"
          label="类型"
          width="120">
        </el-table-column>
      </el-table>
      <div class="operation">
        <el-button size="mini" :loading="buttonLoading" @click="handleCheckAllChange">全选/反选</el-button>
        <el-button size="mini" :loading="buttonLoading" @click="handleAllRead()">标记已读</el-button>
        <el-button size="mini" :loading="buttonLoading" @click="handleAllDelete()">删除</el-button>
        <pagination v-if="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
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
