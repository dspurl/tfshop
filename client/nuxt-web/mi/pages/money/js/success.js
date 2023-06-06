export default {
  layout: 'cart',
  middleware: 'auth',
  head () {
    return {
      title: this.$t('money.success') + '-' + process.env.APP_NAME,
    }
  },
  data() {
    return {

    }
  },
  mounted() {
    $nuxt.$store.commit('setCartTitle', this.$t('money.success'));
  },
  methods: {
    go(path){
      $nuxt.$router.push(path);
    }
  }
}
