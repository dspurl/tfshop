<template>
  <div class="register">
    <el-card class="form" shadow="hover">
      <div class="title">{{$t('find_password.title')}}</div>
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
          <el-input v-model="ruleForm.password" :placeholder="$t('hint.error.import', {attribute: $t('find_password.new_password')})" show-password clearable>
            <i slot="prefix" class="iconfont dsshop-mima"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="rPassword">
          <el-input v-model="ruleForm.rPassword" :placeholder="$t('hint.error.import', {attribute: $t('find_password.confirm_password')})" show-password clearable>
            <i slot="prefix" class="iconfont dsshop-mima"></i>
          </el-input>
        </el-form-item>
        <el-button class="button" type="danger" @click="submitForm" :loading="loading">{{$t('common.submit')}}</el-button>
      </el-form>
      <div class="go-login">{{$t('find_password.think_password')}}<NuxtLink to="/pass/login">{{$t('header.top.login')}}</NuxtLink></div>
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
