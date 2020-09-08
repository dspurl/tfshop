<template>
	<view class="content">
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="{current: tabCurrentIndex === index}"
				@click="tabClick(index)"
			>
				{{item.text}}
			</view>
		</view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view 
					class="list-scroll-content" 
					scroll-y
					@scrolltolower="loadData"
				>
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
					
					<!-- 列表 -->
					<view class="padding-xl bg-white">
						<coolc-coupon @getCoupon="getCoupon" v-for="(item, index) in tabItem.orderList" :key="index" v-bind:item="item" types="use" theme="#ff6c00" color="#ffffff" solid="#ff6c00"></coolc-coupon>
					</view>
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
					
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template> 

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import UserCouponApi from '../../api/userCoupon'
	import coolcCoupon from '@/components/coupon/coolc-coupon.vue';
	export default {
		components: {
			uniLoadMore,
			empty,
			coolcCoupon
		},
		data() {
			return {
				CustomBar: 0,
				tabCurrentIndex: 0,
				page:1,
				modalName: '',
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '未使用',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '已使用',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 3,
						text: '已失效',
						loadingType: 'more',
						orderList: []
					}
				],
			};
		},
		
		onLoad: function(options) {
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.tabCurrentIndex = +options.state;
			// #ifndef MP
			this.CustomBar = 42
			this.loadData()
			// #endif
			// #ifdef MP
			if(options.state == 0){
				this.loadData()
			}
			// #endif
			
		},
		computed: {
			
		},
		methods: {
			//列表
			async loadData(source,search){
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state;
				if(source === 'tabChange' && navItem.loaded === true){
					return;
				}
				
				if(navItem.loadingType === 'loading'){
					//防止重复加载
					return;
				}
				if(navItem.loadingType === 'noMore'){
					//无更多数据时跳出
					return;
				}
				navItem.loadingType = 'loading';
				let userCouponList = []
				let that =this
				await UserCouponApi.getList({
					limit: 8,
					page: this.page,
					index: index					
				},function(res){
					userCouponList = res.data
					if (res.last_page > that.page){
						that.page ++
						//判断是否还有数据， 有改为 more， 没有改为noMore
						that.$set(navItem, 'loadingType', 'more');
					} else {
						that.$set(navItem, 'loadingType', 'noMore');
					}
					userCouponList.forEach(item=>{
						let data = {
							id: item.coupon.id,
							money: item.coupon.cost/100,
							title: item.coupon.explain,
							url: '/pages/index/index',
							end_time: item.coupon.endtime.split(' ')[0].replace(/-/g,"."),
						}
						if(item.state === 1){
							data.state = '2'
						} else if(item.state === 2){
							data.state = '3'
						}else{
							data.state = '1'
						}
						navItem.orderList.push(data);
					})
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					that.$set(navItem, 'loaded', true);
				})
				
			}, 

			//swiper 切换
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index
				this.page = 1
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
		height: calc(100% - 40px);
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
	/deep/ .get-btn{
		right:10upx !important;
	}
</style>
