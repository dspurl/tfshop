export default {
  head () {
    return {
      title:'网站正在维护中-'  + process.env.APP_NAME,
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
