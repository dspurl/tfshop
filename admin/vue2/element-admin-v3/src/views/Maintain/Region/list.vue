<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item :label="$t('region.nation')">
          <el-select v-model="listQuery.parent_id">
            <el-option :value="0" :label="$t('region.all_nation')"/>
            <el-option
              v-for="item in nation"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">{{ $t('common.search') }}</el-button>
        </el-form-item>
      </el-form>
      <br>
      <el-button v-permission="$store.jurisdiction.RegionCreate" class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleCreate(null)">{{ $t('common.add') }}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :key="tableKey"
      :data="list"
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      lazy
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange">
      <el-table-column :label="$t('region.name')">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}(ID:{{ scope.row.id }})</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('region.value')">
        <template slot-scope="scope">
          <span>{{ scope.row.value ? scope.row.value : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('region.parent_name')">
        <template slot-scope="scope">
          <span>{{ scope.row.parent }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" class-name="small-padding fixed-width" width="180" fixed="right">
        <template slot-scope="scope">
          <el-tooltip v-permission="$store.jurisdiction.RegionCreate" :content="$t('common.add_subclass')" class="item" effect="dark" placement="top-start">
            <el-button type="success" icon="el-icon-folder-add" circle @click="handleCreate(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.RegionEdit" :content="$t('common.redact')" class="item" effect="dark" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.RegionDestroy" :content="$t('common.delete')" class="item" effect="dark" placement="top-start">
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('region.parent_name')" prop="parent_id">
          <el-cascader
            v-loading="parentLoading"
            v-model="temp.parent_id"
            :disabled="parentDisabled"
            :options="regionList"
            :filterable="true"
            :props="{ checkStrictly: true, value: 'id', label: 'name' }"/>
        </el-form-item>
        <el-form-item :label="$t('region.name')" prop="name">
          <el-input v-model="temp.name" maxlength="200" clearable/>
        </el-form-item>
        <el-form-item :label="$t('region.value')" prop="value">
          <el-input v-model="temp.value" maxlength="100" clearable/>
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

</style>

<script>
import { getList, create, edit, destroy } from '@/api/region'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'
export default {
  name: 'RegionList',
  components: { Pagination },
  data() {
    return {
      formLoading: false,
      actionurl: process.env.BASE_API + 'uploadPictures',
      imgHeaders: {
        Authorization: 'Bearer ' + getToken('access_token')
      },
      dialogVisible: false,
      ruleForm: [],
      checkAll: false,
      tableKey: 0,
      list: [],
      total: 0,
      textMap: {
        update: this.$t('common.amend'),
        create: this.$t('common.add')
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
        parent_id: 0
      },
      regionList: [],
      nation: [],
      parentDisabled: false,
      parentLoading: false,
      temp: {
        value: '',
        parent_id: 0,
        name: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('region.name') }), trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getNationList()
    this.getRegionList()
  },
  methods: {
    initData() {
      this.list = []
      this.listQuery.parent_id = 0
      this.getNationList()
      this.getRegionList()
    },
    getRegionList() {
      this.parentLoading = true
      getList({
        parent_id: 0,
        all: true
      }).then(response => {
        this.regionList = response.data
        this.parentLoading = false
      })
    },
    getNationList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.nation = response.data
        this.listQuery.parent_id = this.nation.length ? this.nation[0].id : 0
        this.getList()
      })
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleFilter() {
      this.initData()
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
      this.parentDisabled = false
      this.temp = {
        value: '',
        parent_id: 0,
        name: ''
      }
    },
    handleCreate(row) {
      this.resetTemp()
      this.temp.parent_id = this.listQuery.parent_id
      if (row) {
        this.parentDisabled = true
        this.temp.parent_id = row.id
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) { // 编辑
      this.resetTemp()
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
      const title = this.$t('hint.confirm.delete')
      const win = this.$t('hint.succeed.win', { attribute: this.$t('common.delete') })
      this.$confirm(title, this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.formLoading = true
        destroy(row.id).then(() => {
          this.initData()
          this.dialogFormVisible = false
          this.formLoading = false
          this.$notify({
            title: this.$t('common.succeed'),
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
          if (typeof this.temp.parent_id === 'object') {
            this.temp.parent_id = this.temp.parent_id[this.temp.parent_id.length - 1]
          }
          create(this.temp).then(() => {
            this.initData()
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
          if (typeof this.temp.parent_id === 'object') {
            this.temp.parent_id = this.temp.parent_id[this.temp.parent_id.length - 1]
          }
          edit(this.temp).then(() => {
            this.initData()
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
    load(tree, treeNode, resolve) {
      getList({
        parent_id: tree.id
      }).then(response => {
        resolve(response.data)
      })
    }
  }
}
</script>
