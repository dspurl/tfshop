<template>
    <view class="coupon-item">
		<view class="coupon-money">
			<view class="nick" v-if="item.seller_name">{{item.seller_name}}使用</view>
			<view class="layof" v-if="item.type === 3" :style="{color:theme}">{{item.money}}%</view>
			<view class="layof" v-else :style="{color:theme}">￥{{item.money}}</view>
			<view class="tit" v-if="item.ticket">券号：{{item.ticket}}</view>
			<view class="demand" v-if="item.title">{{item.title}}</view>
			<view class="end_time" v-if="item.end_time">{{item.end_time}}前使用</view>
			<view class="time" v-else>使用期限 {{item.time}}</view>
		</view>
		<view v-if="item.state === '1'">
			<view class="get-btn" v-if="!types" :style="{color:color, borderColor:color, background:solid}" @tap="getCoupon(item)">立即领取</view>
			<navigator class="get-btn" v-else :style="{color:color, borderColor:color, background:solid}" :url="item.url" open-type="switchTab" hover-class="other-navigator-hover">立即使用</navigator>
		</view>
		<view v-else-if="item.state === '2'">
			<view class="get-btn" v-if="!types">已领取</view>
			<view class="get-btn" v-else>已使用</view>
		</view>
		<view v-else>
			<view class="get-btn" v-if="!types">已领取</view>
			<view class="get-btn" v-else>已失效</view>
		</view>
    </view>
</template>

<script>
export default {
	components:{

	},
	data() {
		return {

		}
	},
	props:{
		item:{
			type: Object
		},
		types:{
			type: String,
			default: ''
		},
		theme:{
			type: String,
			default: '#ff9000'
		},
		solid:{
			type: String,
			default: '#ffffff'
		},
		color:{
			type: String,
			default: '#ff9000'
		},
	},
	methods: {
		getCoupon(item){
			this.$emit('getCoupon', item)
		}
	}
}
</script>

<style lang='scss'>
/* 页面左右间距 */
$page-row-spacing:30upx;
$page-color-base:#f8f8f8;
$page-color-light:#f8f6fc;
$page-p-l-t-r-30:30upx 30upx 0 30upx;
$page-p-20:30upx;

/* 文字尺寸 */
$font-sm:24upx;
$font-base:28upx;
$font-lg:32upx;

/*文字颜色*/
$font-color-dark:#303133;
$font-color-base:#606266;
$font-color-light:#909399;
$font-color-disabled:#C0C4CC;
$font-color-spec:#d6003c;
$font-color-gray:#999999;
$font-color-red:#dd0037;
$font-color-ccc:#cccccc;
$font-color-999:#999999;
$font-color-666:#666666;
$font-color-333:#333333;
$font-color-000:#000000;

/* 边框颜色 */
$border-color-dark:#DCDFE6;
$border-color-base:#E4E7ED;
$border-color-light:#EBEEF5;

/* 背景颜色 */
$image-bg-color:#eeeeee;
$bgcolor_white:#ffffff;
$all_bgcolor:#f4f4f4;
$vui_bgcolor:#8c0027;

/* 行为相关颜色 */
$color-primary:#fa436a;
$color-success:#4cd964;
$color-warning:#f0ad4e;
$color-error:#dd524d;
.coupon-item {
	width:100%; height:auto; display:table; border-radius:10upx; padding:0 20upx; margin-top:22upx; border:1px solid #eeeeee; position:relative;
	.coupon-money {
		width:465upx; height:auto; display:table; float:left; padding:26upx 0; border-style:none dotted none none; border-color:#eeeeee;
		
		.nick { width:100%; height:50upx; line-height:30upx; font-size:$font-sm; color:$font-color-999; }
		.tit { width:100%; height:50upx; line-height:50upx; font-size:$font-sm; color:$font-color-999; }
		.demand { width:100%; height:40upx; line-height:30upx; font-size:$font-sm; color:$font-color-999; }
		
		.layof { width:100%; height:48upx; line-height:30upx; font-size:44upx; color:#ff9000; font-weight:bold; }
		.end_time { width:100%; height:30upx; line-height:30upx; font-size:$font-sm; color:$font-color-999; }
		.time { width:100%; height:40upx; line-height:30upx; font-size:$font-sm; color:$font-color-999; }
	}
	.get-btn { width:146upx; height:52upx; line-height:50upx; position:absolute; top:50%; right:10upx; margin-top:-26upx; text-align:center; border-radius:60upx; color:#ff9000; border:1px solid #ff9000; font-size:$font-sm; float:right; }
}
.coupon-item:after { width:40upx; height:20upx; position:absolute; left:460upx; top:-1px; border-radius:0 0 40upx 40upx; content:""; display:block; background:$bgcolor_white; border:1px solid #eeeeee; border-top:0px; }
.coupon-item:before { width:40upx; height:20upx; position:absolute; left:460upx; bottom:-1px; border-radius:40upx 40upx 0 0; content:""; display:block; background:$bgcolor_white; border:1px solid #eeeeee; border-bottom:0px; }
</style>