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
      title: this.$t('indent.title') + '-' + process.env.APP_NAME,
    }
  },
  data() {
    const validateRemark = (rule, value, callback) => {
      const flag = new RegExp("[`~!@#$^&*()=|{}':'\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘：”“'。？ ]");
      if(flag.test(value)){
        return callback(new Error(this.$t('header.top.validate_remark')));
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
      },
      isAddress: false
    }
  },
  async asyncData (ctx) {
    try {
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  mounted() {
    $nuxt.$store.commit('setCartTitle', this.$t('indent.title'));
    this.getList()
  },
  methods: {
    async getList(){
      let specification = null
      this.ruleForm.indentCommodity = Object.values(this.store.get(process.env.CACHE_PR + 'OrderList'))
      let data = []
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
          data.push({
            ids: item.good_id,
            price: item.good_sku.price,
            skuIds: item.good_sku_id
          })
        }
      })
      // 是否需要地址
      this.isAddress = this.ruleForm.indentCommodity.some( function( item){
          return item.good.type === $nuxt.$t('good.type.common');
      })
    },
    // 选择的地址
    selectedAddress(res){
      this.buttonLoading = true;
      this.ruleForm.address = res
      const indentCommodity = this.ruleForm.indentCommodity.map(item => {
        return { number: item.number, freight_id: item.good.freight_id };
      });
      freight(res.id, indentCommodity).then(response => {
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
              message: this.$t('hint.error.selects', {attribute:this.$t('indent.location')}),
              type: 'error'
            });
            return false
          }
          this.buttonLoading = true;
          const indentCommodity = this.ruleForm.indentCommodity.map(item => {
            return {
              number: item.number,
              name: item.name,
              good_id: item.good_id,
              img: item.img,
              good_sku_id: item.good_sku_id ? item.good_sku_id : 0,
              freight_id: item.good.freight_id,
              price: item.price
            };
          });
          create({
            indentCommodity,
            remark: this.ruleForm.remark,
            carriage: this.ruleForm.carriage,
            shipping_id: this.ruleForm.address.id
          }).then(response => {
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
