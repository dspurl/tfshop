import { detail, create, edit, good } from '@/api/integralDraw'
import Pagination from '@/components/Pagination'
import AvatarImage from '@/components/Upload/AvatarImage'
import { getList as integralList } from '@/api/integralConfiguration'
export default {
  name: 'IntegralDrawDetail',
  components: { Pagination, AvatarImage },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      formLoading: false,
      loading: false,
      listLoading: false,
      id: 0,
      ruleForm: {
        name: '',
        type: 1,
        explain: '',
        integral_prize: [],
        time: '',
        integral: '',
        tries: 0
      },
      dialogStatus: 'create',
      imgProgressPercent: 0,
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择抽奖类型', trigger: 'change' }
        ],
        integral: [
          { required: true, message: '请设置所需积分', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择有效时间', trigger: 'change' }
        ]
      },
      textMap: {
        update: '修改',
        create: '添加'
      },
      model_type: '',
      dialogFormVisible: false,
      modelType: [{
        label: '自定义',
        value: ''
      }, {
        label: '商品',
        value: 'App\\Models\\v1\\GoodSku'
      }, {
        label: '积分',
        value: 'App\\Models\\v1\\IntegralConfiguration'
      }],
      goodList: [],
      goodLoading: false,
      total: 0,
      step: 1,
      listQuery: {
        title: '',
        limit: 10,
        page: 1,
        sort: '-id'
      },
      index: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.id = this.$route.query.id
      this.dialogStatus = 'update'
      this.getList()
    }
  },
  methods: {
    getList() {
      this.loading = true
      detail(this.id).then(response => {
        this.ruleForm = response.data
        this.$set(this.ruleForm, 'time', [this.ruleForm.start_time, this.ruleForm.end_time])
        this.ruleForm.integral_prize.forEach(item => {
          item.model_type = item.model_type ? item.model_type : ''
          if (item.resource) {
            item.img = item.resource.img
          }
        })
        this.loading = false
      })
    },
    getGood() {
      this.goodLoading = true
      good(this.listQuery).then(response => {
        this.goodList = response.data.data
        this.total = response.data.total
        this.goodLoading = false
      })
    },
    getIntegralList() {
      this.goodLoading = true
      integralList(this.listQuery).then(response => {
        this.goodList = response.data.data
        this.total = response.data.total
        this.goodLoading = false
      })
    },
    addIntegralPrize() {
      this.ruleForm.integral_prize.push({
        model_id: 0,
        model_type: '',
        name: '',
        value: '',
        recycle: '',
        quantity: '',
        probability: '',
        sort: 5,
        is_hidden: 0,
        img: ''
      })
    },
    // 选择奖品类型
    handleModelType(e, index) {
      if (e) {
        this.listQuery.page = 1
        this.goodList = []
        this.total = 0
        switch (e) {
          case 'App\\Models\\v1\\GoodSku':
            this.getGood()
            break
          case 'App\\Models\\v1\\IntegralConfiguration':
            this.getIntegralList()
            break
        }
        this.model_type = e
        this.index = index
        this.dialogFormVisible = true
      }
    },
    // 删除奖品
    handleDelete(index) {
      this.ruleForm.integral_prize.splice(index, 1)
    },
    // 下一步
    goStep(index) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (index === 3) {
            if (this.ruleForm.integral_prize.length === 0) {
              this.$message.error('请设置奖品')
              return false
            }
            this.ruleForm.integral_prize.map(item => {
              const { name, value, quantity, probability, sort } = item
              if (name === '') {
                this.$message.error('未设置奖品名称')
                throw new Error('未设置奖品名称')
              } else if (value === '') {
                this.$message.error('未设置奖品价值')
                throw new Error('未设置奖品价值')
              } else if (quantity === '') {
                this.$message.error('未设置奖品数量')
                throw new Error('未设置奖品数量')
              } else if (probability === '') {
                this.$message.error('未设置中奖概率')
                throw new Error('未设置中奖概率')
              } else if (sort === '') {
                this.$message.error('未设置排序')
                throw new Error('未设置排序')
              }
            })
          }
          this.step = index
        } else {
          console.log('error submit!!')
        }
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1
      switch (this.model_type) {
        case 'App\\Models\\v1\\GoodSku':
          this.getGood()
          break
        case 'App\\Models\\v1\\IntegralConfiguration':
          this.getIntegralList()
          break
      }
    },
    // 选择奖品商品
    handleGood(row) {
      this.ruleForm.integral_prize[this.index].model_id = row.id
      this.ruleForm.integral_prize[this.index].img = row.resources ? row.resources.img : row.good.resources.img
      this.ruleForm.integral_prize[this.index].name = row.good.name
      this.ruleForm.integral_prize[this.index].value = row.price
      this.dialogFormVisible = false
    },
    // 选择积分配置
    handleIntegral(row) {
      this.ruleForm.integral_prize[this.index].model_id = row.id
      this.ruleForm.integral_prize[this.index].name = row.name
      this.ruleForm.integral_prize[this.index].value = row.value
      this.dialogFormVisible = false
    },
    getFile(res, index) {
      this.ruleForm.integral_prize[index].img = res.response
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
    }
  }
}
