import { pay } from '@/api/goodIndent'
import { unifiedPayment, balancePay } from '@/api/pay'
import VueCountdown from '@chenfengyuan/vue-countdown';
import VueQrcode from '@chenfengyuan/vue-qrcode';
export default {
  components: { VueCountdown, VueQrcode },
  layout: 'cart',
  middleware: 'auth',
  head () {
    return {
      title: '支付订单' + '-' + process.env.APP_NAME,
    }
  },
  data() {
    return {
      loading: true,
      detail: false,
      centerDialogVisible: false,
      buttonLoading: false,
      qrcode: '',
      timer: null,
      list: {}
    }
  },
  mounted() {
    $nuxt.$store.commit('setCartTitle', '支付订单');
    this.getList()
  },
  methods: {
    getList(){
      pay($nuxt.$route.query.id).then(response => {
        if(response.state !== 1) {  // 订单发生改变时，直接跳转到结果页
          if (response.state === 4) {
            // $nuxt.$router.replace('/user/indent/list')
            $nuxt.$router.replace({path: '/user/indent/detail', query:{id:$nuxt.$route.query.id}})
          } else {
            $nuxt.$router.replace('/money/success')
          }

        }
        this.loading = false;
        this.list = response
      }).catch(error=>{
        this.$message({
          message: '请求参数有误',
          type: 'error'
        });

      })
    },
    // 显示详情
    showDetail(){
      this.detail = !this.detail
    },
    // 支付
    payment(type){
      this.buttonLoading = true
      if(type === 1){ // 余额支付
        balancePay({id:$nuxt.$route.query.id}).then(response => {
          this.buttonLoading = false
          $nuxt.$router.replace('/money/success')
        })
      }else{
        unifiedPayment({
          id: $nuxt.$route.query.id,
          platform: type,
          trade_type: 'NATIVE',
          type: 'goodsIndent'
        }).then(response => {
          this.centerDialogVisible = true
          this.qrcode = response.code_url
          this.buttonLoading = false
          if (this.timer) {
            clearInterval(this.timer)
            this.timer = setInterval(() => {
              this.getList()
            }, 5000);
          } else {
            this.timer = setInterval(() => {
              this.getList()
            }, 5000);
          }
        }).catch(error=>{
          this.$message({
            message: '支付配置有误，请检查',
            type: 'error'
          });
        })
      }
    }
  },
  destroyed(){
    clearInterval(this.timer)
  }
}
