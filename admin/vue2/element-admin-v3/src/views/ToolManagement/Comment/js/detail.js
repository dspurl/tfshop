import { detail, create, edit } from '@/api/comment'
export default {
  name: 'CommentDetail',
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
        model_id: '',
        model_type: '',
        user_id: '',
        parent_id: '',
        title: '',
        details: '',
        state: '',
        anonymity: '',
        score: ''
      },
      dialogStatus: 'create',
      imgProgressPercent: 0,
      rules: {
        model_id: [
          { required: true, message: '请输入评论关联模型ID', trigger: 'blur' }
        ],
        user_id: [
          { required: true, message: '请输入用户ID', trigger: 'blur' }
        ],
        parent_id: [
          { required: true, message: '请输入父节点ID', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        anonymity: [
          { required: true, message: '请选择是否匿名', trigger: 'change' }
        ],
        score: [
          { required: true, message: '请选择评分', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.id = this.$route.query.id
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
