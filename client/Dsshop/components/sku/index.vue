<!-- 
使用方法 
 <sku :getList="getList" @toggleSpec="toggleSpec"></sku>
 getList：商品数据
 update: 是否是更新

 cartDetails: 购物车时的单条数据
 @toggleSpec:弹出框操作
 @purchasePattern: 购买类型展示
 @loadCart:完成时触发
 
 order: 是否是订单
 @setOrder:修改后传给父节点的值，用来父节点商品更新
 -->
<template>
	<view>
		<view class="a-t">
			<image :src="specificationDefaultDisplay.img" @click="previewImage(specificationDefaultDisplay.img)"></image>
			<view class="right">
				<template v-if="getLists.price_show && specificationDefaultDisplay.price_show">
					<text class="price" v-if="specificationDefaultDisplay.price_show.length > 1">¥{{specificationDefaultDisplay.price_show[0]}} - {{specificationDefaultDisplay.price_show[1]}}</text>
					<text class="price" v-else-if="specificationDefaultDisplay.price_show.length === 1">¥{{specificationDefaultDisplay.price_show[0]}}</text>
				</template>
				<text class="stock">库存：{{specificationDefaultDisplay.inventory_show}}件</text>
				<view class="selected">
					<text class="selected-text" >{{ specificationDefaultDisplay.selected }}</text>
				</view>
			</view>
		</view>
		<scroll-view scroll-y="true" class="specification">
			<view v-for="(item, index) in specification" :key="index" class="attr-list">
				<text>{{ item.value }}</text>
				<view class="item-list">
					<text
						v-for="(childItem, childIndex) in item.leaf"
						:key="childIndex"
						class="tit clamp"
						:class="{ selected: childItem.selected, disabled: childItem.disabled}"
						@click="selectSpec(index, childIndex,childItem)"
					>
						{{ childItem.value }}
					</text>
				</view>
			</view>
			<view class="attr-list">
				<text class="item-left">购买数量</text>
				<view class="item-right">
					<uni-number-box
						class="step"
						:min="1" 
						:max="specificationDefaultDisplay.inventory_show"
						:value="cartGood.number>specificationDefaultDisplay.inventory_show?specificationDefaultDisplay.inventory_show:cartGood.number"
						:isMax="cartGood.number >= specificationDefaultDisplay.inventory_show ? true : false"
						:isMin="cartGood.number===1"
						@eventChange="numberChange"
					></uni-number-box>
				</view>
			</view>
		</scroll-view>
		<button class="btn" @click="cart">完成</button>
	</view>
</template>

<script>
import uniNumberBox from '@/components/uni-number-box.vue'
import { param2Data } from '@/components/sku/sku2param'
import GoodIndent from '@/api/goodIndent'
export default{
	name: 'sku',
	components: {
		uniNumberBox
	},
	props: {
		getList: {
			type: Object,
			default: function(){
				return {};
			}
		},
		cartDetails: {
			type: Object,
			default: function(){
				return {};
			}
		},
		update: {
			type: Boolean,
			default: false
		},
		order: {
			type: Boolean,
			default: false
		},
		buy: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			cartGood: {
				number: 1,
				price: ''
			},
			specSelected:[],
			SKUResult: {},
			good_sku: {}, //原sku属性
			selectedSku: [], //记录当前所有可以选择的项
			selectedSkuIndex: [[]],	//获取可选项对应的坐标
			specSelectedIndex: [], //记录选中的坐标
			productSkus: [],
			selectedName: [],	//已选属性
			noSelectedName: [],	//未选属性
			specificationDefaultDisplay: {},// 规格默认显示
			specification: [],
			shoppingAttributes: [],	//购物属性
			getLists:this.getList,
			buyState: this.buy
		};
	},
	watch: {
		getList(newVal) {
			this.$emit('getList', newVal)
			this.getLists = this.getList
			if(!this.update){
				this.loadData()
			}
			
		},
		buy(newVal) {
			this.buyState = newVal
		},
		getLists(newVal) {
			this.$emit('getLists', newVal)
			
		},
		cartDetails(newVal) {
			this.getLists = newVal.good
			this.initSelectSpec(newVal)
		},
	},
	methods:{
		//获取详情
		loadData() {
			this.selectedSku = []
			// sku
			if (this.getLists.good_sku.length > 0) {
				const { productSkus, specification } = param2Data(this.getLists.good_sku)
				this.specification = specification
				specification.forEach((item,index)=>{
					this.specSelectedIndex.push(null)
					this.noSelectedName.push(item.value)
					item.leaf.forEach((item2,index2)=>{
						this.selectedSku.push(item2.id)
						this.selectedSkuIndex[item2.id]={
							index: index,
							leaf:index2
						}
					})
				})
				// return false
				this.productSkus = productSkus
				// 获取可选集成
				productSkus.forEach((item,ind)=>{
					item.data.forEach(item2=>{
						item2.sort(function(value1, value2) {
							return parseInt(value1.replace("sku","")) - parseInt(value2.replace("sku",""));
						})
						this.SKUResult[item2.join("_")]=true
					})
				})
				// 规格默认属性
				this.specificationDefaultDisplay = {
					img: this.getLists.resources_many[0].img,
					price_show: this.getLists.price_show,
					inventory_show: this.getLists.inventory_show,
					selected: '选择 ' + this.noSelectedName
				}
				this.$emit('purchasePattern','选择 ' + this.noSelectedName)
			}else{
				this.specificationDefaultDisplay = {
					img: this.getLists.resources_many[0].img,
					price_show: this.getLists.price_show,
					inventory_show: this.getLists.inventory_show
				}
				this.cartGood.price = this.getLists.price
			}
			//自动选择默认第一项规格
			if (typeof(this.specification[0].leaf[0]) != 'undefined'){
				for (var i=0;i<this.specification.length;i++){
					this.selectSpec(i, 0,this.specification[i].leaf[0])
				}								
			}
		},
		//初始化选中项
		initSelectSpec(newVal){
			this.selectedSku = []
			this.SKUResult = []
			this.cartGood.price = newVal.price
			this.cartGood.number = newVal.number
			this.shoppingAttributes = newVal.good_sku
			this.good_sku = newVal.good_sku
			let checkedId = []	//选中的ID
			let checkedBrother = []	//兄弟列表
			// sku
			if (newVal.good_sku) {
				const { productSkus, specification } = param2Data(this.getLists.good_sku)
				this.specification = specification
				specification.forEach((item,index)=>{
					item.leaf.forEach((item2,index2)=>{
						// 设置选中的值
						for (var i = 0; i < newVal.good_sku.product_sku.length; i++) {
							if(item2.value === newVal.good_sku.product_sku[i].value){
								item.leaf[index2].selected = true
								this.specSelectedIndex[index]=index2
								if(index2 !== null){
									checkedId.push(specification[index]['leaf'][index2]['id'])
									checkedBrother.push(index)
								}
								break
							}
						}
						this.selectedSku.push(item2.id)
						this.selectedSkuIndex[item2.id]={
							index: index,
							leaf:index2
						}
					})
				})
				
				this.productSkus = productSkus
				// 获取可选集成
				productSkus.forEach((item,ind)=>{
					item.data.forEach(item2=>{
						item2.sort(function(value1, value2) {
							return parseInt(value1.replace("sku","")) - parseInt(value2.replace("sku",""));
						})
						this.SKUResult[item2.join("_")]=true
					})
				})
			}
			this.specificationDefaultDisplay = {
				img: newVal.img,
				price_show: [newVal.good_sku.price],
				inventory_show: newVal.good_sku.inventory,
				selected: '已选 ' + newVal.specification
			}
			// 处理不可选项
			let selectedSkus =JSON.parse(JSON.stringify(this.selectedSku))
			//判断属性是否可选
			let assemblyCache = []	//组合临时存放
			// 去除选中后的可选项
			selectedSkus.forEach(item=>{	//选把未选中的和选中的组合，如果是选中兄弟节点，把选中的值移除
				assemblyCache = JSON.parse(JSON.stringify(checkedId))
				assemblyCache.push(item)
				checkedBrother.forEach((item2,index2)=>{
					this.specification[item2].leaf.forEach(item3=>{
						// 和选中行是兄弟关系
						if(item3.id === item){
							assemblyCache.splice(assemblyCache.indexOf(checkedId[index2]),1)
						}
					})
				})
				assemblyCache.sort(function(value1, value2) {
					return parseInt(value1.replace("sku","")) - parseInt(value2.replace("sku",""));
				})
				
				// assembly.push(assemblyCache.join("_"))
				// 判断选择项是否在可选集合内
				if(!this.SKUResult[assemblyCache.join("_")]){
					this.specification[this.selectedSkuIndex[item].index].leaf[this.selectedSkuIndex[item].leaf].disabled = true
				}else{
					this.specification[this.selectedSkuIndex[item].index].leaf[this.selectedSkuIndex[item].leaf].disabled = false
				}
			})
		},
		//输入价格
		priceInput: function(event) {
			this.cartGood.price = parseFloat(event.target.value)
        },
		//选择规格
		selectSpec(index, childIndex,res){
			if (res.disabled){	//不可选的直接返回
				return false
			}
			let chooseAll = false	//是否选全
			let specification = this.specification
			// 选中的清空
			if (this.specSelectedIndex[index] === childIndex){	//选择结果相同处理
				this.$set(specification[index]['leaf'][childIndex], 'selected', specification[index]['leaf'][childIndex]['selected'] ? false : true)
				this.specSelectedIndex[index]= null
				// 添加未选择的值
				this.noSelectedName.splice(index,0,specification[index].value)
			} else {	//选择不同的处理
				if(this.specSelectedIndex[index] !== null){	//不等于null的时候把同个规格的其它参数设为未选中
					this.$set(specification[index]['leaf'][this.specSelectedIndex[index]], 'selected',false)
				}
				
				this.$set(specification[index]['leaf'][childIndex], 'selected', specification[index]['leaf'][childIndex]['selected'] ? false : true)
				this.specSelectedIndex[index]=childIndex
				// this.noSelectedName
				// 删除选中的元素
				this.noSelectedName.forEach((item,indexs)=>{
					if(item === specification[index].value){
						this.noSelectedName.splice(indexs,1)
					}
				})
				
			}
			
			if(this.noSelectedName.length > 0){
				this.specificationDefaultDisplay = {
					img: this.getLists.resources_many[0].img,
					price_show: this.getLists.price_show,
					inventory_show: this.getLists.inventory_show,
					selected: '选择 ' + this.noSelectedName
				}
				if(!this.update){
					this.$emit('purchasePattern','选择 ' + this.noSelectedName)
				}
				
			}
			//保存最新选择的位置
			
			//存储已选择
			/**
			 * 修复选择规格存储错误
			 * 将这几行代码替换即可
			 * 选择的规格存放在specSelected中
			 */
			this.specSelected = []
			let ids = ''
			let checkedId = []	//选中的ID
			let checkedBrother = []	//兄弟列表
			let selectedSkus =JSON.parse(JSON.stringify(this.selectedSku))
			this.specSelectedIndex.forEach((item,index)=>{
				
				if(item !== null){
					this.specSelected.push(specification[index]['leaf'][item])
					ids += specification[index]['id'] + '-' + specification[index]['leaf'][item]['id'] + '_'
					checkedId.push(specification[index]['leaf'][item]['id'])
					selectedSkus.splice(selectedSkus.indexOf(specification[index]['leaf'][item]['id']),1)
					checkedBrother.push(index)
					
					chooseAll = true
				}else {
					chooseAll = false
				}
			})
			
			//判断属性是否可选
			let assemblyCache = []	//组合临时存放
			
			// 去除选中后的可选项
			selectedSkus.forEach(item=>{	//选把未选中的和选中的组合，如果是选中兄弟节点，把选中的值移除
				assemblyCache = JSON.parse(JSON.stringify(checkedId))
				assemblyCache.push(item)
				checkedBrother.forEach((item2,index2)=>{
					this.specification[item2].leaf.forEach(item3=>{
						// 和选中行是兄弟关系
						if(item3.id === item){
							assemblyCache.splice(assemblyCache.indexOf(checkedId[index2]),1)
						}
					})
				})
				assemblyCache.sort(function(value1, value2) {
					return parseInt(value1.replace("sku","")) - parseInt(value2.replace("sku",""));
				})
				// assembly.push(assemblyCache.join("_"))
				// 判断选择项是否在可选集合内
				if(!this.SKUResult[assemblyCache.join("_")]){
					specification[this.selectedSkuIndex[item].index].leaf[this.selectedSkuIndex[item].leaf].disabled = true
				}else{
					specification[this.selectedSkuIndex[item].index].leaf[this.selectedSkuIndex[item].leaf].disabled = false
				}
			})
			
			
			// console.log(ids.substr(0, ids.length - 1))
			// 选项已选择
			if(chooseAll === true){
				this.cartGood.number = 1
				this.shoppingAttributes = []
				for (var i = 0; i < this.productSkus.length; i++) {
					if(this.productSkus[i].ids === ids.substr(0, ids.length - 1)){
						const specificationDefaultDisplay = this.specificationDefaultDisplay
						const selectedName= []
						this.productSkus[i].skus.forEach(items=>{
							selectedName.push(items.v)
						})
						this.specificationDefaultDisplay = {
							img: this.productSkus[i].resources ? this.productSkus[i].resources.img : this.getLists.resources_many[0].img,
							price_show: [this.productSkus[i].price],
							inventory_show: this.productSkus[i].inventory,
							selected: '已选 ' + selectedName.join(";"),
							cost_price: this.productSkus[i].cost_price
						}
						if(!this.update){
							this.$emit('purchasePattern','已选 ' + selectedName.join(";"))
						}
						this.cartGood.price = this.productSkus[i].price
						this.shoppingAttributes = this.productSkus[i]
						break
					}
				}
			}
		},
		//数量
		numberChange(data){
			this.cartGood.number = data.number
		},
		//加入购物车
		cart(){
			// 单品或已选规格
			if(this.shoppingAttributes.id > 0 || this.getLists.good_sku.length === 0){
				const tmp = /^\d+\.?\d{0,2}$/
				if (!tmp.test(this.cartGood.price)) {
					uni.showToast({
						icon: 'none',
					    title: '输入的金额有误',
					    duration: 2000
					})
					return false
				}
				this.$emit('toggleSpec')
				
				if(this.order){	//订单更新，直接返回更新后的数据
					// 非SKU商品不允许订单下修改，故不做处理
					if(this.getLists.good_sku.length>0){
						let img = this.getLists.resources_many[0].img
						if(this.shoppingAttributes.resources){
							img = this.shoppingAttributes.resources.img
						}
						let cart={
							id: this.cartDetails.id ? this.cartDetails.id : 0,
							name: this.getLists.name,
							price: this.cartGood.price,
							number: this.cartGood.number,
							good_sku_id:this.shoppingAttributes.id,
							good_id: this.getLists.id,
							good: this.getLists,
							good_sku:this.shoppingAttributes,
							img: img
						}
						this.$emit('setOrder',cart)
					}
					
				}else{
					// uni.removeStorageSync('cartList')
					let cartList =  uni.getStorageSync('dsshopCartList') || {}
					if(this.buyState){	//直接购买
						cartList = {}
					}
					let img = this.getLists.resources_many[0].img
					//sku
					if(this.getLists.good_sku.length>0){
						if(this.shoppingAttributes.resources){
							img = this.shoppingAttributes.resources.img
						}
						if(this.update){ //更新
							// 判断用户是否更改了SKU
							if(this.good_sku.id !== this.shoppingAttributes.id){
								delete cartList[this.good_sku.id]
							}
						}
						if(cartList[this.shoppingAttributes.id]){	//已存在，更新其它属性，增加新添加的数量
							if(this.update){ //更新
								cartList[this.shoppingAttributes.id].number= this.cartGood.number
							}else{
								cartList[this.shoppingAttributes.id].number+= this.cartGood.number
							}
							
							//如果购物车商品购买数大于当前库存，将结果改成库存数量
							if(cartList[this.shoppingAttributes.id].number > this.specificationDefaultDisplay.inventory_show){
								cartList[this.shoppingAttributes.id].number = this.specificationDefaultDisplay.inventory_show
							}
							cartList[this.shoppingAttributes.id].price = this.cartGood.price
							cartList[this.shoppingAttributes.id].name = this.getLists.name
							cartList[this.shoppingAttributes.id].good_id = this.getLists.id
							const good = JSON.parse(JSON.stringify(this.getLists))
							delete good.details
							cartList[this.shoppingAttributes.id].good = good
							cartList[this.shoppingAttributes.id].good_sku_id = this.shoppingAttributes.id
							cartList[this.shoppingAttributes.id].good_sku = this.shoppingAttributes
							cartList[this.shoppingAttributes.id].img = img
						}else{
							cartList[this.shoppingAttributes.id]={
								price: this.cartGood.price,
								number: this.cartGood.number,
								name: this.getLists.name,
								good_id: this.getLists.id,
								good: this.getLists,
								good_sku_id:this.shoppingAttributes.id,
								good_sku:this.shoppingAttributes,
								img: img
							}
						}
					}else{
						if(cartList['good_' + this.getLists.id]){
							if(this.update){ //更新
								cartList['good_' + this.getLists.id].number= this.cartGood.number
							}else{
								cartList['good_' + this.getLists.id].number+= this.cartGood.number
							}
							
							//如果购物车商品购买数大于当前库存，将结果改成库存数量
							if(cartList['good_' + this.getLists.id].number > this.getLists.inventory_show){
								cartList['good_' + this.getLists.id].number = this.getLists.inventory_show
							}
							cartList['good_' + this.getLists.id].price = this.cartGood.price
							cartList['good_' + this.getLists.id].name = this.getLists.name
							cartList['good_' + this.getLists.id].good_id = this.getLists.id
							cartList['good_' + this.getLists.id].good = this.getLists
							cartList['good_' + this.getLists.id].img = img
						}else{
							cartList['good_' + this.getLists.id]={
								price: this.cartGood.price,
								number: this.cartGood.number,
								name: this.getLists.name,
								good_id: this.getLists.id,
								good: this.getLists,
								img: img
							}
						}
						
					}
					
					if(this.buyState){	//直接购买
						uni.setStorageSync('dsshopOrderList', cartList)
					}else{
						// 发送给后台
						GoodIndent.addShoppingCart(cartList,function(res){})
						uni.setStorageSync('dsshopCartList', cartList)
					}
					
					
				}
				this.initList()
				if(this.update){ //更新
				}else{
					if(this.buyState){	//直接购买
						uni.navigateTo({
							url: `/pages/indent/create`
						})
					}else{
						uni.showToast({
						    title: '成功加入购物车',
						    duration: 2000
						})
					}
					
				}
				this.$emit('loadCart') //重载数据
			} else{
				uni.showToast({
					icon: 'none',
				    title: '请选择规格',
				    duration: 2000
				})
			}
			
		},
		//初始化
		initList(){
			this.cartGood= {
				number: 1,
				price: ''
			}
			
			this.specification = []
			this.specificationDefaultDisplay = []
			this.SKUResult = []
			this.specSelected = []
			this.specSelectedIndex= []
			this.selectedName = []
			this.noSelectedName = []
			this.selectedSku = []
			this.selectedSkuIndex = [[]]
			this.productSkus = []
			this.shoppingAttributes = []
			this.loadData()
		},
		previewImage(imageUrl){ 
			var images = [];
			images.push(imageUrl);
			uni.previewImage({
				current:0,
				urls:images,
			});
		},
	},

}
</script>

<style lang="scss">
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

/*  弹出层 */
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
</style>
