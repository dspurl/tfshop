import {login} from '@/api/login'
import {getList as bannerList} from '@/api/banner'
import {
  mapMutations
} from 'vuex';
export default {
  layout: 'login',
  head () {
    return {
      title: this.$t('header.top.login') + '-' + process.env.APP_NAME
    }
  },
  async asyncData (ctx) {
    try {
      let banner = {}
      await bannerList({
        limit: 1,
        type: 2,
        state: 0,
        sort: '+sort'
      }).then(response => {
        if (response.total === 1) {
          banner = response.data[0]
          banner.url = banner.url ? banner.url.replace('?id=','/') : ''
        }
      })
      return {
        banner: banner
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  data() {
    const validateCellphone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('hint.error.import', {attribute: this.$t('find_password.cellphone')})));
      } else {
        const myreg = /^1[3456789]\d{9}$/;
        if (!myreg.test(value)) {
          callback(new Error(this.$t('hint.error.wrong_format', {attribute: this.$t('find_password.cellphone')})));
        }
        callback();
      }
    };
    return {
      method: 1,
      ruleForm: {
        cellphone: '',
        password: '',
        remember: false
      },
      loading: false,
      rules: {
        cellphone: [
          { validator: validateCellphone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('hint.error.import', {attribute: this.$t('find_password.password')}), trigger: 'blur' },
          { min: 5, message: this.$t('find_password.password.length'), trigger: 'blur' }
        ]
      },
      banner: {}
    }
  },
  beforeDestroy() {
    clearInterval(this.codeTimer)
  },
  methods: {
    ...mapMutations(['login']),
    setMethod(index){
      this.method = index
    },
    toLogin(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.loading = true;
          login(this.ruleForm).then(response => {
            response.remember = this.ruleForm.remember
            this.login(response);
            this.$message({
              message: this.$t('find_password.login_successfully'),
              type: 'success'
            });
            this.loading = false;
            const route = this.store.get('route');
            if(route){
              this.store.remove('route');
              this.$router.replace({ path: route.path, query: route.query })
            }else{
              $nuxt.$router.replace('/user/portal')
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
