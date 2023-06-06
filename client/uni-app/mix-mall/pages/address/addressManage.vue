<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">{{$t('address.name')}}</text>
			<input class="input" type="text" v-model="addressData.name" :placeholder="$t('address.name.placeholder')" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">{{$t('address.cellphone')}}</text>
			<input class="input" type="number" v-model="addressData.cellphone" :placeholder="$t('address.cellphone.placeholder')" placeholder-class="placeholder" maxlength="11"/>
		</view>
		<view class="row b-b">
			<text class="tit">{{$t('address.address')}}</text>
			<text @click="chooseLocation" class="input">
				{{addressData.location}}
				<block v-if="addressData.address">
					({{addressData.address}})
				</block>
			</text>
			<text class="yticon icon-shouhuodizhi"></text>
		</view>
		<view class="row b-b">
			<text class="tit">{{$t('address.house')}}</text>
			<input class="input" type="text" v-model="addressData.house" :placeholder="$t('address.house.placeholder')" placeholder-class="placeholder" />
		</view>
		<button class="add-btn" @click="confirm">{{$t('common.submit')}}</button>
	</view>
</template>

<script>
	import Shipping from '../../api/shipping'
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return {
				addressData: {
					name: '',
					cellphone: '',
					location: this.$t('hint.error.select', { attribute: this.$t('address.address')}),
					address: '',
					latitude: '',
					longitude: '',
					house: '',
					default: false
				}
			}
		},
		onLoad(option){
			this.loginCheck()
			let title = this.$t('hint.newly_increased',{ attribute : this.$t('address.address') });
			const that = this
			if(option.type==='edit'){
				title = this.$t('hint.redact',{ attribute : this.$t('address.address') })
			}
			if(option.data){
				this.addressData = JSON.parse(option.data)
			}
			if(option.sid){
				this.addressData.good_indent_id = Number(option.sid)
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			...mapMutations(['loginCheck']),
			switchChange(e){
				this.addressData.default = e.detail;
			},

			//地图选择地址
			chooseLocation(){
				const that = this
				// #ifndef MP-WEIXIN
				if(that.addressData.latitude){
					uni.chooseLocation({
						latitude: that.addressData.latitude,
						longitude: that.addressData.longitude,
						success: (data)=> {
							that.addressData.location = data.name
							that.addressData.address = data.address
							that.addressData.latitude = data.latitude
							that.addressData.longitude = data.longitude
						},
						fail: (res)=>{
							// that.$api.msg(res.errMsg)
						}
					})
				}else{
					uni.chooseLocation({
						success: (data)=> {
							that.addressData.location = data.name
							that.addressData.address = data.address
							that.addressData.latitude = data.latitude
							that.addressData.longitude = data.longitude
						},
						fail: (res)=>{
							// that.$api.msg(res.errMsg)
						}
					})
				}
				// #endif
				// #ifdef MP-WEIXIN
				uni.authorize({
				    scope: 'scope.userLocation',
				    success() {
						if(that.addressData.latitude){
							uni.chooseLocation({
								latitude: that.addressData.latitude,
								longitude: that.addressData.longitude,
								success: (data)=> {
									that.addressData.location = data.name
									that.addressData.address = data.address
									that.addressData.latitude = data.latitude
									that.addressData.longitude = data.longitude
								},
								fail: (res)=>{
									// that.$api.msg(res.errMsg)
								}
							})
						}else{
							uni.chooseLocation({
								success: (data)=> {
									that.addressData.location = data.name
									that.addressData.address = data.address
									that.addressData.latitude = data.latitude
									that.addressData.longitude = data.longitude
								},
								fail: (res)=>{
									// that.$api.msg(res.errMsg)
								}
							})
						}
				    }
				})
				// #endif
			},

			//提交
			confirm(){
				const that = this
				let data = this.addressData;
				if(!data.name){
					this.$api.msg(this.$t('hint.error.import', { attribute: this.$t('address.name.placeholder') }));
					return;
				}
				if(!/(^1[3|4|5|7|8|9][0-9]{9}$)/.test(data.cellphone)){
					this.$api.msg(this.$t('hint.error.import', { attribute: this.$t('address.cellphone.placeholder') }));
					return;
				}
				if(!data.location){
					this.$api.msg(this.$t('hint.error.selects', { attribute: this.$t('address.address') }));
					return;
				}
				if(!data.house){
					this.$api.msg(this.$t('hint.error.import', { attribute: that.$t('address.house.placeholder') }));
					return;
				}
				data.cellphone = Number(data.cellphone)
				if(data.id){
					Shipping.edit(data,function(res){
						that.$api.prePage().refreshList()
						that.$api.msg(`${that.$t('address.address')}${that.manageType=='edit' ? that.$t('common.amend'): that.$t('common.add')}${that.$t('common.succeed')}`);
						setTimeout(()=>{
							uni.navigateBack()
						}, 1000)
					})
				}else{
					Shipping.create(data,function(res){
						that.$api.prePage().refreshList()
						that.$api.msg(`${that.$t('address.address')}${that.manageType=='edit' ? that.$t('common.amend'): that.$t('common.add')}${that.$t('common.succeed')}`);
						setTimeout(()=>{
							uni.navigateBack()
						}, 1000)
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;

		.tit{
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
