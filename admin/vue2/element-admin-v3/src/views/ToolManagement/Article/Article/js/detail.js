import { detail, create, edit } from '@/api/article'
import { getToken } from '@/utils/auth'
import tinymce from '@/components/tinymce5'
export default {
  name: 'ArticleDetail',
  components: { tinymce },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      actionurl: process.env.BASE_API + 'uploadPictures',
      imgHeaders: {
        Authorization: 'Bearer ' + getToken('access_token')
      },
      formLoading: false,
      loading: false,
      id: 0,
      disabled: false,
      template: [
        {
          label: '默认风格',
          value: 'defaultArticle'
        }
      ],
      column: [],
      ruleForm: {
        name: '',
        pid: '',
        keyword: '',
        describes: '',
        is_show: 1,
        resources: {
          img: ''
        },
        article_property: {
          details: ''
        },
        column_id: '',
        sort: 5,
        template: 'defaultArticle'
      },
      dialogStatus: 'create',
      imgProgressPercent: 0,
      imgProgress: false,
      imgData: {
        type: 1,
        size: 1024 * 1024 * 2
      },
      rules: {
        name: [
          { required: true, message: '请输入文章名称', trigger: 'blur' }
        ],
        column_id: [
          { required: true, message: '请选择所属栏目', trigger: 'change' }
        ],
        shows: [
          { required: true, message: '请选择是否显示', trigger: 'change' }
        ],
        list: [
          { required: true, message: '请选择是否列表', trigger: 'change' }
        ],
        template: [
          { required: true, message: '请选择模板', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.id = this.$route.query.id
    }
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      detail(this.id ? this.id : 0).then(response => {
        this.column = response.data.column
        if (response.data.article) {
          this.ruleForm = response.data.article
          if (!response.data.article.resources) {
            response.data.article.resources = {
              img: ''
            }
          }
          this.dialogStatus = 'update'
        }
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
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.ruleForm.resources.img = file.response
      this.imgProgress = false
      this.imgProgressPercent = 0
    },
    // 上传时
    handleProgress(file, fileList) {
      this.imgProgressPercent = file.percent
    },
    // 图片格式大小验证
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (
        ['image/jpeg',
          'image/gif',
          'image/png',
          'image/bmp'
        ].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的图片格式')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      this.imgProgress = true
      return isLt2M
    }
  }
}
