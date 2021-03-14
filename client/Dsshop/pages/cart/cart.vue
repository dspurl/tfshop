<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!hasLogin || empty===true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="index">
					<view
						class="cart-item" 
						:class="{'b-b': index!==cartList.length-1}"
					@click.stop="goProduct(item)">
						<view class="image-wrapper">
							<image :src="item.img  | smallImage" 
								:class="[item.loaded]"
								mode="aspectFill" 
								lazy-load 
								@error="onImageError('cartList', index)"
							></image>
							<view
								class="yticon icon-xuanzhong2 checkbox"
								:class="{checked: item.checked}"
								@click.stop="check('item', index)"
							></view>
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.name}}</text>
							<text v-if="item.good_sku_id" class="attr" @click.stop="toggleSpec(item)">{{item.specification}}</text>
							<text>
								<text class="price text-red text-price padding-right">{{item.price}}</text>
								<text class="">x {{item.number}}</text>
							</text>
							
						</view>
						<text class="del-btn yticon icon-fork" @click.stop="deleteCartItem(index)"></text>
					</view>
				</block>
			</view>
			<view v-if="invalidGood.length>0" class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-title text-orange "></text> 失效的商品
				</view>
			</view>
			<view class="cart-list">
				<block v-for="(item, index) in invalidGood" :key="index">
					<view
						class="cart-item" 
						:class="{'b-b': index!==invalidGood.length-1}"
					@click.stop="goProduct(item)">
						<view class="image-wrapper">
							<image :src="item.img" 
								:class="[item.loaded]"
								mode="aspectFill" 
								lazy-load 
								@error="onImageError('cartList', index)"
							></image>
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.name}}</text>
							<text v-if="item.good_sku_id" class="attr">{{item.specification}}</text>
							<text>
								<text class="price text-red text-price padding-right">{{item.price}}</text>
								<text class="">x {{item.number}}</text>
							</text>
							
						</view>
						<text class="del-btn yticon icon-fork" @click.stop="deleteInvalidGood(index)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section" v-if="total>0">
				<view class="checkbox">
					<image 
						:src="allChecked?'/static/selected.png':'/static/select.png'" 
						mode="aspectFit"
						@click="check('all')"
					></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view>
				</view>
				<view class="total-box">
					<text class="price">¥{{total}}</text>
					<text class="coupon">
						不包含配送费
					</text>
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
			</view>
		</view>
		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<sku :cartDetails="cartDetails" :update="true" @loadCart="loadCart"  @toggleSpec="toggleSpec"></sku>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import GoodIndent from '../../api/goodIndent'
	import uniNumberBox from '@/components/uni-number-box.vue'
	import sku from '@/components/sku'
	export default {
		components: {
			uniNumberBox,
			sku
		},
		data() {
			return {
				cartDetails: {},
				specClass: 'none',
				total: 0, //总价格
				allChecked: true, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
				data: ['苹果', '香蕉', '葡萄', '草莓', '西瓜'],
				invalidGood: []
			};
		},
		onShow(){
			if (this.hasLogin) {
				this.loadData()
			}
		},
		watch:{

		},
		computed:{
			...mapState(['hasLogin'])
		},
		methods: {
			//请求数据
			async loadData(){
				this.cartList = []
				this.invalidGood = []
				let cartList =  uni.getStorageSync('dsshopCartList') || {}
				const that = this
				GoodIndent.synchronizationInventory({},function(res){
					cartList = Object.values(res)
					for(var k in cartList){
						cartList[k].checked = true
						cartList[k].loaded = 'loaded'
						if(cartList[k].good_sku){
							cartList[k].good_sku.skus.forEach(item=>{
								if(cartList[k].specification){
									cartList[k].specification+= item.v + ';'
								}else{
									cartList[k].specification = item.v + ';'
								}
								
							})
							cartList[k].specification = cartList[k].specification.substr(0,cartList[k].specification.length-1)
						}
						if(cartList[k].good.is_delete === 1 || cartList[k].good.is_show !== 1){
							cartList[k].invalid = true
						}
						if(cartList[k].invalid === true){ //失效的商品
							that.invalidGood.push(cartList[k])
							// cartList.splice(k,1)
						}
					}
					for(var k in cartList){
						if(cartList[k].invalid === true){ //失效的商品
							cartList.splice(k,1)
						}
					}
					that.cartList = cartList
					uni.setStorageSync('dsshopOrderList', cartList)
					getApp().showDsshopCartNumber()
					that.calcTotal();  //计算总价
				})
				
				
			},
			//规格弹窗开关
			toggleSpec(res) {
				if(this.specClass === 'show'){
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				}else if(this.specClass === 'none'){
					this.cartDetails = res
					this.specClass = 'show';
				}
			},
			stopPrevent(){},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin(){
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			 //选中状态处理
			check(type, index){
				if(type === 'item'){
					this.cartList[index].checked = !this.cartList[index].checked;
				}else{
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item=>{
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			//数量
			numberChange(data){
				this.cartList[data.index].number = data.number
				const cartList =  uni.getStorageSync('dsshopCartList') || {}
				if(this.cartList[data.index].good_sku_id){
					cartList[this.cartList[data.index].good_sku_id]=JSON.parse(JSON.stringify(this.cartList[data.index]))
					delete cartList[this.cartList[data.index].good_sku_id]['checked']
					delete cartList[this.cartList[data.index].good_sku_id]['loaded']
					delete cartList[this.cartList[data.index].good_sku_id]['specification']
				}else{
					cartList['good_'+this.cartList[data.index].good_id]=JSON.parse(JSON.stringify(this.cartList[data.index]))
					delete cartList['good_'+this.cartList[data.index].good_id]['checked']
					delete cartList['good_'+this.cartList[data.index].good_id]['loaded']
					delete cartList['good_'+this.cartList[data.index].good_id]['specification']
				}
				
				uni.setStorageSync('dsshopCartList', cartList)
				this.calcTotal()
				
			},
			//删除
			deleteCartItem(index){
				let list = this.cartList;
				let row = list[index];
				let id = row.id;
				const cartList =  uni.getStorageSync('dsshopCartList') || {}
				if(this.cartList[index].good_sku_id){
					delete cartList[this.cartList[index].good_sku_id]
				}else{
					delete cartList['good_'+this.cartList[index].good_id]
				}
				
				uni.setStorageSync('dsshopCartList', cartList)
				uni.setStorageSync('dsshopOrderList', cartList)
				getApp().showDsshopCartNumber()
				this.cartList.splice(index, 1);
				this.calcTotal();
			},
			//删除失效的商品
			deleteInvalidGood(index){
				let list = this.invalidGood;
				let row = list[index];
				let id = row.id;
				const cartList =  uni.getStorageSync('dsshopCartList') || {}
				if(this.invalidGood[index].good_sku_id){
					delete cartList[this.invalidGood[index].good_sku_id]
				}else{
					delete cartList['good_'+this.invalidGood[index].good_id]
				}
				
				uni.setStorageSync('dsshopCartList', cartList)
				uni.setStorageSync('dsshopOrderList', cartList)
				this.invalidGood.splice(index, 1);
			},
			//清空
			clearCart(){
				uni.showModal({
					content: '清空购物车？',
					success: (e)=>{
						if(e.confirm){
							this.cartList = [];
							this.total = 0;
							this.empty = true;
							uni.removeStorageSync('dsshopCartList')
							uni.removeStorageSync('dsshopOrderList')
							getApp().showDsshopCartNumber()
						}
					}
				})
			},
			//计算总价
			calcTotal(){
				let list = this.cartList;
				if(list.length === 0){
					this.empty = true;
					return;
				}
				let total = 0;
				let checked = true;
				list.forEach(item=>{
					if(item.checked === true){
						total += item.price * item.number;
					}else if(checked === true){
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
				this.empty = false;
			},
			//重新加载数据
			loadCart(){
				this.loadData();
			},
			//访问商品
			goProduct(res){
				uni.navigateTo({
					url: `/pages/product/product?id=${res.good_id}`
				})
			},
			//创建订单
			createOrder(){
				let list = this.cartList
				let goodsData = []
				const that = this
				list.forEach(item=>{
					if(item.checked){
						goodsData.push(item)
					}
				})
				if(goodsData.length <1){
					this.$api.msg('未选择商品')
					return false
				}
				uni.navigateTo({
					url: `/pages/indent/create`
				})
			}
		}
	}
</script>

<style lang='scss'>
	.container{
		padding-bottom: 134upx;
		/* 空白页 */
		.empty{
			position:fixed;
			left: 0;
			top:0;
			width: 100%;
			height: 100vh;
			padding-bottom:100upx;
			display:flex;
			justify-content: center;
			flex-direction: column;
			align-items:center;
			background: #fff;
			image{
				width: 240upx;
				height: 160upx;
				margin-bottom:30upx;
			}
			.empty-tips{
				display:flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;
				.navigator{
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}
	/* 购物车列表项 */
	.cart-item{
		background-color: #FFFFFF;
		display:flex;
		position:relative;
		padding:30upx 40upx;
		.image-wrapper{
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position:relative;
			image{
				border-radius:8upx;
			}
		}
		.checkbox{
			position:absolute;
			left:-16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background:#fff;
			border-radius: 50px;
		}
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			padding-left: 30upx;
			.title,.price{
				font-size:$font-base + 2upx;
				height: 40upx;
				line-height: 40upx;
			}
			.attr{
				font-size: $font-sm;
				color: $font-color-light;
				line-height: 40upx;
				height: 88upx;
				display: -webkit-box;
			    overflow: hidden;
				background-color: #F6F6F6;
			    -webkit-line-clamp: 2;
			    -webkit-box-orient: vertical;
				margin-top: 5upx;
				padding: 8upx;
			}
			.step{
				left: auto;
				right: 0px;
				width:160upx;
			}
			.price{
				margin-top: 30upx;
				height: 50upx;
				line-height:50upx;
				font-size:$font-lg;
			}
		}
		.del-btn{
			padding:4upx 10upx;
			font-size:34upx; 
			height: 50upx;
			color: $font-color-light;
		}
	}
	/* 底部栏 */
	.action-section{
		/* #ifdef H5 */
		margin-bottom:100upx;
		/* #endif */
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		.checkbox{
			height:52upx;
			position:relative;
			image{
				width: 52upx;
				height: 100%;
				position:relative;
				z-index: 5;
			}
		}
		.clear-btn{
			position:absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius:0 50px 50px 0;
			opacity: 0;
			transition: .2s;
			&.show{
				opacity: 1;
				width: 120upx;
			}
		}
		.total-box{
			flex: 1;
			display:flex;
			flex-direction: column;
			text-align:right;
			padding-right: 40upx;
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
			}
			.coupon{
				font-size: $font-sm;
				color: $font-color-light;
				text{
					color: $font-color-dark;
				}
			}
		}
		.confirm-btn{
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}
	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked{
		color: $uni-color-primary;
	}
	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;
		padding-bottom: calc(var(--window-bottom));
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
		.specification{
			max-height: 700upx;
			overflow-y:auto;
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
		.item-left{
			display: flex;
			width:120upx;
			margin-bottom: 60upx;
		}
		.item-right .step{
			right:0upx;
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
</style>
