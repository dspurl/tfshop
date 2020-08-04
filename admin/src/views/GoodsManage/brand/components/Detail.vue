<!--suppress ALL -->
<template>
  <div v-loading="loading" class="createPost-container" style="padding-top: 40px">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm" style="padding-left: 200px;padding-right:20px;width: 900px;">
      <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title" maxlength="16" clearable/>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="ruleForm.price" maxlength="13" clearable style="width:200px;">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择类型" clearable style="width:160px;">
          <el-option :value="0" label="默认"/>
          <el-option :value="1" label="商品"/>
          <el-option :value="2" label="文章"/>
        </el-select>
      </el-form-item>
      <el-form-item label="图片" prop="img">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-progress="handleProgress"
          :action="actionurl"
          :headers="imgHeaders"
          :data="imgData"
          class="avatar-uploader">
          <span v-if="imgProgress">
            <el-progress :percentage="imgProgressPercent" type="circle" class="progress-img"/>
          </span>
          <span v-else>
            <img v-if="ruleForm.img" :src="ruleForm.img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </span>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否显示" prop="state">
        <el-radio-group v-model="ruleForm.state">
          <el-radio :label="0">显示</el-radio>
          <el-radio :label="1">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-radio-group v-model="ruleForm.sort">
          <el-input v-model="ruleForm.sort" maxlength="11" clearable style="width:80px;"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialogStatus==='create'?createSubmit():updateSubmit()">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 188px;
    height: 188px;
    line-height: 188px;
    text-align: center;
  }
  .progress-img{
    padding: 30px;
  }
  .avatar {
    width: 188px;
    height: 188px;
    display: block;
  }
</style>
<script>
import { getShow, createSubmit, updateSubmit } from '@/api/listTemplates'
import { getToken } from '@/utils/auth'
export default {
  name: 'ListTemplatesDetail',
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
        Authorization: getToken('token_type') + ' ' + getToken('access_token')
      },
      dialogVisible: false,
      loading: false,
      id: '',
      ruleForm: {
        state: 0,
        sort: '5',
        img: ''
      },
      imgProgress: false,
      imgData: {
        type: 1,
        size: 1024 * 1024 * 2
      },
      dialogStatus: 'create',
      imgProgressPercent: 0,
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请填写价格', trigger: 'change' }
        ],
        img: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请填写排序', trigger: 'blur' }
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
      if (this.id > 0) {
        getShow(this.id).then(response => {
          this.ruleForm = response.data
          this.dialogStatus = 'update'
          this.loading = false
        })
      } else {
        this.loading = false
      }
    },
    createSubmit() { // 添加
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          createSubmit(this.ruleForm).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.creatingSuccessful'),
              type: 'success',
              duration: 2000
            })
            setTimeout(this.$router.back(-1), 2000)
          })
        }
      })
    },
    updateSubmit() { // 更新
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          updateSubmit(this.ruleForm.id, this.ruleForm).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: this.$t('hint.succeed'),
              message: this.$t('hint.updateSuccessful'),
              type: 'success',
              duration: 2000
            })
            setTimeout(this.$router.back(-1), 2000)
          })
        }
      })
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
    }
  }
}
</script>
