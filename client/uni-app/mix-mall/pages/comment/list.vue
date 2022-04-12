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
								<view v-if="item.good_sku" class="text-gray text-sm">
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
							<view class="bg-img only-im" :style="'background-image:url('+ite.img | smallImage(80)+');'"
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
<style lang='scss' scoped>
  @import "./scss/list";
</style>
<script>
import js from './js/list'
export default js
</script>
