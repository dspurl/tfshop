import { getToken } from '@/plugins/auth'
export default{
  name: 'InsertImage',
  props: {
    imgData: {
      type: Object,
      default:function(){
        return {
          type: 1,
          size: 1024 * 1024 * 2,
          specification: [80, 150]
        }
      }
    },
    format: {
      type: Array,
      default: function () {
        return [
          'image/jpeg',
          'image/gif',
          'image/png',
          'image/bmp'
        ]
      }
    },
    limit: {
      type: Number,
      default: 5
    },
    fileList: {
      type: Array,
      default: function () {
        return []
      }
    },
  },
  data() {
    return {
      url: process.env.API_URL + 'uploadPictures',
      imgHeaders: {
        'apply-secret': process.env.PROJECT_KEY,
        'Authorization': 'Bearer ' + getToken('token')
      }
    }
  },
  watch: {

  },
  mounted() {

  },
  methods:{
    // 图片列表上传成功
    handleSuccessList(res, file, fileList) {
      this.$emit('getFile', fileList)
    },
    handleRemove(file, fileList) {
      this.$emit('getFile', fileList)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    // 图片列表图片格式大小验证
    beforeUploadList(file) {
      const isLt = file.size < this.imgData.size
      if (
        this.format.indexOf(file.type) === -1) {
        this.$message.error('请上传正确的文件格式')
        return false
      }
      if (!isLt) {
        this.$message.error('上传文件大小不能超过 ' + file.size / 1024 / 1024 + 'MB!')
      }
      return isLt
    },
  },
}
