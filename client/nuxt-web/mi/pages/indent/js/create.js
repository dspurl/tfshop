import addressList from '@/components/Address/list'
import { freight } from '@/api/shipping'
import { create, addShoppingCart } from '@/api/goodIndent'
import coupon from '@/pages/coupon/components/use'
import { getDetail } from '@/api/integralCommodity'
import {good} from '@/api/integralDrawLog'
import {verifyPlugin} from '@/api/plugin'
export default {
  components: {
    addressList,
    coupon
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
        carriage: 0,
        user_coupon_id: 0,
        integral: 0,
        integral_draw_log_id: 0
      },
      couponMoney: 0,
      integralPrice: 0,
      integral: {
        available: 0,
        deductible: 0,
        parities: 0
      },
      rules: {
        remark: [
          { validator: validateRemark, trigger: 'blur' }
        ],
      },
      verify: {
        coupon: false,
        seckill: false
      },
      isSeckill: false
    }
  },
  async asyncData (ctx) {
    try {
      let [ verifyPluginData ] = await Promise.all([
        verifyPlugin(['coupon','integral','integralCommodity', 'seckill']),
      ]);
      return {
        verify: verifyPluginData
      }
    } catch(err) {
      ctx.$errorHandler(err)
    }
  },
  mounted() {
    $nuxt.$store.commit('setCartTitle', '确认订单');
    if ($nuxt.$route.query.integral_draw_log_id) {
      this.ruleForm.integral_draw_log_id = $nuxt.$route.query.integral_draw_log_id
      this.getIntegralDrawGoodList()
    } else {
      this.getList()
    }
  },
  methods: {
    async getList(){
      let specification = null
      this.ruleForm.indentCommodity = Object.values(this.store.get(process.env.CACHE_PR + 'OrderList'))
      const data = []
      let seckill = false
      this.ruleForm.indentCommodity.forEach(item=>{
        this.total+= item.price * item.number
        if(this.verify.seckill){
          seckill = item.good.seckill
        }
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
      if(this.verify.seckill && seckill){
        this.isSeckill = true
      }
      if(this.verify.integralCommodity) {
        this.getDetailData(data)
      }
    },
    //中奖奖品订单
    getIntegralDrawGoodList() {
      const data = []
      good(this.ruleForm.integral_draw_log_id).then(item => {
        let specification = null
        this.ruleForm.indentCommodity = item
        this.ruleForm.indentCommodity.forEach(item => {
          this.total += item.price * item.number
          item.product_sku.forEach(item2 => {
            if (specification) {
              specification += item2.value + ';';
            } else {
              specification = item2.value + ';';
            }
          });
          item.specification = specification.substr(0, specification.length - 1);
          data.push({
            ids: item.good_id,
            price: item.price,
            skuIds: item.good_sku_id
          })
        })
      })
      this.getDetailData(data)
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
    },
    // 选择优惠券
    calcTotal(item){
      if(item){
        this.couponMoney = item.cost
        this.ruleForm.user_coupon_id = item.id
      }
    },
    // 获取积分商品信息
    getDetailData(row) {
      getDetail(row).then(response => {
        this.integral.available = response.available
        this.integral.deductible = response.deductible
        this.integral.parities = response.parities
        if (this.integral.available >= this.integral.deductible) {
          this.ruleForm.integral = this.integral.deductible
          this.integralPrice = this.integral.deductible * this.integral.parities * 100 / 100
        } else {
          this.ruleForm.integral = this.integral.available
          this.integralPrice = this.integral.available * this.integral.parities * 100 / 100
        }
      })
    },
    // 自定义积分
    numberIntegral(value) {
      this.integralPrice = value * this.integral.parities * 100 / 100
    }
  }
}
