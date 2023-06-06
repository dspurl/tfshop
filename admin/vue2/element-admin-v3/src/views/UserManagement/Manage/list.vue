<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-permission="$store.jurisdiction.ManageCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('common.add') }}</el-button>
      <el-button class="filter-item" type="success" icon="el-icon-refresh-right" @click="refresh">{{ $t('manage.refresh_permission') }}</el-button>
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
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item :label="$t('manage.power')">
              <span>{{ props.row.power.join(',') }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.table.id')" sortable="custom" align="center" width="65" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('manage.roles')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roles }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('manage.introduction')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('manage.name')">
        <template slot-scope="scope">
          <span>{{ scope.row.groupname ? scope.row.groupname.join(',') : $t('manage.name.not_configured') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-tooltip v-permission="$store.jurisdiction.ManageEdit" :content="$t('common.redact')" class="item" effect="dark" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.ManageDestroy" :content="$t('common.delete')" class="item" effect="dark" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--添加-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="adminRules" :model="temp" label-position="left" label-width="160px">
        <el-form-item :label="$t('manage.roles')" prop="roles">
          <el-input v-model="temp.roles" maxlength="11" clearable style="width:200px"/>
        </el-form-item>
        <el-form-item :label="$t('manage.introduction')" prop="introduction">
          <el-input v-model="temp.introduction" clearable/>
        </el-form-item>
        <el-form-item :label="$t('manage.name')" prop="group">
          <el-select :placeholder="$t('common.select')" v-model="temp.group" multiple>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
          <div>{{ $t('manage.tip') }}</div>
        </el-form-item>
        <el-form-item :label="$t('manage.power')" prop="rules">
          <tree-transfer
            :title="title"
            :from_data="fromData"
            :to_data="toData"
            :default-props="{label:'label'}"
            :mode="mode"
            :placeholder="$t('hint.keyword_filtering')"
            height="300px"
            filter
            open-all
            @addBtn="add"
            @removeBtn="remove"/>
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
    width: 100%;
  }
</style>
<script>
import { getList, create, edit, destroy } from '@/api/manage'
import waves from '@/directive/waves' // Waves directive
import treeTransfer from 'el-tree-transfer'

export default {
  name: 'ManageList',
  components: { treeTransfer },
  directives: { waves },
  data() {
    var validateRoles = (rule, value, callback) => {
      var reg = /^[A-Za-z]+$/
      if (!reg.test(value)) {
        callback(new Error(this.$t('hint.pleaseEnterLetter')))
      } else {
        callback()
      }
    }
    return {
      formLoading: false,
      options: [],
      oldOptions: [],
      tableKey: 0,
      list: null,
      total: 0,
      textMap: {
        update: this.$t('common.amend'),
        create: this.$t('common.add')
      },
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        timeInterval: ''
      },
      fromData: [],
      oldFromData: [],
      toData: [],
      temp: {
        roles: '',
        introduction: '',
        group: [],
        groupname: [],
        oldGroupValue: [],
        oldGroup: [],
        rules: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      adminRules: {
        roles: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('manage.roles') }), trigger: 'blur' },
          { validator: validateRoles, trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('manage.introduction') }), trigger: 'blur' }
        ],
        rules: [
          { type: 'array', required: true, message: this.$t('hint.error.select', { attribute: this.$t('manage.power') }), trigger: 'change' }

        ]
      },
      downloadLoading: false,
      title: [this.$t('tree_transfer.undistributed'), this.$t('tree_transfer.allocated')],
      mode: 'transfer'
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
        this.options = response.data.options
        this.oldOptions = response.data.options
        this.fromData = response.data.fromData
        this.oldFromData = response.data.fromData
        this.toData = response.data.toData
        this.listLoading = false
      })
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
        roles: '',
        introduction: '',
        group: [],
        groupname: [],
        oldGroupValue: [],
        oldGroup: [],
        rules: []
      }
    },
    // 添加控件
    handleCreate() {
      this.resetTemp()
      this.fromData = this.oldFromData
      this.toData = []
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
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.group = this.temp.group ? this.temp.group : []
      this.toData = []
      if (this.temp.toData) {
        this.toData = this.temp.toData
      }
      this.fromData = []
      if (this.temp.fromData) {
        this.fromData = this.temp.fromData
      }
      /*
      if (this.temp.oldGroup) {
        this.options = this.oldOptions.concat(this.temp.oldGroup)
      }*/
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) { // 删除
      this.$confirm(this.$t('manage.delete_prompt'), this.$t('common.hint'), {
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
    // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
    changeMode() {
      if (this.mode === 'transfer') {
        this.mode = 'addressList'
      } else {
        this.mode = 'transfer'
      }
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      this.temp.rules = toData
      // console.log('fromData:', fromData)
      // console.log('toData:', toData)
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      this.temp.rules = toData
    },
    refresh() {
      location.reload()
    }
  }
}
</script>
