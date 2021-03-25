<template>
  <div class="register">
    <el-card class="form" shadow="hover">
      <div class="title">注册DSSHOP帐号</div>
      <el-form class="ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="cellphone">
          <el-input v-model="ruleForm.cellphone" maxlength="11" placeholder="请输入手机号码" clearable>
            <i slot="prefix" class="iconfont dsshop-ziyuan"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="ruleForm.code" maxlength="5" placeholder="请输入验证码" clearable>
            <i slot="prefix" class="iconfont dsshop-duanxinyanzhengma"></i>
          </el-input>
          <el-button class="code-button" type="danger" round size="mini" :disabled="codeDisabled" @click="getCode">{{codename + seconds + unit}}</el-button>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码" show-password clearable>
            <i slot="prefix" class="iconfont dsshop-mima"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="rPassword">
          <el-input v-model="ruleForm.rPassword" placeholder="请确认密码" show-password clearable>
            <i slot="prefix" class="iconfont dsshop-mima"></i>
          </el-input>
        </el-form-item>
        <el-button class="button" type="danger" @click="toRegister" :loading="loading">注册</el-button>
      </el-form>
      <div class="go-login">已有账号？马上去<NuxtLink to="/pass/login">登录</NuxtLink></div>
      <div class="user-agreement">
        已阅读并同意：DSSHOP <NuxtLink to="/pass/register">用户协议</NuxtLink>和 <NuxtLink to="/pass/register">隐私政策</NuxtLink>
      </div>
    </el-card>
  </div>
</template>

<script>
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
        const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
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
</script>
<style  lang='scss' scoped>
  a:hover{
    color: #fa524c;
  }
  .register{
    background-color: #f4f4f4;
    padding: 30px 0 30px 0;
    .form{
      min-height: 550px;
      width: 850px;
      margin: 30px auto;
      text-align: center;
      .title{
        font-size: 30px;
        margin: 30px 0 30px 0;
      }
      .ruleForm{
        margin: 0 auto;
        width: 350px;
        .button{
          width: 100%;
        }
        .code-button{
          position: absolute;
          right: 5px;
          top:6px;
        }
      }
      .user-agreement{
        margin-top:20px;
        font-size: 12px;
        color: #999;
        a{
          margin:0 5px 0 5px;
        }
      }
      .go-login{
        text-align: right;
        font-size: 12px;
        color: #999;
        margin: 10px 230px 0 0;
        a{
          margin: 0 5px 0 5px;
        }
      }
    }
  }
</style>
