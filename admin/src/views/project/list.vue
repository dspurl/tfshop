<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="设备名称">
          <el-input v-model="listQuery.name" placeholder="设备名称" clearable/>
        </el-form-item>
        <el-form-item label="设备品类">
          <el-select v-model="listQuery.smart_device_category_id" placeholder="请选择类型" filterable clearable style="width:160px;">
            <el-option
              v-for="item in category"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设备品牌">
          <el-select v-model="listQuery.smart_device_brand_id" placeholder="请选择类型" filterable clearable style="width:160px;">
            <el-option
              v-for="ite in brand"
              :key="ite.id"
              :label="ite.name"
              :value="ite.id"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
      <br>
      <el-button v-permission="$store.jurisdiction.CreateDevice" class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
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
      <el-table-column
        type="selection"
        width="55"
        fixed="left"/>
      <el-table-column label="设备名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备图标">
        <template slot-scope="scope">
          <div class="drawing">
            <img :src="scope.row.icon" style="width:45px;height:45px;">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="设备品类" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.smart_device_category.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备品牌" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.smart_device_brand.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备型号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.model }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.state_show }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备排序" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" prop="goods_sn">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="$store.jurisdiction.UpdataDevice" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="$store.jurisdiction.DeleteDevice" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="pagination-operation">
      <div class="operation">
        <el-button size="mini" @click="handleCheckAllChange">全选/反选</el-button>
        <el-button size="mini" type="danger" @click="handleAllDelete()">删除</el-button>
      </div>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" class="pagination" @pagination="getList"/>
    </div>

    <!--添加-->
    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="temp.name" maxlength="50" clearable/>
        </el-form-item>
        <el-form-item label="设备品类" prop="smart_device_category_id">
          <el-select v-model="temp.smart_device_category_id" placeholder="请选择类型" filterable clearable style="width:160px;">
            <el-option
              v-for="item in category"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设备品牌" prop="smart_device_brand_id">
          <el-select v-model="temp.smart_device_brand_id" placeholder="请选择类型" filterable clearable style="width:160px;">
            <el-option
              v-for="ite in brand"
              :key="ite.id"
              :label="ite.name"
              :value="ite.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="model">
          <el-input v-model="temp.model" maxlength="60" clearable/>
        </el-form-item>
        <el-form-item label="设备图标" prop="icon">
          <el-input v-model="temp.icon" maxlength="255" clearable style="padding-bottom: 10px;"/>
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-progress="handleProgress"
            :action="actionurl"
            :headers="imgHeaders"
            :data="imgData"
            class="avatar-uploader">
            <span v-if="imgProgress">
              <el-progress :percentage="imgProgressPercent" type="circle" class="progress-img"/>
            </span>
            <span v-else>
              <img v-if="temp.icon" :src="temp.icon" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </span>
            <div slot="tip" class="el-upload__tip">可直接复制网络图片地址，也可上传</div>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否显示" prop="state">
          <el-radio-group v-model="temp.state">
            <el-radio :label="0">显示</el-radio>
            <el-radio :label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-radio-group v-model="temp.sort">
            <el-input v-model="temp.sort" maxlength="11" clearable style="width:80px;"/>
          </el-radio-group>
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
import { getList, setDelete, createSubmit, updateSubmit } from '@/api/device'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ProjectList',
  components: { Pagination },
  data() {
    return {
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
      brand: null,
      category: null,
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
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        smart_device_category_id: [
          { required: true, message: '请选择设备品类', trigger: 'change' }
        ],
        smart_device_brand_id: [
          { required: true, message: '请选择设备品牌', trigger: 'change' }
        ],
        model: [
          { required: true, message: '请输入设备型号', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请添加设备图标', trigger: 'change' }
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请填写排序', trigger: 'blur' }
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
        this.category = response.data.category
        this.brand = response.data.brand
        this.total = response.data.paginate.total
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
        state: 0,
        sort: '5',
        img: ''
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
