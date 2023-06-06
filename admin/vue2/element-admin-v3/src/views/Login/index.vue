<template>
  <div class="login-container">
    <div class="left"/>
    <div class="login-main">
      <div class="login-config">
        <el-button circle>
          <lang-select class="set-language"/>
        </el-button>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <div class="title-container">
          <h3 class="title">{{ title }}</h3>
          <lang-select class="set-language"/>
        </div>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            :placeholder="$t('login.form.input.placeholder.username')"
            name="username"
            type="text"
            auto-complete="on">
            <i slot="prefix" class="el-input__icon el-icon-user"/>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            :placeholder="$t('login.form.input.placeholder.password')"
            name="password"
            auto-complete="on"
            show-password
            @keyup.enter.native="handleLogin">
            <i slot="prefix" class="el-input__icon el-icon-lock"/>
          </el-input>
        </el-form-item>
        <el-form-item class="no">
          <el-checkbox v-model="loginForm.remember">{{ $t('login.form.checkbox.remember_password') }}</el-checkbox>
        </el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">{{ $t('login.form.button.log_in') }}</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect'
import SocialSign from './socialsignin'
import { removeToken } from '@/utils/auth'
import Verify from 'vue2-verify'
export default {
  name: 'Login',
  components: { LangSelect, SocialSign, Verify },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('login.form.rules.error.username')))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error(this.$t('login.form.rules.error.password')))
      } else {
        callback()
      }
    }
    return {
      title: process.env.SITE_NAME,
      loginForm: {
        username: '',
        password: '',
        remember: false
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      verification: true,
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
  },
  destroyed() {
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (!this.verification) {
          this.$message.error(this.$t('login.form.rules.validate'))
          return false
        }
        if (valid) {
          // 防止登录时存在缓存，导致登录报错
          removeToken()
          removeToken('access_token')
          removeToken('expires_in')
          removeToken('refresh_token')
          removeToken('token_type')
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            // this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes star {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.03);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.03);
  }
}
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #ffffff;
  overflow: hidden;
  display: flex;
  .left{
    width: 40%;
    min-height: 100%;
    position: relative;
    background:url('../../assets/login_bg.jpg');
    background-color: #555;
    background-size: cover;
    background-position: 50%;
    background-repeat: no-repeat;
    color: #ffffff;
    animation: star 20s infinite;
  }
  .login-main{
    flex: 1;
    overflow: auto;
    display: flex;
    align-items:center;
    justify-content: center;
    position: relative;
    .login-form {
      width: 420px;
      position: relative;
      overflow: hidden;
    }
    .login-config{
      position: absolute;
      right: 20px;
      top: 20px;
    }
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        color: #000000;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: #000000;
      cursor: pointer;
      user-select: none;
    }
    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }
  }
}
@media (max-width: 1200px) {
  .login-container{
    .login-main{
      .login-form{
        width: 380px;
      }
    }
  }
}

@media (max-width: 1000px) {
  .login-container{
    .left {
      display: none;
    }
    .login-main{
      .login-form {
        padding: 20px 40px;
        width:100%;
      }
    }
  }
}
</style>
