export default {
  layout: 'cart',
  middleware: 'auth',
  head () {
    return {
      title: '支付成功' + '-' + process.env.APP_NAME,
    }
  },
  data() {
    return {

    }
  },
  mounted() {
    $nuxt.$store.commit('setCartTitle', '支付成功');
  },
  methods: {
    go(path){
      $nuxt.$router.push(path);
    }
  }
}
