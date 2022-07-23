<template>
	<view class="content">
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="{current: tabCurrentIndex == item.state}"
				@click="tabClick(item.state)"
			>
				{{item.text}}
			</view>
		</view>
		<!-- 列表-->
		<view class="list-scroll-content">
			<view class="order-item" v-for="(item,index) in list" :key="index">
				<view class="i-top b-b">
					<text class="time">{{item.created_at}}</text>
					<text class="state" :class="item.class">{{item.state_show}}</text>
					<text
						v-if="item.state===4 || item.state===5 || item.state===6 || item.state===7"
						class="del-btn yticon icon-iconfontshanchu1"
						@tap="deleteOrder(index)"
					></text>
				</view>
				<view>
					<view v-for="(goodsItem, goodsIndex) in item.goods_list" :key="goodsIndex">
						<view @tap="goShowOrder(item)" class="goods-box-single">
							<image class="goods-img" :src="goodsItem.img | smallImage" mode="aspectFill" lazy-load></image>
							<view class="right">
								<text class="title clamp">{{goodsItem.name}}</text>
								<text class="attr-box clamp">{{goodsItem.specification}}</text>
								<text><text class="text-red text-price padding-right">{{goodsItem.price}}</text><text>x {{goodsItem.number}}</text></text>
							</view>
						</view>
						<view v-if="item.state === 12" class="action-box b-t">
								<button class="action-btn recom" @tap="goForemanScore()">邀请拼单</button>
								<!-- 拼团分享-->
								<foreman-qr-code :sid="goodsItem.id" :show="foremanShow" @changeShow="changeShow"></foreman-qr-code>
						</view>
					</view>
					<view class="price-box" v-if="item.remark">{{item.remark}}</view>
					<view class="price-box">
						共
						<text class="num">{{item.goods_list.length}}</text>
						件商品
						订单总额
						<text class="num">{{item.total | 1000}}</text>
						元
					</view>
				</view>
				<view class="action-box b-t">
					<block v-if="item.state === 1">
						<button class="action-btn" @tap="cancelOrder(item)">取消订单</button>
					</block>
					<block v-if="item.state === 1">
						<button class="action-btn recom" @tap="goPay(item)">立即支付</button>
					</block>
					<block v-if="item.state === 3">
						<button class="action-btn recom" @tap="confirmReceipt(item)">确认收货</button>
					</block>
					<block v-if="item.state === 10">
						<button class="action-btn recom" @tap="goScore(item)">立即评价</button>
					</block>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
		</view>
	</view>
</template> 

<script>
	import {mapMutations} from 'vuex'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import GoodIndent from '../../api/goodIndent'
	import {verifyPlugin} from '@/api/plugin'
	import ForemanQrCode from '@/pages/groupPurchase/components/qrCode'
	export default {
		components: {
			uniLoadMore,
			empty,
			ForemanQrCode
		},
		data() {
			return {
				CustomBar: 0,
				tabCurrentIndex: 0,
				page:1,
				modalName: '',
				swiperTab: false,
				loadingType: false,
				list: [],
				navList: [{
						state: 0,
						text: '全部'
					},
					{
						state: 1,
						text: '待付款'
					},
					{
						state: 2,
						text: '待发货'
					},
					{
						state: 3,
						text: '待收货'
					},
					{
						state: 5,
						text: '已完成'
					}
				],
				foremanShow: false
			};
		},
		
		onLoad: function(options) {
			if(options.state){
				this.tabCurrentIndex = options.state
			}
			this.getVerifyPlugin()
		},
		onShow(){
			this.loginCheck()
			this.loadData()
		},
		computed: {
			
		},
		methods: {
			...mapMutations(['loginCheck']),
			//设置导航
			getVerifyPlugin(){
				const that = this
				verifyPlugin(['comment','groupPurchase'],function(res){
					if(res.comment){
						that.navList.push({
							state: 10,
							text: '待评价'
						})
					}
					if(res.groupPurchase){
						that.navList.splice(2, 0, {
							state: 12,
							text: '待成团'
						})
					}
				})
			},
			//获取订单列表
			async loadData(type='add', loading) {
				// 下拉刷新
				if(type === 'refresh'){
					this.page = 1
					this.list = [];
				}
				//没有更多直接返回
				if(type === 'add'){
					if(this.loadingType === 'nomore'){
						return;
					}
					this.loadingType = 'loading';
				}else{
					this.loadingType = 'more'
				}
				
				const that =this
				await GoodIndent.getList({
					limit: 5,
					page: that.page,
					index: this.tabCurrentIndex,
					sort: '+created_at'
				},function(res){
					that.list = that.list.concat(res.data)
					if (res.last_page > that.page){
						that.page ++
						that.loadingType  = 'more'
					} else {
						that.loadingType  = 'nomore'
					}
					that.list.forEach(item=>{
						switch(item.state){
							case 1:
							item.class= 'text-orange'
							break;
							case 2:
							item.class= 'text-red'
							break;
							case 3:
							item.class= 'text-green'
							break;
							case 4:
							item.class= 'text-brown'
							break;
						}
						item.goods_list.forEach(items=>{
							if(items.good_sku){
                items.specification = ''
								items.good_sku.product_sku.forEach(item2=>{
									if(items.specification){
										items.specification+= item2.value + ';'
									}else{
										items.specification = item2.value + ';'
									}
								})
								items.specification = items.specification.substr(0,items.specification.length-1)
							}
						})
					})
				})
				
				if(type === 'refresh'){
					that.loading = false
					setTimeout(function() {
						that.loading = true
					}, 500)
					if(loading == 1){
						uni.hideLoading()
					}else{
						uni.stopPullDownRefresh();
					}
				}
			},
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index
				this.loadData('refresh')
			},
			//删除订单
			deleteOrder(index){
				const that = this
				uni.showModal({
				    title: '提示',
				    content: '是否确认删除订单？',
				    success: function (res) {
						if (res.confirm) {
							GoodIndent.destroy(that.list[index].id,function(res){
								that.list.splice(index, 1)
								that.$api.msg(`删除成功`)
								uni.hideLoading()
							})
						}
				    }
				})
			},
			//去支付
			goPay(item){
				uni.navigateTo({
					url: '/pages/money/pay?id='+item.id
				})
			},
			//取消订单
			cancelOrder(item){
				const that = this
				uni.showModal({
				    title: '提示',
				    content: '是否确认取消订单？',
				    success: function (res) {
						if (res.confirm) {
							GoodIndent.cancel(item.id,function(res){
								that.$api.msg(`操作成功`)
								that.refreshOderList()
							})
						}
				    }
				})
				
			},
			//订单展示
			goShowOrder(res){
				uni.navigateTo({
					url: `/pages/indent/detail?id=${res.id}`
				})
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			confirmReceipt(item){
				const that = this
				uni.showModal({
				    title: '提示',
				    content: '是否确认收货？',
				    success: function (res) {
						if (res.confirm) {
							GoodIndent.receipt(item.id,function(res){
								that.$api.msg(`操作成功`)
								that.refreshOderList()
							})
						}
				    }
				})
				
			},
			//下拉刷新
			onPullDownRefresh(){
				this.loadData('refresh');
			},
			//加载更多
			onReachBottom(){
				this.loadData();
			},
			// 评价
			goScore(item){
				uni.navigateTo({
					url: `/pages/comment/score?id=${item.id}`
				})
			},
			//评价成功后回调
			refreshOderList(){
				// 需要重新加载
				this.loadData('refresh')
			},
			// 拼团分享
			goForemanScore(){
				this.foremanShow = true
			},
			changeShow(val){
				this.foremanShow = val
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
