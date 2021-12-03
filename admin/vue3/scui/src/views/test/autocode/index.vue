<template>
	<router-view></router-view>
	<el-main>
		<el-row :gutter="15">
			<el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="24" v-for="item in list" :key="item.title">
				<el-card shadow="hover" :body-style="{ padding: '0px' }" @click="click(item.url)">
					<div class="code-item">
						<div class="img" :style="{background: item.color}">
							<el-icon :style="`background-image: -webkit-linear-gradient(top left, #fff, ${item.color} 100px)`"><component :is="item.icon" /></el-icon>
						</div>
						<div class="title">
							<h2>{{item.title}}</h2>
							<h4>{{item.des}}</h4>
							<p><el-tag>{{item.ver}}</el-tag></p>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</el-main>
</template>

<script>
	export default {
		name: 'autocode',
		data() {
			return {
				list: [
					{
						title: "CRUD v2",
						des: "配置型生成经典的增删改查列表",
						icon: "el-icon-finished",
						color: "#ccc",
						ver: "开发中",
						url: "/test/autocode/list_n"
					},
					{
						title: "FormDesigner",
						des: "表单设计器",
						icon: "el-icon-list",
						color: "#ccc",
						ver: "开发中",
						url: "/test/autocode/form"
					}
				]
			}
		},
		methods: {
			click(url){
				this.$router.push({
					path: url
				});
			}
		}
	}
</script>

<style scoped>
	.el-card {margin-bottom: 15px;}
	.code-item {cursor: pointer;}
	.code-item .img {width: 100%;height: 150px;background: #09f;display:flex;align-items: center;justify-content: center;}
	.code-item .img i {font-size: 100px;color: #fff;background-image: -webkit-linear-gradient(top left, #fff, #09f 100px);-webkit-background-clip: text;-webkit-text-fill-color: transparent;}
	.code-item .title {padding:15px;}
	.code-item .title h2 {font-size: 16px;}
	.code-item .title h4 {font-size: 12px;color: #999;font-weight: normal;margin-top: 5px;}
	.code-item .title p {margin-top: 15px;}
</style>
