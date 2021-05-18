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
          { validator: validateCellphone, trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请输入地址', trigger: 'blur' },
        ],
        house: [
          { required: true, message: '请输入门牌号', trigger: 'blur' },
        ],
      }
    };
  },
  watch: {
    /*getList(newVal) {
      this.$emit('getList', newVal)
      this.getLists = this.getList
      if(!this.update){
        this.loadData()
      }
    },*/

  },
  mounted() {
    this.getList()
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
    querySearch(queryString, cb) {
      let restaurants = this.restaurants;
      $nuxt.$axios
        .get(process.env.IBS_URL + '/place/text',{
          params: {
            keywords: queryString,
            key: process.env.IBS_KEY
          }
        })
        .then((response) => {
          if(response.data.info === 'OK'){
            restaurants = response.data.pois
            restaurants.forEach(item=>{
              item.value = item.name
            })
            this.restaurants = restaurants
          }else{
            console.log('没有查询结果')
          }
        }).catch((response) => {
        console.log('response',response)
      })
      this.$forceUpdate()
      cb(restaurants);
    },
    handleSelect(item) {
      const location = item.location.split(",")
      this.ruleForm.address = item.address
      this.ruleForm.longitude = location[0]
      this.ruleForm.latitude = location[1]
    }
  },
}
