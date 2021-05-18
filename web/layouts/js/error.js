export default {
  head () {
    return {
      title:'您访问的页面出错了-'  + process.env.APP_NAME,
    }
  },
  methods: {
    go(path){
      if (path === -1) {
        $nuxt.$router.go(-1)
      } else {
        $nuxt.$router.push('/');
      }

    }
  }
}
