import { getList, destroy, create, edit } from '@/api/coupon'
import Pagination from '@/components/Pagination'
export default {
  name: 'CouponList',
  components: { Pagination },
  data() {
    const validateAmount = (rule, value, callback) => {
      console.log('this.temp.type', this.temp)
      if (this.temp.type !== 2) {
        if (value === '') {
          callback(new Error('请输入数量'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      formLoading: false,
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      temp: {
        name: '',
        type: '',
        cost: '',
        amount: '',
        sill: '',
        limit_get: '',
        time: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' }
        ],
        cost: [
          { required: true, message: '请输入优惠券价值', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        amount: [
          { validator: validateAmount, trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请填写排序', trigger: 'blur' }
        ]
      },
      textMap: {
        update: '修改',
        create: '添加'
      },
      type: [
        {
          name: '满减优惠券',
          value: 1
        },
        {
          name: '随机优惠券',
          value: 2
        },
        {
          name: '折扣优惠券',
          value: 3
        }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        sort: '-id',
        name: '',
        type: ''
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
      const title = '是否确认删除该优惠券?'
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        name: '',
        cost: '',
        type: '',
        amount: '',
        residue: '',
        sill: '',
        time: '',
        limit_get: ''
      }
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
    handleEnd(row) { // 提前结束
      this.temp = row
      this.temp.action = 1
      const title = '是否提前结束?'
      const win = '结束成功'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        this.formLoading = true
        edit(this.temp).then(() => {
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
      })
    },
    handleStart(row) { // 提前开始
      this.temp = row
      this.temp.action = 2
      const title = '是否提前开始?'
      const win = '设置成功'
      this.$confirm(title, this.$t('hint.hint'), {
        confirmButtonText: this.$t('usuel.confirm'),
        cancelButtonText: this.$t('usuel.cancel'),
        type: 'warning'
      }).then(() => {
        this.formLoading = true
        edit(this.temp).then(() => {
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
      })
    }
  }
}
