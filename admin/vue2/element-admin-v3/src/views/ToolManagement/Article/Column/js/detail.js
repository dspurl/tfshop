import { detail, create, edit } from '@/api/column'
import tinymce from '@/components/tinymce5'
import { getToken } from '@/utils/auth'
export default {
  name: 'ColumnDetail',
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
      disabled: false,
      template: [
        {
          label: '默认列表风格',
          value: 'defaultColumn'
        },
        {
          label: '默认详情风格',
          value: 'defaultColumnDetail'
        }
      ],
      formLoading: false,
      loading: false,
      id: 0,
      pidList: [],
      ruleForm: {
        name: '',
        pid: '',
        keyword: '',
        describes: '',
        is_show: 1,
        resources: {
          img: ''
        },
        column_property: {
          details: ''
        },
        is_list: 0,
        sort: 5,
        template: 'defaultColumn'
      },
      imgProgress: false,
      imgData: {
        type: 1,
        size: 1024 * 1024 * 2
      },
      dialogStatus: 'create',
      imgProgressPercent: 0,
      rules: {
        name: [
          { required: true, message: '请输入栏目名称', trigger: 'blur' }
        ],
        pid: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        show: [
          { required: true, message: '请选择是否显示', trigger: 'change' }
        ],
        template: [
          { required: true, message: '请选择模板', trigger: 'change' }
        ],
        list: [
          { required: true, message: '请选择是否列表', trigger: 'change' }
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
        this.pidList = response.data.pidList
        if (response.data.column) {
          this.ruleForm = response.data.column
          if (this.ruleForm.pid === 0) {
            this.ruleForm.pid = [0]
          }
          if (!response.data.column.resources) {
            response.data.column.resources = {
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
          this.ruleForm.pid = typeof this.ruleForm.pid === 'number' ? this.ruleForm.pid : this.ruleForm.pid.pop()
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
          this.ruleForm.pid = typeof this.ruleForm.pid === 'number' ? this.ruleForm.pid : this.ruleForm.pid.pop()
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
