<template>  
    <view class="container">  
		
		<view class="user-section">
			<image class="bg" src="/static/user-bg.jpg"></image>
			<view class="user-info-box">
				<view class="portrait-box">
					<image class="portrait" :src="user.portrait || '/static/missing-face.png'" lazy-load></image>
				</view>
				<view class="info-box">
					<text class="username">{{user.nickname || user.cellphone || '游客'}}</text>
				</view>
			</view>
		</view>
		
		<view 
			class="cover-container"
			:style="[{
				transform: coverTransform,
				transition: coverTransition
			}]"
			@touchstart="coverTouchstart"
			@touchmove="coverTouchmove"
			@touchend="coverTouchend"
		>
			<image class="arc" src="/static/arc.png"></image>
			
			<view class="tj-sction">
				<view class="tj-item">
					<text class="num" v-if="user.money">{{user.money| 1000}}</text>
					<text class="num" v-else>0.00</text>
					<text>余额</text>
				</view>
				<view v-if="verify.integral" class="tj-item">
					<text class="num">{{user.integral ? user.integral.available : 0}}</text>
					<text>积分</text>
				</view>
				<!-- 优惠券按钮 -->
				<view v-if="verify.coupon" class="tj-item" @click="navTo('/pages/coupon/list?state=1')">
					<text class="num">{{userCouponCount}}</text>
					<text>优惠券</text>
				</view>
			</view>
			<!-- 订单 -->
			<view class="order-section">
				<view class="order-item" @click="navTo('/pages/indent/list?state=0')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-shouye"><text v-if="quantity.all" class="cu-tag badge">{{quantity.all}}</text></text>
					<text>全部订单</text>
				</view>
				<view class="order-item" @click="navTo('/pages/indent/list?state=1')"  hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-daifukuan"><text v-if="quantity.obligation" class="cu-tag badge">{{quantity.obligation}}</text></text>
					<text>待付款</text>
				</view>
				<view v-if="verify.groupPurchase" class="order-item" @click="navTo('/pages/indent/list?state=12')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-share"><text v-if="quantity.share" class="cu-tag badge">{{quantity.share}}</text></text>
					<text>待成团</text>
				</view>
				<view class="order-item" @click="navTo('/pages/indent/list?state=2')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-gouwuche_"><text v-if="quantity.waitdeliver" class="cu-tag badge">{{quantity.waitdeliver}}</text></text>
					<text>待发货</text>
				</view>
				<view class="order-item" @click="navTo('/pages/indent/list?state=3')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-yishouhuo"><text v-if="quantity.waitforreceiving" class="cu-tag badge">{{quantity.waitforreceiving}}</text></text>
					<text>待收货</text>
				</view>
				<view v-if="verify.comment" class="order-item" @click="navTo('/pages/indent/list?state=10')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-yishouhuo"><text v-if="quantity.remainEvaluated" class="cu-tag badge">{{quantity.remainEvaluated}}</text></text>
					<text>待评价</text>
				</view>
			</view>
			<!-- 抽奖活动-->
			<!-- #ifndef APP-PLUS -->
			<scroll-view v-if="integralDrawList.length" scroll-x class="integral-draw-list">
				<view v-for="(item,index) in integralDrawList" :key="index" class="item" @click="navTo(`/pages/user/integralDraw/index?id=${item.id}`)" hover-class="none">
					<view v-if="item.type === 1" class="dsshop ds-turntable" :class="{failure: item.is_hidden === 0}"></view>
					<view v-else-if="item.type === 2" class="dsshop ds-sudoku" :class="{failure: item.is_hidden === 0}"></view>
					<view v-else class="dsshop ds-slot_machine" :class="{failure: item.is_hidden === 0}"></view>
					<view class="name">{{item.name}}</view>
				</view>
			</scroll-view>
			<!-- #endif -->
			<!-- 浏览历史 -->
			<view class="history-section icon">
				<view class="sec-header">
					<text class="yticon icon-lishijilu"></text>
					<text>浏览历史</text>
				</view>
				<scroll-view scroll-x class="h-list">
					<image v-for="(item, index) in browseList" :key="index" @click="navTo('/pages/product/detail?id=' + item.good_id)" :src="item.good.resources.img | smallImage" mode="aspectFill" lazy-load></image>
				</scroll-view>
				<list-cell icon="icon-iconfontweixin" iconColor="#e07472" title="账单" @eventClick="navTo('/pages/finance/bill')"></list-cell>
				<list-cell v-show="verify.integral" icon="icon-iconfontweixin" iconColor="#54b4ef" title="积分明细" @eventClick="navTo('/pages/integral/index')"></list-cell>
				<list-cell v-show="verify.integralDraw" icon="icon-iconfontweixin" iconColor="#E6A23C" title="中奖记录" @eventClick="navTo('/pages/user/integralDraw/log')"></list-cell>
				<list-cell icon="icon-dizhi" iconColor="#5fcda2" title="地址管理" @eventClick="navTo('/pages/address/address')"></list-cell>
				<list-cell icon="icon-shoucang_xuanzhongzhuangtai" iconColor="#54b4ef" @eventClick="navTo('/pages/user/collect')" title="我的收藏"></list-cell>
				<list-cell icon="icon-comment" iconColor="#e07472" title="通知" :tips="noticeNumber ? noticeNumber : null" @eventClick="navTo('/pages/notice/notice')"></list-cell>
				<list-cell v-show="verify.article" icon="icon-xiaoxi" iconColor="#9789f7" title="帮助中心" @eventClick="navToNoValidation('/pages/article/column')"></list-cell>
				<list-cell v-show="verify.distribution" icon="icon-share" iconColor="#9789f7" @eventClick="navTo('/pages/distribution/share')" title="分享" tips="邀请好友赢10元奖励"></list-cell>
				<list-cell icon="icon-shezhi1" iconColor="#e07472" title="设置" @eventClick="navTo('/pages/set/set')"></list-cell>
			</view>
		</view>
			
		
    </view>  
</template>  
<script>  
	import listCell from '@/components/mix-list-cell';
	import Browse from '../../api/browse';
	import User from '../../api/user';
	import GoodIndent from '../../api/goodIndent';
	import Notification from '../../api/notification'
	import {count as couponCount} from '@/api/coupon'
    import {getList} from '@/api/integralDraw'
    import {verifyPlugin} from '@/api/plugin'
    import {  
        mapState 
    } from 'vuex';  
	let startY = 0, moveY = 0, pageAtTop = true;
    export default {
		components: {
			listCell
		},
		data(){
			return {
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				browseList: [],
				user: {},
				noticeNumber: null,
				quantity: {
					all: 0,
					obligation: 0,
					waitdeliver: 0,
					waitforreceiving: 0,
					remainEvaluated: 0,
					share: 0
				},
				userCouponCount: 0,
				integralDrawList: [],
				verify: {
					coupon: false,
					comment: false,
					integralDraw: false,
					integral: false,
					article: false,
					distribution: false,
					groupPurchase: false
				}
			}
		},
		onLoad(){
			
		},
		onShow(){
			this.getVerifyPlugin()
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/set/set');
			}else if(index === 1){
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		},
		// #endif
        computed: {
			...mapState(['hasLogin','userInfo'])
		},
        methods: {
			getVerifyPlugin(){
				const that = this
				verifyPlugin(['coupon','comment','integral','integralDraw','article','distribution','groupPurchase'],function(res){
					that.verify = res
					if(that.hasLogin){
						that.getUser()
						that.browse()
						that.noticeConut()
						that.getQuantity()
						if(that.verify.coupon){
							that.getUserCouponCount()
						}
						if(that.verify.integralDraw){
							that.getIntegralDraw()
						}
					} else {
						that.browseList = []
						that.user = {}
						that.noticeNumber = null
						that.quantity = {
							all: 0,
							obligation: 0,
							waitdeliver: 0,
							waitforreceiving: 0,
							remainEvaluated: 0
						}
					}
				})
			},
			getUser(){
				const that = this
				User.detail(function(res){
					that.user = res
				})
			},
			browse(){
				const that = this
				Browse.getList({
					limit: 10,
					sort: '-updated_at'
				},function(res){
					that.browseList = res.data
				})
			},
			noticeConut(){
				const that = this
				Notification.unread({},function(res){
					that.noticeNumber = res ? res.toString() : null
				})
			},
			getQuantity(){
				const that = this
				GoodIndent.quantity(function(res){
					that.quantity = res
				})
			},
			async getIntegralDraw(){
				let that = this
				await getList({
					limit: 10,
					page: 1,
					sort: '-created_at'
				},function(res){
					that.integralDrawList = res.data
				})
			},
			navTo(url){
				if(!this.hasLogin){
					url = '/pages/public/login';
				}
				uni.navigateTo({  
					url
				})  
			}, 
			// 不验证跳转
			navToNoValidation(url){
				uni.navigateTo({  
					url
				})  
			}, 
			/**
			 *  会员卡下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e){
				if(pageAtTop === false){
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e){
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if(moveDistance < 0){
					this.moving = false;
					return;
				}
				this.moving = true;
				if(moveDistance >= 80 && moveDistance < 100){
					moveDistance = 80;
				}
		
				if(moveDistance > 0 && moveDistance <= 80){
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend(){
				if(this.moving === false){
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				this.coverTransform = 'translateY(0px)';
			},
			// 可用优惠券数量
			getUserCouponCount(){
				const that = this
				couponCount(function(res){
					that.userCouponCount = res
				})
			}
        }  
    }  
</script>  
<style lang='scss'>
	@import './integralDraw/scss/icon.css';
	%flex-center {
	 display:flex;
	 flex-direction: column;
	 justify-content: center;
	 align-items: center;
	}
	%section {
	  display:flex;
	  justify-content: space-around;
	  align-content: center;
	  background: #fff;
	  border-radius: 10upx;
	}

	.user-section{
		height: 520upx;
		padding: 100upx 30upx 0;
		position:relative;
		.bg{
			position:absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			filter: blur(1px);
			opacity: .7;
		}
	}
	.user-info-box{
		height: 180upx;
		display:flex;
		align-items:center;
		position:relative;
		z-index: 1;
		.portrait{
			width: 130upx;
			height: 130upx;
			border:5upx solid #fff;
			border-radius: 50%;
		}
		.username{
			font-size: $font-lg + 6upx;
			color: $font-color-dark;
			margin-left: 20upx;
		}
	}

	.vip-card-box{
		display:flex;
		flex-direction: column;
		color: #f7d680;
		height: 240upx;
		background: linear-gradient(left, rgba(0,0,0,.7), rgba(0,0,0,.8));
		border-radius: 16upx 16upx 0 0;
		overflow: hidden;
		position: relative;
		padding: 20upx 24upx;
		.card-bg{
			position:absolute;
			top: 20upx;
			right: 0;
			width: 380upx;
			height: 260upx;
		}
		.b-btn{
			position: absolute;
			right: 20upx;
			top: 16upx;
			width: 132upx;
			height: 40upx;
			text-align: center;
			line-height: 40upx;
			font-size: 22upx;
			color: #36343c;
			border-radius: 20px;
			background: linear-gradient(left, #f9e6af, #ffd465);
			z-index: 1;
		}
		.tit{
			font-size: $font-base+2upx;
			color: #f7d680;
			margin-bottom: 28upx;
			.yticon{
				color: #f6e5a3;
				margin-right: 16upx;
			}
		}
		.e-b{
			font-size: $font-sm;
			color: #d8cba9;
			margin-top: 10upx;
		}
	}
	.cover-container{
		background: $page-color-base;
		margin-top: -150upx;
		padding: 0 30upx;
		position:relative;
		background: #f5f5f5;
		padding-bottom: 20upx;
		.arc{
			position:absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}
	}
	.tj-sction{
		@extend %section;
		.tj-item{
			@extend %flex-center;
			flex-direction: column;
			height: 140upx;
			font-size: $font-sm;
			color: #75787d;
		}
		.num{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 8upx;
		}
	}
	.order-section{
		@extend %section;
		padding: 28upx 0;
		margin-top: 20upx;
		.order-item{
			@extend %flex-center;
			width: 120upx;
			height: 120upx;
			border-radius: 10upx;
			font-size: $font-sm;
			color: $font-color-dark;
			.yticon{
				position: relative;
			}
		}
		.yticon{
			font-size: 48upx;
			margin-bottom: 18upx;
			color: #fa436a;
		}
		.icon-shouhoutuikuan{
			font-size:44upx;
		}
	}
	.history-section{
		padding: 30upx 0 0;
		margin-top: 20upx;
		background: #fff;
		border-radius:10upx;
		.sec-header{
			display:flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;
			.yticon{
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}
		.h-list{
			white-space: nowrap;
			padding: 30upx 30upx 0;
			image{
				display:inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}
	}
	.integral-draw-list{
		white-space: nowrap;
		padding: 30rpx 30rpx;
		background: #FFFFFF;
		margin-top:20rpx;
		border-radius: 10rpx;
		.item{
			display:inline-block;
			width: 200rpx;
			margin-right: 20rpx;
			text-align: center;
			.dsshop{
				font-size: 100rpx;
				&.failure{
					filter: grayscale(100%);
				}
			}
			.name{
				font-size: 28rpx;
				margin-top:10rpx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
		}
	}
</style>
