<template>
	<view class="container">
		<form>
			<view class="cu-form-group" v-if="data.oldEmail">
				<view class="title">当前绑定邮箱</view>
				{{data.oldEmail}}
			</view>
			<view class="cu-form-group">
				<view class="title">新邮箱</view>
				<input placeholder="请输入新邮箱" name="email" v-model="data.email"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">验证码</view>
				<input maxlength="5" placeholder="请输入验证码" name="code" v-model="data.code"></input>
				<button class='cu-btn bg-red shadow round getcode' :disabled="disabled" @click="getCode">{{codename + seconds + unit}}</button>
			</view>
			<view class=" flex flex-direction padding">
			  <button class="cu-btn round bg-red shadow lg" @click="verifyEmail">提交</button>
			</view>
		</form>
	</view>
</template>

<script>
	import Login from '../../api/login';
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return {
				codename:'获取验证码',
				disabled: false,
				unit: '',
				seconds: '',
				data: {
					oldEmail: '',
					email: '',
					code: '',
					
				}
			};
		},
		onLoad(option){
			if(option.email){
				this.data.oldEmail = option.email
				uni.setNavigationBarTitle({
				    title: '修改邮箱'
				});
			}else{
				uni.setNavigationBarTitle({
				    title: '绑定邮箱'
				});
			}
			this.loginCheck()
		},
		methods:{
			...mapMutations(['loginCheck']),
			// 获取验证码
			getCode(){
				let that = this
				if (!this.data.email){
					this.$api.msg('请填写邮箱')
					return false;
				}
				var myreg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				if (!myreg.test(this.data.email)) {
					this.$api.msg('邮箱格式有误')
					return false;
				}
				Login.emailCode(this.data,function(res){
					that.$api.msg('发送成功')
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
				})
			},
			verifyEmail(){
				const data = this.data
				const that = this
				if (!data.email) {
				  this.$api.msg('请填写邮箱')
				  return false
				}
				var myreg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				if (!myreg.test(data.email)) {
				  this.$api.msg('邮箱格式有误')
				  return false
				}
				if (!data.code) {
				  this.$api.msg('验证码必须')
				  return false
				}
				if (data.code.length != 5) {
				  this.$api.msg('验证码长度有误')
				  return false
				}
				Login.verifyEmail(data,function(res){
					that.$api.msg(`绑定成功`);
					setTimeout(()=>{
						uni.navigateBack({
						    delta: 1
						});
					}, 800)
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
	}
</style>
