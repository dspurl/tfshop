import { detail, create, edit } from '@/api/integralConfiguration'
export default {
  name: 'IntegralConfigurationDetail',
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
      ruleForm: {
        name: '',
        system: '',
        value: '',
        explain: '',
        is_hidden: 0
      },
      dialogStatus: 'create',
      imgProgressPercent: 0,
      rules: {
        name: [
          { required: true, message: '请输入配置名称', trigger: 'blur' }
        ],
        system: [
          { required: true, message: '请输入系统变量：用于系统内部调用，一般以sys_开头', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入配置值', trigger: 'blur' }
        ],
        explain: [
          { required: true, message: '请输入配置说明', trigger: 'blur' }
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
      this.getList()
    }
  },
  methods: {
    getList() {
      this.loading = true
      detail(this.id).then(response => {
        this.ruleForm = response.data
        this.loading = false
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
