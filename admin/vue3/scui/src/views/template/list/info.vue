<template>
	<el-main style="padding:0 20px;">

		<el-steps :active="3" finish-status="success" align-center style="margin-bottom:40px;">
			<el-step title="立项"></el-step>
			<el-step title="调研"></el-step>
			<el-step title="设计"></el-step>
			<el-step title="开发"></el-step>
			<el-step title="完成"></el-step>
		</el-steps>

		<div class="make">
			<div class="make-left">
				<el-button type="primary" size="small">主要操作</el-button>
				<el-button size="small">次要操作</el-button>
				<el-button size="small">次要操作</el-button>
				<el-dropdown>
					<el-button size="small" icon="el-icon-arrow-down"></el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item>更改状态</el-dropdown-item>
							<el-dropdown-item>发送队列</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
			<div class="make-right">
				<el-button type="danger" plain icon="el-icon-delete"></el-button>
			</div>
		</div>

		<el-card shadow="never" header="统计">
			<sc-echarts ref="chart" height="150px" :option="option"></sc-echarts>
		</el-card>

		<el-card shadow="never">
			<el-tabs>
				<el-tab-pane label="基础信息">
					<el-descriptions :column="2" border>
					    <el-descriptions-item label="ID">5001</el-descriptions-item>
					    <el-descriptions-item label="名称">scEcharts</el-descriptions-item>
						<el-descriptions-item label="参与者">
							<el-tag size="mini">Sakuya</el-tag>
							<el-tag size="mini">Lolowan</el-tag>
						</el-descriptions-item>
					    <el-descriptions-item label="类型">数据</el-descriptions-item>
					    <el-descriptions-item label="创建时间">2010-10-10</el-descriptions-item>
						<el-descriptions-item label="进度">70%</el-descriptions-item>
					</el-descriptions>
				</el-tab-pane>
				<el-tab-pane label="详细信息">
					<el-empty description="没有详细信息" :image-size="80"></el-empty>
				</el-tab-pane>
			</el-tabs>
		</el-card>

		<el-card shadow="never" header="日志">
			<el-timeline style="padding-left: 10px;padding-top: 10px;">
				<el-timeline-item v-for="(item, index) in logs" :key="index" :timestamp="item.timestamp" :color="index==0?'#409EFF':''">
					<div class="log-item">
						<el-avatar class="avatar" :size="24" :src="item.icon"></el-avatar>
						<span class="user">{{item.user}}</span>
						<p>{{item.content}}</p>
					</div>
					<div v-if="item.msg" class="log-msg">
						<el-alert :title="item.msg" :closable="false"></el-alert>
					</div>
				</el-timeline-item>
			</el-timeline>
		</el-card>

	</el-main>
</template>

<script>
	import scEcharts from '@/components/scEcharts';

	export default {
		components: {
			scEcharts
		},
		data() {
			return {
				option: {
					grid: {
						top: '10px'
					},
					tooltip: {
						trigger: 'axis'
					},
					xAxis: {
						type: 'category',
						data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
					},
					yAxis: {
						type: 'value'
					},
					series: [{
						data: [120, 200, 150, 80, 70, 110, 130],
						type: 'bar',
						barWidth: '15px',
						itemStyle: {
							borderRadius:[15, 15, 0, 0]
						}
					},
					{
						data: [110, 180, 120, 120, 60, 90, 110],
						type: 'line',
						smooth: true
					}]
				},
				logs: [
					{
						user: 'Lolowan',
						icon: 'img/avatar2.gif',
						content: '完成设计',
						msg: '@Sakuya 设计完成了，赶紧开发吧',
						timestamp: '2021-10-13 13:41:19'
					},
					{
						user: 'Sakuya',
						icon: 'img/avatar.jpg',
						content: '完成调研',
						msg: '',
						timestamp: '2021-10-11 22:08:30'
					},
					{
						user: 'Sakuya',
						icon: 'img/avatar.jpg',
						content: '创建立项',
						msg: '',
						timestamp: '2021-10-10 08:31:23'
					},
				]
			}
		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style scoped>
	.el-card {margin-bottom: 15px;}
	.make {margin-bottom: 15px;display: flex;justify-content: space-between;align-items: center;}
	.log-item {display: flex;align-items: center;font-size: 13px;}
	.log-item .user {color: #333;margin: 0 10px;display: inline-block;}
	.log-item p {color: #666;}
	.log-msg {margin-top: 10px;}
</style>
