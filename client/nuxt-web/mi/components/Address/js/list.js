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
      src: 'https://apis.map.qq.com/tools/locpicker?search=1&type=1&key='+process.env.IBS_KEY+'&referer=myapp', // https://lbs.qq.com
      restaurants: [],
      buttonLoading: false,
      loading: false,
      dialogTitle: '添加收货地址',
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
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        cellphone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateCellphone, trigger: 'blur' }
        ],
        house: [
          { required: true, message: '请输入门牌号', trigger: 'blur' },
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
                message: '修改成功',
                type: 'success'
              });
            }).catch(() => {
              this.buttonLoading = false
            })
          }else{
            if(!this.ruleForm.longitude){
              this.$message.error('请选择地址');
            }
            create(this.ruleForm).then(response => {
              this.buttonLoading = false
              this.centerDialogVisible = false
              this.$refs['ruleForm'].resetFields();
              this.getList()
              this.$message({
                message: '添加成功',
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
      this.$confirm('是否设为默认？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true
        defaultSet(item).then(response => {
          this.buttonLoading = false;
          this.getList()
          this.$message({
            message: '设置成功',
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
          message: '默认地址无法删除',
          type: 'error'
        })
        return
      }
      this.$confirm('确定要删除该地址吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.buttonLoading = true
        destroy(item.id).then(response => {
          this.buttonLoading = false;
          this.getList()
          this.$message({
            message: '删除成功',
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
        this.dialogTitle = '修改收货地址'
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
        this.dialogTitle = '添加收货地址'
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
