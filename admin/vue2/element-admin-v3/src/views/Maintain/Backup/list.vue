<template>
  <div class="app-container">
    <div class="filter-container" style="display: flex;justify-content: right;">
      <el-button v-permission="$store.jurisdiction.BackupCreate" :loading="formLoading" class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">备份</el-button>
    </div>
    <el-tabs v-model="listQuery.type" @tab-click="getList">
      <el-tab-pane label="数据库备份" name="db">
        <div class="tip">
          <p>数据库备份可通过配置中进行定期备份</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="系统备份" name="file">
        <div class="tip">
          <p>文件备份可通过配置中进行定期备份</p>
          <p>系统备份耗时较大，所以采用队列形式处理，备份成功提示后并不会时时同步备份数据，建议过个几分钟后再进行查看</p>
          <p>系统备份无法在线还原，请自行手动进行还原，备份位于:项目根目录/storage/app/dsshop目录下，不以”db-“命名</p>
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
      <el-table-column label="文件名" prop="name" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" sortable="custom" prop="size" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.size }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备份时间" sortable="custom" prop="time" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" width="120" fixed="right">
        <template slot-scope="scope">
          <el-tooltip v-permission="$store.jurisdiction.BackupEdit" v-if="listQuery.type === 'db'" class="item" effect="dark" content="还原" placement="top-start">
            <el-button :loading="formLoading" type="primary" icon="el-icon-refresh-left" circle @click="handleUpdate(scope.row)"/>
          </el-tooltip>
          <el-tooltip v-permission="$store.jurisdiction.BackupDestroy" class="item" effect="dark" content="删除" placement="top-start">
            <el-button :loading="formLoading" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="pagination-operation" style="margin-top: 20px;">
      <div class="operation">
        <el-button size="mini" @click="handleCheckAllChange">全选/反选</el-button>
        <el-button :loading="formLoading" size="mini" type="danger" @click="handleAllDelete()">删除</el-button>
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
        update: '修改',
        create: '添加'
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
          title: this.$t('hint.succeed'),
          message: '备份成功',
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
          title: this.$t('hint.succeed'),
          message: '数据库还原成功',
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
      const title = '是否确认删除该内容?'
      const win = '删除成功'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        this.formLoading = true
        destroy(1, row).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.formLoading = false
          this.$notify({
            title: this.$t('hint.succeed'),
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
      const title = '是否确认批量删除内容?'
      const win = '删除成功'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        this.formLoading = true
        destroy(0, this.multipleSelection).then(() => {
          this.getList()
          this.dialogFormVisible = false
          this.formLoading = false
          this.$notify({
            title: this.$t('hint.succeed'),
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
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.temp.img = file.response
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
        this.$message.error('请上传正确的图片格式')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 500KB!')
      }
      this.imgProgress = true
      return isLt2M
    }
  }
}
</script>
