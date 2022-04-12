import { getList, destroy, create, edit } from '@/api/distribution'
import Pagination from '@/components/Pagination'
export default {
  name: 'DistributionList',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      formLoading: false,
      listLoading: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加'
      },
      temp: {},
      rules: {
        name: [
          { required: true, message: '请输入分销名称', trigger: 'blur' }
        ],
        identification: [
          { required: true, message: '请选择分销标识', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请选择分销级别', trigger: 'change' }
        ]
      },
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) { // 编辑
      row.distribution_rule.forEach((item, index) => {
        row.distribution_rule[index].type = item.type === '按比例'
      })
      this.temp = null
      this.temp = row
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        name: '',
        identification: '',
        level: 1,
        state: 0,
        distribution_rule: [
          {
            name: '1级分销',
            level: 1,
            type: false,
            price: ''
          }
        ]
      }
    },
    updateInput(e, index, name) { // 修改规则信息
      this.temp.distribution_rule[index][name] = e
      this.temp = JSON.parse(JSON.stringify(this.temp))
    },
    setLevel(e) { // 切换级别
      this.temp.distribution_rule = []
      for (let i = 0; i < e; i++) {
        this.temp.distribution_rule.push(
          {
            name: (i + 1) + '级分销',
            level: (i + 1),
            type: false,
            price: ''
          }
        )
      }
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
    create() { // 添加
      this.formLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          create(this.temp).then(() => {
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.creatingSuccessful'),
              type: 'success',
              duration: 2000
            })
            this.getList()
            this.dialogFormVisible = false
            this.formLoading = false
          }).catch(() => {
            this.formLoading = false
          })
        } else {
          this.formLoading = false
        }
      })
    },
    edit() { // 修改
      this.formLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          edit(this.temp).then(() => {
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.updateSuccessful'),
              type: 'success',
              duration: 2000
            })
            this.getList()
            this.dialogFormVisible = false
            this.formLoading = false
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
