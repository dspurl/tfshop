import {detail, create} from '@/api/comment'
import { getToken } from '@/plugins/auth'
export default {
  layout: 'user',
  head () {
    return {
      title: '订单评价-订单详情-个人中心',
    }
  },
  data() {
    return {
      loading: true,
      buttonLoading: false,
      total: 0,
      indent:{
        list: []
      },
      url: process.env.API_URL + 'uploadPictures',
      imgHeaders: {
        'apply-secret': process.env.PROJECT_KEY,
        'Authorization': 'Bearer ' + getToken('token')
      },
      imgData: {
        type: 1,
        size: 1024 * 1024 * 2,
        specification: [80, 150]
      }
    }
  },
  created() {
    console.log('111')
    this.getDetail()
  },
  methods: {
    async getDetail(){

      if(!$nuxt.$route.query.id){

      }
      await Promise.all([
        detail($nuxt.$route.query.id)
      ]).then(([indentData]) => {
        indentData.forEach((item,index)=>{
          this.indent.list.push(
            {
              ...item,
              score: null,
              details: null,
              resources: [],
              anonymity: 0,
              id:item.id
            }
          )
        })
        this.loading = false
      }).catch((error) => {
        this.loading = false
      })
    },
    // 图片列表上传成功
    handleAvatarSuccessList(res, file, fileList, index) {
      this.indent.list[index].resources = fileList
      this.imgProgress = false
      this.imgProgressPercent = 0
    },
    handleRemove(file, fileList, index) {
      this.indent.list[index].resources = fileList
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
    goBack() {
      $nuxt.$router.go(-1)
    },
    // 提交
    addComment() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          let list = JSON.parse(JSON.stringify(this.indent.list))
          for (let i = 0; i <list.length; i++) {
            if(list[i].score === 0) {
              this.$message.error('您还有未选择的星级评分')
              this.buttonLoading = false
              return false
            }
            list[i].resources = list[i].resources.map(item => { return item.response })
          }
          create($nuxt.$route.query.id, list).then(response => {
            $nuxt.$router.go(-1)
          }).catch(() => {
            this.buttonLoading = false
          })
        } else {
          return false;
        }
      });
    }
  }
}
