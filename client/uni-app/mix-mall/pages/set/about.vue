<template>
	<view class="container">
		<view class="bg-white logo text-center padding">
			<image style="width: 300upx;height: 300upx;" src="/static/logo.png" lazy-load></image>
		</view>
		<view class="list-cell solid-top" @click="navTo('/pages/article/details?list=0&id=2')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">用户协议</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell solid-top" @click="navTo('/pages/article/details?list=0&id=1')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">隐私政策</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="service" v-if="service.id">
			<button class="cu-btn round lg bg-red" @click="goService()">
				<text class="cuIcon-servicefill"></text>
				联系客服
			</button>
		</view>
	</view>
</template>

<script>
	import {config} from '@/api/service'
	import {  
	    mapMutations  
	} from 'vuex';
	export default {
		data() {
			return {
				service: {
					url: '',
					id: ''
				}
			};
		},
		onShow(){
			this.loginCheck()
		},
		onLoad(){
			this.getConfig()
		},
		methods:{
			...mapMutations(['loginCheck']),
			navTo(url){
				uni.navigateTo({
					url
				})  
			},
			// 获取客服配置
			getConfig(){
				const that = this
				config({},function(res){
					that.service = res
				})
			},
			// 弹出客服
			goService(){
				// #ifdef H5
				window.location.href = this.service.url
				// #endif
				// #ifdef MP-WEIXIN
				wx.openCustomerServiceChat({
				  extInfo: {url: this.service.url},
				  corpId: this.service.id,
				  success(res) {
					  console.log('res', res)
				  }
				})
				// #endif
			}
		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	.service{
		text-align: center;
		margin-top: 30rpx;
		.cu-btn.lg{
			padding: 0 80rpx;
		}
	}
	.logo{
		justify-content: center;
		display: flex;
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
