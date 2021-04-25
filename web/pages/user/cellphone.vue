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

<script>
  import {detail} from '@/api/user'
  import { changeCellphone, cellphoneCode } from '@/api/login'
  export default {
    layout: 'user',
    head () {
      return {
        title: '修改手机号-个人中心',
      }
    },
    data() {
      const validateCellphone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else {
          const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
          if (!myreg.test(value)) {
            callback(new Error('手机号格式有误'));
          }
          callback();
        }
      };
      return {
        buttonLoading: false,
        loading: true,
        disabled: false,
        codename:'获取验证码',
        seconds: '',
        cellphone: '',
        unit: '',
        user: {},
        ruleForm: {
          cellphone: '',
          code: '',
          state: 2
        },
        rules: {
          cellphone: [
            { required: true, message: '请输入新手机号', trigger: 'blur' },
            { validator: validateCellphone, trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
          ]
        }
      }
    },
    mounted() {
      this.getUser()
    },
    methods: {
      async getUser(){
        await Promise.all([
          detail(this.listQuery)
        ]).then(([userData]) => {
          this.user = userData;
          this.cellphone = JSON.parse(JSON.stringify(userData.cellphone));
          this.loading = false
        }).catch((error) => {
          this.loading = false
        })
      },
      // 获取验证码
      getCode(){
        const that = this;
        this.buttonLoading = true;
        cellphoneCode(this.ruleForm).then(response => {
          // 开始倒计时
          this.seconds = 60;
          this.codename = '';
          this.unit = 's';
          this.disabled = true;
          this.buttonLoading = false;
          this.timer = setInterval(function () {
            that.seconds = that.seconds - 1;
            if (that.seconds === 0) {
              // 读秒结束 清空计时器
              clearInterval(that.timer);
              that.seconds = '';
              that.codename = '获取验证码';
              that.unit = '';
              that.codeDisabled = false
            }
          }, 1000);
          // 模拟验证码发送
          if(response.code){
            that.ruleForm.code = response.code
          }
        }).catch(() => {
          this.buttonLoading = false
        })
      },
      submitForm(){
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.loading = true;
            this.buttonLoading = true;
            changeCellphone(this.ruleForm).then(response => {
              this.loading = false;
              this.buttonLoading = false;
              this.getUser();
              this.$refs['ruleForm'].resetFields();
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            }).catch(() => {
              this.loading = false;
              this.buttonLoading = false
            })
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style lang='scss' scoped>
  .ruleForm{
    width: 500px;
    .code-button{
      position: absolute;
      right: 5px;
      top:6px;
    }
  }
  .user-title{
    color: #757575;
    font-weight: 400;
    font-size: 18px;
    margin-bottom: 20px;
  }
</style>
