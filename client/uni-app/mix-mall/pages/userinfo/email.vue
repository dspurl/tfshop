<template>
	<view class="container">
		<form>
			<view class="cu-form-group" v-if="data.oldEmail">
				<view class="title">{{$t('email.title')}}</view>
				{{data.oldEmail}}
			</view>
			<view class="cu-form-group">
				<view class="title">{{$t('email.email')}}</view>
				<input :placeholder="$t('hint.error.import', { attribute: $t('email.email') })" name="email" v-model="data.email"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">{{$t('find_password.code')}}</view>
				<input :placeholder="$t('hint.error.import', { attribute: $t('find_password.code') })" maxlength="5" name="code" v-model="data.code"></input>
				<button class='cu-btn bg-red shadow round getcode' :disabled="disabled" @click="getCode">{{codename + seconds + unit}}</button>
			</view>
			<view class=" flex flex-direction padding">
			  <button class="cu-btn round bg-red shadow lg" @click="verifyEmail">{{$t('common.submit')}}</button>
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
				codename:this.$t('find_password.get_code'),
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
		onShow(){
			uni.setNavigationBarTitle({
				title: this.$t('email.modification')
			})
		},
		onLoad(option){
			if(option.email){
				this.data.oldEmail = option.email
				uni.setNavigationBarTitle({
				    title: this.$t('email.modification')
				});
			}else{
				uni.setNavigationBarTitle({
				    title: this.$t('email.binding')
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
					this.$api.msg(this.$t('email.write'))
					return false;
				}
				var myreg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				if (!myreg.test(this.data.email)) {
					this.$api.msg(this.$t('email.error'))
					return false;
				}
				Login.emailCode(this.data,function(res){
					that.$api.msg(that.$t('email.send_successfully'))
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
				})
			},
			verifyEmail(){
				const data = this.data
				const that = this
				if (!data.email) {
				  this.$api.msg(this.$t('email.write'))
				  return false
				}
				var myreg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				if (!myreg.test(data.email)) {
				  this.$api.msg(this.$t('email.error'))
				  return false
				}
				if (!data.code) {
				  this.$api.msg(this.$t('email.must'))
				  return false
				}
				if (data.code.length != 5) {
				  this.$api.msg(this.$t('email.error.length'))
				  return false
				}
				Login.verifyEmail(data,function(res){
					that.$api.msg(that.$t('email.binding_success'));
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
