<template>
  <div class="login">
    <div class="banner-panel" :style="{backgroundImage: `url(${banner.resources.img})`}">
      <div class="container">
        <el-row :gutter="24">
          <el-col :span="8" :offset="16">
            <NuxtLink class="link" :to="banner.url.split('pages/').join('')"/>
            <el-card class="form" shadow="hover">
              <div class="login-method">
                <span :class="{on:method === 1}" @click="setMethod(1)">账号登录</span>
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
