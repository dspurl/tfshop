<template>
	<view>
		<view class="bg-white text-center padding-top padding-bottom">
			
			<block v-if="details.type === 0">
				<view class="cu-avatar round lg bg-green margin-bottom">
					<text class="avatar-text">收</text>
				</view>
			</block>
			<block v-else-if="details.type === 1">
				<view class="cu-avatar round lg bg-red margin-bottom">
					<text class="avatar-text">支</text>
				</view>
			</block>
			<view class="text-lg margin-bottom">
				<text>{{details.remark}}</text>
			</view>
			<view>
				<text class="text-lg text-bold margin-bottom">
					<block v-if="details.type === 0">
						+{{details.money_show | 1000}}
					</block>
					<block v-else-if="details.type === 1">
						-{{details.money_show | 1000}}
					</block>
					
				</text>
			</view>
		</view>
		<view class="bg-white text-center margin-top-sm" v-if="details.good_indent">
			<view class="flex  p-xs margin-bottom-sm mb-sm">
				<view class="flex-sub padding-sm">订单单号</view>
				<view class="flex-twice padding-sm text-left">{{details.good_indent.identification}}</view>
			</view>
			<view class="flex  p-xs margin-bottom-sm mb-sm">
				<view class="flex-sub padding-sm">订单备注</view>
				<view class="flex-twice padding-sm text-left">{{details.good_indent.remark}}</view>
			</view>
			<view class="flex  p-xs margin-bottom-sm mb-sm">
				<view class="flex-sub padding-sm">收支日期</view>
				<view class="flex-twice padding-sm text-left">{{details.created_at}}</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import {mapMutations} from 'vuex'
	import MoneyLog from '../../api/moneyLog'
	export default {
		components: {},
		data() {
			return {
				details: []
			}
		},
		onLoad(options){
			this.loginCheck()
			this.getList(options.id)
		},
		methods: {
			...mapMutations(['loginCheck']),
			async getList(id){
				const that = this
				if(id > 0){
					MoneyLog.detail(id,{},function(res){
						that.details = res
					})
				}
			},
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #f7f7f7;
		padding-bottom: 30upx;
	}
	.cu-avatar .avatar-text{
		font-size: 18px;
	}
</style>
