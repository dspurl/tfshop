<template>
	<view class="container">
		<view class="carousel">
			<video v-if="video" id="showVideo" :src="video" :poster="poster" class="showVideo"/>
			<view v-if="video" class="showVideoClose" @click.stop="closeVideo">关闭</view>
			<swiper indicator-dots circular="true" duration="400" v-if="getList.resources_many" @change="imgCtu">
				<swiper-item class="swiper-item" v-for="(item, index) in resources_many" :key="index" @click="showVideo">
					<view v-if="item.type === 'img'" class="image-wrapper" @click="imgList()"><image :src="item.img" class="loaded" mode="aspectFill" lazy-load></image></view>
					<view v-else class="image-wrapper">
						<image :src="poster" lazy-load class="loaded" mode="aspectFill"></image>
					</view>
					<view v-if="item.type === 'video'" class="playVideo text-white cuIcon-videofill"></view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<text class="title">{{ getList.name }}</text>
			<view class="price-box" v-if="inventoryFlag">
				<text class="price-tip">¥</text>
				<template v-if="getList.price_show">
					<text class="price" v-if="getList.price_show.length > 1">{{ getList.price_show[0] }} - {{ getList.price_show[1] }}</text>
					<text class="price" v-else-if="getList.price_show.length === 1">{{ getList.price_show[0] }}</text>
				</template>
				<template v-if="getList.market_price_show">
					<text class="m-price" v-if="getList.market_price_show.length > 1">¥{{ getList.market_price_show[1] }}</text>
					<text class="m-price" v-else-if="getList.market_price_show.length === 1">¥{{ getList.market_price_show[0] }}</text>
				</template>
			</view>
			<view class="bot-row">
				<!-- <text>销量: {{getList.sales}}</text> -->
				<text>库存: {{ getList.inventory_show }}</text>
				<text>销量: {{ getList.sales}}</text>
			</view>
		</view>
		<view class="c-list">
			<block v-if="getList.is_delete || getList.is_show !== 1">
				<view v-if="specificationDefaultDisplay" class="c-row b-b">
					<text class="tit">购买类型</text>
					<view class="con">
						<text class="selected-text">{{ specificationDefaultDisplay }}</text>
					</view>
					<text class="yticon icon-you"></text>
				</view>
			</block>
			<block v-else>
				<view v-if="specificationDefaultDisplay" class="c-row b-b" @click="toggleSpec(true)">
					<text class="tit">购买类型</text>
					<view class="con">
						<text class="selected-text">{{ specificationDefaultDisplay }}</text>
					</view>
					<text class="yticon icon-you"></text>
				</view>
			</block>
		</view>

		<view class="detail-desc">
			<view class="d-header"><text>图文详情</text></view>
			<u-parse :content="getList.details" lazyLoad/>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>
			<view class="p-b-btn" :class="{ active: favorite }" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>
			<view class="action-btn-group" v-if="getList.is_delete  || getList.is_show !== 1 || !inventoryFlag">
				<button type="primary" class=" action-btn no-border buy-now-btn" disabled>立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" disabled>加入购物车</button>
			</view>
			<view class="action-btn-group" v-else>
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="toggleSpec(true)">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="toggleSpec(false)">加入购物车</button>
			</view>
		</view>

		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent"><sku :getList="getList" :buy="buy" @toggleSpec="toggleSpec" @purchasePattern="purchasePattern"></sku></view>
		</view>
		<!-- 已删除或还未发布-->
		<view v-if="getList.is_delete || getList.is_show !== 1" class="sold-out padding-sm">商品已经下架了~</view>
		<view v-if="inventoryFlag == false" class="sold-out padding-sm">商品已经售完了~</view>
	</view>
</template>

<script>
import uParse from '@/components/gaoyia-parse/parse.vue'
import Good from '../../api/good';
import share from '@/components/share';
import { param2Data } from '@/components/sku/sku2param';
import sku from '@/components/sku';
import Browse from '../../api/browse';
import Collect from '../../api/collect';
import {
		mapState,
		mapMutations
	} from 'vuex';
export default {
	components: {
		share,
		sku,
		uParse
	},
	data() {
		return {
			cartGood: {},
			id: '',
			specClass: 'none',
			specificationDefaultDisplay: '', // 规格默认显示
			getList:{
				is_delete:0,
				is_show:1
			},
			inventoryFlag: true, //true有货; false 无货
			shoppingAttributes: [], //购物属性
			favorite: false,
			shareList: [],
			poster: '',
			resources_many: [],
			video: '',
			index: 0,
			buy: false
		};
	},
	async onLoad(options) {
		let id = options.id;
		if (id) {
			this.id = id;
			this.loadData(id);
		}
	},
	computed:{
		...mapState(['hasLogin'])
	},
	onReady: function (res) {
		this.videoContext = uni.createVideoContext('myVideo')
	},
	methods: {
		//获取详情
		async loadData(id) {
			// 商品详情
			const that = this;
			await Good.detail(id, {}, function(res) {
				if (res.resources_many.length > 0) {
					res.resources_many.forEach((item,index)=>{
						if(item.depict.indexOf('_video') !== -1){
							item.type = 'video'
							that.resources_many.unshift(item)
						} else if(item.depict.indexOf('_poster') !== -1){
							that.poster = item.img
						} else {
							item.type = 'img'
							that.resources_many.push(item)
						}
					})
				}
				that.getList = res
				if(that.getList.good_sku.length<=0){
					that.inventoryFlag = false
				}
				if (that.hasLogin){
					that.browse()
				}
			})
			if (that.hasLogin){
				await Collect.detail(id, function(res) {
					if(res === 1){
						that.favorite = true
					} else {
						that.favorite = false
					}
				})
			}
		},
		// 切换swiper
		imgCtu(item){
			this.index = item.target.current
		},
		// 点击视频弹出视频播放器（因swiper内套video无法点击播放按钮，故采用此解决方案）
		showVideo(){
			const resources_many = this.resources_many[this.index]
			if(resources_many.type === 'video'){
				this.video = resources_many.img
			}
		},
		// 关闭视频
		closeVideo(){
			this.video = ''
		},
		//访问记录
		browse() {
			const getList = this.getList
			Browse.create(getList, function(res) {})
		},
		// 图片预览
		imgList() {
			const img_lest = [];
			this.resources_many.forEach(item => {
				if (item.type !== 'video') {
					img_lest.push(item.img)
				}
			})
			uni.previewImage({
				urls: img_lest,
				longPressActions: {
					success: function(data) {},
					fail: function(err) {}
				}
			});
		},
		//规格弹窗开关
		toggleSpec(state) {
			if (!this.hasLogin && state === true){
				this.$api.msg('请先登录')
				return false
			}
			if (typeof state === 'boolean'){
				this.buy=state
			}
			if (this.specClass === 'show') {
				this.specClass = 'hide';
				setTimeout(() => {
					this.specClass = 'none';
				}, 250);
			} else if (this.specClass === 'none') {
				this.specClass = 'show';
			}
		},
		//分享
		share() {
			this.$refs.share.toggleMask();
		},
		//收藏
		toFavorite() {
			if (this.hasLogin){
				const getList = this.getList
				if(this.favorite){	//移除
					Collect.destroy(getList.id,function(res){
					})
				}else{	//添加
					Collect.create(getList,function(res){
						
					})
				}
			}
			this.favorite = !this.favorite;
		},
		//购买类型展示
		purchasePattern(data) {
			this.specificationDefaultDisplay = data;
		},
		stopPrevent() {}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
	padding-bottom: 160upx;
}
.icon-you {
	font-size: $font-base + 2upx;
	color: #888;
}
.carousel {
	height: 722upx;
	position: relative;
	swiper {
		height: 100%;
	}
	.image-wrapper {
		width: 100%;
		height: 100%;
		position: relative;
	}
	.swiper-item {
		display: flex;
		justify-content: center;
		align-content: center;
		height: 750upx;
		overflow: hidden;
		image {
			width: 100%;
			height: 100%;
		}
	}
}

/* 标题简介 */
.introduce-section {
	background: #fff;
	padding: 40upx 30upx;

	.title {
		font-size: 32upx;
		color: $font-color-dark;
		height: 50upx;
		line-height: 50upx;
	}
	.price-box {
		display: flex;
		align-items: baseline;
		height: 64upx;
		padding: 10upx 0;
		font-size: 26upx;
		color: $uni-color-primary;
	}
	.price {
		font-size: $font-lg + 2upx;
	}
	.m-price {
		margin: 0 12upx;
		color: $font-color-light;
		text-decoration: line-through;
	}
	.coupon-tip {
		align-items: center;
		padding: 4upx 10upx;
		background: $uni-color-primary;
		font-size: $font-sm;
		color: #fff;
		border-radius: 6upx;
		line-height: 1;
		transform: translateY(-4upx);
	}
	.bot-row {
		display: flex;
		align-items: center;
		height: 50upx;
		font-size: $font-sm;
		color: $font-color-light;
		text {
			flex: 1;
		}
	}
}
/* 分享 */
.share-section {
	display: flex;
	align-items: center;
	color: $font-color-base;
	background: linear-gradient(left, #fdf5f6, #fbebf6);
	padding: 12upx 30upx;
	.share-icon {
		display: flex;
		align-items: center;
		width: 70upx;
		height: 30upx;
		line-height: 1;
		border: 1px solid $uni-color-primary;
		border-radius: 4upx;
		position: relative;
		overflow: hidden;
		font-size: 22upx;
		color: $uni-color-primary;
		&:after {
			content: '';
			width: 50upx;
			height: 50upx;
			border-radius: 50%;
			left: -20upx;
			top: -12upx;
			position: absolute;
			background: $uni-color-primary;
		}
	}
	.icon-xingxing {
		position: relative;
		z-index: 1;
		font-size: 24upx;
		margin-left: 2upx;
		margin-right: 10upx;
		color: #fff;
		line-height: 1;
	}
	.tit {
		font-size: $font-base;
		margin-left: 10upx;
	}
	.icon-bangzhu1 {
		padding: 10upx;
		font-size: 30upx;
		line-height: 1;
	}
	.share-btn {
		flex: 1;
		text-align: right;
		font-size: $font-sm;
		color: $uni-color-primary;
	}
	.icon-you {
		font-size: $font-sm;
		margin-left: 4upx;
		color: $uni-color-primary;
	}
}

.c-list {
	font-size: $font-sm + 2upx;
	color: $font-color-base;
	background: #fff;
	.c-row {
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		position: relative;
	}
	.tit {
		width: 140upx;
	}
	.con {
		flex: 1;
		color: $font-color-dark;
		.selected-text {
			margin-right: 10upx;
		}
	}
	.bz-list {
		height: 40upx;
		font-size: $font-sm + 2upx;
		color: $font-color-dark;
		text {
			display: inline-block;
			margin-right: 30upx;
		}
	}
	.con-list {
		flex: 1;
		display: flex;
		flex-direction: column;
		color: $font-color-dark;
		line-height: 40upx;
	}
	.red {
		color: $uni-color-primary;
	}
}

/* 评价 */
.eva-section {
	display: flex;
	flex-direction: column;
	padding: 20upx 30upx;
	background: #fff;
	margin-top: 16upx;
	.e-header {
		display: flex;
		align-items: center;
		height: 70upx;
		font-size: $font-sm + 2upx;
		color: $font-color-light;
		.tit {
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right: 4upx;
		}
		.tip {
			flex: 1;
			text-align: right;
		}
		.icon-you {
			margin-left: 10upx;
		}
	}
}
.eva-box {
	display: flex;
	padding: 20upx 0;
	.portrait {
		flex-shrink: 0;
		width: 80upx;
		height: 80upx;
		border-radius: 100px;
	}
	.right {
		flex: 1;
		display: flex;
		flex-direction: column;
		font-size: $font-base;
		color: $font-color-base;
		padding-left: 26upx;
		.con {
			font-size: $font-base;
			color: $font-color-dark;
			padding: 20upx 0;
		}
		.bot {
			display: flex;
			justify-content: space-between;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
}
/*  详情 */
.detail-desc {
	background: #fff;
	margin-top: 16upx;
	.d-header {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80upx;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		position: relative;
		text {
			padding: 0 20upx;
			background: #fff;
			position: relative;
		}
	}
}

/* 规格选择弹窗 */
.attr-content {
	padding: 10upx 30upx;
	.a-t {
		display: flex;
		image {
			width: 170upx;
			height: 170upx;
			flex-shrink: 0;
			margin-top: -40upx;
			border-radius: 8upx;
		}
		.right {
			display: flex;
			flex-direction: column;
			padding-left: 24upx;
			font-size: $font-sm + 2upx;
			color: $font-color-base;
			line-height: 42upx;
			.price {
				font-size: $font-lg;
				color: $uni-color-primary;
				margin-bottom: 10upx;
			}
			.selected-text {
				margin-right: 10upx;
			}
		}
	}
	.specification {
		max-height: 700upx;
		overflow-y: auto;
	}
	.attr-list {
		position: relative;
		display: flex;
		flex-direction: column;
		font-size: $font-base + 2upx;
		color: $font-color-base;
		padding-top: 30upx;
		padding-left: 10upx;
	}
	.item-left {
		display: flex;
		width: 120upx;
		margin-bottom: 60upx;
	}
	.item-right .step {
		right: 0upx;
		left: auto;
		bottom: 50upx;
	}
	.item-list {
		padding: 20upx 0 0;
		display: flex;
		flex-wrap: wrap;
		text {
			display: flex;
			align-items: center;
			justify-content: center;
			background: #eee;
			margin-right: 20upx;
			margin-bottom: 20upx;
			border-radius: 100upx;
			min-width: 60upx;
			height: 60upx;
			padding: 0 20upx;
			font-size: $font-base;
			color: $font-color-dark;
		}
		.selected {
			background: #fbebee;
			color: $uni-color-primary;
		}
		.disabled {
			color: $font-color-disabled;
		}
	}
}
.popup {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 99;

	&.show {
		display: block;
		.mask {
			animation: showPopup 0.2s linear both;
		}
		.layer {
			animation: showLayer 0.2s linear both;
		}
	}
	&.hide {
		.mask {
			animation: hidePopup 0.2s linear both;
		}
		.layer {
			animation: hideLayer 0.2s linear both;
		}
	}
	&.none {
		display: none;
	}
	.mask {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		background-color: rgba(0, 0, 0, 0.4);
	}
	.layer {
		position: fixed;
		z-index: 99;
		bottom: 0;
		width: 100%;
		min-height: 40vh;
		border-radius: 10upx 10upx 0 0;
		background-color: #fff;
		.btn {
			height: 66upx;
			line-height: 66upx;
			border-radius: 100upx;
			background: $uni-color-primary;
			font-size: $font-base + 2upx;
			color: #fff;
			margin: 30upx auto 20upx;
		}
	}
	@keyframes showPopup {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes hidePopup {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes showLayer {
		0% {
			transform: translateY(120%);
		}
		100% {
			transform: translateY(0%);
		}
	}
	@keyframes hideLayer {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(120%);
		}
	}
}

/* 底部操作菜单 */
.page-bottom {
	position: fixed;
	left: 30upx;
	bottom: 30upx;
	z-index: 95;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 690upx;
	height: 100upx;
	background: rgba(255, 255, 255, 0.9);
	box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);
	border-radius: 16upx;

	.p-b-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: $font-sm;
		color: $font-color-base;
		width: 96upx;
		height: 80upx;
		.yticon {
			font-size: 40upx;
			line-height: 48upx;
			color: $font-color-light;
		}
		&.active,
		&.active .yticon {
			color: $uni-color-primary;
		}
		.icon-fenxiang2 {
			font-size: 42upx;
			transform: translateY(-2upx);
		}
		.icon-shoucang {
			font-size: 46upx;
		}
	}
	.action-btn-group {
		display: flex;
		height: 76upx;
		border-radius: 100px;
		overflow: hidden;
		box-shadow: 0 20upx 40upx -16upx #fa436a;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
		background: linear-gradient(to right, #ffac30, #fa436a, #f56c6c);
		margin-left: 20upx;
		position: relative;
		&:after {
			content: '';
			position: absolute;
			top: 50%;
			right: 50%;
			transform: translateY(-50%);
			height: 28upx;
			width: 0;
			border-right: 1px solid rgba(255, 255, 255, 0.5);
		}
		.action-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 180upx;
			height: 100%;
			font-size: $font-base;
			padding: 0;
			border-radius: 0;
			background: transparent;
		}
	}
}
.showVideo{
	position: fixed;
	top:0;
	left:0;
	width:100%;
	height: 722upx;
	z-index: 999;
}
.showVideoClose{
	position: fixed;
	right:10upx;
	top:20upx;
	background-color: #FFFFFF;
	padding:20upx;
	z-index: 1000;
}
.playVideo{
	position: absolute;
	top:300upx;
	opacity: 1;
	font-size: 120upx;
}
.sold-out{
	text-align: center;
	position: fixed;
	left:0;
	bottom: 140upx;
	width: 100%;
	background-color: #999999;
	color: #FFFFFF;
	z-index: 3;
}
</style>
