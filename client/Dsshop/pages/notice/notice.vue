<template>
	<view>
		<view v-if="data.length === 0">
			<view class="no-data flex justify-center">暂时没有通知哦~</view>
		</view>
		<block v-else>
			<view class="notice-item" v-for="(item, index) in data" :key="index">
				<text class="time">{{item.created_at}}</text>
				<view class="content">
					<text class="title">{{item.data.title}}</text>
					<block v-if="item.data.type === 2">
						<view class="text-center text-gray padding-bottom">付款金额</view>
						<view class="text-center text-price text-sl padding-bottom padding-top">{{item.data.price/100 | 1000}}</view>
					</block>
					<view class="padding-bottom" v-if="item.data.list.length > 0" v-for="(items, indexs) in item.data.list" :key="indexs">
						<text class="text-gray padding-right">{{items.keyword}}</text><text v-if="items.copy" @click="setCopy(items.data)">{{items.data}}</text><text v-else>{{items.data}}</text>
					</view>
					<text class="introduce" v-if="item.data.remark">
						{{item.data.remark}}
					</text>
					<view class="bot b-t" v-if="item.data.url" @click="goNavigator(item.data.url)">
						<text>查看详情</text>
						<text class="more-icon yticon icon-you"></text>
					</view>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
		</block>
	</view>
</template>

<script>
	import Notification from '../../api/notification'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import {
	    mapMutations  
	} from 'vuex';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				data: [],
				page:1,
				loadingType: 'more'
			}
		},
		onLoad: function(options) {
			this.loadData()
		},
		onShow(){
			this.loginCheck()
		},
		methods: {
			...mapMutations(['loginCheck']),
			//获取列表
			loadData(type){
				const that = this
				Notification.getList({
					limit: 8,
					page: this.page,
					sort: '-created_at'
				},function(res){
					that.data = that.data.concat(res.data)
					if (res.last_page > that.page){
						that.page ++
						//判断是否还有数据， 有改为 more， 没有改为noMore
						that.loadingType = 'more'
					} else {
						that.loadingType = 'noMore'
					}
					if(type === 'pull'){
						setTimeout(function () {
							uni.stopPullDownRefresh();
						}, 1000)
					}
				})
			},
			// 复制内容
			setCopy(res){
				// #ifndef H5
				uni.setClipboardData({
				    data: res,
				    success: function () {
				        
				    }
				})
				// #endif
			},
			goNavigator(url){
				// 为了兼容老版本
				uni.navigateTo({
					url: url.replace('order\/showOrder','indent\/detail')
				})
			},
			onPullDownRefresh() {
				this.data = []
				this.page = 1
				this.loadData('pull')
			},
			onReachBottom(){
				if(this.loadingType !== 'noMore'){
					this.loadData()
				}
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #f7f7f7;
		padding-bottom: 30upx;
	}

	.notice-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.time {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80upx;
		padding-top: 10upx;
		font-size: 26upx;
		color: #7d7d7d;
	}

	.content {
		width: 710upx;
		padding: 20upx 0 0 24upx;
		background-color: #fff;
		border-radius: 4upx;
	}

	.title {
		display: flex;
		align-items: center;
		height: 90upx;
		font-size: 32upx;
		color: #303133;
	}

	.img-wrapper {
		width: 100%;
		height: 260upx;
		position: relative;
	}

	.pic {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 6upx;
	}

	.cover {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		font-size: 36upx;
		color: #fff;
	}

	.introduce {
		display: inline-block;
		padding: 16upx 0;
		font-size: 28upx;
		color: #606266;
		line-height: 38upx;
	}

	.bot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
		font-size: 24upx;
		color: #707070;
		position: relative;
	}

	.more-icon {
		font-size: 32upx;
	}
	.no-data{
		padding-top:400upx;
		font-size: 32upx;
	}
</style>
