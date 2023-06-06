<template>
  <div class="box">
    <div class="user-title">{{$t('user.info')}}</div>
    <div class="padding-top-20">
      <el-form v-loading="loading" label-width="200px">
        <el-form-item :label="$t('userinfo.head_portrait')" prop="portrait">
          <el-avatar :size="80">
            <img class="portrait" @click="modification('portrait')" :src="user.portrait ? user.portrait : require('assets/img/portrait.gif')"/>
          </el-avatar>
        </el-form-item>
        <el-form-item :label="$t('userinfo.nickname')" prop="nickname">
          <span>{{user.nickname ? user.nickname : $t('userinfo.not_set')}}</span>
          <el-link type="primary" :underline="false" @click="modification('nickname')">{{$t('common.amend')}}</el-link>
        </el-form-item>
        <el-form-item :label="$t('userinfo.email')" prop="email">
          <span>{{user.email ? user.email : $t('userinfo.not_bound')}}</span>
          <el-link type="primary" :underline="false" @click="modification('email')">{{$t('common.amend')}}</el-link>
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
          <el-form-item :label="$t('userinfo.head_portrait')" prop="portrait">
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
              <div slot="tip" class="el-upload__tip">{{$t('hint.tip.upload', {rmvb: 'jpg/png/gif',size: '2M'})}}</div>
            </el-upload>
          </el-form-item>
        </template>
        <template v-else-if="dialogType === 'nickname'">
          <el-form-item :label="$t('userinfo.nickname')" prop="nickname">
            <el-input maxlength="30" v-model="ruleForm.nickname" :placeholder="$t('hint.error.import', {attribute: $t('userinfo.nickname')})" clearable></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item :label="$t('userinfo.email')" prop="email">
            <el-input maxlength="255" v-model="ruleForm.email" :placeholder="$t('hint.error.import', {attribute: $t('userinfo.email')})" clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('find_password.verification_code')" prop="code">
            <el-input v-model.number="ruleForm.code" maxlength="5" :placeholder="$t('hint.error.import', {attribute: $t('find_password.verification_code')})" clearable></el-input>
            <el-button class="code-button" :loading="buttonLoading" type="danger" round size="mini" :disabled="disabled" @click="getCode">{{codename + seconds + unit}}</el-button>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" @click="centerDialogVisible = false">{{$t('common.cancel')}}</el-button>
        <el-button :loading="buttonLoading" type="danger" @click="submitForm">{{$t('common.confirm')}}</el-button>
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
