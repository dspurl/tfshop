<template>
	<el-card shadow="hover" header="关于项目" class="item-background">
		<p>轻量级单用户商城解决方案，如果喜欢就点个星星支持一下。</p>
		<p>基于MIT协议，可免费商用（禁止售卖）</p>
		<p>TFSHOP每个版本都申请了软著，未取得售卖授权，不得售卖基于TFSHOP的任何衍生版本，不然将通过法律途径追责！</p>
		<p>
			<a class="github" href="https://github.com/dspurl/dsshop" target="_blank">
				<img
					src="https://img.shields.io/github/stars/dspurl/dsshop.svg"
					alt="star"
					style="vertical-align: middle"
				/>
			</a>
		</p>
	</el-card>
</template>

<script>
export default {
	title: "关于项目",
	icon: "el-icon-setting",
	description: "点个星星支持一下",
	data() {
		return {

		}
	}
}
</script>

<style lang='scss' scoped>
.item-background p {
	color: #999;
	margin-top: 10px;
	line-height: 1.8;
}
a {
	margin-right: 10px;
}
.github{
	position: relative;
	top: -1px;
}
</style>
