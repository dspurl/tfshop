<template>
  <div class="box">
    <div class="money-pay">
      <el-card class="container" shadow="always" v-loading="loading">
        <div class="pay-order">
          <div class="el-icon-circle-check"></div>
          <div class="order-info">
            <div class="title">订单提交成功！去付款咯～</div>
            <div class="warn">请在<span>
              <no-ssr>
                <vue-countdown @end="getList" v-if="list.overtime_time" :time="list.overtime_time * 1000" v-slot="{ days, hours, minutes, seconds }">
                  {{ days }} 天 {{ hours }} 小时 {{ minutes }} 分 {{ seconds }} 秒
                </vue-countdown>
              </no-ssr>
            </span>内完成支付, 超时后将取消订单</div>
            <div class="address" v-show="!detail" v-if="list.good_location">收货信息：{{list.good_location.name}} {{list.good_location.cellphone}} {{list.good_location.location}}<template v-if="list.good_location.address">({{ list.good_location.address }})</template></div>
            <div class="order-details" v-show="detail" v-if="list.good_location">
              <el-divider></el-divider>
              <ul>
                <li>
                  <div class="label">订单号：</div>
                  <div class="content"><span class="on">{{list.identification}}</span></div>
                </li>
                <li>
                  <div class="label">收货信息：</div>
                  <div class="content">{{list.good_location.name}} {{list.good_location.cellphone}} {{list.good_location.location}}<template v-if="list.good_location.address">({{ list.good_location.address }})</template></div>
                </li>
                <li>
                  <div class="label">商品名称：</div>
                  <div class="content"><span v-for="(item, index) in list.goods_list" :key="index">{{item.good.name}} </span></div>
                </li>
              </ul>
            </div>
            <div class="fright">
              <div class="total">应付总额：<div class="price"><span>{{(list.total ? list.total : 0)| thousands}}</span>元</div></div>
              <div class="show-detail" @click="showDetail">订单详情<i class="iconfont dsshop-xia"></i></div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="container mode-payment-box" shadow="always" v-loading="loading">
        <div class="title">选择以下支付方式付款</div>
        <el-divider></el-divider>
        <div class="min-title">支付方式</div>
        <div class="list">
          <div class="li" v-loading="buttonLoading" @click="payment('weixin')">
            <el-image
              class="image"
              :src="require('assets/img/weixin-pay.jpg')"
              fit="cover"/>
          </div>
          <div class="li" v-loading="buttonLoading" v-if="list.user" @click="payment(1)">
            预存款支付（{{list.user.money| thousands}}）
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog
        title="微信支付"
        :visible.sync="centerDialogVisible"
        :close-on-click-modal="false"
        width="400px"
        center>
        <div class="vue-qrcode">
          <vue-qrcode :value="qrcode" :options="{ width: 250 }"></vue-qrcode>
        </div>
        <div slot="footer" class="dialog-footer">
          <div>请使用<span class="main-color">微信</span>扫一扫</div>
          <div>二维码完成支付</div>
        </div>
    </el-dialog>
  </div>
</template>

<script>
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
</script>
<style lang='scss' scoped>
  .vue-qrcode{
    text-align: center;
  }
  .main-color{
    margin-left: 5px;
    margin-right: 5px;
    color: #fa524c;
  }
  .money-pay{
    margin: 40px 0 40px 0;
  }
  .mode-payment-box{
    margin-top: 30px;
    .title{
      font-size: 18px;
      margin-top:10px;
    }
    .min-title{
      font-size: 16px;
      color: #616161;
      margin-bottom: 20px;
    }
    .list{
      display: flex;
      margin-bottom: 20px;
      .li{
        border: 1px solid #e0e0e0;
        text-align: center;
        cursor: pointer;
        overflow: hidden;
        min-width: 174px;
        height: 60px;
        line-height: 60px;
        margin-left: 14px;
        padding-left:10px;
        padding-right: 10px;
      }
      .li:hover{
        border-color: #fa524c;
      }
      .li.on{
        border-color: #fa524c;
      }
    }
  }
  .pay-order{
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    .el-icon-circle-check{
      font-size: 80px;
      color: #83c44e;
      margin-left:30px;
      margin-right: 30px;
    }
    .order-info{
      position: relative;
      flex:1;
      color: #616161;
      margin-bottom: 5px;
      margin-right: 20px;
      line-height: 2;
      font-size: 14px;
      .title{
        margin-bottom: 10px;
        font-size: 24px;
        font-weight: 400;
        line-height: 36px;
      }
      .warn{
        span{
          color: #fa524c;
          margin: 0 5px 0 5px;
        }
      }
      .fright{
        position: absolute;
        top:10px;
        right: 0;
        .show-detail{
          cursor:pointer;
          text-align: right;
          margin-right: 5px;
        }
        .show-detail:hover{
          color: #fa524c;
        }
        .total{
          display: flex;
          line-height: 30px;
          .price{
            position: relative;
            top:-5px;
            color: #fa524c;
            span{
              font-size: 24px;
            }
          }
        }
        .iconfont{
          position: relative;
          left: 5px;
          font-size: 12px;
        }
      }
      .order-details{
        li{
          display: flex;
          .label{
            width: 80px;
          }
          .content{
            .on{
              color: #fa524c;
            }
          }

        }
      }
    }
  }
</style>
