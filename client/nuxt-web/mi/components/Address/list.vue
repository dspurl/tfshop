<template>
	<div>
    <div class="address-list" v-loading="loading">
      <div class="address-item" v-for="(item, index) in list" :key="index">
        <div class="item-on" :class="{on:item.on && select}" @click="switchAddress(item)">
          <div class="address-info">
            <div class="name">
              {{ item.name }}
              <span v-if="item.defaults">{{ $t('address.default') }}</span>
            </div>
            <div class="cellphone">{{ item.cellphone }}</div>
            <div class="address-con">{{ item.location ? item.location + '(' : '' }}{{ item.address }} {{ item.house ? ')' + item.house : '' }}</div>
            <div class="address-action">
              <el-link v-if="!select" type="danger" :underline="false" @click="defaultAddress(item)">{{ $t('address.set_default') }}</el-link>
              <el-link type="danger" :underline="false" @click="updateAddress(item)">{{ $t('common.amend') }}</el-link>
              <el-link v-if="!select" type="danger" :underline="false" @click="deleteAddress(item)">{{ $t('common.delete') }}</el-link>
            </div>
          </div>
        </div>
      </div>
      <div class="address-item" @click="updateAddress">
        <div class="item">
          <div class="add-desc">
            <div><i class="el-icon-circle-plus"></i></div>
            <div>{{ $t('address.add_new') }}</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      width="600px;height:500px;overflow-y: auto;">
      <el-form class="ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item :label="$t('address.name')" prop="name">
          <el-input :placeholder="$t('hint.error.import', { attribute: $t('address.name') })" v-model="ruleForm.name" clearable maxlength="20"></el-input>
        </el-form-item>
        <el-form-item :label="$t('find_password.cellphone')" prop="cellphone">
          <el-input :placeholder="$t('hint.error.import', { attribute: $t('find_password.cellphone') })" v-model="ruleForm.cellphone" clearable maxlength="11"></el-input>
        </el-form-item>
        <el-form-item :label="$t('address.location')" prop="location">
          <div v-if="ruleForm.longitude">{{ruleForm.location}}({{ruleForm.address}})</div>
          <div v-else>{{ $t('address.location.tip') }}</div>
          <iframe v-if="ruleForm.longitude" class="iframe" height="500" frameborder=0 :src="`${src}&coord=${ruleForm.latitude},${ruleForm.longitude}`"></iframe>
          <iframe v-else class="iframe" height="500" frameborder=0 :src="src"></iframe>
        </el-form-item>
        <el-form-item :label="$t('address.house')" prop="house">
          <el-input :placeholder="$t('hint.error.import', { attribute: $t('address.house') })" v-model="ruleForm.house" clearable maxlength="80"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" @click="centerDialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button :loading="buttonLoading" type="danger"  @click="submitForm('ruleForm')">{{ $t('common.confirm') }}</el-button>
      </span>
    </el-dialog>
	</div>
</template>

<style lang='scss' scoped>
  @import "./scss/list";
</style>

<script>
import js from './js/list'
export default js
</script>
