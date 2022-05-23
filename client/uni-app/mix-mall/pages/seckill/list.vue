<template>
	<view class="content">
		<scroll-view scroll-x class="nav" scroll-with-animation :scroll-left="scrollLeft">
			<view class="cu-item" :class="TabCur === index ?'cur':''" v-for="(item,index) in times" :key="index" @tap="tabSelect" :data-id="index">
				<view class="time">{{item.label}}</view>
				<view class="state">{{item.active ? '抢购中' : '即将开始'}}</view>
			</view>
		</scroll-view>
		<view class="list-box">
			<navigator :url='`/pages/product/detail?id=${item.good_id}`' hover-class="none" class="item" v-for="(item,index) in list" :key="index">
				<view class="img">
					<image :src="item.resources.img | smallImage(300)" mode="widthFix"></image>
				</view>
				<view class="info">
					<view class="title">{{ item.name }}</view>
					<view class="progress-box" v-if="item.state === 1">
						<view class="cu-progress round">
							<view class="bg-red" :style="[{ width:loading?`${item.progress}%`:''}]"></view>
						</view>
						<text class="margin-left">{{item.progress}}%</text>
					</view>
					<view class="abstract">{{ item.abstract }}</view>
					<view class="price"><span>￥</span>{{ item.price[0] | 1000 }}</view>
				</view>
			</navigator>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>

	</view>
</template>
<style lang='scss' scoped>
.content{
	min-height: 100vh;
	background-color: #fff;
}
.list-box{
	.item{
		display: flex;
		border-top: 1px solid #EBEEF5;
		padding: 10rpx 30rpx;
		.img{
			width: 240rpx;
		}
		.info{
			flex:1;
			margin-left: 30rpx;
			min-width:0;
			.title{
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
				font-size: 30rpx;
			}
			.progress-box{
				margin-top: 20rpx;
				display: flex;
			}
			.abstract{
				margin-top: 20rpx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			.price{
				margin-top: 30rpx;
				color:#fa436a;
				font-size: 40rpx;
				font-weight: bold;
				span{
					font-size: 12rpx;
				}
			}
		}
	}
}
.nav{
	margin-top: 10rpx;
	background: #fff;
	.cu-item{
		text-align: center;
		height: 100rpx;
		line-height: 40rpx;
		padding-top: 10rpx;
		.time{
			font-size: 36rpx;
			font-weight: bold;
		}
		.state{
			font-size: 24rpx;
		}
		&.cur{
			border-bottom-color: #fa524c;
		}
	}
}
</style>
<script>
import js from './js/list'
export default js
</script>
