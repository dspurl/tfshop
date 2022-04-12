<template>
	<view class="content">
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="{current: tabCurrentIndex == index}"
				@click="tabClick(index)"
			>
				{{item.text}}
			</view>
		</view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" :disable-touch="true">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view 
					class="list-scroll-content" 
					scroll-y
					@scrolltolower="loadData"
				>
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
					
					<!-- 订单列表 -->
					<view 
						v-for="(item,index) in tabItem.orderList" :key="index"
						class="order-item"
					>
						<view class="i-top b-b">
							<text class="time">{{item.created_at}}</text>
							<text class="state" :class="item.class">{{item.state_show}}</text>
							<text
								v-if="item.state===4 || item.state===5 || item.state===6 || item.state===7"
								class="del-btn yticon icon-iconfontshanchu1"
								@tap="deleteOrder(index)"
							></text>
						</view>
						<view @tap="goShowOrder(item)">
								<view 
								class="goods-box-single"
								v-for="(goodsItem, goodsIndex) in item.goods_list" :key="goodsIndex"
							>
								<image class="goods-img" :src="goodsItem.img | smallImage" mode="aspectFill" lazy-load></image>
								<view class="right">
									<text class="title clamp">{{goodsItem.name}}</text>
									<text class="attr-box clamp">{{goodsItem.specification}}</text>
									<text><text class="text-red text-price padding-right">{{goodsItem.price}}</text><text>x {{goodsItem.number}}</text></text>
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
					 
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
					
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template> 

<script>
	import {mapMutations} from 'vuex'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import GoodIndent from '../../api/goodIndent'
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				CustomBar: 0,
				tabCurrentIndex: 0,
				page:1,
				modalName: '',
				details: {
					startTime: currentDate,
					endTime: currentDate
				},
				swiperTab: false,
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '待发货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 3,
						text: '待收货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 10,
						text: '待评价',
						loadingType: 'more',
						orderList: []
					}
				],
			};
		},
		
		onLoad: function(options) {
			this.tabCurrentIndex = options.state;
		},
		onShow(){
			this.loginCheck()
			this.loadData()
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			...mapMutations(['loginCheck']),
			//获取订单列表
			async loadData(source,search){
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state;
				if(source === 'tabChange' || !source){
					navItem.loadingType = 'more'
					navItem.orderList = []
				}
				
				if(navItem.loadingType === 'loading'){
					//防止重复加载
					return;
				}
				if(navItem.loadingType === 'noMore'){
					//无更多数据时跳出
					return;
				}
				// #ifndef MP-ALIPAY
				navItem.loadingType = 'loading'
				// #endif
				var orderList = []
				let that =this
				await GoodIndent.getList({
					limit: 5,
					page: this.page,
					index: state,
					sort: '+created_at',
					startTime: this.details.startTime,
					endTime: this.details.endTime,
					search: search
					
				},function(res){
					orderList = res.data
					if (res.last_page > that.page){
						that.page ++
						//判断是否还有数据， 有改为 more， 没有改为noMore
						that.$set(navItem, 'loadingType', 'more');
					} else {
						that.$set(navItem, 'loadingType', 'noMore');
					}
					orderList.forEach(item=>{
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
						navItem.orderList.push(item);
					})
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					that.$set(navItem, 'loaded', true);
					that.swiperTab = true
				})
				
			}, 
			//顶部tab点击
			tabClick(index){
				this.swiperTab = false
				this.tabCurrentIndex = index
				this.page = 1
				this.loadData('tabChange')
			},
			//删除订单
			deleteOrder(index){
				const that = this
				uni.showModal({
				    title: '提示',
				    content: '是否确认删除订单？',
				    success: function (res) {
						if (res.confirm) {
							GoodIndent.destroy(that.navList[that.tabCurrentIndex].orderList[index].id,function(res){
								that.navList[that.tabCurrentIndex].orderList.splice(index, 1)
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

			//订单状态文字和颜色
			orderStateExp(state){
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch(+state){
					case 1:
						stateTip = '待付款'; break;
					case 2:
						stateTip = '待发货'; break;
						stateTipColor = '#909399';
						break;
						
					//更多自定义
				}
				return {stateTip, stateTipColor};
			},
			//编辑
			goOrder(res){
				uni.navigateTo({
					url: `/pages/indent/create?id=${res.id}`
				})
			},
			//订单展示
			goShowOrder(res){
				uni.navigateTo({
					url: `/pages/indent/detail?id=${res.id}`
				})
			},
			//关闭订单后重新加载
			refreshOderList(){
				this.navList= [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '待发货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 3,
						text: '待收货',
						loadingType: 'more',
						orderList: []
					},
					// {
					// 	state: 4,
					// 	text: '待评价',
					// 	loadingType: 'more',
					// 	orderList: []
					// },
					// {
					// 	state: 5,
					// 	text: '售后',
					// 	loadingType: 'more',
					// 	orderList: []
					// }
				]
				this.page = 1
				this.loadData()
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
	
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			bindDateChange: function(e) {
				if (e.target.dataset.type == 1) {
					this.details.startTime = e.target.value
				} else {
					this.details.endTime = e.target.value
				}
				
			},
			// 搜索
			getSearch(){
				this.navList= [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '待发货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 3,
						text: '待收货',
						loadingType: 'more',
						orderList: []
					},
				]
				this.hideModal()
				this.loadData(null,1)
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
			// 评价
			goScore(item){
				uni.navigateTo({
					url: `/pages/comment/score?id=${item.id}`
				})
			},
			//评价成功后回调
			refreshOderList(){
				// 需要重新加载
				this.loadData()
			}
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
