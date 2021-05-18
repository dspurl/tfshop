<template>
  <div class="box">
    <div class="user-title">修改手机号</div>
    <div class="padding-top-20">
      <el-form v-loading="loading" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="ruleForm">
        <el-form-item label="当前手机号">
          {{cellphone}}
        </el-form-item>
        <el-form-item label="新的手机号" prop="cellphone">
          <el-input maxlength="11" v-model="ruleForm.cellphone" clearable placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" maxlength="5" placeholder="请输入验证码" clearable></el-input>
          <el-button class="code-button" :loading="buttonLoading" type="danger" round size="mini" :disabled="disabled" @click="getCode">{{codename + seconds + unit}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="buttonLoading" type="danger" @click="submitForm('ruleForm')">确认修改</el-button>
          <el-button :loading="buttonLoading" @click="resetForm('ruleForm')">重置</el-button>
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
