<template>
  <div class="box">
    <div class="user-title">{{$t('user.bill')}}</div>
    <div class="padding-top-20">
      <el-tabs v-model="listQuery.type" @tab-click="getReloadList">
        <el-tab-pane :label="$t('finance.all')" name="0"></el-tab-pane>
        <el-tab-pane :label="$t('finance.income')" name="1"></el-tab-pane>
        <el-tab-pane :label="$t('finance.disbursement')" name="2"></el-tab-pane>
      </el-tabs>
      <div class="indent-list">
        <el-table
          :data="moneyLogList"
          ref="table"
          border
          v-loading="loading"
          class="table">
          <el-table-column
            :label="$t('finance.remark')">
            <template slot-scope="scope">
              {{scope.row.remark}}
            </template>
          </el-table-column>
          <el-table-column
            prop="type_show"
            :label="$t('finance.type')"
            width="120">
          </el-table-column>
          <el-table-column
            :label="$t('finance.money')"
            width="120">
            <template slot-scope="scope">
              {{scope.row.money_show | thousands}}
            </template>
          </el-table-column>
          <el-table-column
            prop="created_at"
            :label="$t('finance.date')"
            width="180">
          </el-table-column>
        </el-table>
      </div>
      <div class="operation">
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
