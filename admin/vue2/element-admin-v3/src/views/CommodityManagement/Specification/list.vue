<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item :label="$t('specification.filter.form.input.label.title')">
          <el-input :placeholder="$t('specification.filter.form.input.placeholder.title')" v-model="listQuery.title" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">{{ $t('common.search') }}</el-button>
        </el-form-item>
      </el-form>
      <br>
      <el-button v-permission="$store.jurisdiction.SpecificationCreate" class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('common.add') }}</el-button>
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
      <el-table-column :label="$t('good.table.id')" sortable="custom" prop="id" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('specification.table.column.label.name')" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('specification.table.column.label.label')" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('specification.table.column.label.specification_group_id')" align="center" width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.specification_group_id ? scope.row.specification_group.name : $t('specification.table.column.label.ungrouped') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('specification.table.column.label.type_show')" align="center" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.type_show }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('specification.table.column.label.location_show')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.location_show }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('specification.table.column.label.value')" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('specification.table.column.label.is_search')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.is_search ? $t('common.yes') : $t('common.no') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.table.sort')" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.table.add_time')" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" class-name="small-padding fixed-width" width="120" fixed="right">
        <template slot-scope="scope">
          <el-tooltip v-permission="$store.jurisdiction.SpecificationEdit" :content="$t('common.redact')" class="item" effect="dark" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdate(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.SpecificationDestroy" :content="$t('common.delete')" class="item" effect="dark" placement="top-start">
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
    <el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="200px" style="margin-left:20px;">
        <el-form-item :label="$t('specification.dialog.form.input.label.name')" prop="name">
          <el-input v-model="temp.name" maxlength="30" clearable/>
        </el-form-item>
        <el-form-item :label="$t('specification.dialog.form.input.label.label')" prop="label">
          <el-input :placeholder="$t('specification.dialog.form.input.placeholder.label')" v-model="temp.label" maxlength="20" clearable/>
        </el-form-item>
        <el-form-item :label="$t('specification.dialog.form.select.label.type_show')" prop="type">
          <el-select :placeholder="$t('hint.error.select', { specification: $t('specification.dialog.form.select.label.type_show') })" v-model="temp.type" clearable style="width:160px;">
            <el-option :value="1" :label="$t('specification.dialog.form.select.option.label.text')"/>
            <el-option :value="2" :label="$t('specification.dialog.form.select.option.label.radio')"/>
            <el-option :value="3" :label="$t('specification.dialog.form.select.option.label.multi_select')"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('specification.dialog.form.select.label.is_search')" prop="is_search">
          <el-radio-group v-model="temp.is_search">
            <el-radio :label="0">{{ $t('common.no') }}</el-radio>
            <el-radio :label="1">{{ $t('common.yes') }}</el-radio>
          </el-radio-group>
          <div>{{ $t('specification.dialog.form.select.tip.is_search') }}</div>
        </el-form-item>
        <el-form-item :label="$t('specification.dialog.form.select.label.specification_group_id')" prop="specification_group_id">
          <el-select v-model="temp.specification_group_id" clearable style="width:160px;">
            <el-option
              v-for="(item,index) in SpecificationGroup"
              :key="index"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('specification.dialog.form.select.label.location')" prop="location">
          <el-select :placeholder="$t('specification.dialog.form.select.placeholder.location')" v-model="temp.location" clearable style="width:160px;">
            <el-option :label="$t('specification.dialog.form.select.option.label.parameter')" :value="0"/>
            <el-option :label="$t('specification.dialog.form.select.option.label.details')" :value="1"/>
            <el-option :label="$t('specification.dialog.form.select.option.label.all')" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('specification.dialog.form.input.label.value')" prop="value">
          <el-input v-model="temp.value" :autosize="{ minRows: 4}" type="textarea" show-word-limit clearable/>
          <div>{{ $t('specification.dialog.form.input.tip.value') }}</div>
        </el-form-item>
        <el-form-item :label="$t('common.sort')" prop="sort">
          <el-input v-model="temp.sort" clearable/>
        </el-form-item>
        <el-form-item prop="sort">
          <div>{{ $t('common.sort.tip') }}</div>
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
import { getList, create, edit, destroy } from '@/api/specification'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
  name: 'SpecificationList',
  components: { Pagination },
  data() {
    return {
      formLoading: false,
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
        page: 1,
        limit: 10,
        sort: '+id',
        activeIndex: '1'
      },
      temp: {},
      rules: {
        name: [
          { required: true, message: this.$t('hint.error.nonentity', { attribute: this.$t('specification.dialog.form.input.label.name') }), trigger: 'blur' }
        ],
        type: [
          { required: true, message: this.$t('hint.error.select', { attribute: this.$t('specification.dialog.form.select.label.type_show') }), trigger: 'change' }
        ],
        is_search: [
          { required: true, message: this.$t('hint.error.select', { attribute: this.$t('specification.dialog.form.select.label.is_search') }), trigger: 'change' }
        ],
        location: [
          { required: true, message: this.$t('hint.error.select', { attribute: this.$t('specification.dialog.form.select.label.location') }), trigger: 'change' }
        ],
        sort: [
          { required: true, message: this.$t('hint.error.please_enter', { attribute: this.$t('common.sort') }), trigger: 'blur' }
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
      const title = this.$t('hint.confirm.delete')
      const win = this.$t('hint.succeed.win', { attribute: this.$t('common.delete') })
      this.$confirm(title, this.$t('common.hint'), {
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
    }
  }
}
</script>
