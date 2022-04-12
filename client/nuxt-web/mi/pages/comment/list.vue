<template>
  <div class="box">
    <div class="container">
      <el-table
        v-loading="loading"
        :data="list"
        ref="table"
        class="table"
        empty-text="暂无评价">
        <el-table-column
          label="评价">
          <template slot-scope="scope">
            <div class="details">{{scope.row.comment.details}}</div>
            <div class="imgList" v-if="scope.row.comment.resources_many.length > 0">
              <el-image
                class="img"
                v-for="(item,index) in scope.row.comment.resources_many" :key="index"
                fit="contain"
                :src="item.img | smallImage(150)"
                :preview-src-list="scope.row.comment.resources_many.map(item => { return item.img })">
              </el-image>
            </div>
            <div class="time">{{scope.row.comment.created_at.split(' ')[0]}}</div>
            <div class="reply" v-if="scope.row.comment.reply">
              解释：{{scope.row.comment.reply.details}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="购买类型"
          align="center"
          width="300">
          <template slot-scope="scope">
            <div v-if="scope.row.good_sku">
              <span v-for="(item,index) in scope.row.good_sku.product_sku" :key="index">
                {{item.key}}:{{item.value}}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="用户"
          width="150"
          align="center">
          <template slot-scope="scope">
            {{scope.row.comment.name}}
          </template>
        </el-table-column>
      </el-table>
      <div class="operation">
        <pagination v-if="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList" :autoScroll="false"/>
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
