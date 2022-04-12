<template>
    <div class="coupon-item">
		<div class="coupon-money">
			<div class="nick" v-if="item.seller_name">{{item.seller_name}}使用</div>
			<div class="layof" v-if="item.type === 3" :style="{color:theme}">{{item.money}}%</div>
			<div class="layof" v-else :style="{color:theme}">￥{{item.money}}</div>
			<div class="tit" v-if="item.ticket">券号：{{item.ticket}}</div>
			<div class="demand" v-if="item.title">{{item.title}}</div>
			<div class="end_time" v-if="item.end_time">{{item.end_time}}前使用</div>
			<div class="time" v-else>使用期限 {{item.time}}</div>
		</div>
		<div v-if="item.state === '1'">
			<div class="get-btn" v-if="!types" :style="{color:color, borderColor:color, background:solid}" @tap="getCoupon(item)">立即领取</div>
			<navigator class="get-btn" v-else :style="{color:color, borderColor:color, background:solid}" :url="item.url" open-type="switchTab" hover-class="other-navigator-hover">立即使用</navigator>
		</div>
		<div v-else-if="item.state === '2'">
			<div class="get-btn" v-if="!types">已领取</div>
			<div class="get-btn" v-else>已使用</div>
		</div>
		<div v-else>
			<div class="get-btn" v-if="!types">已领取</div>
			<div class="get-btn" v-else>已失效</div>
		</div>
    </div>
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
$page-row-spacing:15px;
$page-color-base:#f8f8f8;
$page-color-light:#f8f6fc;
$page-p-l-t-r-30:15px 15px 0 15px;
$page-p-20:15px;

/* 文字尺寸 */
$font-sm:15px;
$font-base:15px;
$font-lg:15px;

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
	width:100%; height:auto; display:table; border-radius:5px; padding:0 10px; margin-top:11px; border:1px solid #eeeeee; position:relative;
	.coupon-money {
		width:232px; height:auto; display:table; float:left; padding:13px 0; border-style:none dotted none none; border-color:#eeeeee;

		.nick { width:100%; height:25px; line-height:25px; font-size:$font-sm; color:$font-color-999; }
		.tit { width:100%; height:25px; line-height:25px; font-size:$font-sm; color:$font-color-999; }
		.demand { width:100%; height:20px; line-height:15px; font-size:$font-sm; color:$font-color-999; }

		.layof { width:100%; height:24px; line-height:15px; font-size:22px; color:#ff9000; font-weight:bold; }
		.end_time { width:100%; height:15px; line-height:15px; font-size:$font-sm; color:$font-color-999; }
		.time { width:100%; height:20px; line-height:15px; font-size:$font-sm; color:$font-color-999; }
	}
	.get-btn { width:73px; height:26px; line-height:25px; position:absolute; top:50%; right:5px; margin-top:-26upx; text-align:center; border-radius:30px; color:#ff9000; border:1px solid #ff9000; font-size:$font-sm; float:right; }
}
.coupon-item:after { width:20px; height:10px; position:absolute; left:230px; top:-1px; border-radius:0 0 20px 20px; content:""; display:block; background:$bgcolor_white; border:1px solid #eeeeee; border-top:0; }
.coupon-item:before { width:20px; height:10px; position:absolute; left:230px; bottom:-1px; border-radius:20px 20px 0 0; content:""; display:block; background:$bgcolor_white; border:1px solid #eeeeee; border-bottom:0; }
</style>
