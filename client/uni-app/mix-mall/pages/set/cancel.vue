<template>
	<view class="container">
		<view class="text-xl padding text-center text-bold">{{$t('cancel.title')}}</view>
		<view class="padding solid-bottom">
			<view class="text-lg padding-bottom">{{$t('cancel.safe_state')}}</view>
			<view class="text-sm">{{$t('cancel.astrict')}}</view>
		</view>
		<view class="padding solid-bottom">
			<view class="text-lg padding-bottom">{{$t('cancel.dispute')}}</view>
			<view class="text-sm">{{$t('cancel.no_dispute')}}</view>
		</view>
		<view class="padding">
			<view class="text-lg padding-bottom">{{$t('cancel.unfinished')}}</view>
			<view class="text-sm">{{$t('cancel.nothing_progress')}}</view>
		</view>
		<view class="text-center sub">
			<view class="text-sm" @click="agree = !agree">
				<span class="lg padding-right-xs" :class="agree ? 'cuIcon-roundcheckfill text-red': 'text-gray cuIcon-round'"></span>
				我已阅读并知晓了<span class="text-red" @click="navTo('/pages/article/detail?list=0&id=3')">《账号注册须知》</span></view>
			<button @click="cancel()" :disabled="!agree" class="cu-btn round bg-red margin-top">确认申请</button>
		</view>
	</view>
</template>

<script>
	import User from '../../api/user'
	import {  
	    mapMutations  
	} from 'vuex';
	export default {
		data() {
			return {
				agree:false,
			};
		},
		onShow(){
			this.loginCheck()
			uni.setNavigationBarTitle({
				title: this.$t('set.cancel')
			})
		},
		methods:{
			...mapMutations(['loginCheck']),
			navTo(url){
				uni.navigateTo({
					url
				})  
			},
			//注销提交
			cancel(){
				const that = this
				User.cancel({},function(res){
					that.logout()
					that.$api.msg(this.$t('cancel.succeed'))
					setTimeout(()=>{
						uni.switchTab({
						    url: '/pages/index/index'
						});
					}, 1000)
				})
			}
		}
	}
</script>

<style lang='scss'>
	page{
		background: #FFFFFF;
	}
	.sub{
		position: absolute;
		bottom: 100upx;
		width: 100%;
	}
</style>
