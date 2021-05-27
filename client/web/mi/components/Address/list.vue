<template>
	<div>
    <div class="address-list" v-loading="loading">
      <div class="address-item" v-for="(item, index) in list" :key="index">
        <div class="item-on" :class="{on:item.on && select}" @click="switchAddress(item)">
          <div class="address-info">
            <div class="name">
              {{ item.name }}
              <span v-if="item.defaults">默认</span>
            </div>
            <div class="cellphone">{{ item.cellphone }}</div>
            <div class="address-con">{{ item.location ? item.location + '(' : '' }}{{ item.address }} {{ item.house ? ')' + item.house : '' }}</div>
            <div class="address-action">
              <el-link v-if="!select" type="danger" :underline="false" @click="defaultAddress(item)">设为默认</el-link>
              <el-link type="danger" :underline="false" @click="updateAddress(item)">修改</el-link>
              <el-link v-if="!select" type="danger" :underline="false" @click="deleteAddress(item)">删除</el-link>
            </div>
          </div>
        </div>
      </div>
      <div class="address-item" @click="updateAddress">
        <div class="item">
          <div class="add-desc">
            <div><i class="el-icon-circle-plus"></i></div>
            <div>添加新地址</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      width="600px">
      <el-form class="ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="联系人" prop="name">
          <el-input v-model="ruleForm.name" clearable maxlength="20" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="cellphone">
          <el-input v-model="ruleForm.cellphone" clearable maxlength="11" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="location">
          <el-autocomplete
            v-model="ruleForm.location"
            popper-class="my-autocomplete"
            :fetch-suggestions="querySearch"
            placeholder="例如：宁波 天一广场"
            :trigger-on-focus="false"
            @select="handleSelect"
            style="width: 100%"
          >
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
              <span class="addr">{{ item.adname + ' ' + item.address }}</span>
            </template>
          </el-autocomplete>
          <div>输入完成后如没有想要的地址，可以多输入一个空格，在弹出列表中选择所在地区</div>
        </el-form-item>
        <el-form-item label="门牌号" prop="house">
          <el-input v-model="ruleForm.house" clearable maxlength="80" placeholder="请输入门牌号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" @click="centerDialogVisible = false">取 消</el-button>
        <el-button :loading="buttonLoading" type="danger"  @click="submitForm('ruleForm')">确 定</el-button>
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
