<template>
	<view class="content">
		<scroll-view
			class="list-scroll-content" 
			scroll-y
			@scrolltolower="loadData"
		>
			<!-- 空白页 -->
			<empty v-if="navList.length === 0"></empty>
			
			<!-- 订单列表 -->
			<view 
				v-for="(item,index) in navList" :key="index"
				class="order-item"
			>
				<view class="i-top b-b">
					<text class="time">{{item.created_at}}</text>
					<text class="state" :class="{'text-green':item.state === '已兑换'}">{{item.state}}</text>
				</view>
				<view @tap="goShowOrder(item)">
					<view class="goods-box-single">
						<image v-if="item.integral_prize.model_type === 'App\\Models\\v1\\GoodSku'" class="goods-img" :src="item.integral_prize.resource.img" mode="aspectFill" lazy-load></image>
						<image v-else class="goods-img" :src="require('./assets/integral.png')" mode="aspectFill" lazy-load></image>
						<view class="right">
							<text class="title clamp">{{item.integral_prize.name}}</text>
						</view>
					</view>
				</view>
				<view class="action-box b-t">
					<block v-if="item.state === '未兑换'">
						<button class="action-btn recom" @tap="navTo(`/pages/indent/create?integral_draw_log_id=${item.id}`)">下单</button>
					</block>
					<block v-if="item.model_id && item.model_type === 'App\\Models\\v1\\GoodIndent'">
						<button class="action-btn" @tap="navTo(`/pages/indent/detail?id=${item.model_id}`)">查看订单</button>
					</block>
				</view>
			</view>
			 
			<uni-load-more :status="loadingType"></uni-load-more>
			
		</scroll-view>
	</view>
</template> 

<script>
	import {mapMutations} from 'vuex'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import {getList} from '@/api/integralDrawLog'
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				page:1,
				navList: [],
				loadingType: 'more'
			};
		},
		onLoad(){
			this.loginCheck()
			this.loadData()
		},
		methods: {
			...mapMutations(['loginCheck']),
			//获取订单列表
			async loadData(source,search){
				//这里是将订单挂载到tab列表下
				if(source === 'tabChange' || !source){
					this.loadingType = 'more'
					this.navList = []
				}
				
				if(this.loadingType === 'loading'){
					//防止重复加载
					return;
				}
				if(this.loadingType === 'noMore'){
					//无更多数据时跳出
					return;
				}
				// #ifndef MP-ALIPAY
				this.loadingType = 'loading'
				// #endif
				let that =this
				getList({
					limit: 5,
					page: this.page,
					user: true
					
				},function(res){
					console.log('res', res)
					if (res.last_page > that.page){
						that.page ++
						that.loadingType = 'more'
					} else {
						that.loadingType = 'noMore'
					}
					that.navList = that.navList.concat(res.data)
					if(source === 'tabChange'){
						setTimeout(function () {
							uni.stopPullDownRefresh();
						}, 1000)
					}
				})
				
			},
			onPullDownRefresh() {
				this.page = 1
				this.loadData('tabChange')
			},
			navTo(url){
				uni.navigateTo({  
					url
				})  
			},
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	
	.swiper-box{
		height: calc( 100vh - 40px );
	}
	.list-scroll-content{
		height: 100%;
	}
	
	.navbar{
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item{
		height: auto;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right:30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.time{
				flex: 1;
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		/* 多条商品 */
		.goods-box{
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;
			.goods-item{
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}
			.goods-img{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 20upx 0;
			.goods-img{
				display: block;
				width: 120upx;
				height: 120upx;
			}
			.right{
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;
				.title{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}
				.attr-box{
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}
				.price{
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					&:before{
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}
		
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.num{
				margin: 0 8upx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
				&:before{
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
		.action-btn{
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			margin-bottom: 10upx;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: $base-color;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
	}
	
	
	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}
	
	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}
	
	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}
	
	.uni-load-more__img>view {
		position: absolute
	}
	
	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}
	
	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}
	
	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}
	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
		}
	}
	.search{
		position: fixed;
		right: 0;
		top: 50%;
		z-index: 995;
		width:40px;
		height:40px;
		display: flex;
		border-radius: 5px;
	}
	.search .cuIcon-search{
		line-height: 40px;
		margin: 0 auto;
		font-size: 36rpx;
	}
	.cu-modal{
		z-index: 300;
	}
	.add-btn{
		align-items: center;
		justify-content: center;
		height: 80upx;
		margin: 60upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
