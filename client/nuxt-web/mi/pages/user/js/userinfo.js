import {detail, edit} from '@/api/user'
import { emailCode,verifyEmail } from '@/api/login'
import { getToken } from '@/plugins/auth'
export default {
  layout: 'user',
  head () {
    return {
      title: `${this.$t('user.info')}-${this.$t('header.top.personal_center')}`,
    }
  },
  data() {
    return {
      disabled: false,
      codename:this.$t('find_password.get_code'),
      seconds: '',
      unit: '',
      uploadFile:{
        url: process.env.API_URL + 'uploadPictures',
        header: {
          'apply-secret': process.env.PROJECT_KEY,
          'Authorization': 'Bearer ' + getToken('token')
        },
        data: {
          type: 1,
          size: 1024 * 1024 * 2
        }
      },
      loading: true,
      buttonLoading: false,
      centerDialogVisible: false,
      imgProgressPercent: 0,
      imgProgress: false,
      dialogType: '',
      dialogTitle: '',
      ruleForm: {},
      user: {},
      collectList: [],
      rules: {
        portrait: [
          { required: true, message: this.$t('userinfo.portrait'), trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: this.$t('hint.error.import', {attribute: this.$t('userinfo.nickname')}), trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('hint.error.import', {attribute: this.$t('userinfo.email')}), trigger: 'blur' },
          { type: 'email', message: this.$t('hint.error.wrong_format', {attribute: this.$t('userinfo.email')}), trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: this.$t('hint.error.import', {attribute: this.$t('find_password.verification_code')}), trigger: 'blur' },
          { type: 'number', message: this.$t('find_password.verification_code.number', {attribute: this.$t('find_password.verification_code')})}
        ],
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
        this.loading = false
      }).catch((error) => {
        this.loading = false
      })
    },
    submitForm(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if(this.dialogType === 'email'){
            verifyEmail(this.ruleForm).then(response => {
              this.buttonLoading = false;
              this.centerDialogVisible = false;
              this.getUser();
              this.$message({
                message: this.$t('common.success'),
                type: 'success'
              });
            }).catch(() => {
              this.buttonLoading = false
            })
          }else{
            edit(this.ruleForm).then(response => {
              this.buttonLoading = false;
              this.centerDialogVisible = false;
              this.getUser();
              this.$message({
                message: this.$t('common.success'),
                type: 'success'
              });
            }).catch(() => {
              this.buttonLoading = false
            })
          }
        }
      })
    },
    modification(type){
      this.centerDialogVisible = true
      this.dialogType= type;

      switch (type) {
        case 'portrait':
          this.dialogTitle = this.$t('userinfo.amend_portrait');
          this.ruleForm = {
            portrait: this.user.portrait
          };
          break;
        case 'nickname':
          this.dialogTitle = this.$t('userinfo.amend_nickname');
          this.ruleForm = {
            nickname: this.user.nickname
          };
          break;
        case 'email':
          this.dialogTitle = this.$t('userinfo.amend_email');
          this.ruleForm = {
            email: this.user.email,
            code: ''
          };
          break
      }
    },
    handleAvatarSuccess(res, file) {
      this.ruleForm.portrait = file.response;
      this.imgProgress = false;
      this.imgProgressPercent = 0
    },
    // 上传时
    handleProgress(file, fileList) {
      this.imgProgressPercent = file.percent
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (
        ['image/jpeg',
          'image/gif',
          'image/png',
          'image/bmp'
        ].indexOf(file.type) === -1) {
        this.$message.error(this.$t('userinfo.error.image'));
        return false
      }
      if (!isLt2M) {
        this.$message.error(this.$t('userinfo.error.image.size'))
      }
      this.imgProgress = true;
      return isLt2M
    },
    // 获取验证码
    getCode(){
      const that = this;
      this.buttonLoading = true;
      emailCode(this.ruleForm).then(response => {
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
            that.codename = this.$t('find_password.get_code');
            that.unit = '';
            that.disabled = false
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
  }
}
