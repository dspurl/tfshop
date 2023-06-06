<template>
  <div class="box">
    <div class="user-title">{{$t('header.top.message')}}</div>
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
          :label="$t('notice.title')">
          <template slot-scope="scope">
            <NuxtLink :class="{on: !scope.row.read_at}" :to="{ path: '/user/notice/detail', query: { id: scope.row.id }}">
              <span v-if="!scope.row.read_at">●</span>{{scope.row.data.title}}
            </NuxtLink>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          :label="$t('notice.time')"
          width="180"
          sortable>
        </el-table-column>
        <el-table-column
          prop="data.typeShow"
          :label="$t('notice.type')"
          width="140">
        </el-table-column>
      </el-table>
      <div class="operation">
        <el-button size="mini" :loading="buttonLoading" @click="handleCheckAllChange">{{$t('notice.select_reverse')}}</el-button>
        <el-button size="mini" :loading="buttonLoading" @click="handleAllRead()">{{$t('notice.read')}}</el-button>
        <el-button size="mini" :loading="buttonLoading" @click="handleAllDelete()">{{$t('common.delete')}}</el-button>
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
