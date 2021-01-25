<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="插件名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="插件缩写">
        <template slot-scope="scope">
          <span>{{ scope.row.abbreviation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="插件描述">
        <template slot-scope="scope">
          <span>{{ scope.row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column label="插件地址">
        <template slot-scope="scope">
          <a :href="scope.row.url" target="_blank" >{{ scope.row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column label="插件版本">
        <template slot-scope="scope">
          <span>{{ scope.row.locality_versions ? scope.row.locality_versions : '未安装' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最新版本">
        <template slot-scope="scope">
          <span>{{ scope.row.versions }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="$store.jurisdiction.PlugInInstall" v-if="!scope.row.locality_versions || scope.row.is_delete" :loading="butLoading" type="primary" size="mini" @click="handleCreate(scope.row.abbreviation)">安装</el-button>
          <el-button v-permission="$store.jurisdiction.PlugInUpdate" v-else-if="scope.row.locality_versions && scope.row.versions > scope.row.locality_versions" :loading="butLoading" type="warning" size="mini" @click="handleCreate(scope.row.abbreviation, 1)">升级</el-button>
          <el-button v-permission="$store.jurisdiction.PlugInDelete" v-if="scope.row.locality_versions && !scope.row.is_delete" :loading="butLoading" type="danger" size="mini" @click="handleDelete(scope.row.abbreviation)">删除插件</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
  .timeInterval{
    top:-4px;
  }
  .pagination-operation{
    margin-bottom: 80px;
    float:left;
  }
  .pagination-operation .operation{
    margin-left:20px;
    margin-top: 32px;
    font-size: 12px;
    float:left;
    margin-right: 10px;
  }
  .pagination-operation .pagination{
    float:left;
    padding: 0 0;
  }
  .drawing img{
    float:left;
  }
  .drawing .right{
    text-align: left;
    float:left;
    margin-left: 10px;
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
    width: 288px;
    height: 188px;
    line-height: 188px;
    text-align: center;
  }
  .progress-img{
    padding: 30px;
  }
  .avatar {
    width: 288px;
    height: 188px;
    display: block;
  }
</style>

<script>
import { getList, createSubmit, deleteSubmit } from '@/api/plugin'

export default {
  name: 'PlugInList',
  data() {
    return {
      dialogVisible: false,
      ruleForm: [],
      checkAll: false,
      tableKey: 0,
      list: null,
      total: 0,
      textMap: {
        update: '修改',
        create: '添加'
      },
      imgProgressPercent: 0,
      loading: false,
      butLoading: false,
      listLoading: false,
      imgProgress: false,
      dialogStatus: '',
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id',
        activeIndex: '1'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleCreate(name, type) {
      this.butLoading = true
      createSubmit(name).then(() => {
        this.butLoading = false
        this.getList()
        this.$notify({
          title: this.$t('hint.succeed'),
          message: type === 1 ? '更新成功' : '安装成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(name) {
      this.butLoading = true
      deleteSubmit(name).then(() => {
        this.butLoading = false
        this.getList()
        this.$notify({
          title: this.$t('hint.succeed'),
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
