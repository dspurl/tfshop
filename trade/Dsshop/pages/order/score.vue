<template>
	<view class="content">
		<view class="score-list" v-for="(ite,ind) in commodity" :key="ind">
			<view class="goods-box-single margin-top">
				<image class="goods-img" :src="ite.img" mode="aspectFill" lazy-load></image>
				<view class="right">
					<text class="title clamp">{{ite.name}}</text>
					<text class="attr-box clamp">{{ite.specification}}</text>
					<text><text class="text-red text-price padding-right">{{ite.price}}</text><text>x {{ite.number}}</text></text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">综合评分</view>
				<uni-rate @change="setScore" v-model="data[ind].score" active-color="#fa436a" :is-fill="false"/>
				<text>{{scoreName[data[ind].score]}}</text>
			</view>
			<view class="cu-bar bg-white">
				<view class="action">
					添加图片
				</view>
				<view class="action">
					{{data[ind].resources.length}}/4
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in data[ind].resources" :key="index" @tap="ViewImage(ind,index)" :data-url="data[ind].resources[index]">
					 <image :src="data[ind].resources[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg(ind,index)">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage(ind)" v-if="data[ind].resources.length<4">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
			<view class="cu-form-group">
				<checkbox-group @change="setAnonymity(ind)">
					<checkbox class='round red' :class="data[ind].anonymity?'checked':''" :checked="data[ind].anonymity?true:false"></checkbox>
					<text class="anonymity">匿名评价</text>
				</checkbox-group>
			</view>
			<view class="cu-form-group">
				<textarea maxlength="-1" :disabled="data[ind].details!=null" @input="textareaAInput($event,ind)" placeholder="亲,您对这个商品满意吗？您的评价会帮助我们选择更好的商品哦~"></textarea>
			</view>
		</view>
		<view class="height45"></view>
		<button class="add-btn" @click="addComment()">提交评价</button>
	</view>
</template> 

<script>
	import Comment from '../../api/comment'
	import {mapMutations} from 'vuex'
	export default {
		components: {
			
		},
		data() {
			return {
				imgList: [],
				scoreName: ['','差','较差','一般','好','很好'],
				data: [],
				commodity: [],
				id: ''
			}
		},
		
		onLoad: function(options) {
			if(!options.id){
				this.$api.msg('参数有误')
			}else{
				this.id = options.id
			}
			this.loginCheck()
			this.loadData()
		},
		methods: {
			...mapMutations(['loginCheck']),
			// 获取商品列表
			async loadData() {
				const that = this
				Comment.goodIndentCommodity(this.id,function(res){
					that.commodity = res
					res.forEach((item,index)=>{
						that.data[index]={
							score:0,
							details: null,
							resources:[],
							anonymity: 0,
							id:item.id
						}
					})
				})
			},
			// 评价内容
			textareaAInput(e,index){
				this.data[index].details=e.detail.value
				
			},
			// 设置星级评分
			setScore(e){
				this.$forceUpdate()
			},
			ChooseImage(index) {
				let that = this
				let uploadFile = ''
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: (res) => {
						uni.uploadFile({
						  url: uni.getStorageSync('applyDsshopSecret').host + 'uploadPictures',
						  filePath: res.tempFilePaths[0],
						  name: 'file',
						  header: {
							'apply-secret': uni.getStorageSync('applyDsshopSecret').secret,
							'Authorization': 'Bearer ' + uni.getStorageSync('dsshopApplytoken')
						  },
						  formData: {
							type: 1,
							size: 1024 * 500
						  },
						  success(res) {
							that.data[index].resources.push(res.data)
							that.$forceUpdate()
						  },
						  fail(res) {
							that.$api.msg(res.message);
							return false
						  }
						})
					}
				});
			},
			// 预览图片
			ViewImage(ind,index) {
				uni.previewImage({
					urls: this.data[ind].resources,
					current: this.data[ind].resources[index].url
				});
			},
			// 删除图片
			DelImg(ind,index) {
				uni.showModal({
					content: '确定要删除该图片？',
					cancelText: '再看看',
					confirmText: '再见',
					success: res => {
						if (res.confirm) {
							this.data[ind].resources.splice(index, 1)
							this.$forceUpdate()
						}
					}
				})
			},
			// 是否匿名
			setAnonymity(ind){
				this.data[ind].anonymity = this.data[ind].anonymity ? 0 : 1
				this.$forceUpdate()
			},
			// 提交
			addComment(){
				const that = this
				let data = this.data
				for (const [index,item] of data.entries()){
					if(!item.score){
						this.$api.msg('您还有未选择的星级评分');
						return;
					}
					if(!item.details){
						this.$api.msg('您还有未填写的评价内容');
						return;
					}
				}
				Comment.createSubmit(this.id,data,function(res){
					that.$api.msg(`评价成功`);
					setTimeout(()=>{
						uni.navigateBack()
					}, 800)
				})
			}
		},
		
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	.height45{
		height: 120upx;
		display: flex;
	}
	.add-btn{
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
	.anonymity{
		padding-left: 30upx;
		position: relative;
		top:4upx;
	}
	/* 单条商品 */
	.goods-box-single{
		background-color: #FFFFFF;
		display: flex;
		padding: 20upx 30upx;
		.goods-img{
			display: block;
			width: 120upx;
			height: 120upx;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			padding: 0 30upx 0 24upx;
			overflow: hidden;
			.title{
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				line-height: 1;
			}
			.attr-box{
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				padding: 10upx 12upx;
			}
			.price{
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				&:before{
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
	}
</style>
