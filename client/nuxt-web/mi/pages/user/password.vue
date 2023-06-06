<template>
  <div class="box">
    <div class="user-title">{{$t('user.password')}}</div>
    <div class="padding-top-20">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="ruleForm">
        <el-form-item :label="$t('password.current_password')" prop="nowPassword">
          <el-input v-model="ruleForm.nowPassword" clearable show-password :placeholder="$t('hint.error.import', {attribute: $t('password.current_password')})"></el-input>
        </el-form-item>
        <el-form-item :label="$t('find_password.new_password')" prop="password">
          <el-input v-model="ruleForm.password" clearable show-password :placeholder="$t('hint.error.import', {attribute: $t('find_password.new_password')})"></el-input>
        </el-form-item>
        <el-form-item :label="$t('find_password.confirm_password')" prop="rPassword">
          <el-input v-model="ruleForm.rPassword" clearable show-password :placeholder="$t('hint.error.import', {attribute: $t('find_password.confirm_password')})"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="danger" @click="submitForm('ruleForm')">{{$t('cellphone.confirm_modification')}}</el-button>
          <el-button :loading="loading" @click="resetForm('ruleForm')">{{$t('cellphone.reset')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/password";
</style>

<script>
import js from './js/password'
export default js
</script>
