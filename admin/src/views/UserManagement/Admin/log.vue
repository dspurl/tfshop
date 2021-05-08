<template>
  <div class="app-container">
    <div class="filter-container">
    </div>

     <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column :label="$t('usuel.id')" sortable="custom" align="center" width="65" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作员" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.admin_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作路径" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.path}}</span>
        </template>
      </el-table-column>
      <el-table-column label="方式" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
       <el-table-column label="input" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.input }}</span>
        </template>
      </el-table-column>
       <el-table-column label="时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>


    </el-table>
    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<style rel="stylesheet/scss" lang="scss">
  .timeInterval{
    top:-4px;
  }
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
</style>
<script>
import { log } from '@/api/admin'
import Pagination from '@/components/Pagination'
export default {
  name: 'SystemLog',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      total: 0,
      canNull: '',
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '-id',
      },
      temp: {},
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      log(this.listQuery).then(response => {
        this.list = response.data.data
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      } else if (prop === 'name') {
        this.sortByTIME(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },

  }
}
</script>
