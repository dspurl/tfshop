import { detail, create, edit } from '@/api/goodParameterGroup'
import { getList } from '@/api/goodParameter'
export default {
  name: 'GoodParameterGroupDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formLoading: false,
      loading: false,
      id: 0,
      list: [],
      ruleForm: {
        value: '',
        is_hide: 0,
        leaf: []
      },
      dialogStatus: 'create',
      imgProgressPercent: 0,
      rules: {
        value: [
          { required: true, message: '请输入参数名', trigger: 'blur' }
        ],
        is_hide: [
          { required: true, message: '请选择是否隐藏', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.id = this.$route.query.id
      this.dialogStatus = 'update'
      this.getList()
    }
    this.getGoodParameterList()
  },
  methods: {
    getList() {
      this.loading = true
      detail(this.id).then(response => {
        this.ruleForm = {
          id: response.data.id,
          value: response.data.value,
          is_hide: response.data.is_hide,
          leaf: response.data.good_parameter.map(item => { return item.id })
        }
        this.loading = false
      })
    },
    // 获取产品参数列表
    getGoodParameterList() {
      getList({ is_hide: 0 }).then(response => {
        this.list = response.data.data
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
    }
  }
}
