<template>
  <div class="box">
    <div class="user-title">修改密码</div>
    <div class="padding-top-20">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="ruleForm">
        <el-form-item label="当前密码" prop="nowPassword">
          <el-input v-model="ruleForm.nowPassword" clearable show-password placeholder="请输入当前密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="ruleForm.password" clearable show-password placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rPassword">
          <el-input v-model="ruleForm.rPassword" clearable show-password placeholder="请输入确认密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="danger" @click="submitForm('ruleForm')">确认修改</el-button>
          <el-button :loading="loading" @click="resetForm('ruleForm')">重置</el-button>
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
