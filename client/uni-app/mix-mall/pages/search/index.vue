<template>
	<view class="content">
		<view class="cu-bar search">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input v-model="name" @blur="go" type="text" :placeholder="$t('category.search')" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-red shadow-blur round" @click="go">{{$t('common.search')}}</button>
			</view>
		</view>
		<view class="history-box">
			<view class="title-box">
				<view class="name text-bold">{{$t('search.history')}}</view>
				<view class="text-gray cuIcon-delete" @click="empty()"></view>
			</view>
			<view class="list">
				<view class="item" v-for="(item,index) in search" :key="index">
					<view class="cu-tag round" @click="clickSearch(item)">{{ item }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {  
	    mapMutations  
	} from 'vuex';
	export default {
		data() {
			return {
				name: '',
				search: uni.getStorageSync('tfshopSearch') ? uni.getStorageSync('tfshopSearch') : []
			};
		},
		onShow(){
			uni.setNavigationBarTitle({
				title: this.$t('set.search')
			})
		},
		onLoad(){
			
		},
		methods:{
			empty(){
				uni.removeStorageSync('tfshopSearch');
				this.search = []
			},
			clickSearch(e){
				this.name = e
				this.go()
			},
			go(){
				if(this.name){
					if(this.search.includes(this.name)){
						Array.prototype.unshift.apply(this.search, this.search.splice(this.search.indexOf(this.name), 1));
					}else{
						this.search.unshift(this.name)
					}
					uni.setStorageSync('tfshopSearch', this.search)
				}
				uni.navigateTo({
					url: `/pages/product/list?title=${this.name}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page{
		background: #fff;
	}
</style>
<style lang="scss" scoped>
	.history-box{
		padding: 40rpx;
		.title-box{
			display: flex;
			align-items:center;
			.name{
				flex:1;
			}
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			.item{
				padding: 20rpx 20rpx 0 0;
			}
		}
	}
</style>