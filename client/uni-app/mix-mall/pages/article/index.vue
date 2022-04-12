<template>
	<view>
		<view v-if="data.length === 0">
			<view class="no-data flex justify-center">暂时没有数据哦~</view>
		</view>
		<block v-else>
			<view class="notice-item" v-for="(item, index) in data" :key="index" @click="goNavigator(item)">
				<text class="time">{{item.created_at}}</text>
				<view class="content">
					<block v-if="item.resources">
						<text class="title">{{item.name}}</text>
						<view class="img-wrapper">
							<image class="pic" :src="item.resources.img"></image>
						</view>
						<view class="bot b-t">
							<text>查看详情</text>
							<text class="more-icon yticon icon-you"></text>
						</view>
					</block>
					<block v-else>
						<view class="img-wrapper">
							<view class="cover">
								{{item.name}}
							</view>
						</view>
						<view class="bot b-t">
							<text>查看详情</text>
							<text class="more-icon yticon icon-you"></text>
						</view>
					</block>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
		</block>
	</view>
</template>
<style lang='scss' scoped>
  @import "./scss/index";
</style>
<script>
import js from './js/index'
export default js
</script>
