<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="规格名称">
          <el-input v-model="listQuery.title" placeholder="规格名称" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
      <br>
      <el-button v-permission="$store.jurisdiction.CreateSpecification" class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
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
      <el-table-column label="编号" >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格名称" >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格标注名称" >
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格组名称" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.specification_group_id ? scope.row.specification_group.name : '未分组' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格类型" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.type_show }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示位置" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.location_show }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格值" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否可搜索" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.is_search ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="$store.jurisdiction.EditSpecification" type="warning" size="mini" style="width:80px" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="$store.jurisdiction.DeleteSpecification" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="temp.name" maxlength="30" clearable/>
        </el-form-item>
        <el-form-item label="规格标注名称" prop="label">
          <el-input v-model="temp.label" placeholder="为空取规格名称" maxlength="20" clearable/>
        </el-form-item>
        <el-form-item label="规格类型" prop="type">
          <el-select v-model="temp.type" placeholder="请选择类型" clearable style="width:160px;">
            <el-option :value="1" label="文本"/>
            <el-option :value="2" label="单选"/>
            <el-option :value="3" label="多选"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否可搜索" prop="is_search">
          <el-radio-group v-model="temp.is_search">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
          <el-alert
            title="设为可搜索，则可显示在筛选条件中;只有单选、多选设置才有效"
            type="warning"/>
        </el-form-item>
        <el-form-item label="规格组" prop="specification_group_id">
          <el-select v-model="temp.specification_group_id" placeholder="请选择类型" clearable style="width:160px;">
            <el-option
              v-for="(item,index) in SpecificationGroup"
              :key="index"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="显示位置" prop="location">
          <el-select v-model="temp.location" placeholder="请选择位置" clearable style="width:160px;">
            <el-option :value="0" label="规格参数页"/>
            <el-option :value="1" label="详情页"/>
            <el-option :value="2" label="都显示"/>
          </el-select>
        </el-form-item>
        <el-form-item label="规格值" prop="value">
          <el-input v-model="temp.value" :autosize="{ minRows: 4}" type="textarea" show-word-limit clearable/>
          <el-alert
            title="多个规格，请用回车分割"
            type="warning"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort" style="width:200px;">
          <el-input v-model="temp.sort" clearable/>
        </el-form-item>
        <el-form-item prop="sort">
          <el-alert
            title="排序值越小越靠前"
            type="warning"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('usuel.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createSubmit():updateSubmit()">确定</el-button>
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
import { getList, setDelete, createSubmit, updateSubmit } from '@/api/specification'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'SpecificationList',
  components: { Pagination },
  data() {
    return {
      actionurl: process.env.BASE_API + 'uploadPictures',
      imgHeaders: {
        Authorization: getToken('token_type') + ' ' + getToken('access_token')
      },
      SpecificationGroup: [],
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
        ],
        type: [
          { required: true, message: '请选择属性类型', trigger: 'change' }
        ],
        is_search: [
          { required: true, message: '请选择是否可搜索属性', trigger: 'change' }
        ],
        location: [
          { required: true, message: '请选择显示位置', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
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
        this.list = response.data.paginate.data
        this.total = response.data.paginate.total
        this.SpecificationGroup = response.data.SpecificationGroup
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
      } else if (prop === 'time') {
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
        location: ''
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
      var title = '是否确认删除该内容?'
      var win = '删除成功'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        setDelete(row.id, row).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: this.$t('hint.succeed'),
            message: win,
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {
      })
    },
    handleAllDelete() { // 批量删除
      var title = '是否确认批量删除内容?'
      var win = '删除成功'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        setDelete(0, this.multipleSelection).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: this.$t('hint.succeed'),
            message: win,
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {
      })
    },
    createSubmit() { // 添加
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createSubmit(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.creatingSuccessful'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateSubmit() { // 更新
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateSubmit(this.temp.id, this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.updateSuccessful'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.temp.img = file.response
      this.imgProgress = false
      this.imgProgressPercent = 0
    },
    // 上传时
    handleProgress(file, fileList) {
      this.imgProgressPercent = file.percent
    },
    // 图片格式大小验证
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 < 500

      if (
        ['image/jpeg',
          'image/gif',
          'image/png',
          'image/bmp'
        ].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的图片格式')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 500KB!')
      }
      this.imgProgress = true
      return isLt2M
    }
  }
}
</script>
