<template>  
    <view class="container">  
		
		<view class="user-section">
			<image class="bg" src="/static/user-bg.jpg"></image>
			<view class="user-info-box">
				<view class="portrait-box">
					<image class="portrait" :src="user.portrait || '/static/missing-face.png'" lazy-load></image>
				</view>
				<view class="info-box">
					<text v-if="user.nickname || user.platform" class="username">{{user.nickname || user.platform + '用户'}}</text>
					<text @click="navTo()" class="username" v-else>去登录</text>
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
					<text>{{$t('user.balance')}}</text>
				</view>
			</view>
			<!-- 订单 -->
			<view class="order-section">
				<view class="order-item" @click="navTo('/pages/indent/list?state=0')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-shouye"><text v-if="quantity.all" class="cu-tag badge">{{quantity.all}}</text></text>
					<text>{{$t('good_indent.state.all')}}</text>
				</view>
				<view class="order-item" @click="navTo('/pages/indent/list?state=1')"  hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-daifukuan"><text v-if="quantity.obligation" class="cu-tag badge">{{quantity.obligation}}</text></text>
					<text>{{$t('good_indent.state.pay')}}</text>
				</view>
				<view class="order-item" @click="navTo('/pages/indent/list?state=2')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-gouwuche_"><text v-if="quantity.waitdeliver" class="cu-tag badge">{{quantity.waitdeliver}}</text></text>
					<text>{{$t('good_indent.state.deliver')}}</text>
				</view>
				<view class="order-item" @click="navTo('/pages/indent/list?state=3')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-yishouhuo"><text v-if="quantity.waitforreceiving" class="cu-tag badge">{{quantity.waitforreceiving}}</text></text>
					<text>{{$t('good_indent.state.take')}}</text>
				</view>
			</view>
			<!-- 浏览历史 -->
			<view class="history-section icon">
				<view class="sec-header">
					<text class="yticon icon-lishijilu"></text>
					<text>{{$t('user.browsing_history')}}</text>
				</view>
				<scroll-view scroll-x class="h-list">
					<image v-for="(item, index) in browseList" :key="index" v-if="item.good" @click="navTo('/pages/product/detail?id=' + item.good_id)" :src="item.good.resources.img | smallImage" mode="aspectFill" lazy-load></image>
				</scroll-view>
				<list-cell icon="icon-iconfontweixin" iconColor="#e07472" :title="$t('user.bill')" @eventClick="navTo('/pages/finance/bill')"></list-cell>
				<list-cell icon="icon-dizhi" iconColor="#5fcda2" :title="$t('user.site')" @eventClick="navTo('/pages/address/address')"></list-cell>
				<list-cell icon="icon-shoucang_xuanzhongzhuangtai" :title="$t('user.collect')" iconColor="#54b4ef" @eventClick="navTo('/pages/user/collect')"></list-cell>
				<list-cell icon="icon-comment" iconColor="#e07472" :title="$t('user.inform')" :tips="noticeNumber ? noticeNumber : null" @eventClick="navTo('/pages/notice/notice')"></list-cell>
				<list-cell icon="icon-shezhi1" iconColor="#e07472" :title="$t('user.set')" @eventClick="navTo('/pages/set/set')"></list-cell>
				<list-cell cuIcon="cuIcon-global" iconColor="#e07472" :title="$t('set.multilingual')" @eventClick="modalName = 'multilingualModal'"></list-cell>
			</view>
			<view v-if="copyright !== '1'" style="padding-top: 40rpx;text-align: center;color: #c4c3c3;">DSWJCMS提供技术支持</view>
		</view>
		<view class="cu-modal" :class="modalName=='multilingualModal'?'show':''" @tap="modalName = null">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-list menu text-left">
					<view class="cu-item" v-for="(item,index) in locales" :key="index" @click="setLanguage(item)">
						<label class="flex justify-between align-center flex-sub">
							<view class="flex-sub">{{item.name}}</view>
							<i v-if="language === item.code" class="text-green cuIcon-check"></i>
						</label>
					</view>
				</view>
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
				copyright: '1',
				quantity: {
					all: 0,
					obligation: 0,
					waitdeliver: 0,
					waitforreceiving: 0
				},
				modalName: '',
				locales: [
					{
						code: 'en',
						iso: 'en-US',
						name: 'English'
					},
					{
						code: 'zh',
						iso: 'zh-CN',
						name: '中文'
					}
				],
				language: uni.getStorageSync('language')
			}
		},
		onShow(){
			this.getlist()
			uni.setNavigationBarTitle({
				title: this.$t('tab_bar.3')
			})
		},
		onLoad(){
			this.getAuthorization();
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
			getlist(){
				const that = this
				if(that.hasLogin){
					that.getUser()
					that.browse()
					that.noticeConut()
					that.getQuantity()
				} else {
					that.browseList = []
					that.user = {}
					that.noticeNumber = null
					that.quantity = {
						all: 0,
						obligation: 0,
						waitdeliver: 0,
						waitforreceiving: 0
					}
				}
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
			setLanguage(res){
				getApp().setLanguage(res)
				this.modalName = null
				this.language = res.code
				this.getlist()
				this.getAuthorization()
				uni.setNavigationBarTitle({
					title: this.$t('tab_bar.3')
				})
			},
			getAuthorization(){
				const that = this
				User.authorization(function(res){
					that.copyright = res
				})
			}
		}
 }
</script>  
<style lang='scss'>
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
		background: linear-gradient(to left, rgba(0,0,0,.7), rgba(0,0,0,.8));
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
			background: linear-gradient(to left, #f9e6af, #ffd465);
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
</style>
