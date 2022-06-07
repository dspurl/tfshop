<template>
	<view class="content">
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
					<view class="price-box">
						<view class="ll">
							<view class="price"><span>￥</span>{{ item.price[0] | 1000 }}</view>
							<view class="m-price">￥{{item.originalPrice[0] | 1000}}</view>
						</view>
						<view class="rr">
							{{item.number}}人成团
						</view>
					</view>
					
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
			.price-box{
				display: flex;
				align-items: flex-end;
				.ll{
					flex:1;
					display: flex;
					align-items: flex-end;
					.price{
						margin-top: 30rpx;
						color:#fa436a;
						font-size: 40rpx;
						font-weight: bold;
						span{
							font-size: 12rpx;
						}
					}
					.m-price{
						font-size: 24rpx;
						text-decoration: line-through;
						color: #909399;
						margin-left: 10rpx;
					}
				}
				.rr{
					font-size: 24rpx;
				}
			}
			
		}
	}
}
.navbar{
	position: fixed;
	left: 0;
	top: var(--window-top);
	display: flex;
	width: 100%;
	height: 80upx;
	background: #fff;
	box-shadow: 0 2upx 10upx rgba(0,0,0,.06);
	z-index: 10;
	.nav-item{
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: 30upx;
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
				width: 120upx;
				height: 0;
				border-bottom: 4upx solid $base-color;
			}
		}
	}
	.p-box{
		display: flex;
		flex-direction: column;
		.yticon{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 30upx;
			height: 14upx;
			line-height: 1;
			margin-left: 4upx;
			font-size: 26upx;
			color: #888;
			&.active{
				color: $base-color;
			}
		}
		.xia{
			transform: scaleY(-1);
		}
	}
	.cate-item{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 80upx;
		position: relative;
		font-size: 44upx;
		&:after{
			content: '';
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			border-left: 1px solid #ddd;
			width: 0;
			height: 36upx;
		}
	}
}
</style>
<script>
import js from './js/list'
export default js
</script>
