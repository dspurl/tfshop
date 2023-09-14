<template>
	<view>
		<!-- 运费单号 -->
		<view v-if="indentList.odd" class="address-section">
			<view class="order-content">
				<text class="cuIcon-deliver"></text>
				{{indentList.dhl.name}}
				<view class="cen">
					<view class="copy-box">
						<view class="odd">{{indentList.odd}}</view>
						<view class="copy text-blue" 
						v-clipboard:copy="indentList.odd"
						v-clipboard:success="onSuccess" 
						v-clipboard:error="onError"
						>{{$t('common.copy')}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 地址 -->
		<view v-if="indentList.good_location" class="address-section">
			<view class="order-content">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="cen">
					<view class="top">
						<text class="name">{{ indentList.good_location.name }}</text>
						<text class="mobile">{{ indentList.good_location.cellphone }}</text>
					</view>
					<text class="address">
						{{ indentList.good_location.location }}
						<block v-if="indentList.good_location.address">({{ indentList.good_location.address }})</block>
						{{ indentList.good_location.house }}
					</text>
				</view>
			</view>
		</view>

		<view class="goods-section">
			<!-- 商品列表 -->
			<navigator
				:url="'/pages/product/detail?id=' + item.good_id"
				hover-class="none"
				class="g-item padding-top-sm"
				v-for="(item, index) in indentList.goods_list"
				:key="index"
			>
				<image :src="item.img  | smallImage" lazy-load></image>
				<view class="right">
					<text class="title clamp">{{ item.name }}</text>
					<text class="spec">{{ item.specification }}</text>
					<view class="price-box">
						<text class="price">{{$t('common.unit')}}{{ item.price }}</text>
						<text class="number">x {{ item.number }}</text>
					</view>
				</view>
			</navigator>
		</view>
		<!-- 金额明细 -->
		<view class="yt-list margin-bottom">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">{{$t('indent.remark')}}</text>
				<text class="cell-tip">{{ indentList.remark ? indentList.remark : '' }}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">{{$t('indent.total')}}</text>
				<text class="cell-tip">{{$t('common.unit')}}{{ total | 1000 }}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="!indentList.integral_draw_log">
				<text class="cell-tit clamp">{{$t('indent.freight')}}</text>
				<text class="cell-tip">
					<block v-if="indentList.carriage > 0">{{ indentList.carriage | 1000 }}</block>
					<block v-else>{{$t('indent.free_shipping')}}</block>
				</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">{{$t('indent.actual_payment')}}</text>
				<text class="cell-tip">{{ indentList.total | 1000 }}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">{{$t('indent.identification')}}</text>
				<text class="cell-tip" v-clipboard:copy="indentList.identification"
        v-clipboard:success="onSuccess" 
        v-clipboard:error="onError">{{ indentList.identification }}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">{{$t('indent.status')}}</text>
				<text class="cell-tip">{{ indentList.state_show }}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="indentList.state !== 1">
				<text class="cell-tit clamp">{{$t('mode.payment')}}</text>
				<text class="cell-tip">{{ indentList.pay_way }}</text>
			</view>
			<!-- 卡密-->
			<template v-if="indentList.good_code.length">
				<view class="yt-list-cell b-b">
					<text class="cell-tit clamp">{{code_type ? $t('good.code_type.web_disk') : $t('good.code_type.carmi')}}</text>
					<text class="cell-tip"></text>
				</view>
				<view class="yt-list-cell b-b" v-for="(item,index) in indentList.good_code" :key="index">
					<view class="cell-tit clamp"><template v-if="item.name">{{code_type ? $t('good.good_code.url') : $t('good.good_code.card_number')}}：{{ item.name }}<text class="text-gray cuIcon-copy" style="margin-left: 10rpx;" @tap="setClipboardData(item.name)"></text></template></view>
					<view class="cell-tip">{{code_type ? $t('good.web_disk.code') : $t('good.code_type.carmi')}}：{{ item.code }}<text class="text-gray cuIcon-copy" style="margin-left: 10rpx;" @tap="setClipboardData(item.code)"></text></view>
				</view>
			</template>
			<view class="yt-list-cell b-b" v-if="indentList.receiving_time">
				<text class="cell-tit clamp">{{$t('indent.receiving_time')}}</text>
				<text class="cell-tip" style="color: #fa436a;">{{ indentList.receiving_time }}</text>
			</view>
		</view>
		<!-- 底部 -->
		<view v-if="indentList.state === 1 || indentList.state === 3 || indentList.state === 10 || indentList.state === 12" class="footer">
			<view class="price-content"></view>
			<navigator v-if="indentList.state === 1" :url="'/pages/money/pay?id=' + indentList.id" hover-class="none" class="submit">{{$t('indent.payment')}}</navigator>
			<view v-else-if="indentList.state === 3" class="submit" @click="confirmReceipt(indentList)">{{$t('indent.confirm_receipt')}}</view>
		</view>
		<view class="footer" v-if="indentList.download">
			<view class="price-content"></view>
			<view class="submit" @click="goDownload">{{$t('indent.download')}}</view>
		</view>
	</view>
</template>

<script>
import GoodIndent from '../../api/goodIndent';
import {mapMutations} from 'vuex'
export default {
	data() {
		return {
			id: '',
			indentList: {
				total: 0,
				good_code: []
			},
			goodList: [],
			addressData: {},
			carriage: 0,
			total: 0,
			outPocket: 0,
			order: [],
			onError: null,
			isType: true,
			code_type: 0
		};
	},
	onLoad(option) {
		if (!option.id) {
			this.$api.msg(this.$t('common.arguments'));
			return false;
		}
		this.id = option.id;
	},
	onShow(){
		uni.setNavigationBarTitle({
			title: this.$t('indent.details')
		})
		this.loginCheck()
		//商品数据
		this.getList();
	},
	methods: {
		...mapMutations(['loginCheck']),
		async getList() {
			let list = {};
			const that = this;
			await GoodIndent.detail(this.id, function(res) {
				for (var k in res.goods_list) {
					if (res.goods_list[k].good_sku) {
						that.code_type = res.goods_list[k].good_sku.code_type
						res.goods_list[k].good_sku.product_sku.forEach(item => {
							if (res.goods_list[k].specification) {
								res.goods_list[k].specification += item.value + ';';
							} else {
								res.goods_list[k].specification = item.value + ';';
							}
						});
						res.goods_list[k].specification = res.goods_list[k].specification.substr(0, res.goods_list[k].specification.length - 1);
					}
					if (res.goods_list[k].good.type === 2 || res.goods_list[k].good.type === 3) {
						that.isType = false
					}
				}
				that.indentList = res;
				that.calcTotal();
			});
		},
		//计算总价
		calcTotal() {
			let list = this.indentList.goods_list;
			let total = 0;
			list.forEach(item => {
				total += item.price * item.number;
			});
			this.total = Number(total.toFixed(2));
		},
		onSuccess: function (res) {
			this.$api.msg(this.$t('hint.succeed.win', {attribute:this.$t('common.copy')}))
	    },
	    onError: function (err) {
		    this.$api.msg(this.$t('hint.succeed.fail', {attribute:this.$t('common.copy')}))
	    },
		confirmReceipt(item){
			const that = this
			GoodIndent.receipt(item.id,function(res){
				that.getList()
			})
		},
		stopPrevent() {},
		// 下载文件
		goDownload() {
			const that = this
			GoodIndent.download(this.indentList.id,function(res){
				// #ifndef H5
				uni.downloadFile({
					url: that.configURL.BaseURL + 'indentDownload/'+ res,
					success: (res) => {
						if (res.statusCode === 200) {
							const filePath = res.tempFilePath
							uni.openDocument({
								filePath: filePath,
								success: function (res) {
								
								},
								fail: function (ress) {
									that.$api.msg(that.$t('indent.download.error.not'))
								}
							})
							
						} else {
							this.$api.msg(this.$t('indent.download.error'))
						}
					}
				});
				// #endif
				// #ifdef H5
				window.open(that.configURL.BaseURL + 'indentDownload/'+ res)
				// #endif
			})
		},
		// 复制卡密信息
		setClipboardData(e) {
			uni.setClipboardData({
				data: e,
				success: function () {}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
	padding-bottom: 100upx;
}

.address-section {
	padding: 30upx 0;
	background: #fff;
	position: relative;

	.order-content {
		display: flex;
		align-items: center;
	}

	.icon-shouhuodizhi {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 90upx;
		color: #888;
		font-size: 44upx;
	}
	.cuIcon-deliver{
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 90upx;
		color: #888;
		font-size: 44upx;
	}
	.cen {
		display: flex;
		flex-direction: column;
		flex: 1;
		font-size: 28upx;
		color: $font-color-dark;
		.copy-box{
			display: flex;
			padding-left: 10rpx;
			.odd{
				padding-top:4rpx;
			}
			.copy{
				margin-left: 10rpx;
			}
		}
	}

	.name {
		font-size: 34upx;
		margin-right: 24upx;
	}

	.address {
		margin-top: 16upx;
		margin-right: 20upx;
		color: $font-color-light;
	}

	.icon-you {
		font-size: 32upx;
		color: $font-color-light;
		margin-right: 30upx;
	}

	.a-bg {
		position: absolute;
		left: 0;
		bottom: 0;
		display: block;
		width: 100%;
		height: 5upx;
	}
}

.goods-section {
	margin-top: 16upx;
	background: #fff;
	padding-bottom: 1px;

	.g-header {
		display: flex;
		align-items: center;
		height: 84upx;
		padding: 0 30upx;
		position: relative;
	}

	.logo {
		display: block;
		width: 50upx;
		height: 50upx;
		border-radius: 100px;
	}

	.name {
		font-size: 30upx;
		color: $font-color-base;
		margin-left: 24upx;
	}

	.g-item {
		display: flex;
		margin: 20upx 30upx;

		image {
			flex-shrink: 0;
			display: block;
			width: 140upx;
			height: 140upx;
			border-radius: 4upx;
		}

		.right {
			flex: 1;
			padding-left: 24upx;
			overflow: hidden;
			.tag-box{
				display: flex;
				.seckill-tag{
					background: #fa524c;
					color: #ffffff;
					border-radius: 10rpx;
					font-size: 24rpx;
					padding: 0 10rpx;
				}
				.group-purchase-tag{
					background: #D1478E;
					color: #ffffff;
					border-radius: 10rpx;
					font-size: 24rpx;
					padding: 0 10rpx;
				}
			}
		}

		.title {
			font-size: 30upx;
			color: $font-color-dark;
		}

		.spec {
			font-size: 26upx;
			color: $font-color-light;
		}

		.price-box {
			display: flex;
			align-items: center;
			font-size: 32upx;
			color: $font-color-dark;
			padding-top: 10upx;

			.price {
				margin-bottom: 4upx;
			}
			.number {
				font-size: 26upx;
				color: $font-color-base;
				margin-left: 20upx;
			}
		}

		.step-box {
			position: relative;
		}
	}
}
.yt-list {
	margin-top: 16upx;
	background: #fff;
}

.yt-list-cell {
	display: flex;
	align-items: center;
	padding: 10upx 30upx 10upx 40upx;
	line-height: 70upx;
	position: relative;

	&.cell-hover {
		background: #fafafa;
	}

	&.b-b:after {
		left: 30upx;
	}

	.cell-icon {
		height: 32upx;
		width: 32upx;
		font-size: 22upx;
		color: #fff;
		text-align: center;
		line-height: 32upx;
		background: #f85e52;
		border-radius: 4upx;
		margin-right: 12upx;

		&.hb {
			background: #ffaa0e;
		}

		&.lpk {
			background: #3ab54a;
		}
	}

	.cell-more {
		align-self: center;
		font-size: 24upx;
		color: $font-color-light;
		margin-left: 8upx;
		margin-right: -10upx;
	}

	.cell-tit {
		flex: 1;
		font-size: 26upx;
		color: $font-color-light;
		margin-right: 10upx;
	}

	.cell-tip {
		font-size: 26upx;
		color: $font-color-dark;

		&.disabled {
			color: $font-color-light;
		}

		&.active {
			color: $base-color;
		}
		&.red {
			color: $base-color;
		}
	}

	&.desc-cell {
		.cell-tit {
			max-width: 90upx;
		}
	}

	.desc {
		flex: 1;
		font-size: $font-base;
		color: $font-color-dark;
	}
}

/* 支付列表 */
.pay-list {
	padding-left: 40upx;
	margin-top: 16upx;
	background: #fff;
	.pay-item {
		display: flex;
		align-items: center;
		padding-right: 20upx;
		line-height: 1;
		height: 110upx;
		position: relative;
	}
	.icon-weixinzhifu {
		width: 80upx;
		font-size: 40upx;
		color: #6bcc03;
	}
	.icon-alipay {
		width: 80upx;
		font-size: 40upx;
		color: #06b4fd;
	}
	.icon-xuanzhong2 {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60upx;
		height: 60upx;
		font-size: 40upx;
		color: $base-color;
	}
	.tit {
		font-size: 32upx;
		color: $font-color-dark;
		flex: 1;
	}
}

.footer {
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 995;
	display: flex;
	align-items: center;
	width: 100%;
	height: 90upx;
	justify-content: space-between;
	font-size: 30upx;
	background-color: #fff;
	z-index: 998;
	color: $font-color-base;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
	.price-content {
		padding-left: 30upx;
	}
	.price-tip {
		color: $base-color;
		margin-left: 8upx;
	}
	.price {
		font-size: 36upx;
		color: $base-color;
	}
	.submit {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 280upx;
		height: 100%;
		color: #fff;
		font-size: 32upx;
		background-color: $base-color;
	}
}
.winning-information{
	.name{
		width: 300rpx;
		color: #909399;
	}
	.content{
		flex:1;
	}
}
</style>
