<template>
	<view>
		<view v-if="data.length === 0">
			<view class="no-data flex justify-center">暂时没有评价哦~</view>
		</view>
		<block v-else>
			<view class="cu-card dynamic no-card" v-for="(item, index) in data" :key="index">
				<view class="cu-item shadow">
					<view class="cu-list menu-avatar">
						<view class="cu-item margin-top margin-bottom">
							<image class="cu-avatar round lg" :src="item.comment.portrait || '/static/missing-face.png'"  mode="aspectFill" lazy-load></image>
							<view class="content flex-sub">
								<view>{{item.comment.name}}</view>
								<view class="text-gray text-sm flex justify-between">
									{{item.comment.created_at.split(' ')[0]}}
								</view>
								<view class="text-gray text-sm">
									<span v-for="(ite,ind) in item.good_sku.product_sku" :key="ind" class="padding-right-xs">
										{{ite.key}}:{{ite.value}}
									</span>
								</view>
							</view>
						</view>
					</view>
					<view class="text-content margin-top-sm">
						{{item.comment.details}}
					</view>
					<block v-if="item.comment.resources_many.length > 0">
						<view class="grid flex-sub padding-lr grid-square" :class="'col-'+item.comment.resources_many.length">
							<view class="bg-img only-im" :style="'background-image:url('+ite.img+');'"
							 @tap="ViewImage(inde,index)"
							 v-for="(ite,inde) in item.comment.resources_many" :key="inde">
							</view>
						</view>
					</block>
					<view class="text-gray bg-gray text-sm text-left margin padding-sm" v-if="item.comment.reply">
						<view>掌柜回复：</view>
						<view>{{item.comment.reply.details}}</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
		</block>
	</view>
</template>

<script>
	import Comment from '../../api/comment'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				data: [],
				page:1,
				id: 0,
				loadingType: 'more'
			}
		},
		onLoad: function(options) {
			let id = options.id;
			if (id) {
				this.id = id
				this.loadData();
			}
		},
		methods: {
			//获取列表
			loadData(type){
				const that = this
				Comment.goodEvaluate({
					limit: 8,
					page: this.page,
					good_id:that.id
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
			// 预览图片
			ViewImage(ind,index) {
				console.log(this.data[index].comment.resources_many[ind].img)
				uni.previewImage({
					urls: this.data[index].comment.resources_many.map((ite)=>{return ite.img}),
					current: this.data[index].comment.resources_many[ind].img
				});
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
		padding: 0 24upx;
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
