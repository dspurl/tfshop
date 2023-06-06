<template>
	<view class="container">
		<view class="list-cell b-b m-t" @click="navTo('/pages/userinfo/userinfo')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">{{$t('set.personal')}}</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo('/pages/set/message')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">{{$t('set.inform')}}</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="clearCache()" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">{{$t('set.cache')}}</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo('/pages/set/about')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">{{$t('set.about')}}</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" @click="navTo('/pages/set/cancel')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">{{$t('set.cancel')}}</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell log-out-btn" @click="toLogout">
			<text class="cell-tit">{{$t('set.out')}}</text>
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
			uni.setNavigationBarTitle({
				title: this.$t('user.set')
			})
		},
		methods:{
			...mapMutations(['logout','loginCheck']),
			//检测版本
			testVersion(){
				this.$api.msg(this.$t('set.newest'))
			},
			//清除缓存
			clearCache(){
				uni.removeStorageSync('dsshopOrderList')
				uni.removeStorageSync('dsshopCartList')
				this.$api.msg(this.$t('set.clear_successfully'))
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
				    content: that.$t('set.logout'),
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
			}


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
