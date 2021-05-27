import {login} from '@/api/login'
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
  data() {
    const validateCellphone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else {
        const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (!myreg.test(value)) {
          callback(new Error('手机号格式有误'));
        }
        callback();
      }
    };
    return {
      method: 1,
      ruleForm: {
        cellphone: '',
        password: ''
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
      }
    }
  },
  methods: {
    ...mapMutations(['login']),
    toLogin(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.loading = true;
          login(this.ruleForm).then(response => {
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
