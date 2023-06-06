<template>
  <div class="box">
    <div class="user-title">{{$t('user.cellphone')}}</div>
    <div class="padding-top-20">
      <el-form v-loading="loading" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="ruleForm">
        <el-form-item :label="$t('cellphone.current')">
          {{cellphone}}
        </el-form-item>
        <el-form-item :label="$t('cellphone.new')" prop="cellphone">
          <el-input maxlength="11" v-model="ruleForm.cellphone" clearable :placeholder="$t('hint.error.import', {attribute: $t('cellphone.new')})"></el-input>
        </el-form-item>
        <el-form-item :label="$t('find_password.verification_code')" prop="code">
          <el-input v-model="ruleForm.code" maxlength="5" :placeholder="$t('hint.error.import', {attribute: $t('find_password.verification_code')})" clearable></el-input>
          <el-button class="code-button" :loading="buttonLoading" type="danger" round size="mini" :disabled="disabled" @click="getCode">{{codename + seconds + unit}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="buttonLoading" type="danger" @click="submitForm('ruleForm')">{{$t('cellphone.confirm_modification')}}</el-button>
          <el-button :loading="buttonLoading" @click="resetForm('ruleForm')">{{$t('cellphone.reset')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/cellphone";
</style>

<script>
import js from './js/cellphone'
export default js
</script>
