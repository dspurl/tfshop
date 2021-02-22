<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">DSSHOP</view>
			<view class="welcome">
				找回密码
			</view>
			<!--  #ifdef  MP-WEIXIN -->
			<scroll-view scroll-x class="bg-white nav padding">
			    <view class="flex text-center">
			      <view class="cu-item flex-sub" :class="index==TabCur?'text-red cur':''" v-for="(item,index) in 2" :key="index" @tap="tabSelect" :data-id="index">
			        {{tabname[index]}}
			      </view>
			    </view>
			</scroll-view>
			<!--  #endif -->
			<view v-if="TabCur == 0" class="bg-white">
				<view class="padding flex flex-direction">
				  <button class="cu-btn round bg-red shadow lg" open-type="getPhoneNumber" @getphonenumber="toLogin" :disabled="logining">授权登录</button>
				</view>
			</view>
			<view v-else>
			    <view class="bg-white">
			      <form>
			        <view class="cu-form-group">
			          <view class="title">手机号码</view>
			          <input type="number" maxlength="11" v-model="ruleForm.cellphone" @input="cellphoneInput"></input>
			        </view>
			        <view class="cu-form-group">
			          <view class="title">验证码</view>
			          <input type="number" maxlength="5" v-model="ruleForm.code" @input="codeInput"></input>
			          <button class="cu-btn bg-red shadow round getcode" :disabled="disabled" @click="getCode">{{codename + seconds + unit}}</button>
			        </view>
			        <view class="cu-form-group">
			          <view class="title">新密码</view>
			          <input type="password" password v-model="ruleForm.password" @input="passwordInput"></input>
			        </view>
					<view class="cu-form-group">
					  <view class="title">确认密码</view>
					  <input type="password" password v-model="ruleForm.rPassword" @input="rPasswordInput"></input>
					</view>
			      </form>
			    </view>
			    <view class=" flex flex-direction padding">
			      <button class="cu-btn round bg-red shadow lg" @click="toFindPassword">提交</button>
			    </view>
			  </view>
		  </view>
			<view class="register-section">
				已有账号?
				<text @click="toLogin">马上登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import Login from '../../api/login'
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
					code: '',
					password: '',
					rPassword: '',
					state: 1
				},
				disabled: false,
				logining: false
			}
		},
		onLoad(){
			// #ifndef  MP-WEIXIN
			this.TabCur = 1
			// #endif
		},
		methods: {
			...mapMutations(['login']),
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			async toFindPassword(e){
				const ruleForm = this.ruleForm
				const that = this
				if(e.detail.iv){
					ruleForm.iv = e.detail.iv
					ruleForm.session_key = uni.getStorageSync('applyDsshopSession_key')
					ruleForm.encryptedData = e.detail.encryptedData
				}else{
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
					if (!ruleForm.code) {
					  this.$api.msg('验证码必须')
					  return false
					}
					if (ruleForm.code.length != 5) {
					  this.$api.msg('验证码长度有误')
					  return false
					}
					if (!ruleForm.password) {
					  this.$api.msg('新密码必须')
					  return false
					}
					if (!ruleForm.rPassword) {
					  this.$api.msg('确认密码必须')
					  return false
					}
					if (ruleForm.password != ruleForm.rPassword) {
					  this.$api.msg('确认密码和新密码不一致')
					  return false
					}
				}
				Login.findPassword(ruleForm,function(res){
					that.$api.msg(`密码重置成功`);
					uni.redirectTo({
						url: `/pages/public/login`
					})
				})
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			toLogin(){
				uni.redirectTo({
					url: `/pages/public/login`
				})
			},
			//手机号
			  cellphoneInput: function (e) {
			    var ruleForm = this.ruleForm
			    ruleForm.cellphone = e.detail.value
			  },
			  //验证码
			  codeInput: function (e) {
			    var ruleForm = this.ruleForm
			    ruleForm.code = e.detail.value
			  },
			  //密码
			  passwordInput: function (e) {
			    var ruleForm = this.ruleForm
			    ruleForm.password = e.detail.value
			  },
			  //重复密码
			  rPasswordInput: function (e) {
			    var ruleForm = this.ruleForm
			    ruleForm.rPassword = e.detail.value
			  },
			  // 获取验证码
			  getCode(){
			    let that = this
			    if (!this.ruleForm.cellphone){
				  this.$api.msg('请填写手机号码')
				  return false;
			    } else if (this.ruleForm.cellphone.length != 11) {
				  this.$api.msg('手机号长度有误')
			      return false;
			    }
			    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
			    if (!myreg.test(this.ruleForm.cellphone)) {
				  this.$api.msg('手机号有误')
			      return false;
			    }
				Login.cellphoneCode(this.ruleForm,function(res){
					// 开始倒计时
					that.seconds = 60
					that.codename = ''
					that.unit = 's'
					that.disabled = true
					that.timer = setInterval(function () {
						that.seconds = that.seconds - 1
						if (that.seconds == 0) {
							// 读秒结束 清空计时器
							clearInterval(that.timer)
							that.seconds = ''
							that.codename = '获取验证码'
							that.unit = ''
							that.disabled = false
						}
					}, 1000)
					// 模拟短信发送
					if(res.code){
						that.ruleForm.code = res.code.toString()
					}
				})
			  },
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
