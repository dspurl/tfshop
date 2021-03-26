<template>
	<view class="app">
		<view v-if="orderInfo.state === 4">
			<view class="price-box">
				<text>订单已失效</text>
			</view>
		</view>
		<view v-else>
			<view class="price-box">
				<text>支付金额</text>
				<text class="price">{{orderInfo.total | 1000}}</text>
				<text class="padding-top">订单失效时间</text>
				<uni-countdown color="#fa436a" splitorColor="#fa436a" :show-day="orderInfo.day ? true : false" :showColon="false" :day="orderInfo.day" :hour="orderInfo.hour" :minute="orderInfo.minute" :second="orderInfo.second"></uni-countdown>
			</view>
			
			<view class="pay-type-list">
			
				<view class="type-item b-b" @click="changePayType('weixin')">
					<text class="icon yticon icon-weixinzhifu"></text>
					<view class="con">
						<text class="tit">微信支付</text>
						<text>推荐使用微信支付</text>
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
						<text class="tit">预存款支付</text>
						<text>可用余额 ¥{{orderInfo.user.money | 1000}}</text>
					</view>
					<label class="radio">
						<radio value="" color="#fa436a" :checked="payType == 1" />
						</radio>
					</label>
				</view>
			</view>
			
			<button class="mix-btn" :disabled="confirmDisabled" @click="confirm">确认支付</button>
			<view class="cu-modal" :class="modalName=='payHint'?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">提醒</view>
						<view class="action" @tap="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding-xl">
						是否已完成支付
					</view>
					<view class="flex cu-bar bg-white justify-between">
						<button class="margin-left cu-btn line-green text-green" @tap="goBack">取消</button>
						<button class="margin-right cu-btn bg-green margin-left" @tap="goBack">已完成</button>
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
				user: {}
			};
		},
		computed: {
		
		},
		onLoad(options) {
			if(!options.id){
				this.$api.msg('参数有误')
				return false
			}
			this.id = options.id
		},
		onShow(){
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
							url: '/pages/money/paySuccess'
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
				/* uni.redirectTo({
					url: '/pages/indent/list?state=2'
				}) */
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
							  title: '提示',
							  content: '您未打开通知功能，无法及时接收重要通知哦，是否现在去开启？',
							  success (res) {
								if (res.confirm) {
								  uni.redirectTo({
									url: '/pages/set/message'
								  })
								} else if (res.cancel) {
								  uni.redirectTo({
									url: '/pages/money/paySuccess'
								  })
								}
							  }
							})
						}else{
							uni.redirectTo({
								url: '/pages/money/paySuccess'
							})
						}
					})
				} else {
					// #ifdef H5
					Pay.unifiedPayment({
						platform: this.payType,
						type: 'goodsIndent',
						trade_type: 'MWEB',
						id: this.id,
					},function(res){
						that.confirmDisabled = false
						that.showModal('payHint')
						window.location.href = res.mweb_url
					})
					// #endif
					// #ifdef MP
					Pay.unifiedPayment({
						id: this.id,
						platform: this.payType,
						trade_type: 'JSAPI',
						type: 'goodsIndent'
					},function(res){
						that.confirmDisabled = false
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
							  	  title: '提示',
							  	  content: '您未打开通知功能，无法及时接收重要通知哦，是否现在去开启？',
							  	  success (res) {
							  	    if (res.confirm) {
							  	      uni.redirectTo({
							  	      	url: '/pages/set/message'
							  	      })
							  	    } else if (res.cancel) {
							  	      uni.redirectTo({
							  	      	url: '/pages/money/paySuccess'
							  	      })
							  	    }
							  	  }
							  	})
							  }else{
							  	uni.redirectTo({
							  		url: '/pages/money/paySuccess'
							  	})
							  }
							},
							fail(res) {
								that.$api.msg('支付失败，请重新支付')
							}
						})
						
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
				content: '￥';
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
