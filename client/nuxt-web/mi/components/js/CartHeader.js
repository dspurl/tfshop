export default {
  data() {
    return {
      user:{},
      userActive: false,
    }
  },
  mounted() {
    this.userInfo()
  },
  methods: {
    userInfo(){
      if(this.$store.state.hasLogin){
        this.user = this.store.get(process.env.CACHE_PR + 'UserInfo')
      }
    },
    userMenu(){
      this.userActive = true
    },
    userMenuOut(){
      this.userActive = false
    },
    logout(){
      this.$store.commit('logout')
      this.$router.go(0)
    },
  }
}
