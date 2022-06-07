import { detail, create, edit } from '@/api/groupPurchase'
import SaveDialog from '../components/Good'
import { getToken } from '@/utils/auth'
import AvatarImage from '@/components/Upload/AvatarImage'
import tinymce from '@/components/tinymce5'
export default {
  name: 'GroupPurchaseDetail',
  components: { SaveDialog, AvatarImage, tinymce },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: 0,
      dialog: {
        save: false
      },
      actionurl: process.env.BASE_API + 'uploadPictures',
      imgHeaders: {
        Authorization: 'Bearer ' + getToken('access_token')
      },
      imgMasterData: {
        type: 1,
        size: 1024 * 1024 * 2,
        specification: [80, 150, 200, 250, 300, 350]
      },
      multipleSelection: [],
      imgData: {
        type: 1,
        size: 1024 * 1024 * 2
      },
      formLoading: false,
      loading: false,
      id: 0,
      tableKey: 0,
      ruleForm: {
        times: [],
        good_id: 0,
        img: '',
        name: '',
        imgList: [],
        group_purchase_sku: [],
        abstract: '',
        details: '',
        number: 2,
        number_max: 4,
        aging: 24,
        is_show: 1,
        is_purchase_number: 0,
        purchase_number: '',
        sort: 5,
        is_recommend: 0
      },
      dialogStatus: 'create',
      imgProgress: false,
      imgProgressPercent: 0,
      rules: {
        img: [
          { required: true, message: '请上传主图', trigger: 'change' }
        ],
        times: [
          { required: true, message: '请选择活动时间', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        abstract: [
          { required: true, message: '请输入简介', trigger: 'blur' }
        ],
        details: [
          { required: true, message: '请输入详情', trigger: 'blur' }
        ],
        is_show: [
          { required: true, message: '请选择是否上架', trigger: 'change' }
        ],
        purchase_number: [
          { required: true, message: '请输入购买数量', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入拼团人数', trigger: 'blur' }
        ],
        aging: [
          { required: true, message: '请输入拼团时效', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择拼团状态', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        is_recommend: [
          { required: true, message: '请选择是否推荐', trigger: 'change' }
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
    // 添加
    add() {
      this.dialog.save = true
      this.$nextTick(() => {
        this.$refs.saveDialog.open()
      })
    },
    getList() {
      this.loading = true
      detail(this.id).then(response => {
        this.ruleForm = response.data
        this.ruleForm.imgList = []
        response.data.resources_many.forEach(item => {
          if (item.depict === 'group_purchase_zimg') {
            this.ruleForm.img = item.img
            this.ruleForm.img_id = item.id
          } else {
            item.url = item.img
            item.response = item.img
            this.ruleForm.imgList.push(item)
          }
        })
        const groupPurchaseSku = JSON.parse(JSON.stringify(response.data.group_purchase_sku))
        this.ruleForm.group_purchase_sku = this.ruleForm.good_sku
        this.ruleForm.group_purchase_sku.forEach(item => {
          const group_purchase_sku = groupPurchaseSku.find(res => res.good_sku_id === item.id)
          if (group_purchase_sku) {
            item.group_purchase_price = group_purchase_sku.group_purchase_price
            item.good_sku_id = group_purchase_sku.good_sku_id
            item.limit = group_purchase_sku.limit
            item.residue_limit = group_purchase_sku.residue_limit
            item.img = group_purchase_sku.resources ? group_purchase_sku.resources.img : ''
            item.img_id = group_purchase_sku.resources ? group_purchase_sku.resources.id : ''
            item.group_purchase_sku_id = group_purchase_sku.id
          } else {
            item.group_purchase_price = item.price
            item.good_sku_id = item.id
            item.limit = 0
            item.group_purchase_sku_id = 0
            item.img = item.resources ? item.resources.img : ''
            item.img_id = item.resources ? item.resources.id : ''
          }
        })
        this.$nextTick(() => {
          this.ruleForm.group_purchase_sku.forEach(item => {
            const group_purchase_sku = groupPurchaseSku.find(res => res.good_sku_id === item.id)
            if (group_purchase_sku) {
              this.$refs.multipleTable.toggleRowSelection(item)
            }
          })
        })
        this.ruleForm.times = [this.ruleForm.time, this.ruleForm.end_time]
        delete this.ruleForm.resources_many
        delete this.ruleForm.good_sku
        this.ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
        this.active = 1
        this.loading = false
      })
    },
    // 下一步
    nextStep() {
      if (!this.ruleForm.img) {
        this.$message.error('请选择商品')
        this.formLoading = false
        return false
      }
      this.active = 1
    },
    create() { // 添加
      this.formLoading = true
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择产品参数')
        this.formLoading = false
        return false
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].limit <= 0) {
          this.$message.error('限量不能少于0')
          this.formLoading = false
          return false
        } else if (this.multipleSelection[i].limit > this.multipleSelection[i].inventory) {
          this.$message.error('限量不能超过库存')
          this.formLoading = false
          return false
        }
      }
      const ruleForm = this.ruleForm
      ruleForm.group_purchase_sku = this.multipleSelection
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          create(ruleForm).then(() => {
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
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择产品参数')
        this.formLoading = false
        return false
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].limit <= 0) {
          this.$message.error('限量不能少于0')
          this.formLoading = false
          return false
        } else if (this.multipleSelection[i].limit > this.multipleSelection[i].inventory) {
          this.$message.error('限量不能超过库存')
          this.formLoading = false
          return false
        }
      }
      const ruleForm = this.ruleForm
      ruleForm.group_purchase_sku = this.multipleSelection
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          edit(ruleForm).then(() => {
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
    // 选择商品
    handleSuccess(res) {
      this.ruleForm.good_id = res.id
      this.ruleForm.img = res.img
      this.ruleForm.name = res.name
      this.ruleForm.imgList = res.imgList
      this.ruleForm.group_purchase_sku = res.good_sku
      this.ruleForm.details = res.details
      this.ruleForm.group_purchase_sku.forEach(res => {
        res.group_purchase_price = res.price
        res.good_sku_id = res.id
        res.limit = 0
        res.group_purchase_sku_id = 0
      })
      this.ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.ruleForm.img = file.response
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
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      this.imgProgress = true
      return isLt2M
    },
    // 图片列表图片格式大小验证
    beforeAvatarUploadList(file) {
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
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 图片列表上传成功
    handleAvatarSuccessList(res, file, fileList) {
      this.ruleForm.imgList = fileList
      this.imgProgress = false
      this.imgProgressPercent = 0
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      this.ruleForm.imgList = fileList
    },
    getFile(res, index) {
      this.ruleForm.group_purchase_sku[index].img = res.response
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
