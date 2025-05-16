<template>
	<el-card shadow="never" header="当前已用量">
		<el-progress :text-inside="true" :stroke-width="20" :color="color" :percentage="value" :format="format"/>
		<el-row :gutter="15" style="margin-top: 20px;">
			<el-col :lg="6">
				<el-card shadow="never">
					<sc-statistic title="文档" value="7.41" suffix="GB" groupSeparator></sc-statistic>
				</el-card>
			</el-col>
			<el-col :lg="6">
				<el-card shadow="never">
					<sc-statistic title="图片" value="12.90" suffix="GB" groupSeparator></sc-statistic>
				</el-card>
			</el-col>
			<el-col :lg="6">
				<el-card shadow="never">
					<sc-statistic title="视音频" value="68.79" suffix="MB" groupSeparator></sc-statistic>
				</el-card>
			</el-col>
			<el-col :lg="6">
				<el-card shadow="never">
					<sc-statistic title="其他" value="17.58" suffix="GB" groupSeparator></sc-statistic>
				</el-card>
			</el-col>
		</el-row>
	</el-card>
</template>

<script>
	import scStatistic from '@/components/scStatistic';

	export default {
		components: {
			scStatistic
		},
		data() {
			return {
				value: 39.58,
				color: [
					{ color: '#67C23A', percentage: 40 },
					{ color: '#E6A23C', percentage: 60 },
					{ color: '#F56C6C', percentage: 80 },
				]
			}
		},
		methods: {
			format(percentage){
				return percentage + "G"
			}
		}
	}
</script>

<style>
</style>
