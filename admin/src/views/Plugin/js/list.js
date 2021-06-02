import { getList, install, destroy, uninstall, publish } from '@/api/plugin'
export default {
  name: 'PlugInList',
  data() {
    return {
      formLoading: false,
      dialogVisible: false,
      ruleForm: [],
      checkAll: false,
      tableKey: 0,
      list: null,
      total: 0,
      textMap: {
        update: '修改',
        create: '添加'
      },
      imgProgressPercent: 0,
      loading: false,
      butLoading: false,
      listLoading: false,
      imgProgress: false,
      dialogStatus: '',
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id',
        activeIndex: '1'
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
        this.list = response.data
        this.listLoading = false
      })
    },
    handleInstall(name, type) {
      this.butLoading = true
      this.formLoading = true
      install(name).then(() => {
        this.butLoading = false
        this.formLoading = false
        this.getList()
        this.$notify({
          title: this.$t('hint.succeed'),
          message: type === 1 ? '更新成功' : '安装成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.butLoading = false
        this.formLoading = false
      })
    },
    handleDelete(name) {
      const title = '是否确认删除该插件?'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        this.butLoading = true
        this.formLoading = true
        destroy(name).then(() => {
          this.butLoading = false
          this.formLoading = false
          this.getList()
          this.$notify({
            title: this.$t('hint.succeed'),
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.butLoading = false
          this.formLoading = false
        })
      })
    },
    handleUninstall(name) {
      const title = '是否确认删除该插件?'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        this.butLoading = true
        this.formLoading = true
        uninstall(name).then(() => {
          this.butLoading = false
          this.formLoading = false
          this.getList()
          this.$notify({
            title: this.$t('hint.succeed'),
            message: '已成功移除',
            type: 'success',
            duration: 2000
          })
        }).catch(() => {
          this.butLoading = false
          this.formLoading = false
        })
      })
    },
    handlePublish(name) {
      this.butLoading = true
      this.formLoading = true
      publish(name).then(() => {
        this.butLoading = false
        this.formLoading = false
        this.getList()
        this.$notify({
          title: this.$t('hint.succeed'),
          message: '发行成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.butLoading = false
        this.formLoading = false
      })
    },
    // 下载
    handleDownload(name) {
      window.open(process.env.BASE_API + 'plugin/download/' + name)
    }
  }
}
