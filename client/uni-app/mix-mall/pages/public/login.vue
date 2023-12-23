<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">DSSHOP</view>
			<view class="welcome">
				{{$t('login.welcome')}}
			</view>
			<view class="flex flex-direction padding">
			  <button class="cu-btn round bg-red shadow lg" :loading="logining" :disabled="logining" @click="toRegist">手机号登录</button>
			</view>
			<!--  #ifdef MP -->
			<view class=" flex flex-direction padding">
			  <button class="cu-btn round bg-orange shadow lg" :loading="logining" :disabled="logining" @click="toMiniLogin">{{$t('find_password.authorized_login')}}</button>
			</view>
			<!--  #endif -->
		</view>
	</view>
</template>

<script>
	import Login from '@/api/login'
	import { getPlatform,getLogin } from '@/utils'
	import {
        mapMutations
    } from 'vuex';

	export default{
		data(){
			return {
				tabname:[this.$t('find_password.tab.authorization'),this.$t('find_password.tab.sms')],
				codename:this.$t('find_password.get_code'),
				unit: '',
				TabCur: 0,
				seconds: '', // 读秒
				ruleForm: {
					cellphone: '',
					password: ''
				},
				nodes: [{
					name: 'span',
					children: [{
						type: 'text',
						text: this.$t('login.rich.t1')
					}],
					},{
					name: 'span',
					attrs: {
						style: 'text-decoration: underline;'
					},
					children: [{
						type: 'text',
						text: this.$t('login.rich.t2')
					}],
				},
				{
					name: 'p',
					children: [{
						type: 'text',
						text: this.$t('login.rich.t3')
					}],
				},
				{
					name: 'p',
					children: [{
						type: 'text',
						text: this.$t('login.rich.t4')
					}],
				},
				{
					name: 'span',
					attrs: {
						style: 'text-decoration: underline;'
					},
					children: [{
						type: 'text',
						text: this.$t('login.rich.t5')
					}],
				},
				{
					name: 'span',
					children: [{
						type: 'text',
						text: this.$t('login.rich.t6')
					}],
				},
				],
				disabled: false,
				modalName: null,
				logining: false
			}
		},
		onLoad(options){
			// #ifndef  MP
			this.TabCur = 1
			// #endif
		},
		onShow(){
		},
		methods: {
			...mapMutations(['login']),
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			async toLogin(e){
				const ruleForm = this.ruleForm
				const that = this
				if (!ruleForm.cellphone) {
				  this.$api.msg(this.$t('find_password.rule.cellphone'))
				  return false
				} else if (ruleForm.cellphone.length != 11) {
				  this.$api.msg(this.$t('find_password.rule.cellphone.length'))
				  return false;
				}
				var myreg = /^1[3456789]\d{9}$/;
				if (!myreg.test(ruleForm.cellphone)) {
				  this.$api.msg(this.$t('find_password.rule.cellphone.reg'))
				  return false
				}
				if (!ruleForm.password) {
				  this.$api.msg(this.$t('login.password_must'))
				  return false
				}
				this.logining = true
				
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id
				if (this.TabCur == 0) {
					this.logining = false
				} else {
					if (this.ruleForm.cellphone && this.ruleForm.code){
						this.logining = false
					}else{
						this.logining = true
					}
				}
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			toRegist(){
				uni.redirectTo({
					url: `/pages/public/register`
				})
			},
			toMiniLogin(){
				const that = this
				uni.login({
					success(res) {
						if (res.code) {
							that.logining = true
							Login.miniLogin({
								code: res.code,
								platform: getPlatform()
							},function(res){
								that.login(res)
								that.logining = false
								that.$api.msg(that.$t('login.succeed'));
								uni.navigateBack()
							})
						}
					}
				})
				
			}
		}

	}
</script>

<style lang='scss'>
	page{
		background: #fff;
	}
	.scroll-Y{
		height: 300upx;line-height: 50upx;
	}
	.container{
		padding-top: 115px;
		position:relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	.wrapper{
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}
	.back-btn{
		position:absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.left-top-sign{
		font-size: 120upx;
		color: $page-color-base;
		position:relative;
		left: -16upx;
	}
	.right-top-sign{
		position:absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;
		&:before, &:after{
			display:block;
			content:"";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}
		&:before{
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
		&:after{
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}
	.left-bottom-sign{
		position:absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}
	.welcome{
		position:relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
	}
	.input-content{
		padding: 0 60upx;
	}
	.input-item{
		display:flex;
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 30upx;
		background:$page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		&:last-child{
			margin-bottom: 0;
		}
		.tit{
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}
		input{
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}

	.confirm-btn{
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
		&:after{
			border-radius: 100px;
		}
	}
	.forget-section{
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
	.cu-form-group .title{
		width: 240upx;
		text-align: right;
	}
</style>
