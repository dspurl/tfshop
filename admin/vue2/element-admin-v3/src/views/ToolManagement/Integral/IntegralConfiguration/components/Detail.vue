<template>
  <div v-loading="loading" class="createPost-container" style="padding-top: 40px">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="ruleForm" style="padding-left: 200px;padding-right:20px;width: 900px;">
      <el-form-item label="配置名称" prop="name" style="width:400px;">
        <el-input v-model="ruleForm.name" maxlength="20" placeholder="请输入配置名称" clearable/>
      </el-form-item>
      <el-form-item label="系统变量" prop="system" style="width:400px;">
        <el-input v-model="ruleForm.system" maxlength="30" placeholder="请输入系统变量" clearable/>
        <p>用于系统内部调用，一般以sys_开头</p>
      </el-form-item>
      <el-form-item label="配置值" prop="value" style="width:400px;">
        <el-input v-model="ruleForm.value" maxlength="30" placeholder="请输入配置值" clearable/>
        <p>数值或百分比，具体以配置说明为准</p>
      </el-form-item>
      <el-form-item label="配置说明" prop="explain" style="width:400px;">
        <el-input v-model="ruleForm.explain" maxlength="200" placeholder="请输入配置说明" clearable/>
      </el-form-item>
      <el-form-item label="是否隐藏" prop="is_hidden" style="width:400px;">
        <el-radio-group v-model="ruleForm.is_hidden" placeholder="请选择是否隐藏">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button :loading="formLoading" type="primary" @click="dialogStatus==='create'?create():edit()">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import js from '../js/detail'
export default js
</script>
