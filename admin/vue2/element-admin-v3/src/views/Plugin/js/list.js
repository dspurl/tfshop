import { getList, install, destroy, uninstall, publish, updatePack, diff, conflictResolution } from '@/api/plugin'
import Pagination from '@/components/Pagination'
import JsonViewer from 'vue-json-viewer'
export default {
  name: 'PlugInList',
  components: { Pagination, JsonViewer },
  data() {
    return {
      dialogData: [],
      diffTitle: '',
      diffName: '',
      diffAbbreviation: '',
      handleDiffLoading: false,
      diffLoading: false,
      diffSearch: '',
      copyable: {
        copyText: '复制',
        copiedText: '复制中'
      },
      formLoading: false,
      dialogVisible: false,
      dialogDiff: false,
      ruleForm: [],
      checkAll: false,
      tableKey: 0,
      list: [],
      total: 0,
      textMap: {
        update: '修改',
        create: '添加'
      },
      category: ['插件'],
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
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    refreshList() {
      this.listQuery.page = 1
      this.getList()
    },
    // 冲突文件列表
    getDiff(name, abbreviation) {
      this.diffLoading = true
      this.dialogDiff = true
      this.diffTitle = name + '的冲突列表'
      this.diffName = abbreviation
      this.diffAbbreviation = abbreviation
      diff(abbreviation).then(response => {
        this.dialogData = response.data
        this.diffLoading = false
      })
    },
    // 冲突处理
    handleDiff(index, type) {
      this.handleDiffLoading = true
      conflictResolution(this.diffAbbreviation, { index: index, type: type }).then(response => {
        this.getDiff(this.diffName, this.diffAbbreviation)
        this.$notify({
          title: this.$t('hint.succeed'),
          message: '处理成功',
          type: 'success',
          duration: 2000
        })
      }).finally(() => {
        this.handleDiffLoading = false
      })
    },
    handleSelect(key, keyPath) {
      this.listQuery.activeIndex = key
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdatePack(item, suffix = 0) {
      this.butLoading = true
      this.formLoading = true
      updatePack(item.code, {
        suffix: suffix,
        img: item.img,
        author: item.author,
        author_url: item.author_url,
        portrait: item.portrait,
        category: item.category
      }).then(() => {
        this.butLoading = false
        this.formLoading = false
        this.getList()
        this.$notify({
          title: this.$t('hint.succeed'),
          message: '下载成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.butLoading = false
        this.formLoading = false
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
      const title = '存在冲突的插件卸载后相关文件也会被删除哦，是否确认卸载?'
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
            message: '已成功卸载',
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
