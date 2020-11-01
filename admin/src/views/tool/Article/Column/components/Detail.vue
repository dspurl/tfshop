<!--suppress ALL -->
<template>
  <div v-loading="loading" class="createPost-container" style="padding-top: 40px">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm" style="padding-left: 200px;padding-right:200px;">
      <el-form-item label="栏目名称" prop="name">
        <el-input v-model="ruleForm.name" maxlength="60" clearable style="width:400px"/>
      </el-form-item>
      <el-form-item label="类目" prop="pid">
        <el-select v-model="ruleForm.pid" clearable placeholder="请选择">
          <el-option
            v-for="item in pidList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="关键字" prop="keyword">
        <el-input v-model="ruleForm.keyword" maxlength="255" clearable style="width:600px"/>
      </el-form-item>
      <el-form-item label="描述" prop="describes">
        <el-input v-model="ruleForm.describes" maxlength="255" clearable style="width:600px"/>
      </el-form-item>
      <el-form-item label="缩略图" prop="img">
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
            <img v-if="ruleForm.resources.img" :src="ruleForm.resources.img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </span>
        </el-upload>
        <div class="el-upload__tip">推荐尺寸：312px * 208px</div>
      </el-form-item>
      <el-form-item prop="content" style="margin-bottom: 30px;">
        <tinymce
          ref="editor"
          v-model="ruleForm.column_property.details"
          :disabled="disabled"
          :url="actionurl"
          :header="imgHeaders"/>
      </el-form-item>
      <el-form-item label="是否显示" prop="show">
        <el-radio-group v-model="ruleForm.show">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="2">隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否列表" prop="list">
        <el-radio-group v-model="ruleForm.list">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
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
    width: 312px;
    height: 208px;
    line-height: 208px;
    text-align: center;
  }
  .progress-img{
    padding: 30px;
  }
  .avatar {
    width: 312px;
    height: 208px;
    display: block;
  }
</style>
<script>
import { getShow, createSubmit, updateSubmit } from '@/api/column'
import { getToken } from '@/utils/auth'
import tinymce from '@/components/tinymce5'
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
      disabled: false,
      actionurl: process.env.BASE_API + 'uploadPictures',
      imgHeaders: {
        Authorization: 'Bearer ' + getToken('access_token')
      },
      pidList: {},
      dialogVisible: false,
      loading: false,
      id: '',
      ruleForm: {
        name: '',
        pid: '',
        keyword: '',
        describes: '',
        show: 1,
        resources: {
          img: ''
        },
        column_property: {
          details: ''
        },
        list: 0,
        sort: 5
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
      getShow(this.id ? this.id : 0).then(response => {
        this.pidList = response.data.pidList
        if (response.data.column) {
          this.ruleForm = response.data.column
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
</script>
