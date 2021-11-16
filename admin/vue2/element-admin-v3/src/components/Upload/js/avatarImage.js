import { getToken } from '@/utils/auth'
export default{
  name: 'AvatarImage',
  props: {
    imgData: {
      type: Object,
      default: () => {
        return {
          type: 1,
          size: 1024 * 1024 * 2,
          specification: [80, 150]
        }
      }
    },
    format: {
      type: Array,
      default: () => [
        'image/jpeg',
        'image/gif',
        'image/png',
        'image/bmp'
      ]
    },
    height: {
      type: Number,
      default: 160
    },
    width: {
      type: Number,
      default: 160
    },
    file: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      url: process.env.BASE_API + 'uploadPictures',
      imgHeaders: {
        Authorization: getToken('token_type') + ' ' + getToken('access_token')
      }
    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    // 图片列表上传成功
    handleSuccessList(res, file) {
      this.$emit('getFile', file)
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
    // 图片上传失效
    handleError(err) {
      this.$message.error(JSON.parse(err.message).message)
    }
  }
}
