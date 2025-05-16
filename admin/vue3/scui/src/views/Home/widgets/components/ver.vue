<template>
	<el-card shadow="hover" header="版本信息">
		<div style="height: 210px; text-align: center">
			<img src="img/ver.svg" style="height: 140px" />
			<h2 style="margin-top: 15px">TFSHOP {{ data.version }}</h2>
			<p style="margin-top: 5px">最新版本 {{ data.tag_name }}</p>
			<p style="margin-top: 5px">
				<el-button v-if="data.version !== data.tag_name" type="primary" size="small" round @click="goPath"
					>立即更新</el-button
				>
			</p>
		</div>
		<div style="margin-top: 20px"></div>
	</el-card>
</template>

<script>
export default {
	title: "版本信息",
	icon: "el-icon-monitor",
	description: "当前项目版本信息",
	data() {
		return {
			ver: "loading...",
			version: "",
			data: {
				version: "获取中",
				tag_name: "获取中",
				html_url: "",
			},
		};
	},
	mounted() {
		this.getVer();
	},
	methods: {
		async getVer() {
			try {
				const res = await this.$API.auth.getVersion.get();
				this.data = res.message;
				console.log(this.data)
			} catch (error) {
				// 处理获取版本信息过程中出现的错误
				console.error("获取版本信息失败：", error);
			}
		},
		goPath() {
			window.open(this.data.html_url, '_blank');
		},
	},
};
</script>
