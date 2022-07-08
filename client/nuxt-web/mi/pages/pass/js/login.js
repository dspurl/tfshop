import {login} from '@/api/login'
import {code, verify, index} from '@/api/sweepLogin'
import {verifyPlugin} from '@/api/plugin'
import {getList as bannerList} from '@/api/banner'
import {
  mapMutations
} from 'vuex';
export default {
  layout: 'login',
  head () {
    return {
      title: '登录' + '-' + process.env.APP_NAME
    }
  },
  async asyncData (ctx) {
    try {
      let isSweepLogin = false
      let banner = {}
      await verifyPlugin('sweepLogin').then(response => {
        isSweepLogin = response.sweepLogin
      })
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
        isSweepLogin: isSweepLogin,
        banner: banner
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  data() {
    const validateCellphone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else {
        const myreg = /^1[3456789]\d{9}$/;
        if (!myreg.test(value)) {
          callback(new Error('手机号格式有误'));
        }
        callback();
      }
    };
    return {
      isSweepLogin: false,
      method: 1,
      codeLoading: false,
      codeImg: '',
      codeTimer: null,
      codeState: 0,
      codeTime: 0,
      codeUuid: 0,
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
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, message: '密码长度必须大于5位', trigger: 'blur' }
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
      if(index === 2){
        this.getCode()
      }
    },
    // 获取二维码
    getCode(){
      this.codeLoading = true
      this.codeState = 0
      if(this.codeTimer){
        clearInterval(this.codeTimer);
      }
      code().then(response => {
        this.codeImg = response.code
        this.codeTime = response.expires_in
        this.codeUuid = response.uuid
        this.codeTimer = setInterval(this.getRefreshCode, 2000);
      }).finally(() => {
        this.codeLoading = false
      })
    },
    // 刷新登录状态
    getRefreshCode(){
      this.codeTime = this.codeTime-1
      if (this.codeTime === 0) {
        clearInterval(this.codeTimer);
        this.codeState = 4
      } else {
        verify({uuid: this.codeUuid}).then(response => {
          this.codeState = response.state
          if(this.codeState !== 0 && this.codeState !== 1){
            clearInterval(this.codeTimer);
          }
          if(this.codeState === 2){
            index({
              uuid: this.codeUuid
            }).then(response => {
              this.login(response);
              this.$message({
                message: '登录成功',
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

    },
    toLogin(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.loading = true;
          login(this.ruleForm).then(response => {
            response.remember = this.ruleForm.remember
            this.login(response);
            this.$message({
              message: '登录成功',
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
