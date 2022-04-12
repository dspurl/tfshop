<template>
  <div v-loading="loading" class="createPost-container" style="padding-top: 40px">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="ruleForm" style="padding-left: 200px;padding-right:20px;width: 900px;">
      <el-form-item label="参数名" prop="value" style="width:400px;">
        <el-input v-model="ruleForm.value" maxlength="60" placeholder="请输入参数名" clearable/>
      </el-form-item>
      <el-form-item label="默认值" prop="value" style="width:400px;">
        <el-select v-model="ruleForm.leaf" multiple placeholder="请选择">
          <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.value"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="是否隐藏" prop="is_hide" style="width:400px;">
        <el-radio-group v-model="ruleForm.is_hide" placeholder="请选择是否隐藏">
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
