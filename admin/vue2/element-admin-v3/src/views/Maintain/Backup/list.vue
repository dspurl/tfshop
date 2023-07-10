<template>
  <div class="app-container">
    <div class="filter-container" style="display: flex;justify-content: right;">
      <el-button v-permission="$store.jurisdiction.BackupCreate" :loading="formLoading" class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">{{ $t('backup.create') }}</el-button>
    </div>
    <el-tabs v-model="listQuery.type" @tab-click="getList">
      <el-tab-pane :label="$t('backup.db')" name="db">
        <div class="tip">
          <p>{{ $t('backup.db.tip') }}</p>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('backup.file')" name="file">
        <div class="tip">
          <p>{{ $t('backup.file.tip.one') }}</p>
          <p>{{ $t('backup.file.tip.two') }}</p>
          <p>{{ $t('backup.file.tip.three') }}</p>
        </div>
      </el-tab-pane>
    </el-tabs>
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
      <el-table-column :label="$t('backup.name')" prop="name" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('backup.size')" sortable="custom" prop="size" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.size }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('backup.time')" sortable="custom" prop="time" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" class-name="small-padding fixed-width" width="120" fixed="right">
        <template slot-scope="scope">
          <el-tooltip v-permission="$store.jurisdiction.BackupEdit" v-if="listQuery.type === 'db'" :content="$t('backup.update')" class="item" effect="dark" placement="top-start">
            <el-button :loading="formLoading" type="primary" icon="el-icon-refresh-left" circle @click="handleUpdate(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.BackupDestroy" :content="$t('common.delete')" class="item" effect="dark" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="pagination-operation" style="margin-top: 20px;">
      <div class="operation">
        <el-button size="mini" @click="handleCheckAllChange">{{ $t('common.check_all') }}/{{ $t('common.inverse') }}</el-button>
        <el-button :loading="formLoading" size="mini" type="danger" @click="handleAllDelete()">{{ $t('common.delete') }}</el-button>
      </div>
    </div>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
</style>

<script>
import { getList, create, edit, destroy } from '@/api/backup'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'

export default {
  name: 'BannerList',
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
      list: null,
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
        type: 'db'
      },
      temp: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data
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
        state: 0,
        sort: '5',
        img: ''
      }
    },
    handleCreate() {
      this.formLoading = true
      create(this.listQuery).then(() => {
        this.getList()
        this.dialogFormVisible = false
        this.formLoading = false
        this.$notify({
          title: this.$t('common.succeed'),
          message: this.$t('hint.succeed.win', { attribute: this.$t('backup.create') }),
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.formLoading = false
      })
    },
    handleUpdate(row) { // 编辑
      this.formLoading = true
      edit(row).then(() => {
        this.getList()
        this.dialogFormVisible = false
        this.formLoading = false
        this.$notify({
          title: this.$t('common.succeed'),
          message: this.$t('hint.succeed.win', { attribute: this.$t('backup.update') }),
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.formLoading = false
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
        destroy(1, row).then(() => {
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
    handleAllDelete() { // 批量删除
      const title = this.$t('backup.delete_prompt')
      const win = this.$t('hint.succeed.win', { attribute: this.$t('common.delete') })
      this.$confirm(title, this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.formLoading = true
        destroy(0, this.multipleSelection).then(() => {
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
    }
  }
}
</script>
