<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="`${$t('common.table.id')}/${$t('power.title')}/${$t('power.api')}`" v-model="listQuery.title" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
      <el-cascader
        v-model="listQuery.pid"
        :options="optionsLang"
        :props="{ value: 'id', label: 'title', checkStrictly: true }"
        filterable
        clearable
        style="top:-4px"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('common.search') }}</el-button>
      <el-button class="filter-item" type="success" icon="el-icon-refresh-right" @click="refresh">{{ $t('manage.refresh_permission') }}</el-button>
      <el-button v-permission="$store.jurisdiction.PowerCreate" class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleCreate()">{{ $t('common.add') }}</el-button>
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
      <el-table-column :label="$t('common.table.id')" align="center" width="65" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('power.icon')" align="center" width="120">
        <template slot-scope="scope">
          <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('power.title')" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('power.url')" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('power.api')" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.api }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.language')" width="200">
        <template slot-scope="scope">
          <lang-translate v-model="scope.row" @translate="handleTranslate"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('power.state')" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.state_show }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-tooltip v-permission="$store.jurisdiction.PowerCreate" :content="$t('common.copy')" class="item" effect="dark" placement="top-start">
            <el-button type="success" icon="el-icon-document-copy" circle @click="handleCreate(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.PowerEdit" :content="$t('common.redact')" class="item" effect="dark" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.PowerDestroy" :content="$t('common.delete')" class="item" effect="dark" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!--添加-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="adminRules" :model="temp" label-position="left" label-width="160px" style="margin-left:20px;">
        <el-form-item :label="$t('power.title')" prop="title">
          <el-input v-model="temp.title" maxlength="30" clearable/>
        </el-form-item>
        <el-form-item :label="$t('power.api')" prop="api">
          <el-input v-model="temp.api" clearable/>
          <div>{{ $t('power.api.tip') }}</div>
        </el-form-item>
        <el-form-item :label="$t('power.url')" prop="url">
          <el-input v-model="temp.url" clearable/>
          <div>{{ $t('power.url.tip') }}</div>
        </el-form-item>
        <el-form-item :label="$t('power.pid')" prop="pid">
          <el-cascader
            v-model="temp.pid"
            :options="optionsLang"
            :props="{ value: 'id', label: 'title', checkStrictly: true }"
            filterable
            clearable
            style="top:-4px"/>
          <div>{{ $t('power.pid.tip') }}</div>
        </el-form-item>
        <el-form-item :label="$t('common.sort')" prop="sort" style="width:200px;">
          <el-input v-model="temp.sort" clearable/>
        </el-form-item>
        <el-form-item :label="$t('power.icon')" prop="icon" style="width:300px;">
          <el-input v-model="temp.icon" clearable/>
          <div v-if="temp.icon">
            <svg-icon :icon-class="temp.icon" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('power.state')" prop="state">
          <el-radio-group v-model="temp.state">
            <el-radio :label="0">{{ $t('common.no') }}</el-radio>
            <el-radio :label="1">{{ $t('common.yes') }}</el-radio>
          </el-radio-group>
          <div>{{ $t('power.state.tip') }}</div>
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
</style>

<script>
import { getList, create, edit, destroy } from '@/api/power'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import LangTranslate from '@/components/LangTranslate'

export default {
  name: 'PowerList',
  components: { Pagination, LangTranslate },
  directives: { waves },
  data() {
    var validateApi = (rule, value, callback) => {
      if (value === '') {
        if (this.temp.pid === '') {
          callback(new Error(this.$t('power.pid.error')))
        } else if (this.temp.pid > 0) {
          callback(new Error(this.$t('hint.error.not_null', { attribute: this.$t('power.api') })))
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
        update: this.$t('common.amend'),
        create: this.$t('common.add')
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
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('power.pid') }), trigger: 'blur' }
        ],
        title: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('power.title') }), trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  computed: {
    optionsLang() {
      const lang = this.temp.lang ? this.temp.lang : this.$store.state.app.language
      const options = this.options.filter((element) => { return element.lang === lang })
      options.unshift({
        id: 0,
        title: this.$t('category.top', lang)
      })
      return options
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.data.data
        this.options = response.data.options
        this.total = response.data.data.total
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
    handleCreate(row = null, item) {
      if (!row) {
        this.resetTemp()
      } else {
        this.temp = Object.assign({}, row)
      }
      if (item) {
        this.temp = {
          ...item,
          ...this.temp
        }
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
      if (this.temp.pid === 0) {
        this.temp.pid = [0]
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
    },
    handleTranslate(value, item) {
      if (value) {
        this.handleUpdate(value)
      } else {
        this.handleCreate(item)
      }
    }
  }
}
</script>
