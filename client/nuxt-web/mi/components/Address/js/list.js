import { create, getList, edit, destroy, defaultSet } from '@/api/shipping'
export default{
  name: 'AddressList',
  props: {
    select: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateCellphone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('hint.error.import', { attribute: this.$t('find_password.cellphone') })));
      } else {
        const myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (!myreg.test(value)) {
          callback(new Error(this.$t('hint.error.wrong_format', { attribute: this.$t('find_password.cellphone') })));
        }
        callback();
      }
    };
    return {
      src: 'https://apis.map.qq.com/tools/locpicker?search=1&type=1&key='+process.env.IBS_KEY+'&referer=myapp', // https://lbs.qq.com
      restaurants: [],
      buttonLoading: false,
      loading: false,
      dialogTitle: this.$t('address.add'),
      centerDialogVisible: false,
      list: [],
      ruleForm: {
        location: '',
        address: '',
        name: '',
        house: '',
        cellphone: '',
        latitude: '',
        longitude: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('hint.error.import', { attribute: this.$t('address.name') }), trigger: 'blur' },
        ],
        cellphone: [
          { required: true, message: this.$t('hint.error.import', { attribute: this.$t('find_password.cellphone') }), trigger: 'blur' },
          { validator: validateCellphone, trigger: 'blur' }
        ],
        house: [
          { required: true, message: this.$t('hint.error.import', { attribute: this.$t('address.house') }), trigger: 'blur' },
        ],
      }
    };
  },
  watch: {},
  mounted() {
    this.getList()
    window.addEventListener('message', this.handleSelect)
  },
  methods:{
    async getList(){
      this.loading = true;
      await getList({
        sort: '-defaults'
      }).then(response => {
        this.loading = false;
        this.list = response.data
        this.list.forEach(item=>{
          if(item.defaults){
            item.on = true
            this.$emit('selectedAddress',item)
          }else{
            item.on = false
          }
        })
      }).catch(() => {
        this.loading = false
      })
    },
    // 切换地址
    switchAddress(res){
      if(this.select){
        this.list.forEach(item=>{
          item.on = false
        })
        res.on = true
        this.$emit('selectedAddress',res)
        this.$forceUpdate()
      }
    },
    submitForm(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if(this.ruleForm.id){
            edit(this.ruleForm).then(response => {
              this.buttonLoading = false;
              this.centerDialogVisible = false
              this.$refs['ruleForm'].resetFields();
              this.getList()
              this.$message({
                message: this.$t('hint.succeed.win', { attribute: this.$t('common.amend') }),
                type: 'success'
              });
            }).catch(() => {
              this.buttonLoading = false
            })
          }else{
            if(!this.ruleForm.longitude){
              this.$message.error(this.$t('hint.error.selects', { attribute: this.$t('address.location') }));
            }
            create(this.ruleForm).then(response => {
              this.buttonLoading = false
              this.centerDialogVisible = false
              this.$refs['ruleForm'].resetFields();
              this.getList()
              this.$message({
                message: this.$t('hint.succeed.win', { attribute: this.$t('common.add') }),
                type: 'success'
              });
            }).catch(() => {
              this.buttonLoading = false
            })
          }
        }
      })
    },
    defaultAddress(item){
      this.$confirm(this.$t('address.is_default'), this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true
        defaultSet(item).then(response => {
          this.buttonLoading = false;
          this.getList()
          this.$message({
            message: this.$t('common.success'),
            type: 'success'
          });
        }).catch(() => {
          this.buttonLoading = false
        })
      }).catch(() => {
      })
    },
    deleteAddress(item){
      if(item.defaults){
        this.$message({
          message: this.$t('address.delete.confirm'),
          type: 'error'
        })
        return
      }
      this.$confirm(this.$t('address.delete.title'), this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true
        destroy(item.id).then(response => {
          this.buttonLoading = false;
          this.getList()
          this.$message({
            message: this.$t('hint.succeed.win', { attribute: this.$t('common.delete') }),
            type: 'success'
          });
        }).catch(() => {
          this.buttonLoading = false
        })
      }).catch(() => {
      })
    },
    updateAddress(item){
      if(item.id){
        this.ruleForm = item
        this.dialogTitle = this.$t('address.amend')
      }else{
        this.ruleForm = {
          location: '',
          address: '',
          name: '',
          house: '',
          cellphone: '',
          latitude: '',
          longitude: ''
        }
        this.dialogTitle = this.$t('address.add')
      }
      this.centerDialogVisible = true
    },
    handleSelect(event) {
      const loc = event.data;
      if (loc && loc.module === 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
        this.ruleForm.location = loc.poiname
        this.ruleForm.address = loc.poiaddress
        this.ruleForm.longitude = loc.latlng.lng
        this.ruleForm.latitude = loc.latlng.lat
      }
    }
  },
}
