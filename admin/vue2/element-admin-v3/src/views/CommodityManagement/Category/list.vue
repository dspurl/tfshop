<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('category.filter.form.cascader.placeholder.pid')" v-model="listQuery.title" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
      <el-cascader
        v-model="listQuery.pid"
        :options="options"
        :props="{ checkStrictly: true }"
        filterable
        clearable
        style="top:-4px"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('common.search') }}</el-button>
      <el-button v-permission="$store.jurisdiction.CategoryCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">{{ $t('common.add') }}</el-button>
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
      <el-table-column :label="$t('common.table.id')" align="center" width="65" sortable="custom" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.table.label.icon')" align="center">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.resources"
            :src="scope.row.resources.img | smallImage(300)"
            fit="scale-down"
            style="width: 80px;"/>
          <span v-else>{{ $t('common.table.nothing') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.table.label.name')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.table.sort')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.table.state')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.state_show }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" align="center" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <el-tooltip v-permission="$store.jurisdiction.CategoryCreate" :content="$t('common.copy')" class="item" effect="dark" placement="top-start">
            <el-button type="success" icon="el-icon-document-copy" circle @click="handleCreate(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.CategoryCreate" :content="$t('common.add_subclass')" class="item" effect="dark" placement="top-start">
            <el-button type="success" icon="el-icon-folder-add" circle @click="handleSonCreate(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.CategoryEdit" :content="$t('common.redact')" class="item" effect="dark" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.CategoryDestroy" :content="$t('common.delete')" class="item" effect="dark" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--添加-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="adminRules" :model="temp" label-position="left" label-width="120px" style="width:90%;">
        <el-form-item :label="$t('category.dialog.form.input.label.name')" prop="name" style="width:400px;">
          <el-input v-model="temp.name" maxlength="30" clearable/>
        </el-form-item>
        <el-form-item :label="$t('category.dialog.form.cascader.label.pid')" prop="pid">
          <el-cascader
            v-model="temp.pid"
            :options="options"
            :props="{ checkStrictly: true }"
            filterable
            clearable
            style="top:-4px"/>
        </el-form-item>
        <el-form-item :label="$t('common.sort')" prop="sort" style="width:200px;">
          <el-input v-model="temp.sort" clearable/>
        </el-form-item>
        <el-form-item prop="sort">
          <el-alert
            :title="$t('common.sort.tip')"
            type="warning"/>
        </el-form-item>
        <el-form-item :label="$t('category.dialog.form.upload.label.logo')" prop="logo">
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
              <el-image
                v-if="temp.logo"
                :src="temp.logo"
                fit="scale-down"
                class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </span>
            <div slot="tip" class="el-upload__tip">{{ $t('hint.tip.upload_recommend', { rmvb: 'jpg/png/gif', size: '500KB', recommend: '120px*120px' }) }}</div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('common.is_show')" prop="state">
          <el-radio-group v-model="temp.state">
            <el-radio :label="0">{{ $t('common.yes') }}</el-radio>
            <el-radio :label="1">{{ $t('common.no') }}</el-radio>
          </el-radio-group>
          <el-alert
            :title="$t('category.dialog.form.radio_group.tip.is_show')"
            type="warning"/>
        </el-form-item>
        <el-form-item :label="$t('category.dialog.form.radio_group.label.is_recommend')" prop="is_recommend">
          <el-radio-group v-model="temp.is_recommend">
            <el-radio :label="1">{{ $t('common.yes') }}</el-radio>
            <el-radio :label="0">{{ $t('common.no') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('category.dialog.form.transfer.label.specification')" prop="specification">
          <el-transfer
            :filter-method="filterMethod"
            :titles="[$t('common.unselected'), $t('common.selected')]"
            :data="data"
            :filter-placeholder="$t('category.dialog.form.transfer.filter_placeholder.specification')"
            v-model="temp.specification"
            filterable/>
          <el-alert
            :title="$t('category.dialog.form.transfer.tip.specification')"
            type="warning"/>
        </el-form-item>
        <el-form-item :label="$t('category.dialog.form.transfer.label.brand')" prop="brand">
          <el-transfer
            :titles="[$t('common.unselected'), $t('common.selected')]"
            :data="dataBrand"
            :filter-placeholder="$t('category.dialog.form.transfer.filter_placeholder.brand')"
            v-model="temp.brand"
            filterable/>
          <el-alert
            :title="$t('category.dialog.form.transfer.tip.brand')"
            type="warning"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="formLoading" @click="dialogFormVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button :loading="formLoading" type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
  .timeInterval{
    top:-4px;
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
  .el-dialog{
    width:65% !important;
  }
</style>

<script>
import { getList, create, edit, destroy } from '@/api/category'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'

export default {
  name: 'CategoryList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      formLoading: false,
      data: [],
      dataBrand: [],
      value: [],
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      },
      tableKey: 0,
      options: [],
      list: null,
      total: 0,
      textMap: {
        update: this.$t('common.amend'),
        create: this.$t('common.add')
      },
      imgData: {
        type: 1,
        size: 1024 * 500,
        specification: [80, 300]
      },
      actionurl: process.env.BASE_API + 'uploadPictures',
      imgHeaders: {
        Authorization: getToken('token_type') + ' ' + getToken('access_token')
      },
      imgProgressPercent: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '',
        pid: []
      },
      imgProgress: false,
      temp: {
        title: '',
        api: '',
        state: 0,
        pid: [],
        attribute: [],
        brand: [],
        sort: 5,
        is_recommend: 0,
        parameter: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      adminRules: {
        name: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('category.dialog.form.input.label.name') }), trigger: 'blur' }
        ],
        sort: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('common.sort') }), trigger: 'blur' }
        ],
        state: [
          { required: true, message: this.$t('hint.error.select', { specification: this.$t('common.state') }), trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      parameterList: []
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
        this.options = response.data.options
        this.total = response.data.paginate.total
        this.listLoading = false
        const that = this
        that.data = []
        response.data.specification.forEach((res, index) => {
          that.data.push({
            label: res.label,
            key: res.id
          })
        })
        that.dataBrand = []
        response.data.brand.forEach((res, index) => {
          that.dataBrand.push({
            label: res.name,
            key: res.id
          })
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      if (this.listQuery.timeInterval) {
        this.listQuery.timeInterval = this.listQuery.timeInterval.join('至')
      }
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
    resetTemp() {
      this.temp = {
        title: '',
        api: '',
        state: 0,
        pid: [],
        attribute: [],
        brand: [],
        sort: 5,
        is_recommend: 0,
        parameter: []
      }
    },
    handleCreate(row = null) {
      if (!row) {
        this.resetTemp()
      } else {
        this.temp = Object.assign({}, row)
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSonCreate(row = null) {
      this.resetTemp()
      this.temp.pid = row.id
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() { // 添加
      this.formLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.pid.length > 0) {
            this.temp.pid = this.temp.pid.pop()
          }
          create(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.formLoading = false
            this.$notify({
              title: this.$t('common.succeed'),
              message: this.$t('hint.succeed.win', { attribute: this.$t('common.add') }),
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.formLoading = false
          })
        }
      })
    },
    updateData() { // 更新
      this.formLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.pid.length > 0) {
            this.temp.pid = this.temp.pid.pop()
          }
          edit(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.formLoading = false
            this.$notify({
              title: this.$t('common.succeed'),
              message: this.$t('hint.succeed.win', { attribute: this.$t('common.update') }),
              type: 'success',
              duration: 2000
            })
          }).catch(() => {
            this.formLoading = false
          })
        }
      })
    },
    handleUpdate(row) { // 修改
      this.temp = row
      if (row.pid === 0) {
        row.pid = [0]
      }
      if (row.resources) {
        this.temp.logo = row.resources.img
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) { // 删除
      this.$confirm(this.$t('hint.deleteDetermine'), this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.formLoading = true
        destroy(row.id).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.formLoading = false
          this.$notify({
            title: this.$t('common.succeed'),
            message: this.$t('hint.succeed.win', { attribute: this.$t('common.delete') }),
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.formLoading = false
        })
      }).catch(() => {
      })
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.temp.logo = file.response
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
        this.$message.error(this.$t('hint.upload.img.rmvb'))
        return false
      }
      if (!isLt2M) {
        this.$message.error(this.$t('hint.upload.img.can_not_surpass', { size: '500KB' }))
      }
      this.imgProgress = true
      return isLt2M
    }
  }
}
</script>
