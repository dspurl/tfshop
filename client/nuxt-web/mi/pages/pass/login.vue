<template>
  <div class="login">
    <div class="banner-panel" :style="{backgroundImage: banner.resources ? `url(${banner.resources.img})` : ''}">
      <div class="container">
        <el-row :gutter="24">
          <el-col :span="8" :offset="16">
            <NuxtLink v-if="banner.url" class="link" :to="banner.url.split('pages/').join('')"/>
            <el-card class="form" shadow="hover">
              <div class="login-method">
                <span :class="{on:method === 1}" @click="setMethod(1)">{{$t('login.login')}}</span>
              </div>
              <div v-if="method === 1">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
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
                  <el-form-item>
                    <el-checkbox v-model="ruleForm.remember">{{$t('login.rememb')}}</el-checkbox>
                  </el-form-item>
                  <el-button class="button" type="danger" :loading="loading" @click="toRegister">{{$t('header.top.login')}}</el-button>
                </el-form>
                <div class="other">
                  首次登录会注册
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
  @import "./scss/login";
</style>

<script>
import js from './js/login'
export default js
</script>
