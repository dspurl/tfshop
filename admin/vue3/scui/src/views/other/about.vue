<template>
	<el-main>
		<el-row :gutter="15">
			<el-col :lg="24">
				<el-card shadow="never" class="aboutTop">
					<div class="aboutTop-info">
						<img src="img/logo.png">
						<h2>{{data.name}}</h2>
						<p>{{data.version}}</p>
					</div>
				</el-card>
				<el-card shadow="never" header="dependencies">
					<el-descriptions border :column="3">
						<el-descriptions-item v-for="(value, key) in data.dependencies" :key="key" :label="key">{{value}}</el-descriptions-item>
					</el-descriptions>
				</el-card>
				<el-card shadow="never" header="devDependencies">
					<el-descriptions border :column="3">
						<el-descriptions-item v-for="(value, key) in data.devDependencies" :key="key" :label="key">{{value}}</el-descriptions-item>
					</el-descriptions>
				</el-card>
			</el-col>
		</el-row>
	</el-main>
</template>

<script>
	import packageJson from '../../../package.json'

	export default {
		name: 'about',
		data() {
			return {
				data: packageJson
			}
		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style scoped>
	.aboutTop {border:0;background: linear-gradient(to right, #8E54E9, #4776E6);color: #fff;}
	.aboutTop-info {text-align: center}
	.aboutTop-info img {width: 100px;}
	.aboutTop-info h2 {font-size: 26px;margin-top: 15px;}
	.aboutTop-info p {font-size: 16px;margin-top: 10px;}
</style>
