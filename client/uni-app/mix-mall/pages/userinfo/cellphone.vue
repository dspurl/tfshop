<template>
	<view class="container">
		<form>
			<view class="cu-form-group" v-if="data.oldCellphone">
				<view class="title">当前绑定手机</view>
				{{data.oldCellphone}}
			</view>
			<view class="cu-form-group">
				<view class="title">新手机号</view>
				<input :placeholder="$t('hint.error.import', { attribute: '新手机号' })" maxlength="11" name="cellphone" v-model="data.cellphone"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">{{$t('find_password.code')}}</view>
				<input :placeholder="$t('hint.error.import', { attribute: $t('find_password.code') })" maxlength="5" name="code" v-model="data.code"></input>
				<button class='cu-btn bg-red shadow round getcode' :disabled="disabled" @click="getCode">{{codename + seconds + unit}}</button>
			</view>
			<view class=" flex flex-direction padding">
			  <button class="cu-btn round bg-red shadow lg" @click="changeCellphone">{{$t('common.submit')}}</button>
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
					oldCellphone: '',
					cellphone: '',
					code: '',
					state: 2
					
				}
			};
		},
		onShow(){
			uni.setNavigationBarTitle({
				title: '修改手机号'
			})
		},
		onLoad(option){
			if(option.cellphone){
				this.data.oldCellphone = option.cellphone
				uni.setNavigationBarTitle({
				    title: '修改手机号'
				});
			}else{
				uni.setNavigationBarTitle({
				    title: '绑定手机号'
				});
			}
			this.loginCheck()
		},
		methods:{
			...mapMutations(['loginCheck']),
			// 获取验证码
			getCode(){
				let that = this
				if (!this.data.cellphone){
					this.$api.msg('请填写手机号')
					return false;
				}
				var myreg = /^1[3456789]\d{9}$/;
				if (!myreg.test(this.data.cellphone)) {
					this.$api.msg('手机号格式有误')
					return false;
				}
				Login.cellphoneCode(this.data,function(res){
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
					// 模拟短信发送
					if(res.code){
						that.data.code = res.code.toString()
					}
				})
			},
			changeCellphone(){
				const data = this.data
				const that = this
				if (!data.cellphone) {
				  this.$api.msg('请填写手机号')
				  return false
				}
				var myreg = /^1[3456789]\d{9}$/;
				if (!myreg.test(data.cellphone)) {
				  this.$api.msg('手机号格式有误')
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
				Login.changeCellphone(data,function(res){
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
