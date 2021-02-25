<template>
	<view class="container">
		<view class="view">
			<view class="text-xl text-center text-bold">开启微信提醒服务</view>
		</view>
		<view class=" flex justify-center padding">
		  <button show-message-card send-message-path="subscribe" send-message-img="../../static/subscribe.png" send-message-title="识别接收到的二维码,关注公众号" open-type="contact" @contact="handleContact" class="cu-btn round bg-red shadow lg" style="width: 60%;">去开启</button>
		</view>
		<view class="text-center text-gray text-xs">点击按钮，按上图指导开启提醒服务</view>
	</view>
</template>

<script>
	import User from '../../api/user';
	import {  
	    mapMutations  
	} from 'vuex';
	export default {
		data() {
			return {
				user: {}
			};
		},
		onShow(){
			this.loginCheck()
		},
		methods:{
			...mapMutations(['loginCheck']),
			handleContact(e) {
				console.log(e)
				console.log(e.detail.path)
				console.log(e.detail.query)
			}
		}
	}
</script>

<style lang='scss'>
	page{
		background: #FFFFFF;
	}
	.view{
		margin-top:80upx;
	}
</style>
