<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('user.queryPowerTitle')" v-model="listQuery.title" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
      <el-cascader
        v-model="listQuery.pid"
        :options="options"
        :props="{ checkStrictly: true }"
        filterable
        clearable
        style="top:-4px"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('usuel.search') }}</el-button>
      <el-button class="filter-item" type="success" icon="el-icon-refresh-right" @click="refresh">刷新权限</el-button>
      <el-button v-permission="$store.jurisdiction.PowerCreate" class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleCreate()">{{ $t('usuel.add') }}</el-button>
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
      <el-table-column :label="$t('usuel.id')" align="center" width="65" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单图标" align="center">
        <template slot-scope="scope">
          <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.title')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="外链" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.api')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.api }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示在菜单栏" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.state_show }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" class-name="small-padding fixed-width" width="300">
        <template slot-scope="scope">
          <el-tooltip v-permission="$store.jurisdiction.PowerCreate" class="item" effect="dark" content="复制" placement="top-start">
            <el-button type="success" icon="el-icon-document-copy" circle @click="handleCreate(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.PowerEdit" class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.PowerDestroy" class="item" effect="dark" content="删除" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!--添加-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="adminRules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('user.title')" prop="title">
          <el-input v-model="temp.title" maxlength="30" clearable/>
        </el-form-item>
        <el-form-item :label="$t('user.api')" prop="api">
          <el-input v-model="temp.api" clearable/>
        </el-form-item>
        <el-form-item label="外链" prop="url">
          <el-input v-model="temp.url" clearable/>
          <el-alert
            title="如果是类目（不可点），需要指向外链地址为内链地址，如listTemplateList"
            type="warning"/>
        </el-form-item>
        <el-form-item :label="$t('user.grouping')" prop="pid">
          <el-cascader
            v-model="temp.pid"
            :options="options"
            :props="{ checkStrictly: true }"
            filterable
            clearable
            style="top:-4px"/>
          <el-alert
            title="层级大于两层的不会在菜单栏中显示"
            type="warning"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort" style="width:200px;">
          <el-input v-model="temp.sort" clearable/>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" style="width:300px;">
          <el-input v-model="temp.icon" clearable/>
          <div v-if="temp.icon">
            <svg-icon :icon-class="temp.icon" />
          </div>
        </el-form-item>
        <el-form-item label="显示在菜单栏" prop="state">
          <el-radio-group v-model="temp.state">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
          <el-alert
            title="如有子类，选择隐藏，将不会显示子类"
            type="warning"/>
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
</style>

<script>
import { getList, create, edit, destroy } from '@/api/power'
import waves from '@/directive/waves' // Waves directiveimport { jurisdiction } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'PowerList',
  components: { Pagination },
  directives: { waves },
  data() {
    var validateApi = (rule, value, callback) => {
      if (value === '') {
        if (this.temp.pid === '') {
          callback(new Error(this.$t('user.apiAndGroupAtLeastOneItemToFillIn')))
        } else if (this.temp.pid > 0) {
          callback(new Error(this.$t('user.apiCannotBeEmpty')))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      formLoading: false,
      tableKey: 0,
      options: [],
      list: null,
      total: 0,
      textMap: {
        update: this.$t('usuel.amend'),
        create: this.$t('usuel.add')
      },
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id',
        pid: []
      },
      temp: {
        title: '',
        api: '',
        state: 0,
        pid: [],
        sort: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      adminRules: {
        api: [
          { validator: validateApi, trigger: 'blur' }
        ],
        pid: [
          { required: true, message: this.$t('user.thePermissionNameCannotBeEmpty'), trigger: 'blur' }
        ],
        title: [
          { required: true, message: this.$t('user.thePermissionNameCannotBeEmpty'), trigger: 'blur' }
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
        this.options = response.data.options
        this.total = response.data.total
        this.listLoading = false
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
        sort: 0
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
    createData() { // 添加
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
            this.updateUserinfo()
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
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) { // 删除
      this.$confirm(this.$t('hint.deleteDetermine'), this.$t('hint.hint'), {
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
            message: this.$t('hint.deletedSuccessful'),
            type: 'success',
            duration: 2000
          })
          this.updateUserinfo()
        }).catch(() => {
          this.formLoading = false
        })
      }).catch(() => {
      })
    },
    updateUserinfo() {
      // this.$store.dispatch('ChangeRoles') // 此方法会导致VUE提示死循环
      // location.reload()
    },
    refresh() {
      location.reload()
    }
  }
}
</script>
