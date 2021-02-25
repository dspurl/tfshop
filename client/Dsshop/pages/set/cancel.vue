<template>
	<view class="container">
		<view class="text-xl padding text-center text-bold">请确认您的账号是否满足以下注销条件</view>
		<view class="padding solid-bottom">
			<view class="text-lg padding-bottom">账号处于安全状态</view>
			<view class="text-sm">账号处于正常状态，没有被封号等账户限制。</view>
		</view>
		<view class="padding solid-bottom">
			<view class="text-lg padding-bottom">账号无进行中的任何纠纷</view>
			<view class="text-sm">本账号无任何账号纠纷，包括投诉、举报或被投诉、被举报等。</view>
		</view>
		<view class="padding">
			<view class="text-lg padding-bottom">账号无未完成的业务</view>
			<view class="text-sm">没有正在进行中，或者尚未确认完成的交易。</view>
		</view>
		<view class="text-center sub">
			<view class="text-sm" @click="agree = !agree">
				<span class="lg padding-right-xs" :class="agree ? 'cuIcon-roundcheckfill text-red': 'text-gray cuIcon-round'"></span>
				我已阅读并知晓了<span class="text-red" @click="navTo('/pages/article/details?list=0&id=3')">《账号注册须知》</span></view>
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
					that.$api.msg('账号已成功注销')
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
