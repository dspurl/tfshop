<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="address-box">
					<text v-if="item.defaults" class="tag">默认</text>
					<text class="address">{{item.location?item.location+'(':''}}{{item.address}} {{item.house?')'+item.house:''}}</text>
				</view>
				<view class="u-box">
					<text class="name">{{item.name}}</text>
					<text class="mobile">{{item.cellphone}}</text>
				</view>
			</view>
			<text class="yticon icon-bianji" @click.stop="addAddress('edit', item)"></text>
			<text class="cuIcon-delete" @click.stop="deleteAddress(index, item)"></text>
		</view>
		<view v-if="addressList.length==0">
			<text class="noAddressInfo">还没有收货地址, 请添加</text>		
		</view>
		<!-- #ifdef MP -->
		<button class="add-btn1" @click="getWxaddAddress()">获取微信地址</button>
		<!-- #endif -->		
		<button class="add-btn2" @click="addAddress('add')">手动新增地址</button> 

	</view>
</template>

<script>
	import Address from '../../api/address'
	import {mapMutations} from 'vuex'	
	export default {
		data() {
			return {
				source: 0,
				addressList: [],
				type: 0,
				addressData: {
					name: '',
					cellphone: '',
					location: '',
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
			if(option.type){
				this.type = option.type
			}
			this.loadData()
		},
		methods: {
			...mapMutations(['loginCheck']),
			//获取列表
			loadData(){
				const that = this
				Address.getList({},function(res){
					that.addressList = res.data
				})
			},
			//选择地址
			checkAddress(item){
				const that = this
				if (!item.defaults) {
					uni.showModal({
						content: '设为默认地址？',
						success: (confirmRes)=> {
							if (confirmRes.confirm) {
								Address.checkSubmit(item,function(res){
									if(that.type === '1'){
										that.$api.prePage().refreshAddress(item)
										uni.navigateBack()
									}else{
										that.$api.msg('设置成功')
										that.loadData()
									}
									
								})
							} else {
								if(that.type === '1'){
									that.$api.prePage().refreshAddress(item)
									uni.navigateBack()
								}
							}
						}
					})
				} else {
					that.$api.prePage().refreshAddress(item)
					uni.navigateBack()
				}
				
				if(this.source == 1){
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().addressData = item;
					uni.navigateBack()
				}
			},
			addAddress(type, item){
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			//自动获取微信地址
			getWxaddAddress(){
				let that = this
				//#ifdef MP
					wx.chooseAddress({
					  success (res) {					
						let data 		= that.addressData;
						data.name 		= res.userName
						data.cellphone 	= res.telNumber		
						//data.location 	= res.provinceName + res.cityName + res.countyName
						data.address 	= res.provinceName + res.cityName + res.countyName + res.detailInfo
						Address.createSubmit(data,function(res){
							that.refreshList()	
						})						
					  }
					})
				//#endif
			},
			//添加或修改成功之后回调
			refreshList(){
				this.loadData()
			},
			// 删除
			deleteAddress(index, item){
				const that = this
				uni.showModal({
					content: '确定要删除该地址吗？',
					success: (confirmRes)=> {
						if (confirmRes.confirm) {
							if (item.defaults) {
								this.$api.msg('默认收货地址无法删除')
								return false
							}
							Address.deleteSubmit(item.id,function(res){
								that.addressList.splice(index, 1)
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
		padding-bottom: 120upx;
	}
	.content{
		position: relative;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		background: #fff;
		position: relative;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			min-width: 80upx;
			line-height: 1;
		}
		.address{
			font-size: 30upx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;
		.name{
			margin-right: 30upx;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}
	
	.add-btn1{
		position: fixed;
		left: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 290upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
	.add-btn2{
		position: fixed;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 290upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
	.cuIcon-delete{
		padding-left: 10upx;
		padding-top:18upx;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
	}
</style>
