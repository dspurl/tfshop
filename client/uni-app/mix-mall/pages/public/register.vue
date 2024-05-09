<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">TFSHOP</view>
			<view class="welcome">
				手机号登录
			</view>
			<view class="text-gray" style="margin-left:50rpx;">首次登录会注册</view>
			<view class="bg-white">
			  <form>
			    <view class="cu-form-group">
			      <view class="title">{{$t('find_password.cellphone')}}</view>
			      <input type="number" maxlength="11" v-model="ruleForm.cellphone" @input="cellphoneInput"></input>
			    </view>
			    <view class="cu-form-group">
			      <view class="title">{{$t('find_password.code')}}</view>
			      <input type="number" maxlength="5" v-model="ruleForm.code" @input="codeInput"></input>
			      <button class="cu-btn bg-red shadow round getcode" :disabled="disabled" @click="getCode">{{codename + seconds + unit}}</button>
			    </view>
			  </form>
			</view>
			<view class=" flex flex-direction padding">
			  <button class="cu-btn round bg-red shadow lg" @click="toRegister">立即登录</button>
			</view>
			<view class="cu-modal" :class="modalName=='agreement'?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">{{$t('login.register_privacy')}}</view>
					</view>
					<view class="padding text-left">
						<scroll-view scroll-y="true" class="scroll-Y">
							<rich-text :nodes="nodes"></rich-text>
						</scroll-view>
					</view>
					<view class="bg-white text-left padding text-sm">
						{{$t('login.consent')}}
						<span class="text-blue" @tap="goNavigator(2)">《tfshop{{$t('login.user_registration')}}》</span>
						、
						<span class="text-blue" @tap="goNavigator(1)">《tfshop{{$t('login.privacy')}}》</span>
					</view>
					<view class="grid bg-white col-2 solid-top">
						<view class="padding" @click="toLogin">{{$t('login.disagree')}}</view>
						<view class="bg-red padding" @click="modalName = ''">{{$t('login.agreement')}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Login from '@/api/login'
	import { getPlatform } from '@/utils'
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
					code: '',
					password: '',
					rPassword: '',
					uuid: ''
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
				logining: false,
				modalName: 'agreement',
			}
		},
		onLoad(option){
			// #ifndef  MP-WEIXIN
			this.TabCur = 1
			// #endif
			if(option.uuid){
				this.ruleForm.uuid = option.uuid
			}

		},
		methods: {
			...mapMutations(['login']),
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			async toRegister(e){
				const ruleForm = this.ruleForm
				const that = this
				if(e.detail.iv){
					ruleForm.iv = e.detail.iv
					ruleForm.session_key = uni.getStorageSync('applyDsshopSession_key')
					ruleForm.encryptedData = e.detail.encryptedData
				}else{
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
					if (!ruleForm.code) {
					  this.$api.msg(this.$t('find_password.rule.code'))
					  return false
					}
					if (ruleForm.code.length != 5) {
					  this.$api.msg(this.$t('find_password.rule.code.length'))
					  return false
					}
				}
				ruleForm.platform = getPlatform()
				// #ifdef  MP
				uni.login({
					success(res) {
						if (res.code) {
							that.logining = true
							ruleForm.login_code = res.code
							Login.register(ruleForm,function(res){
								that.login(res)
								that.logining = false
								that.$api.msg(that.$t('login.succeed'));
								uni.navigateBack()
							})
						}
					}
				})
				// #endif
				// #ifndef  MP
				that.logining = true
				Login.register(ruleForm,function(res){
					that.login(res)
					that.logining = false
					that.$api.msg(that.$t('login.succeed'));
					uni.navigateBack()
				})
				// #endif
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			// 协议
			goNavigator(id){
				uni.navigateTo({
				    url: `/pages/article/detail?list=0&id=${id}`
				});
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
				  this.$api.msg(this.$t('find_password.rule.cellphone'))
				  return false;
			    } else if (this.ruleForm.cellphone.length != 11) {
				  this.$api.msg(this.$t('find_password.rule.cellphone.length'))
			      return false;
			    }
			    var myreg = /^1[3456789]\d{9}$/;
			    if (!myreg.test(this.ruleForm.cellphone)) {
				  this.$api.msg(this.$t('find_password.rule.cellphone.reg'))
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
							that.codename = that.$t('find_password.get_code')
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
			  showModal(e) {
			  	this.modalName = e.currentTarget.dataset.target
			  },
			  hideModal(e) {
			  	this.modalName = null
			  },
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
		width: 240rpx;
		text-align: right;
	}
</style>
