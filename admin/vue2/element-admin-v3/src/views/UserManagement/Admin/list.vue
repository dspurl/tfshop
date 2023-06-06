<template>
  <div class="app-container">
    <div class="filter-container">
      <el-menu :default-active="listQuery.authGroup" class="el-menu-demo" mode="horizontal" clearable @select="handleSelect">
        <el-menu-item v-for="(item, index) of authGroupList" :key="index" :index="item.id.toString()">{{ item.introduction }}</el-menu-item>
      </el-menu>
      <br>
      <el-input :placeholder="`${$t('common.table.id')}/${$t('admin.name')}`" v-model="listQuery.title" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('common.search') }}</el-button>
      <el-button v-permission="$store.jurisdiction.AdminCreate" class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('common.add') }}</el-button>
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
      <el-table-column :label="$t('common.table.id')" sortable="custom" align="center" width="65" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.name')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.portrait')" align="center" width="120">
        <template slot-scope="scope">
          <el-avatar :size="45" :src="scope.row.portrait">
            <img src="@/assets/admin/3ea6beec64369c2642b92c6726f1epng.png">
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.group')" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.group }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.email')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.last_login_at')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.last_login_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.time')" sortable="custom" prop="time" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tooltip v-permission="$store.jurisdiction.AdminEdit" :content="$t('common.redact')" class="item" effect="dark" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.AdminDestroy" :content="$t('common.delete')" class="item" effect="dark" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!--添加-->
    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('admin.name')" prop="name">
          <el-input v-model="temp.name" maxlength="30" clearable/>
        </el-form-item>
        <el-form-item :label="$t('admin.email')" prop="email">
          <el-input v-model="temp.email" maxlength="255" clearable/>
        </el-form-item>
        <el-form-item :label="$t('admin.cellphone')" prop="cellphone">
          <el-input v-model="temp.cellphone" maxlength="11" clearable/>
        </el-form-item>
        <el-form-item :label="$t('admin.portrait')" prop="portrait">
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-progress="handleProgress"
            :action="actionUrl"
            :headers="imgHeaders"
            :data="imgData"
            class="avatar-uploader">
            <span v-if="imgProgress">
              <el-progress :percentage="imgProgressPercent" type="circle" class="progress-img"/>
            </span>
            <span v-else>
              <el-image
                v-if="temp.portrait"
                :src="temp.portrait"
                fit="scale-down"
                class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </span>
            <div slot="tip" class="el-upload__tip">{{ $t('hint.tip.upload', { rmvb: 'jpg/png/gif', size: '500KB' } ) }}</div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('admin.password')" prop="password">
          <el-input v-model="temp.password" show-password maxlength="255" clearable/>
          <div class="el-upload__tip">{{ $t('admin.password.tip') }}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button :loading="formLoading" type="primary" @click="dialogStatus==='create'?create():edit()">{{ $t('common.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
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
import { getList, create, edit, destroy, getAuthGroupList } from '@/api/admin'
import { getToken } from '@/utils/auth'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination'
export default {
  name: 'AdminList',
  components: { Pagination },
  directives: { waves },
  data() {
    var validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('hint.error.please_enter', { attribute: this.$t('admin.email') })))
      } else {
        if (!(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value))) {
          callback(new Error(this.$t('hint.error.wrong_format', { attribute: this.$t('admin.email') })))
        }
        callback()
      }
    }
    return {
      formLoading: false,
      actionUrl: process.env.BASE_API + 'uploadPictures',
      imgProgress: false,
      imgProgressPercent: 0,
      imgHeaders: {
        Authorization: 'Bearer ' + getToken('access_token')
      },
      imgData: {
        type: 1,
        size: 1024 * 500
      },
      uploadData: {},
      imageUrl: '',
      portrait: '',
      tableKey: 0,
      list: null,
      authGroupList: null,
      textMap: {
        update: this.$t('common.amend'),
        create: this.$t('common.add')
      },
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        sort: 'id',
        authGroup: '0'
      },
      temp: {
        password: '',
        name: '',
        portrait: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        name: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('admin.name') }), trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('admin.email') }), trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        cellphone: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('admin.cellphone') }), trigger: 'blur' }
        ],
        portrait: [
          { required: true, message: this.$t('hint.error.please_upload', { attribute: this.$t('admin.portrait') }), trigger: 'change' }
        ],
        password: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('admin.password') }), trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getAuthGroup()
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
    getAuthGroup() {
      getAuthGroupList(this.listQuery).then(resp => {
        this.authGroupList = resp.data
        this.authGroupList.unshift({
          id: 0,
          introduction: this.$t('common.all')
        })
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
    resetTemp() {
      this.temp = {
        imageUrl: '',
        password: '',
        name: '',
        portrait: ''
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
      this.rules.password[0].required = false
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
              title: this.$t('common.succeed'),
              message: this.$t('hint.succeed.win', { attribute: this.$t('common.add') }),
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
            this.$store.dispatch('GetUserInfo').then(res => {}) // 更新管理员信息
            this.$notify({
              title: this.$t('common.succeed'),
              message: this.$t('hint.succeed.win', { attribute: this.$t('common.update') }),
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
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.temp.portrait = file.response
      this.imgProgress = false
      this.imgProgressPercent = 0
    },
    // 上传时
    handleProgress(file, fileList) {
      this.imgProgressPercent = file.percent
    },
    // 图片格式大小验证
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (
        ['image/jpeg',
          'image/gif',
          'image/png'
        ].indexOf(file.type) === -1) {
        this.$message.error(this.$t('hint.upload.img.rmvb'))
        return false
      }
      if (!isLt2M) {
        this.$message.error(this.$t('hint.upload.img.can_not_surpass', { size: '2M' }))
      }
      this.imgProgress = true
      return isLt2M
    },
    handleSelect(index) {
      this.listQuery.title = ''
      this.listQuery.authGroup = index
      this.listQuery.page = 1
      this.getList()
    },
    handleDelete(row) { // 删除
      this.$confirm(this.$t('admin.delete_prompt'), this.$t('common.hint'), {
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
    }
  }
}
</script>
<style>
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
