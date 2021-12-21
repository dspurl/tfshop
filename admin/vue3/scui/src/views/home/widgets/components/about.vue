<template>
	<el-card shadow="hover" header="关于项目" class="item-background">
		<p>一套多终端商城解决方案，支持网站、平板、PWA、H5、小程序、安卓、IOS，如果喜欢就点个星星支持一下。</p>
		<p>
			<a class="github" href="https://github.com/dspurl/dsshop" target="_blank">
				<img
					src="https://img.shields.io/github/stars/dspurl/dsshop.svg"
					alt="star"
					style="vertical-align: middle"
				/>
			</a>
			<a href="https://gitee.com/dswjcms/dsshop" target="_blank">
				<img
					src="https://gitee.com/dswjcms/dsshop/badge/star.svg?theme=dark"
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
