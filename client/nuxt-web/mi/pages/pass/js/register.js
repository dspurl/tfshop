import {cellphoneCode, register} from '@/api/login'
export default {
  layout: 'login',
  head () {
    return {
      title: '注册' + '-' + process.env.APP_NAME
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
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        cellphone: '',
        password: '',
        code: '',
        rPassword: ''
      },
      codename:'获取验证码',
      seconds: '',
      unit: '',
      loading: false,
      codeDisabled: false,
      rules: {
        cellphone: [
          { validator: validateCellphone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, message: '密码长度必须大于5位', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { type: 'number', message: '验证码必须为数字'}
        ],
        rPassword: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取验证码
    getCode(){
      const that = this;
      cellphoneCode(this.ruleForm).then(response => {
        // 开始倒计时
        this.seconds = 60;
        this.codename = '';
        this.unit = 's';
        this.codeDisabled = true;
        this.timer = setInterval(function () {
          that.seconds = that.seconds - 1;
          if (that.seconds === 0) {
            // 读秒结束 清空计时器
            clearInterval(that.timer);
            that.seconds = '';
            that.codename = '获取验证码';
            that.unit = '';
            that.codeDisabled = false
          }
        }, 1000);
        // 模拟短信发送
        if(response.code){
          that.ruleForm.code = response.code
        }
      }).catch(() => {

      })
    },
    toRegister(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.loading = true;
          register(this.ruleForm).then(() => {
            this.$message({
              message: '注册成功',
              type: 'success'
            });
            this.loading = false;
            $nuxt.$router.replace('/pass/login')
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
