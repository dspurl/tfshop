import { getList, destroy, create, edit } from '@/api/integralCommodity'
import Pagination from '@/components/Pagination'
import { getList as getGoodList } from '@/api/good'
export default {
  name: 'IntegralCommodityList',
  components: { Pagination },
  data() {
    return {
      dialogVisible: false,
      multipleSelection: [],
      dialogMultipleSelection: [],
      tableKey: 0,
      list: [],
      total: 0,
      dialogTableKey: 0,
      dialogList: null,
      dialogTotal: 0,
      formLoading: false,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      dialogListQuery: {
        page: 1,
        limit: 10,
        sort: '+id',
        notInId: []
      },
      formInline: {
        type: 1,
        value: 100,
        is_hidden: 1
      }
    }
  },
  activated() {
    this.getList()
    window.scrollTo(0, 1)
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
        this.dialogListQuery.notInId = response.data.all
        this.listLoading = false
        this.getDialogList()
      })
    },
    getDialogList() {
      getGoodList(this.dialogListQuery).then(response => {
        this.dialogList = response.data.data
        this.dialogTotal = response.data.total
      })
    },
    handleFilter() {
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
    handleCheckAllChange() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange(val) { // 设置全选/全不选数据
      this.multipleSelection = val
    },
    handleDelete(row) { // 删除
      const title = '是否确认删除该商品?'
      const win = '删除成功'
      this.$confirm(title, this.$t('hint.hint'), {
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
      if (!this.multipleSelection) {
        this.$message.error('请选择要删除的内容')
        return false
      }
      const title = '是否确认批量删除内容?'
      const win = '删除成功'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        this.formLoading = true
        destroy(0, this.multipleSelection).then(() => {
          this.listQuery.page = 1
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
    dialogSortChange(data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.dialogListQuery.sort = '+' + prop
      } else {
        this.dialogListQuery.sort = '-' + prop
      }
      this.handleFilter()
    },
    handleDialogSelectionChange(val) {
      this.dialogMultipleSelection = val
    },
    handleDialogCheckAllChange() {
      this.$refs.dialogTable.toggleAllSelection()
    },
    handleDialogFilter() {
      this.dialogListQuery.page = 1
      this.getDialogList()
    },
    hasSelect() {
      this.formLoading = true
      create(this.dialogMultipleSelection.map(item => { return item.id })).then(() => {
        this.$notify({
          title: this.$t('hint.succeed'),
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
        this.handleFilter()
        this.dialogVisible = false
      }).finally(() => {
        this.formLoading = false
      })
    },
    hasEdit(row) {
      edit(row.id, row).then(() => {
      })
    },
    hasAllEdit() {
      if (this.multipleSelection.length === 0) {
        return false
      }
      const multipleSelection = []
      this.formLoading = true
      this.multipleSelection.forEach(element => {
        multipleSelection.push({
          id: element.id,
          type: this.formInline.type,
          value: this.formInline.value,
          is_hidden: this.formInline.is_hidden
        })
      })
      edit(0, multipleSelection).then(() => {
        this.handleFilter()
      }).finally(() => {
        this.formLoading = false
      })
    }
  }
}
