<template>
  <div class="register">
    <el-card class="form" shadow="hover">
      <div class="title">重置密码</div>
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
          <el-input v-model="ruleForm.password" placeholder="请输入新密码" show-password clearable>
            <i slot="prefix" class="iconfont dsshop-mima"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="rPassword">
          <el-input v-model="ruleForm.rPassword" placeholder="请输入确认密码" show-password clearable>
            <i slot="prefix" class="iconfont dsshop-mima"></i>
          </el-input>
        </el-form-item>
        <el-button class="button" type="danger" @click="submitForm" :loading="loading">提交</el-button>
      </el-form>
      <div class="go-login">想到密码？马上去<NuxtLink to="/pass/login">登录</NuxtLink></div>
    </el-card>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/findPassword";
</style>

<script>
import js from './js/findPassword'
export default js
</script>
