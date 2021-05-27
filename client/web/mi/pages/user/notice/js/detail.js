import {detail} from '@/api/notification'
export default {
  layout: 'user',
  head () {
    return {
      title: '消息通知-个人中心',
    }
  },
  data() {
    return {
      loading: true,
      notice:{}
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    async getDetail(){
      if(!$nuxt.$route.query.id){
        this.$message({
          message: '参数有误，请联系管理员',
          type: 'error'
        });
        $nuxt.$router.go(-1);
        return false
      }
      await Promise.all([
        detail($nuxt.$route.query.id)
      ]).then(([notificationData]) => {
        this.notice = notificationData;
        this.loading = false
      }).catch((error) => {
        this.loading = false
      })
    },
    goBack() {
      $nuxt.$router.go(-1)
    },
    goNavigator(url){
      // 为了兼容老版本
      uni.navigateTo({
        url: url.replace('pages','user')
      })
    },
  }
}
