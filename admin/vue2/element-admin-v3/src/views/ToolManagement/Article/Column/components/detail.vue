<template>
  <div v-loading="loading" class="createPost-container" style="padding-top: 40px">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="ruleForm" style="padding-left: 200px;padding-right:20px;width: 900px;">
      <el-form-item label="栏目名称" prop="name">
        <el-input v-model="ruleForm.name" maxlength="60" clearable style="width:400px"/>
      </el-form-item>
      <el-form-item label="类目" prop="pid">
        <el-cascader
          v-model="ruleForm.pid"
          :options="pidList"
          :props="{ checkStrictly: true, expandTrigger: 'hover' }"
          clearable/>
      </el-form-item>
      <el-form-item label="关键字" prop="keyword">
        <el-input v-model="ruleForm.keyword" maxlength="255" clearable style="width:600px"/>
      </el-form-item>
      <el-form-item label="描述" prop="describes">
        <el-input v-model="ruleForm.describes" maxlength="255" clearable style="width:600px"/>
      </el-form-item>
      <el-form-item label="模板" prop="template">
        <el-select v-model="ruleForm.template" placeholder="请选择">
          <el-option
            v-for="item in template"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="缩略图" prop="img">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-progress="handleProgress"
          :action="actionurl"
          :headers="imgHeaders"
          :data="imgData"
          class="avatar-uploader">
          <span v-if="imgProgress">
            <el-progress :percentage="imgProgressPercent" type="circle" class="progress-img"/>
          </span>
          <span v-else>
            <img v-if="ruleForm.resources.img" :src="ruleForm.resources.img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </span>
        </el-upload>
        <div class="el-upload__tip">推荐尺寸：312px * 208px</div>
      </el-form-item>
      <el-form-item label="详情" prop="content" style="margin:0 -500px 30px 0;">
        <tinymce
          ref="editor"
          v-model="ruleForm.column_property.details"
          :disabled="disabled"
          :url="actionurl"
          :header="imgHeaders"/>
      </el-form-item>
      <el-form-item label="是否显示" prop="is_show" style="width:400px;">
        <el-radio-group v-model="ruleForm.is_show">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否列表" prop="is_list" style="width:400px;">
        <el-radio-group v-model="ruleForm.is_list">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-radio-group v-model="ruleForm.sort">
          <el-input v-model="ruleForm.sort" maxlength="11" clearable style="width:80px;"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button :loading="formLoading" type="primary" @click="dialogStatus==='create'?create():edit()">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang='scss'>
  @import "../scss/detail";
</style>
<script>
import js from '../js/detail'
export default js
</script>
