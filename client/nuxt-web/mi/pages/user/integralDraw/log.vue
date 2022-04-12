<template>
  <div>
    <div class="padding-top-20">
      <el-table
        :data="data"
        @sort-change="sortChange"
        ref="table"
        border
        v-loading="loading"
        class="table">
        <el-table-column label="抽奖名称">
          <template slot-scope="scope">
            <span>{{ scope.row.integral_draw.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="奖品">
          <template slot-scope="scope">
            <span>{{ scope.row.integral_prize.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.state }}</span>
          </template>
        </el-table-column>
        <el-table-column label="中奖时间" prop="created_at" sortable="created_at">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <NuxtLink v-if="scope.row.state === '未兑换'" :to="{ path: `/indent/create?integral_draw_log_id=${scope.row.id}`}">
              <el-button :loading="buttonLoading" type="danger" size="mini" round>下单</el-button>
            </NuxtLink>
            <NuxtLink v-if="scope.row.model_id && scope.row.model_type === 'App\\Models\\v1\\GoodIndent'" :to="{ path: `/user/indent/detail?id=${scope.row.model_id}`}">
              <el-button :loading="buttonLoading" size="mini" round>查看订单</el-button>
            </NuxtLink>
          </template>
        </el-table-column>
      </el-table>
      <div class="operation">
        <pagination v-if="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    class="pagination" @pagination="getData"/>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
@import "scss/log";
</style>
<script>
import js from './js/log'
export default js
</script>
