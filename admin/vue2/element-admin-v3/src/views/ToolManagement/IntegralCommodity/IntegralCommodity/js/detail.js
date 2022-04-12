import { detail, create, edit } from '@/api/integralCommodity'
import { getList } from '@/api/good'
import Pagination from '@/components/Pagination'
export default {
  name: 'IntegralCommodityDetail',
  components: { Pagination },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formLoading: false,
      listLoading: false,
      dialogVisible: false,
      loading: false,
      tableKey: 0,
      list: [],
      total: 0,
      multipleSelection: [],
      id: 0,
      ruleForm: {
        goodList: [],
        type: 0,
        value: 0
      },
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      dialogStatus: 'create',
      imgProgressPercent: 0,
      rules: {
        good_id: [
          { required: true, message: '请输入商品ID', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择积分抵扣方式', trigger: 'change' }
        ],
        value: [
          { required: true, message: '请输入积分可抵扣值', trigger: 'blur' }
        ],
        is_hidden: [
          { required: true, message: '请选择是否隐藏', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.id = this.$route.query.id
      this.dialogStatus = 'update'
      this.getDetail()
    }
    this.getList()
  },
  methods: {
    getDetail() {
      this.loading = true
      detail(this.id).then(response => {
        this.ruleForm = response.data
        this.loading = false
      })
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    create() { // 添加
      this.formLoading = true
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          create(this.ruleForm).then(() => {
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.creatingSuccessful'),
              type: 'success',
              duration: 2000
            })
            this.formLoading = false
            setTimeout(this.$router.back(-1), 2000)
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
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          edit(this.ruleForm).then(() => {
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.updateSuccessful'),
              type: 'success',
              duration: 2000
            })
            this.formLoading = false
            setTimeout(this.$router.back(-1), 2000)
          }).catch(() => {
            this.formLoading = false
          })
        } else {
          this.formLoading = false
        }
      })
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleCheckAllChange() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    hasSelect() {
      this.ruleForm.goodList = this.multipleSelection
      this.dialogVisible = false
    }
  }
}
