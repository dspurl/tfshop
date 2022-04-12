<template>
  <div class="login">
    <div class="banner-panel" style="background-image: url('//cdn.cnbj1.fds.api.mi-img.com/mi-mall/72644d9b8031286de3cc74e151aefd90.jpg');">
      <div class="container">
        <el-row :gutter="24">
          <el-col :span="8" :offset="16">
            <NuxtLink class="link" to="/pass/login"/>
            <el-card class="form" shadow="hover">
              <div class="login-method">
                <span :class="{on:method === 1}" @click="setMethod(1)">账号登录</span>
                <template v-if="isSweepLogin">
                  <el-divider direction="vertical"></el-divider>
                  <span :class="{on:method === 2}" @click="setMethod(2)">扫码登录</span>
                </template>
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
                  <el-form-item>
                    <el-checkbox v-model="ruleForm.remember">记住密码</el-checkbox>
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
                  <div class="qr" v-loading="codeLoading">
                    <el-image
                      class="image"
                      :src="codeImg"
                      fit="scale-down"/>
                    <div class="lose-efficacy" v-if="codeState === 1">
                      <div class="name">扫码成功</div>
                      <el-button size="mini" class="flush" type="danger" @click="getCode()">重新扫码</el-button>
                    </div>
                    <div class="lose-efficacy" v-else-if="codeState === 3">
                      <div class="name">扫码失败</div>
                      <el-button size="mini" class="flush" type="danger" @click="getCode()">重新扫码</el-button>
                    </div>
                    <div class="lose-efficacy" v-else-if="codeState === 4">
                      <div class="name">二维码已失效</div>
                      <el-button size="mini" class="flush" type="danger" @click="getCode()">刷新</el-button>
                    </div>
                  </div>
                  <div class="explain" v-if="codeState === 1">请在手机完成授权登录</div>
                  <div class="explain" v-else-if="codeState === 3">您拒绝授权，尝试重新扫码</div>
                  <div class="explain" v-else>使用<span>微信</span>扫描二维码</div>
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

<style lang='scss' scoped>
  @import "./scss/login";
</style>

<script>
import js from './js/login'
export default js
</script>
