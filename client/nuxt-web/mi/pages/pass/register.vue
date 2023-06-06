<template>
  <div class="register">
    <el-card class="form" shadow="hover">
      <div class="title">{{$t('register.account', {name: 'DSSHOP'})}}</div>
      <el-form class="ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="cellphone">
          <el-input v-model="ruleForm.cellphone" maxlength="11" :placeholder="$t('hint.error.import', {attribute: $t('find_password.cellphone')})" clearable>
            <i slot="prefix" class="iconfont dsshop-ziyuan"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="ruleForm.code" maxlength="5" :placeholder="$t('hint.error.import', {attribute: $t('find_password.verification_code')})" clearable>
            <i slot="prefix" class="iconfont dsshop-duanxinyanzhengma"></i>
          </el-input>
          <el-button class="code-button" type="danger" round size="mini" :disabled="codeDisabled" @click="getCode">{{codename + seconds + unit}}</el-button>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" :placeholder="$t('hint.error.import', {attribute: $t('find_password.password')})" show-password clearable>
            <i slot="prefix" class="iconfont dsshop-mima"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="rPassword">
          <el-input v-model="ruleForm.rPassword" :placeholder="$t('hint.error.import', {attribute: $t('find_password.confirm_password')})" show-password clearable>
            <i slot="prefix" class="iconfont dsshop-mima"></i>
          </el-input>
        </el-form-item>
        <el-button class="button" type="danger" @click="toRegister" :loading="loading">{{$t('header.top.register')}}</el-button>
      </el-form>
      <div class="go-login">{{$t('register.referrer_account')}}<NuxtLink to="/pass/login">{{$t('header.top.login')}}</NuxtLink></div>
      <div class="user-agreement">
        {{$t('register.read')}}：DSSHOP <NuxtLink to="/pass/register">《{{$t('register.user_agreement')}}》</NuxtLink><NuxtLink to="/pass/register">《{{$t('register.privacy_policy')}}》</NuxtLink>
      </div>
    </el-card>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/register";
</style>

<script>
import js from './js/register'
export default js
</script>
