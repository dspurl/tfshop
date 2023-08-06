<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="`${$t('common.table.id')}/${$t('member.cellphone')}/${$t('member.name')}`" v-model="listQuery.title" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
      <span class="filter-item">
        <el-date-picker
          v-model="listQuery.timeInterval"
          :picker-options="pickerOptions"
          :range-separator="$t('common.to')"
          :start-placeholder="$t('date_picker.start_placeholder')"
          :end-placeholder="$t('date_picker.end_placeholder')"
          type="datetimerange"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"/>
      </span>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('common.search') }}</el-button>
      <el-radio-group v-model="listQuery.state" class="filter-item" @change="handleFilter">
        <el-radio-button label="0">{{ $t('common.all') }}</el-radio-button>
        <el-radio-button label="1">{{ $t('member.state.normal') }}</el-radio-button>
        <el-radio-button label="2">{{ $t('member.state.forbid') }}</el-radio-button>
      </el-radio-group>
      <el-button v-permission="$store.jurisdiction.MemberExport" :loading="formLoading" class="filter-item" style="margin-left: 10px;float:right;" icon="el-icon-download" @click="handleExport">{{ $t('common.export') }}</el-button>
      <el-button v-permission="$store.jurisdiction.MemberCreate" class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('common.add') }}</el-button>
      <!--<el-button v-permisssion="jurisdiction.usersListExport" v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('usuel.export') }}</el-button>-->
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
      <el-table-column :label="$t('member.name')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.portrait')" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.portrait" style="width:45px;hieght:45px;">
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.nickname')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname === 1 ? scope.row.nickname : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.cellphone')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.cellphone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.gender')" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.gender_show }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.language')" align="center" width="120">
        <template slot-scope="scope">
          {{ scope.row.language.name }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.money')" align="center" width="200">
        <template slot-scope="scope">
          {{ scope.row.money|1000 }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.created_at')" sortable="custom" prop="time" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('member.updated_at')" sortable="custom" prop="time" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.table.state')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.state_show }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" align="center" width="120" fixed="right">
        <template slot-scope="scope">
          <el-tooltip v-permission="$store.jurisdiction.MemberEdit" :content="$t('common.redact')" class="item" effect="dark" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!--添加-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="adminRules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('member.name')" prop="name">
          <el-input v-model="temp.name" maxlength="16" clearable/>
        </el-form-item>
        <el-form-item :label="$t('member.cellphone')" prop="cellphone">
          <el-input v-model="temp.cellphone" maxlength="11" clearable/>
        </el-form-item>
        <el-form-item :label="$t('member.nickname')" prop="nickname">
          <el-input v-model="temp.nickname" maxlength="16" clearable/>
        </el-form-item>
        <el-form-item :label="$t('member.gender')" prop="gender">
          <el-radio-group v-model="temp.gender">
            <el-radio :label="0">{{ $t('member.gender.unknown') }}</el-radio>
            <el-radio :label="1">{{ $t('member.gender.man') }}</el-radio>
            <el-radio :label="2">{{ $t('member.gender.woman') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('common.table.state')" prop="state">
          <el-radio-group v-model="temp.state">
            <el-radio :label="1">{{ $t('member.state.normal') }}</el-radio>
            <el-radio :label="2">{{ $t('member.state.forbid') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('member.password')" prop="password">
          <el-input v-model="temp.password" show-password clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button :loading="formLoading" type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('common.confirm') }}</el-button>
      </div>
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
</style>
<script>
import { getList, create, edit, exports } from '@/api/member'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination'

export default {
  name: 'MemberList',
  components: { Pagination },
  directives: { waves },
  data() {
    var validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('hint.error.please_enter', { attribute: this.$t('member.cellphone') })))
      } else {
        if (!(/^1[345789]\d{9}$/.test(value))) {
          callback(new Error(this.$t('hint.error.wrong_format', { attribute: this.$t('member.cellphone') })))
        }
        callback()
      }
    }
    return {
      formLoading: false,
      actionurl: process.env.BASE_API + 'uploadPictures',
      uploadData: {},
      pickerOptions: {
        shortcuts: [{
          text: this.$t('usuel.latest_week'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('usuel.last_month'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('usuel.last_three_months'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      imageUrl: '',
      portrait: '',
      tableKey: 0,
      list: null,
      total: 0,
      textMap: {
        update: this.$t('common.amend'),
        create: this.$t('common.add')
      },
      listLoading: true,
      listQuery: {
        state: 0,
        page: 1,
        limit: 10,
        sort: '-id',
        timeInterval: ''
      },
      temp: {
        state: 1,
        password: '',
        gender: 0,
        name: '',
        cellphone: '',
        nickname: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      adminRules: {
        name: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('member.name') }), trigger: 'blur' }
        ],
        cellphone: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('member.cellphone') }), trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('member.password') }), trigger: 'blur' }
        ]
      },
      downloadLoading: false
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
    handleAvatarSuccess(res, file) { // 上传图片
      this.portrait = file.response
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) { // 上传图片
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
        state: 1,
        password: '',
        gender: 0,
        name: '',
        cellphone: '',
        nickname: ''
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
    createData() { // 添加用户
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
    updateData() { // 更新
      this.formLoading = true
      this.adminRules.password[0].required = false
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
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
        } else {
          this.formLoading = false
        }
      })
    },
    handleUpdate(row) { // 修改
      row.password = ''
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      if (row.portrait_name) {
        this.imageUrl = row.portrait_name
      } else {
        this.imageUrl = ''
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleExport() {
      this.formLoading = true
      exports(this.listQuery).then(response => {
        window.open(response.data)
      }).finally(res => {
        this.formLoading = false
      })
    }
  }
}
</script>
