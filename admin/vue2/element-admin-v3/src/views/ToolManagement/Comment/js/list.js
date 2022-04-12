import { getList, destroy, create, edit } from '@/api/comment'
import Pagination from '@/components/Pagination'
export default {
  name: 'CommentList',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      type: [
        {
          name: '商品',
          value: 'GoodIndentCommodity'
        }
      ],
      ruleForm: {
        reply: ''
      },
      rules: {
        reply: [
          { required: true, message: '请输入回复内容', trigger: 'blur' }
        ]
      },
      temp: {},
      dialogVisible: false,
      formLoading: false,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id',
        model_id: '',
        model_type: ''
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
    handleReply(row) { // 回复窗口
      this.ruleForm.reply = ''
      this.ruleForm.parent_id = row.id
      this.ruleForm.model_type = row.model_type
      this.ruleForm.model_id = row.model_id
      this.dialogVisible = true
    },
    setReply() { // 回复
      this.formLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          create(this.ruleForm).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.formLoading = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: '回复成功',
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
    // 审核
    setAudit(row, result) {
      this.temp = row
      this.formLoading = true
      edit(result, this.temp).then(() => {
        this.getList()
        this.dialogFormVisible = false
        this.formLoading = false
        this.$notify({
          title: this.$t('hint.succeed'),
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.formLoading = false
      })
    }
  }
}
