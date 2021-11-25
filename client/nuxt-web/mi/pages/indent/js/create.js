import addressList from '@/components/Address/list'
import { freight } from '@/api/shipping'
import { create, addShoppingCart } from '@/api/goodIndent'
export default {
  components: {
    addressList
  },
  layout: 'cart',
  middleware: 'auth',
  head () {
    return {
      title: '确认订单' + '-' + process.env.APP_NAME,
    }
  },
  data() {
    const validateRemark = (rule, value, callback) => {
      const flag = new RegExp("[`~!@#$^&*()=|{}':'\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘：”“'。？ ]");
      if(flag.test(value)){
        return callback(new Error('不允许输入非法字符'));
      }else{
        callback();
      }
    };
    return {
      loading: true,
      buttonLoading: false,
      total: 0,
      ruleForm: {
        indentCommodity: [],
        address: {},
        remark: '',
        carriage: 0
      },
      rules: {
        remark: [
          { validator: validateRemark, trigger: 'blur' }
        ],
      }
    }
  },
  mounted() {
    $nuxt.$store.commit('setCartTitle', '确认订单');
    this.getList()
  },
  methods: {
    async getList(){
      let specification = null
      this.ruleForm.indentCommodity = Object.values(this.store.get(process.env.CACHE_PR + 'OrderList'))
      this.ruleForm.indentCommodity.forEach(item=>{
        this.total+= item.price * item.number
        if(item.good_sku){
          specification = null;
          item.good_sku.product_sku.forEach(item2 => {
            if (specification) {
              specification += item2.value + ';';
            } else {
              specification = item2.value + ';';
            }
          });
          item.specification = specification.substr(0, specification.length - 1);
        }
      })
    },
    // 选择的地址
    selectedAddress(res){
      this.buttonLoading = true;
      this.ruleForm.address = res
      freight(res.id, this.ruleForm.indentCommodity).then(response => {
        this.ruleForm.carriage = response.carriage
        this.buttonLoading = false;
      })
    },
    // 提交订单
    submit(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if(!this.ruleForm.address){
            this.$message({
              message: '请选择地址',
              type: 'error'
            });
            return false
          }
          this.buttonLoading = true;
          create(this.ruleForm).then(response => {
            this.buttonLoading = false;
            this.store.remove(process.env.CACHE_PR + 'CartList')
            this.store.remove(process.env.CACHE_PR + 'OrderList')
            addShoppingCart([])
            $nuxt.$router.replace({path: '/money/pay', query:{id: response}})
          }).catch(() => {
            this.buttonLoading = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    go(){
      $nuxt.$router.go(-1)
    }
  }
}
