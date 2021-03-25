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

<script>
import { amendPassword } from '@/api/login'
export default {
  layout: 'user',
  head () {
    return {
      title: '修改密码-个人中心',
    }
  },
  data() {
    const validateNowPassword = (rule, value, callback) => {
      if (value === this.ruleForm.nowPassword) {
        callback(new Error('新密码不能和旧密码相同!'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      ruleForm: {
        nowPassword: '',
        password: '',
        rPassword: ''
      },
      rules: {
        nowPassword: [
          { required: true, message: '请输入当前密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validateNowPassword, trigger: 'blur' }
        ],
        rPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
      }
    }
  },
  mounted() {

  },
  methods: {
    submitForm(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.loading = true;
          amendPassword(this.ruleForm).then(response => {
            this.loading = false;
            this.$refs['ruleForm'].resetFields();
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          }).catch(() => {
            this.loading = false
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
  }
  .user-title{
    color: #757575;
    font-weight: 400;
    font-size: 18px;
    margin-bottom: 20px;
  }
</style>
