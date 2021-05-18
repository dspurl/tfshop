import {cancel} from '@/api/user'
export default {
  layout: 'user',
  head () {
    return {
      title: '注销账户-个人中心',
    }
  },
  data() {
    return {
      loading: false,
      checked: false,
      disabled: true
    }
  },
  mounted() {

  },
  methods: {
    //注销提交
    cancel(){
      cancel(this.ruleForm).then(response => {
        this.loading = false;
        $nuxt.$store.commit('logout');
        this.$message({
          message: '注销成功',
          type: 'success'
        });
        this.$router.replace('/')
      }).catch(() => {
        this.loading = false
      })
    },
    agree(){
      if(this.checked){
        this.disabled = false
      }else{
        this.disabled = true
      }
    }
  }
}
