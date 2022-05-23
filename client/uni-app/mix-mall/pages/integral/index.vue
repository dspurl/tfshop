<template>
	<view>
		<scroll-view scroll-x class="bg-white nav margin-bottom">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="item.value===tabCur?'text-orange cur':''" v-for="(item,index) in type" :key="index" @tap="setType(item.value)" :data-id="index">
					{{item.label}}
				</view>
			</view>
		</scroll-view>
		<view class="sticky-box">
			<view class="cu-list menu">
				<view class="cu-item">
					<view class="content padding-tb-sm">
						<view>
							<picker mode="date" :value="date" fields="month" @change="DateChange">
								<view class="picker">
									{{date}}
								</view>
							</picker>
							<text class="cuIcon-unfold"></text>
						</view>
						<view class="text-gray text-sm">
							<text class="padding-right">支出{{expend}}</text><text>收入{{income}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-list menu-avatar">
			<view class="cu-item" v-for="(item,index) in getList" :key="index">
				
				<block v-if="item.type === '收入'">
					<view class="cu-avatar round lg bg-green">
						<text class="avatar-text">收</text>
					</view>
				</block>
				<block v-else-if="item.type === '支出'">
					<view class="cu-avatar round lg bg-red">
						<text class="avatar-text">支</text>
					</view>
				</block>
				<view class="content text-cut">
					<view><view class="text-cut">{{item.remark}}</view></view>
					<view class="text-gray text-sm flex">{{item.created_at}}</view>
				</view>
				<view class="action">
					<block v-if="item.type === '收入'">
						<view class="text-green text-cut text-bold text-df">+{{item.operation}}</view>
					</block>
					<block v-else-if="item.type === '支出'">
						<view class="text-red text-cut text-bold text-df">-{{item.operation}}</view>
					</block>
					
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import {mapMutations} from 'vuex'
	import {getList} from '@/api/integralLog.js'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		components: {
			uniLoadMore	
		},
		data() {
			return {
				getList: [],
				loadingType: 'more', //加载更多状态
				page:1,
				date: '',
				income: 0,
				expend: 0,
				tabCur: '',
				type: [{
					value: '',
					label: '全部'
				},{
					value: 0,
					label: '收入'
				},{
					value: 1,
					label: '支出'
				}]
			}
		},
		onLoad(options){
			this.loginCheck()
			this.loadData()
			this.date = this.getDate()
		},
		methods: {
			...mapMutations(['loginCheck']),
			//获取列表
			async loadData(type='add',loading){
				if(type === 'refresh'){
					this.page = 1
					this.getList = [];
				}
				//没有更多直接返回
				if(type === 'add'){
					if(this.loadingType === 'nomore'){
						return;
					}
				}else{
					this.loadingType = 'more'
				}
				let that =this
				await getList({
					limit: 10,
					page: this.page,
					sort: '-created_at',
					timeInterval: this.date ? this.date : this.getDate(),
					type: this.tabCur
				},function(res){
					that.getList = that.getList.concat(res.paginate.data)
					that.income = res.income
					that.expend = res.expend
					if (res.paginate.last_page > that.page){
						that.page ++
						that.loadingType  = 'more'
					} else {
						that.loadingType  = 'nomore'
					}
				})
				if(type === 'refresh'){
					if(loading == 1){
						uni.hideLoading()
					}else{
						uni.stopPullDownRefresh();
					}
				}
			}, 
			//获取当前日期
			getDate(){
				var date = new Date();
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				if (month < 10) {
				    month = "0" + month;
				}
				return year + '-' + month
			},
			//设置日期
			DateChange(e) {
				this.date = e.detail.value
				this.loadData('refresh')
				
			},
			//下拉刷新
			onPullDownRefresh(){
				this.loadData('refresh');
			},
			//加载更多
			onReachBottom(){
				this.loadData();
			},
			setType(value){
				this.tabCur = value
				this.loadData('refresh');
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #f7f7f7;
		padding-bottom: 30upx;
	}
	.sticky-box {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		position: -webkit-sticky;
		/* #endif */
		position: sticky;
		top: var(--window-top);
		z-index: 99;
		flex-direction: row;
		width: 100%;
		.cu-list{
			width:100%;
		}
	}
	.cu-avatar .avatar-text{
		font-size: 18px;
	}
</style>
