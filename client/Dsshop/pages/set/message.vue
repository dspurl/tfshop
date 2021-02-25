<template>
	<view class="container">
		<view class="cu-list menu" v-if="user.notification">
			<view class="cu-item">
				<view class="content padding-tb-sm">
					<view>邮件通知</view>
					<view class="text-gray text-sm">
						在邮箱上接收通知等重要消息
					</view>
				</view>
				<view class="action">
					<switch v-if="user.email" class='red' data-type="email" @change="setNotification" :class="user.notification.email?'checked':''" :checked="user.notification.email?true:false" color="#e54d42"></switch>
					<switch v-else class='red' @click="setNotification" data-type="email" :disabled="true" ></switch>
				</view>
			</view>
			<view class="cu-item">
				<view class="content padding-tb-sm">
					<view>微信通知</view>
					<view class="text-gray text-sm">
						在微信上接收通知等重要消息
					</view>
				</view>
				<view class="action">
					<switch v-if="user.wechat" class='red' data-type="wechat" @change="setNotification" :class="user.notification.wechat?'checked':''" :checked="user.notification.wechat?true:false" color="#e54d42"></switch>
					<switch v-else class='red' @click="setNotification" data-type="wechat" :disabled="true" ></switch>
				</view>
			</view>
		</view>
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
			this.getUser()
		},
		methods:{
			...mapMutations(['loginCheck']),
			getUser(){
				const that = this
				User.detail(function(res){
					that.user = res
				})
			},
			// 设置通知状态
			setNotification(e){
				const type = e.currentTarget.dataset.type
				if(type === 'email'){
					if(!this.user.email){
						this.$api.msg(`请先绑定邮箱`)
						setTimeout(()=>{
							uni.navigateTo({
							    url: '/pages/userinfo/email'
							})
						}, 800)
						return false
					}
				}else if(type === 'wechat'){
					if(!this.user.wechat){
						this.$api.msg(`请先关注微信公众号`)
						setTimeout(()=>{
							uni.navigateTo({
							    url: '/pages/public/subscribe'
							})
						}, 800)
						return false
					}
				}
				this.user.notification[type] = e.detail.value
				// 更新通知状态
				User.notification(this.user,function(res){})
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
