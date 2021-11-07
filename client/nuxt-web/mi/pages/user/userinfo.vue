<template>
  <div class="box">
    <div class="user-title">个人资料</div>
    <div class="padding-top-20">
      <el-form v-loading="loading" label-width="200px">
        <el-form-item label="头像" prop="portrait">
          <el-avatar :size="80">
            <img class="portrait" @click="modification('portrait')" :src="user.portrait ? user.portrait : require('assets/img/portrait.gif')"/>
          </el-avatar>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <span>{{user.nickname ? user.nickname : '未设置'}}</span>
          <el-link type="primary" :underline="false" @click="modification('nickname')">修改</el-link>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <span>{{user.email ? user.email : '未绑定'}}</span>
          <el-link type="primary" :underline="false" @click="modification('email')">修改</el-link>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      width="600px">
      <el-form class="ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <template v-if="dialogType === 'portrait'">
          <el-form-item label="头像" prop="portrait">
            <el-upload
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-progress="handleProgress"
              :action="uploadFile.url"
              :headers="uploadFile.header"
              :data="uploadFile.data"
              class="avatar-uploader">
              <span v-if="imgProgress">
              <el-progress :percentage="imgProgressPercent" type="circle" class="progress-img"/>
            </span>
              <span v-else>
              <img v-if="ruleForm.portrait" :src="ruleForm.portrait" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"/>
            </span>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过2M</div>
            </el-upload>
          </el-form-item>
        </template>
        <template v-else-if="dialogType === 'nickname'">
          <el-form-item label="昵称" prop="nickname">
            <el-input maxlength="30" v-model="ruleForm.nickname" placeholder="请输入昵称" clearable></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="邮箱" prop="email">
            <el-input maxlength="255" v-model="ruleForm.email" placeholder="请输入邮箱" clearable></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model.number="ruleForm.code" maxlength="5" placeholder="请输入验证码" clearable></el-input>
            <el-button class="code-button" :loading="buttonLoading" type="danger" round size="mini" :disabled="disabled" @click="getCode">{{codename + seconds + unit}}</el-button>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" @click="centerDialogVisible = false">取 消</el-button>
        <el-button :loading="buttonLoading" type="danger" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/userinfo";
</style>

<script>
import js from './js/userinfo'
export default js
</script>
