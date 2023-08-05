<template>
	<view class="content">
		<view class="fixed cu-bar search bg-white" :style="{paddingTop:navHeight+'px',paddingBottom:'10px'}">
			<view class="margin-left text-xl">
				<text @click="goHome" class="cuIcon-shop text-black"></text>
			</view>
			<view @click="navTo('/pages/search/index')" class="search-form round">
				<text class="cuIcon-search"></text>
				<input disabled :adjust-position="false" type="text" :placeholder="$t('category.search')" confirm-type="search"></input>
			</view>
			<view @click="navTo('/pages/notice/notice')" class="action">
				<view class='cuIcon cuIcon-notice'>
					<view v-if="is_notice" class='cu-tag badge'></view>
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="left-aside" :style="{paddingTop: (navHeight+50)+'px'}">
			<view v-for="(item, index) in flist" :key="item.id" class="f-item" :class="{active: item.id === currentId}" @click="tabtap(item,index)">
				{{item.name}}
			</view>
		</scroll-view>
		<scroll-view :style="{paddingTop: (navHeight+50)+'px'}" scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop" @scrolltolower="lower">
			<template v-if="tlist.length > 0">
				<template v-if="slist.length > 0">
					<view v-for="item in slist" :key="item.id" class="s-list" :id="'main-'+item.id">
						<text class="s-item">{{item.name}}</text>
						<view class="t-list">
							<view @click="navToList(item.id, titem.id)" v-if="titem.pid === item.id" class="t-item text-cut" v-for="titem in tlist" :key="titem.id">
								<image :src="titem.resources.img  | smallImage(80)" lazy-load></image>
								<text class="text-cut text-center">{{titem.name}}</text>
							</view>
						</view>
					</view>
				</template>
				<template v-else>
					<view v-for="item in flist" :key="item.id" class="s-list" :id="'main-'+item.id">
						<text class="s-item"></text>
						<view class="t-list">
							<view @click="navToList(0, titem.id)" v-if="titem.pid === item.id" class="t-item text-cut" v-for="titem in tlist" :key="titem.id">
								<image mode="aspectFit" :src="titem.resources.img  | smallImage(80)" lazy-load></image>
								<text class="text-cut text-center">{{titem.name}}</text>
							</view>
						</view>
					</view>
				</template>
			</template>
			<template v-else>
				<!-- 只有一级菜单，直接显示商品列表-->
				<!-- 商品列表 -->
				<view class="good-list">
					<view class="good-item" @click="navTo(`/pages/product/detail?id=${item.id}`)" v-for="(item,index) in goodsList" :key="index">
						<view class="img">
							<image :src="item.resources.img | smallImage" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="name">{{item.name}}</view>
							<view class="price-box">
								<view class="price text-red text-bold">{{$t('common.unit')}}{{item.order_price | 1000}}</view>
								<button class="sm cu-btn cuIcon bg-red text-xxl">
									<text class="cuIcon-cart"></text>
								</button>
							</view>
						</view>
					</view>
					<uni-load-more :status="loadingType"></uni-load-more>
				</view>
			</template>
		</scroll-view>
	</view>
</template>

<script>
	import Good from '@/api/good'
	import Notification from '@/api/notification'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import { mapState } from 'vuex';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				navHeight: getApp().globalData.navHeight ? getApp().globalData.navHeight : 10,
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 49,	//一级类目默认选中的ID
				flist: [],
				slist: [],
				tlist: [],
				tap: 0,
				goodsList: [],
				page: 1,
				loadingType: 'more',
				filterIndex: '',
				is_notice: false
			}
		},
		computed: {
			...mapState(['hasLogin'])
		},
		onLoad(){
			
		},
		onShow(){
			this.loadData();
			if(this.hasLogin){
				this.notice()
			}
			uni.setNavigationBarTitle({
				title: this.$t('tab_bar.1')
			})
		},
		methods: {
			async loadData(){
				const that = this
				that.flist = []
				that.slist = []
				that.tlist = []
				// 分类
				await Good.goodCategory({},function(res){
					res.forEach(item=>{
						if(!item.pid){
							that.flist.push(item);  //pid为父级id, 没有pid或者pid=0是一级分类
						}else if(!item.resources){
							that.slist.push(item); //没有图的是2级分类
						}else{
							that.tlist.push(item); //3级分类
						}
					})
					if(that.tlist.length === 0) {
						if(that.flist.length > 0){
							that.currentId = that.flist[0].id
							that.getGood()
						}
						
					}
					that.$nextTick(() => {
						if(!that.sizeCalcState && that.tlist.length > 0){
							that.calcSize();
						}
					})
				})
			},
			//加载商品 ，带下拉刷新和上滑加载
			async getGood(type='add', loading) {
				// 下拉刷新
				if(type === 'refresh'){
					this.page = 1
					this.goodsList = [];
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
			
				let goodsList = [];
				let that =this
				// 商品
				await Good.getList({
					limit: 10,
					category_id: this.currentId,
					page: this.page,
					sort: this.filterIndex
				},function(res){
					that.goodsList = that.goodsList.concat(res.data)
					if (res.last_page > that.page){
						that.page ++
						that.loadingType  = 'more'
					} else {
						that.loadingType  = 'nomore'
					}
				})
			},
			//筛选点击
			tabClick(index){
				if(index){
					if(index === 'sales'){
						this.filterIndex = '-sales'
					}else{
						if(this.filterIndex !== '+order_price'){
							this.filterIndex = '+order_price'
						}else{
							this.filterIndex = '-order_price'
						}
					}
				}else{
					this.filterIndex = ''
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.getGood('refresh', 1);
				uni.showLoading({
					title: this.$t('load_more.content_refresh')
				})
			},
			//一级分类点击
			tabtap(item, index){
				if(this.tlist.length){
					if(!this.sizeCalcState){
						this.calcSize();
					}
					this.tap = 1
					this.currentId = item.id;
					if (this.slist.length>0) {
						let index = this.slist.findIndex(sitem=>sitem.pid === item.id);
						if(this.tabScrollTop === this.slist[index].top){
							this.tabScrollTop = this.slist[index].top+1
						}else{
							this.tabScrollTop = this.slist[index].top
						}
					} else {
						let index = this.flist.findIndex(sitem=>sitem.id === item.id);
						if(this.tabScrollTop === this.flist[index].top){
							this.tabScrollTop = this.flist[index].top+1
						}else{
							this.tabScrollTop = this.flist[index].top
						}
					}
				}else{
					this.currentId = item.id
					this.getGood('refresh', 1);
				}
			},
			//右侧栏滚动
			asideScroll(e){
				if(!this.sizeCalcState && this.tlist.length > 0){
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = null
				if (this.slist.length>0) {
					tabs = this.slist.filter(item=>item.top <= scrollTop).reverse();
					if(tabs.length > 0 && !this.tap){
						this.currentId = tabs[0].pid;
					}
				} else {
					tabs = this.flist.filter(item=>item.top <= scrollTop).reverse();
					if(tabs.length > 0 && !this.tap){
						this.currentId = tabs[0].id;
					}
				}

				this.tap = 0
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let h = 0;
				if (this.slist.length>0) {
					this.slist.forEach(item=>{
						let view = uni.createSelectorQuery().select("#main-" + item.id);
						view.fields({
							size: true
						}, data => {
							item.top = h;
							h += data.height;
							item.bottom = h;
						}).exec();
					})
				} else {
					this.flist.forEach(item=>{
						let view = uni.createSelectorQuery().select("#main-" + item.id);
						view.fields({
							size: true
						}, data => {
							if(h === 0){
								this.currentId = item.id
							}
							item.top = h;
							h += data.height;
							item.bottom = h;
						}).exec();
					})
				}
				this.sizeCalcState = true;
			},
			navToList(sid, tid){
				uni.navigateTo({
					url: `/pages/product/list?fid=${this.currentId}&sid=${sid}&tid=${tid}`
				})
			},
			notice(){
				const that = this
				Notification.unread({},function(res){
					that.is_notice = res ? true : false
				})
			},
			//加载更多
			lower: function(e) {
				this.getGood()
			},
			//返回首页
			goHome(){
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			navTo(url){
				uni.navigateTo({  
					url
				})  
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #ffffff;
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #f6f8fa;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
		&.active{
			color: $base-color;
			background: #ffffff;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
		position: relative;
	}
	.s-item{
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;

		image{
			width: 140upx;
			height: 140upx;
		}
		.text-cut{
			width: 176upx;
		}
	}
	.good-list{
		.good-item{
			display: flex;
			padding: 40rpx 20rpx 0 0;
			.img{
				width: 160rpx;
				height: 160rpx;
				overflow: hidden;
				margin-right: 20rpx;
				image{
					width: 100%;
					height: 100%;
					opacity: 1;
				}
			}
			.info{
				flex: 1;
				min-width:0;
				.name{
					overflow:hidden;
					text-overflow:ellipsis;
					display:-webkit-box;
					-webkit-box-orient:vertical;
					-webkit-line-clamp:2;
					height: 76rpx;
					margin-bottom: 30rpx;
				}
				.price-box{
					display: flex;
					align-items:center;
					.price{
						flex: 1;
					}
				}
			}
		}
	}
	.cuIcon{
		position: relative;
		.cu-tag{
			top: auto;
			right: auto;
		}
	}
</style>
