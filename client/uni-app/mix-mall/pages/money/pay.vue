<template>
	<view class="app">
		<view v-if="orderInfo.state === 4">
			<view class="price-box">
				<text>{{$t('indent.lost_efficacy')}}</text>
			</view>
		</view>
		<view v-else>
			<view class="price-box">
				<text>{{$t('indent.payment_amount')}}</text>
				<text class="price">{{$t('common.unit')}}{{orderInfo.total | 1000}}</text>
				<text class="padding-top">{{$t('indent.lost_efficacy_time')}}</text>
				<uni-countdown color="#fa436a" splitorColor="#fa436a" :show-day="orderInfo.day ? true : false" :showColon="false" :day="orderInfo.day" :hour="orderInfo.hour" :minute="orderInfo.minute" :second="orderInfo.second"></uni-countdown>
			</view>
			
			<view class="pay-type-list">
			
				<view class="type-item b-b" @click="changePayType('weixin')">
					<text class="icon yticon icon-weixinzhifu"></text>
					<view class="con">
						<text class="tit">{{$t('payment_log.platform.weixin')}}</text>
						<text>{{$t('payment_log.platform.recommend_weixin')}}</text>
					</view>
					<label class="radio">
						<radio value="" color="#fa436a" :checked="payType == 'weixin'"/>
						</radio>
					</label>
				</view>
				<!-- <view class="type-item b-b" @click="changePayType('alipay')">
					<text class="icon yticon icon-alipay"></text>
					<view class="con">
						<text class="tit">支付宝支付</text>
					</view>
					<label class="radio">
						<radio value="" color="#fa436a" :checked="payType == 'alipay'" />
						</radio>
					</label>
				</view> -->
				<view class="type-item" @click="changePayType(1)">
					<text class="icon yticon icon-erjiye-yucunkuan"></text>
					<view class="con">
						<text class="tit">{{$t('payment_log.prepaid_deposit')}}</text>
						<text>{{$t('payment_log.available_balance')}} {{$t('common.unit')}}{{orderInfo.user.money | 1000}}</text>
					</view>
					<label class="radio">
						<radio value="" color="#fa436a" :checked="payType == 1" />
						</radio>
					</label>
				</view>
			</view>
			
			<button class="mix-btn" :disabled="confirmDisabled" @click="confirm">{{$t('payment_log.confirm_payment')}}</button>
			<view class="cu-modal" :class="modalName=='payHint'?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">{{$t('payment_log.remind')}}</view>
						<view class="action" @tap="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">
						{{$t('payment_log.is_accomplish')}}
					</view>
					<view class="flex cu-bar bg-white justify-between">
						<button class="margin-left cu-btn line-green text-green" @tap="goBack">{{$t('common.cancel')}}</button>
						<button class="margin-right cu-btn bg-green margin-left" @tap="goBack">{{$t('good_indent.state.accomplish')}}</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import GoodIndent from '../../api/goodIndent'
	import Pay from '../../api/pay'
	import User from '../../api/user';
	import { micromessenger } from 'utils'
	import {
	  authMsg
	} from '../../utils'
	import {
	    mapMutations  
	} from 'vuex';
	export default {
		data() {
			return {
				confirmDisabled: false,
				id: '',
				payType: 'weixin',
				orderInfo: {
					total: 0,
					user: {
						money: 0
					}
				},
				index:0,
				jweixin:null,
				modalName: null,
				jweixin:null,
				user: {},
				paySuccess: `/pages/money/paySuccess`
			};
		},
		computed: {
		
		},
		onLoad(options) {
			if(!options.id){
				this.$api.msg(this.$t('common.arguments'))
				return false
			}
			this.id = options.id
			// #ifdef H5
			if(micromessenger()){
				this.getWeixin()
			}
			// #endif
		},
		onShow(){
			uni.setNavigationBarTitle({
				title: this.$t('money.pay.title')
			})
			this.loginCheck()
			this.getList()
			this.getUser()
		},
		methods: {
			...mapMutations(['loginCheck']),
			getUser(){
				const that = this
				User.detail(function(res){
					that.user = res
				})
			},
			getList(){
				const that = this
				GoodIndent.pay(this.id,function(res){
					that.orderInfo = res
					if(res.state !== 1 && res.state !== 4){
						uni.redirectTo({
							url: that.paySuccess
						})
					}
				})
			},
			//选择支付方式
			changePayType(type) {
				this.payType = type;
			},
			showModal(e) {
				this.modalName = e
			},
			hideModal(e) {
				this.modalName = null
			},
			goBack(){
				this.hideModal()
				this.getList()
			},
			getWeixin(){
				this.jweixin = require('jweixin-module')
				const that = this
				JsSdk.buildConfig(function(res){
					that.jweixin.config(res)
					that.jweixin.error(function(res){
					  console.log('失败')
					})
				})
			},
			//确认支付
			confirm: async function() {
				const that = this
				this.confirmDisabled = true
				if(this.payType === 1) {
					Pay.balancePay({
						id: this.id
					},function(res){
						authMsg(['4iOC-HyjJeKK5HiYORcOtrKHvu2Ho1ScVF0aqP3KkzQ'])
						that.confirmDisabled = false
						if(!that.user.email && !that.user.wechat){
							uni.showModal({
							  title: that.$t('common.hint'),
							  content: that.$t('payment_log.notification_enabled'),
							  success (res) {
								if (res.confirm) {
								  uni.redirectTo({
									url: '/pages/set/message'
								  })
								} else if (res.cancel) {
								  uni.redirectTo({
									url: that.paySuccess
								  })
								}
							  }
							})
						}else{
							uni.redirectTo({
								url: that.paySuccess
							})
						}
					})
				} else {
					// #ifdef H5
					if(micromessenger()){
						Pay.unifiedPayment({
							platform: this.payType,
							type: 'goodsIndent',
							trade_type: 'JSAPI',
							id: this.id,
						},function(res){
							that.jweixin.chooseWXPay({
							  appId:res.msg.appId,
							  timestamp: res.msg.timestamp,
							  nonceStr: res.msg.nonceStr,
							  package: res.msg.package,
							  signType: res.msg.signType,
							  paySign: res.msg.paySign,
							  success: function (res) {
								uni.redirectTo({
									url: that.paySuccess
								})
							  },
								fail(res) {
									that.$api.msg(that.$t('payment_log.payment_failure'))
									that.confirmDisabled = false
								}
							})
						},function(error){
							that.$api.msg(error.message)
							that.confirmDisabled = false
						})
					} else {
						Pay.unifiedPayment({
							platform: this.payType,
							type: 'goodsIndent',
							trade_type: 'MWEB',
							id: this.id,
						},function(res){
							that.confirmDisabled = false
							that.showModal('payHint')
							window.location.href = res.mweb_url
						},function(error){
							that.$api.msg(error.message)
							that.confirmDisabled = false
						})
					}
					// #endif
					// #ifdef MP
					Pay.unifiedPayment({
						id: this.id,
						platform: this.payType,
						trade_type: 'JSAPI',
						type: 'goodsIndent'
					},function(res){
						uni.requestPayment({
							timeStamp: res.msg.timestamp,
							nonceStr: res.msg.nonceStr,
							package: res.msg.package,
							signType: res.msg.signType,
							paySign: res.msg.paySign,
							success(res) {
							  // console.log(res)
							  // 订阅消息
							  authMsg(['4iOC-HyjJeKK5HiYORcOtrKHvu2Ho1ScVF0aqP3KkzQ'])
							  if(!that.user.email && !that.user.wechat){
							  	uni.showModal({
							  	  title: that.$t('common.hint'),
							  	  content: that.$t('payment_log.notification_enabled'),
							  	  success (res) {
							  	    if (res.confirm) {
							  	      uni.redirectTo({
							  	      	url: '/pages/set/message'
							  	      })
							  	    } else if (res.cancel) {
							  	      uni.redirectTo({
							  	      	url: that.paySuccess
							  	      })
							  	    }
							  	  }
							  	})
							  }else{
							  	uni.redirectTo({
							  		url: that.paySuccess
							  	})
							  }
							},
							fail(res) {
								that.$api.msg(that.$t('payment_log.payment_failure'))
								that.getList()
							}
						})
						
					},function(error){
						that.$api.msg(error.message)
						that.confirmDisabled = false
					})
					// #endif
				}
			},
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price{
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;
			&:before{
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;
		
		.type-item{
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position:relative;
		}
		
		.icon{
			width: 100upx;
			font-size: 52upx;
		}
		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}
		.icon-weixinzhifu {
			color: #36cb59;
		}
		.icon-alipay {
			color: #01aaef;
		}
		.tit{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

</style>
