<template>
  <div class="login">
    <div class="banner-panel" style="background-image: url('//cdn.cnbj1.fds.api.mi-img.com/mi-mall/72644d9b8031286de3cc74e151aefd90.jpg');">
      <div class="container">
        <el-row :gutter="24">
          <el-col :span="8" :offset="16">
            <NuxtLink class="link" to="/pass/login"/>
            <el-card class="form" shadow="hover">
              <div class="login-method">
                <span :class="{on:method === 1}" @click="method = 1">账号登录</span>
<!--                <el-divider direction="vertical"></el-divider>-->
<!--                <span :class="{on:method === 2}" @click="method = 2">扫码登录</span>-->
              </div>
              <div v-if="method === 1">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                  <el-form-item prop="cellphone">
                    <el-input v-model="ruleForm.cellphone" maxlength="11" placeholder="请输入手机号码" clearable>
                      <i slot="prefix" class="iconfont dsshop-ziyuan"></i>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input v-model="ruleForm.password" placeholder="请输入密码" show-password clearable>
                      <i slot="prefix" class="iconfont dsshop-mima"></i>
                    </el-input>
                  </el-form-item>
                  <el-button class="button" type="danger" :loading="loading" @click="toLogin">登录</el-button>
                </el-form>
                <div class="other">
                  <NuxtLink to="/pass/register">立即注册</NuxtLink>
                  <el-divider direction="vertical"></el-divider>
                  <NuxtLink to="/pass/findPassword">忘记密码？</NuxtLink>
                </div>
              </div>
              <div v-else>
                <div class="qr-code">
                  <div class="qr">
                    <el-image
                      class="image"
                      src="//qr.m.jd.com/show?appid=133&size=147&t=1616062343779"
                      fit="scale-down"/>
                    <div class="lose-efficacy">
                      <div class="name">二维码已失效</div>
                      <el-button size="mini" class="flush" type="danger">刷新</el-button>
                    </div>
                  </div>
                  <div class="explain">使用<span>dsshop移动设备</span>扫描二维码</div>
                  <div class="advantage">
                    <div><i class="iconfont dsshop-kuai"/>更快</div>
                    <div><i class="iconfont dsshop-anquanzhuye"/>更安全</div>
                    <div><i class="iconfont dsshop-shurukuang"/>免输入</div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
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
</script>
<style lang='scss' scoped>
  .banner-panel{
    width: 100%;
    height: 588px;
    background-repeat: no-repeat;
    background-position: top center;
    position: relative;
    .qr-code{
      text-align: center;
      margin-top:30px;
      .qr{
        position: relative;
        margin:0 auto;
        border: 1px solid #f4f4f4;
        padding: 8px;
        width: 155px;
        .lose-efficacy{
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          .name{
            margin-top:50px;
            color: #fff;
            font-size: 16px;
          }
          .flush{
            margin-top:10px;
          }
        }
      }
      .explain{
        font-size: 12px;
        margin: 20px 0 20px 0;
        span{
          color: $font-color-main;
          margin: 0 5px 0 5px;
        }
      }
      .advantage{
        display: flex;
        color: #999;
        justify-content: center;
        div{
          i{
            padding-right: 3px;
            color: #e2e1e5;
          }
          margin: 0 10px 0 10px;
        }
      }
    }
    .link{
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      height: 588px;
      width: 800px;
    }
    .form{
      margin: 40px 0 40px 0;
      height: 508px;
      .login-method{
        text-align: center;
        font-size: 26px;
        padding:30px 0 30px 0;
        span{
          cursor:pointer;
        }
        .on, span:hover{
          color: $font-color-main;
        }
      }
      .button{
        width: 100%;
      }
      .other{
        margin-top:50px;
        text-align: center;
      }
      .other a{
        color: #999;
      }
      .other a:hover{
        color: $font-color-main;
      }
    }
  }
</style>
