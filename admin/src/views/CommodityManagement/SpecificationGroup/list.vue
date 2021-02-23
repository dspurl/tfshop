<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="规格组名称">
          <el-input v-model="listQuery.title" placeholder="规格组名称" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
      <br>
      <el-button v-permission="$store.jurisdiction.SpecificationGroupCreate" class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
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
      <el-table-column label="规格组名称" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="120" fixed="right">
        <template slot-scope="scope">
          <el-tooltip v-permission="$store.jurisdiction.SpecificationGroupEdit" class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.SpecificationGroupDestroy" class="item" effect="dark" content="删除" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="pagination-operation">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
    </div>

    <!--添加-->
    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="规格组名称" prop="name">
          <el-input v-model="temp.name" maxlength="30" clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('usuel.cancel') }}</el-button>
        <el-button :loading="formLoading" type="primary" @click="dialogStatus==='create'?create():edit()">确定</el-button>
      </div>
    </el-dialog>
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
    width: 188px;
    height: 188px;
    line-height: 188px;
    text-align: center;
  }
  .progress-img{
    padding: 30px;
  }
  .avatar {
    width: 188px;
    height: 188px;
    display: block;
  }
</style>

<script>
import { getList, create, edit, destroy } from '@/api/specificationGroup'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
  name: 'SpecificationGroupList',
  components: { Pagination },
  data() {
    return {
      formLoading: false,
      actionurl: process.env.BASE_API + 'uploadPictures',
      imgHeaders: {
        Authorization: getToken('token_type') + ' ' + getToken('access_token')
      },
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
      imgData: {
        type: 1,
        size: 1024 * 500
      },
      imgProgressPercent: 0,
      loading: false,
      listLoading: false,
      imgProgress: false,
      dialogStatus: '',
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id',
        activeIndex: '1'
      },
      temp: {},
      rules: {
        name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ]
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
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.listQuery.sort = '+' + prop
      } else {
        this.listQuery.sort = '-' + prop
      }
      this.handleFilter()
    },
    handleSelect(key, keyPath) {
      this.listQuery.activeIndex = key
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        name: '',
        type: '',
        is_search: 0,
        value: '',
        label: '',
        sort: 5,
        specification_group_id: '',
        location: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) { // 编辑
      this.temp = null
      this.temp = row
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCheckAllChange() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange(val) { // 设置全选/全不选数据
      this.multipleSelection = val
    },
    handleDelete(row) { // 删除
      const title = '是否确认删除该内容?'
      const win = '删除成功'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        this.formLoading = true
        destroy(row.id).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.formLoading = false
          this.$notify({
            title: this.$t('hint.succeed'),
            message: win,
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.formLoading = false
        })
      }).catch(() => {
      })
    },
    create() { // 添加
      this.formLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          create(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.formLoading = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.creatingSuccessful'),
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.formLoading = false
          })
        } else {
          this.formLoading = false
        }
      })
    },
    edit() { // 更新
      this.formLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          edit(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.formLoading = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.updateSuccessful'),
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.formLoading = false
          })
        } else {
          this.formLoading = false
        }
      })
    }
  }
}
</script>
