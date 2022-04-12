<template>
	<view>
		<view class="subject" v-if="data.name">
			<view class="title">{{data.name}}</view>
			<view class="text-lg text-gray margin-top margin-bottom">最近更新时间：{{data.updated_at}}</view>
			<u-parse v-if="data.column_property && list == '1'" class="details" :content="data.column_property.details"/>
			<u-parse v-if="data.article_property && list == '0'" class="details" :content="data.article_property.details"/>
			<view class="text-lg text-gray margin-top">阅读 {{data.pv}}</view>
		</view>
		<view v-else>
			<view class="no-data flex justify-center">暂时没有数据哦~</view>
		</view>
	</view>
</template>
<style lang='scss' scoped>
  @import "./scss/detail";
</style>
<script>
import js from './js/detail'
export default js
</script>
