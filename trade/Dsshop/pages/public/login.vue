<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">DSSHOP</view>
			<view class="welcome">
				欢迎回来！
			</view>
			<view class="bg-white">
			  <form>
			    <view class="cu-form-group">
			      <view class="title">手机号码</view>
			      <input type="number" maxlength="11" v-model="ruleForm.cellphone" @input ="cellphoneInput"></input>
			    </view>
				<view class="cu-form-group">
				  <view class="title">密码</view>
				  <input type="password" password v-model="ruleForm.password" @input="passwordInput"></input>
				</view>
			  </form>
			</view>
			<view class=" flex flex-direction padding">
			  <button class="cu-btn round bg-red shadow lg" :disabled="logining" @click="toLogin">登录</button>
			</view>
			<view class=" flex flex-direction padding">
			  <button class="cu-btn round bg-orange shadow lg" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">授权登录</button>
			</view>
			<view class="forget-section" @click="toFind">
				忘记密码?
			</view>
		  </view>
			<view class="register-section">
				还没有账号?
				<text @click="toRegist">马上注册</text>
			</view>
		</view>
	</view>
</template>

<script>
	import User from '../../api/user'
	import { getPlatform } from '../../utils'
	import App from '../../App.vue'
	import {  
        mapMutations  
    } from 'vuex';
	
	export default{
		data(){
			return {
				tabname:['微信授权','短信验证'],
				codename:'获取验证码',
				unit: '',
				TabCur: 0,
				seconds: '', // 读秒
				ruleForm: {
					cellphone: '',
					password: ''
				},
				disabled: false,
				logining: true
			}
		},
		onLoad(){
			// #ifndef  MP
			this.TabCur = 1
			// #endif
		},
		onShow(){
			// #ifdef MP
			App.methods.checkSession()
			// #endif
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
				  this.$api.msg('请填写手机号码')
				  return false
				} else if (ruleForm.cellphone.length != 11) {
				  this.$api.msg('手机号长度有误')
				  return false;
				}
				var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
				if (!myreg.test(ruleForm.cellphone)) {
				  this.$api.msg('手机号有误')
				  return false
				}
				if (!ruleForm.password) {
				  this.$api.msg('密码必须')
				  return false
				}
				this.logining = true
				User.goLogin(ruleForm,function(res){
					// applytoken
					uni.setStorageSync('dsshopApplytoken', res.api_token)
					that.login(res)
					that.logining = false
					that.$api.msg(`登录成功`);
					uni.navigateBack()
				})
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
			toFind(){
				uni.redirectTo({
					url: `/pages/public/findPassword`
				})
			},
			//手机号
			  cellphoneInput: function (e) {
			    var ruleForm = this.ruleForm
			    ruleForm.cellphone = e.detail.value
				if (this.ruleForm.cellphone && this.ruleForm.password){
					this.logining = false
				}else{
					this.logining = true
				}
			  },
			  //密码
			  passwordInput: function (e) {
			    var ruleForm = this.ruleForm
			    ruleForm.password = e.detail.value
				if (this.ruleForm.cellphone && this.ruleForm.password){
					this.logining = false
				}else{
					this.logining = true
				}
			  },
			  //授权登录
			  decryptPhoneNumber(e){
				  const that = this
				  if(e.detail.iv){
					  User.authorizedPhone({
						iv: e.detail.iv,
						encryptedData: e.detail.encryptedData,
						session_key: uni.getStorageSync('applyDsshopSession_key'),
						platform: getPlatform()
					  },function(res){
						uni.setStorageSync('dsshopApplytoken', res.api_token)
						that.login(res)
						that.$api.msg(`登录成功`);
						uni.navigateBack()
					  })
				  }else{
					  that.$api.msg(`您选择了拒绝授权，无法完成登录`)
				  }
				  
			  }
		}

	}
</script>

<style lang='scss'>
	page{
		background: #fff;
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
		position:relative;
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
		width: 160upx;
		text-align: right;
	}
</style>
