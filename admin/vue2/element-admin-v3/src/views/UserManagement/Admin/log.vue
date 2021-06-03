<template>
  <div class="app-container">
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
          <span>{{ scope.row.path }}</span>
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
      <el-table-column label="提交的数据" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
            <el-button type="primary" icon="el-icon-mobile" circle @click="checkJson(scope.row)"/>
          </el-tooltip>
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
    <!--查看-->
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible" title="请求数据详情">
      <json-viewer
        :value="jsonData"
        :expand-depth="5"
        :copyable="copyable"
        theme="my-awesome-json-theme"
        boxed
        sort/>
    </el-dialog>
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
  .my-awesome-json-theme {
    background: #2d2d2d;
    white-space: nowrap;
    color: #ccc;
    font-size: 14px;
    font-family: Consolas, Menlo, Courier, monospace;

    .jv-ellipsis {
      color: #999;
      background-color: #eee;
      display: inline-block;
      line-height: 0.9;
      font-size: 0.9em;
      padding: 0 4px 2px 4px;
      border-radius: 3px;
      vertical-align: 2px;
      cursor: pointer;
      user-select: none;
    }
    .jv-button { color: #49b3ff }
    .jv-key { color: #ccc }
    .jv-item {
      &.jv-array { color: #ccc }
      &.jv-boolean { color: #fc1e70 }
      &.jv-function { color: #067bca }
      &.jv-number { color: #fc1e70 }
      &.jv-object { color: #ccc }
      &.jv-undefined { color: #e08331 }
      &.jv-string {
        color: #42b983;
        word-break: break-word;
        white-space: normal;
      }
    }
    .jv-code {
      .jv-toggle {
        &:before {
          padding: 0 2px;
          border-radius: 2px;
        }
        &:hover {
          &:before {
            background: #eee;
          }
        }
      }
    }
  }
</style>
<script>
import { log } from '@/api/admin'
import Pagination from '@/components/Pagination'
import JsonViewer from 'vue-json-viewer'
export default {
  name: 'SystemLog',
  components: { Pagination, JsonViewer },
  data() {
    return {
      dialogFormVisible: false,
      tableKey: 0,
      total: 0,
      canNull: '',
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '-id'
      },
      jsonData: {
        data: {}
      },
      copyable: {
        copyText: '复制',
        copiedText: '复制中'
      },
      temp: {}
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
    checkJson(res) {
      this.dialogFormVisible = true
      this.jsonData = res.input ? res.input : {}
    }
  }
}
</script>
