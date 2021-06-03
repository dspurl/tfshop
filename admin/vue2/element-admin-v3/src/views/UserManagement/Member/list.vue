<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('user.queryUserTitle')" v-model="listQuery.title" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
      <span class="filter-item">
        <el-date-picker
          v-model="listQuery.timeInterval"
          :picker-options="pickerOptions"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"/>
      </span>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('usuel.search') }}</el-button>
      <el-radio-group v-model="listQuery.state" class="filter-item" @change="handleFilter">
        <el-radio-button label="0">全部</el-radio-button>
        <el-radio-button label="1">正常</el-radio-button>
        <el-radio-button label="2">禁止访问</el-radio-button>
      </el-radio-group>
      <el-button v-permission="$store.jurisdiction.MemberCreate" class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('usuel.add') }}</el-button>
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
      <el-table-column :label="$t('usuel.id')" sortable="custom" align="center" width="65" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.name')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name ? scope.row.name : '未设置' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.portrait')">
        <template slot-scope="scope">
          <img :src="scope.row.portrait" style="width:45px;hieght:45px;">
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname === 1 ? scope.row.nickname : '未设置' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.mobile')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cellphone?scope.row.cellphone:$t('usuel.unknown') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          {{ scope.row.gender_show }}
        </template>
      </el-table-column>
      <el-table-column label="余额" align="center">
        <template slot-scope="scope">
          {{ scope.row.money }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.time')" sortable="custom" prop="time">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" sortable="custom" prop="time">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.state')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.state_show }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tooltip v-permission="$store.jurisdiction.MemberEdit" class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!--添加-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="adminRules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('user.name')" prop="name">
          <el-input v-model="temp.name" maxlength="16" clearable/>
        </el-form-item>
        <el-form-item :label="$t('user.mobile')" prop="cellphone">
          <el-input v-model="temp.cellphone" maxlength="11" clearable/>
        </el-form-item>
        <el-form-item :label="$t('user.nickname')" prop="nickname">
          <el-input v-model="temp.nickname" maxlength="16" clearable/>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="temp.gender">
            <el-radio :label="0">未知</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="temp.state">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">禁止访问</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('user.password')" prop="password">
          <el-input v-model="temp.password" :placeholder="canNull" show-password clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('usuel.cancel') }}</el-button>
        <el-button :loading="formLoading" type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('usuel.confirm') }}</el-button>
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
import { getList, create, edit } from '@/api/member'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'MemberList',
  components: { Pagination },
  directives: { waves },
  data() {
    var validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('hint.enterMobile')))
      } else {
        if (!(/^1[345789]\d{9}$/.test(value))) {
          callback(new Error(this.$t('hint.mobileFormatWrong')))
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
          text: this.$t('usuel.latestWeek'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('usuel.lastMonth'),
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('usuel.lastThreeMonths'),
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
      canNull: '',
      list: null,
      total: 0,
      textMap: {
        update: this.$t('usuel.amend'),
        create: this.$t('usuel.add')
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
          { required: true, message: this.$t('hint.enterUsername'), trigger: 'blur' },
          { min: 4, max: 16, message: this.$t('hint.length4_16'), trigger: 'blur' }
        ],
        cellphone: [
          { required: true, message: this.$t('hint.enterMobile'), trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('hint.enterCode'), trigger: 'blur' }
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
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error(this.$t('hint.uploadAvaterJPGPNG'))
      }
      if (!isLt2M) {
        this.$message.error(this.$t('hint.uploadAvater2MB'))
      }
      return (isJPG || isPNG || isGIF) && isLt2M
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
        state: 1,
        password: '',
        gender: 0,
        name: '',
        cellphone: '',
        nickname: ''
      }
    },
    handleCreate() {
      this.canNull = ''
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
    },
    handleUpdate(row) { // 修改
      row.password = ''
      this.canNull = this.$t('hint.canNull')
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [this.$t('user.id'), this.$t('user.mobile'), this.$t('user.name'), this.$t('user.nickname'), this.$t('user.portrait'), this.$t('user.openid'), this.$t('user.sessionKey'), this.$t('user.time'), this.$t('user.wxData')]
        const filterVal = ['id', 'name', 'cellphone', 'nickname', 'portrait_name', 'openid', 'session_key', 'time', 'data']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.$t('route.usersList')
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'time') { // 时间格式化
          return parseTime(v[j])
        } else if (j === 'data') {
          return this.$t('user.nickname') + '：' + v[j]['nickName'] + ' ' + this.$t('user.gender') + '：' + (v[j]['gender'] === 1 ? this.$t('user.man') : this.$t('user.woman')) + ' ' + this.$t('user.avatarUrl') + '：' + v[j]['avatarUrl'] + ' ' + this.$t('user.language') + '：' + v[j]['language'] + ' ' + this.$t('user.country') + '：' + v[j]['country'] + ' ' + this.$t('user.province') + '：' + v[j]['province'] + ' ' + this.$t('user.city') + '：' + v[j]['city']
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
