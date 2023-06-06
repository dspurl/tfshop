export default {
  head () {
    return {
      title:this.$t('error.maintain') + '-'  + process.env.APP_NAME,
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
