<template>
	<view class="container">
		<view class="list-cell b-b m-t" @click="navTo('/pages/userinfo/userinfo')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">个人资料</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo('/pages/set/message')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">通知与提醒</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="clearCache()" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">清除缓存</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo('/pages/set/about')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">关于我们</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell" @click="navTo('/pages/set/cancel')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">注销服务</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell log-out-btn" @click="toLogout">
			<text class="cell-tit">退出登录</text>
		</view>
	</view>
</template>

<script>
	import Login from '../../api/login'
	import {  
	    mapMutations  
	} from 'vuex';
	export default {
		data() {
			return {
				notification: false
			};
		},
		onShow(){
			this.loginCheck()
		},
		methods:{
			...mapMutations(['logout','loginCheck']),
			//检测版本
			testVersion(){
				this.$api.msg('已经最新了')
			},
			//清除缓存
			clearCache(){
				uni.removeStorageSync('dsshopOrderList')
				uni.removeStorageSync('dsshopCartList')
				this.$api.msg('缓存清除成功')
			},
			navTo(url){
				uni.navigateTo({
					url
				})  
			},
			switchNotification(e) {
				this.notification = e.detail.value
			},
			//退出登录
			toLogout(){
				const that = this
				uni.showModal({
				    content: '确定要退出登录么',
				    success: (e)=>{
				    	if(e.confirm){
							Login.logout({},function(res){
								that.logout()
								setTimeout(()=>{
									uni.navigateBack()
								}, 200)
							})
				    		
				    	}
				    }
				});
			},
			//switch
			switchChange(e){
				let statusTip = e.detail.value ? '打开': '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},

		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
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
