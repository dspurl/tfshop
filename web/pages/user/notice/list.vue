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

<script>
import {getList, destroy, read} from '@/api/notification'
export default {
  layout: 'user',
  head () {
    return {
      title: '消息通知-个人中心',
    }
  },
  data() {
    return {
      tableLoading: false,
      checkboxAll: false,
      loading: true,
      buttonLoading: false,
      noticeList: [],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1,
        sort: '-created_at',
        pc: true
      },
      multipleSelection: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList(){
      this.tableLoading = true;
      await Promise.all([
        getList(this.listQuery)
      ]).then(([notificationData]) => {
        this.noticeList = notificationData.data;
        this.total = notificationData.total;
        this.loading = false;
        this.tableLoading = false
      }).catch((error) => {
        this.loading = false;
        this.tableLoading = false
      })
    },
    handleCheckAllChange() {
      this.$refs.table.toggleAllSelection()
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    handleAllDelete() { // 批量删除
      if(this.multipleSelection.length === 0){
        this.$message({
          message: '请选择需要操作的内容',
          type: 'error'
        });
        return false
      }
      this.$confirm('是否确认删除选中内容？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true;
        destroy(this.multipleSelection).then(response => {
          this.buttonLoading = false;
          this.handleFilter();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }).catch(() => {
          this.buttonLoading = false
        })
      }).catch(() => {
      })
    },
    handleAllRead() { // 批量标记为已读
      if(this.multipleSelection.length === 0){
        this.$message({
          message: '请选择需要操作的内容',
          type: 'error'
        });
        return false
      }
      this.buttonLoading = true
      read(this.multipleSelection).then(response => {
        this.buttonLoading = false;
        this.getList();
        this.$message({
          message: '标记成功',
          type: 'success'
        });
      }).catch(() => {
        this.buttonLoading = false
      })
    },
    sortChange(data) {
      const { prop, order } = data;
      if (order === 'ascending') {
        this.listQuery.sort = '+' + prop
      } else if(order === 'descending') {
        this.listQuery.sort = '-' + prop
      }else{
        this.listQuery.sort = null
      }
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList()
    },
  }
}
</script>
<style lang='scss' scoped>
  .operation{
    margin-top:20px;
    display: flex;
    .pagination{
      margin-left:5px;
      padding:0 0;
    }
  }
  .table{
    width: 100%;
    a{
      color: #999;
      span{
        font-size: 16px;
        color: #fa524c;
        margin-right: 5px;
      }
    }
    a:hover{
      color: #fa524c;
    }
    .on{
      color: #000;
    }
  }
  .user-title{
    color: #757575;
    font-weight: 400;
    font-size: 18px;
    margin-bottom: 20px;
  }
</style>
