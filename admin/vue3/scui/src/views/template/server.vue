<template>
	<el-container>
		<el-aside width="220px">
			<el-container>
				<el-header>
					<el-input placeholder="输入关键字进行过滤" v-model="groupFilterText" clearable></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree ref="group" class="menu" :data="group" node-key="code" :current-node-key="group[0].code" highlight-current :filter-node-method="groupFilterNode"></el-tree>
				</el-main>
			</el-container>
		</el-aside>
		<el-main style="padding:0;">

			<el-tabs class="tabs-pages" stretch>
				<el-tab-pane label="服务器概况" lazy>
					<el-main>
						<el-card shadow="never" header="SQL Server">
							<el-row>
								<el-col :span="8">
									<div class="server-top-item">
										<el-progress type="dashboard" :percentage="25" :stroke-width="8" :width="150"
											:color="colors">
											<template #default="{ percentage }">
												<span class="percentage-value">{{ percentage }}<em>%</em></span>
												<span class="percentage-label">CPU</span>
											</template>
										</el-progress>
									</div>
								</el-col>
								<el-col :span="8">
									<div class="server-top-item">
										<el-progress type="dashboard" :percentage="33.2" :stroke-width="8" :width="150"
											:color="colors">
											<template #default="{ percentage }">
												<span class="percentage-value">{{ percentage }}<em>%</em></span>
												<span class="percentage-label">Memory</span>
											</template>
										</el-progress>
									</div>
								</el-col>
								<el-col :span="8">
									<div class="server-top-item">
										<el-progress type="dashboard" :percentage="81.0" :stroke-width="8" :width="150"
											:color="colors">
											<template #default="{ percentage }">
												<span class="percentage-value">{{ percentage }}<em>%</em></span>
												<span class="percentage-label">Disk</span>
											</template>
										</el-progress>
									</div>
								</el-col>
							</el-row>
							<el-tabs style="margin-top: 20px;" @tab-click="tabClick">
								<el-tab-pane label="CPU" lazy>
									<div class="server-item-info">
										<div class="title">
											<label>CPU</label>
											<span>Intel(R) Core(TM) i5-8265U CPU @ 1.60GHz</span>
										</div>
										<div class="chart" style="border-color: #409EFF;background: rgba(64,158,255,0.05);">
											<scEcharts ref="cpu" height="100%" :option="option.cpu"></scEcharts>
										</div>
										<div class="data">
											<el-descriptions :column="2" size="small" border title="Information">
												<el-descriptions-item label="利用率">35%</el-descriptions-item>
												<el-descriptions-item label="速度">2.67 GHz</el-descriptions-item>
												<el-descriptions-item label="内核">4</el-descriptions-item>
												<el-descriptions-item label="逻辑处理器">8</el-descriptions-item>
												<el-descriptions-item label="正常运行时间">0:06:06:04</el-descriptions-item>
											</el-descriptions>
										</div>
									</div>
								</el-tab-pane>
								<el-tab-pane label="Memory" lazy>
									<div class="server-item-info">
										<div class="title">
											<label>Memory</label>
											<span>16.0 GB</span>
										</div>
										<div class="chart" style="border-color: #8b12ae;background: rgba(139,18,174,0.05);">
											<scEcharts ref="memory" height="100%" :option="option.memory"></scEcharts>
										</div>
									</div>
								</el-tab-pane>
								<el-tab-pane label="Disk" lazy>
									<div class="server-item-info">
										<div class="title">
											<label>Disk</label>
											<span>SAMSUNG MZVLB512HBJQ-000L7</span>
										</div>
										<div class="disk-list">
											<el-row :gutter="20">
												<el-col :span="6">
													<div class="disk-list-item">
														<h2>本地磁盘(C)</h2>
														<el-progress :stroke-width="10" :percentage="50" :color="colors" />
														<p>66.2 GB 可用，共 175 GB</p>
													</div>
												</el-col>
												<el-col :span="6">
													<div class="disk-list-item">
														<h2>本地磁盘(D)</h2>
														<el-progress :stroke-width="10" :percentage="60" :color="colors" />
														<p>66.2 GB 可用，共 175 GB</p>
													</div>
												</el-col>
												<el-col :span="6">
													<div class="disk-list-item">
														<h2>本地磁盘(E)</h2>
														<el-progress :stroke-width="10" :percentage="81" :color="colors" />
														<p>66.2 GB 可用，共 175 GB</p>
													</div>
												</el-col>
												<el-col :span="6">
													<div class="disk-list-item">
														<h2>本地磁盘(F)</h2>
														<el-progress :stroke-width="10" :percentage="15.5" :color="colors" />
														<p>66.2 GB 可用，共 175 GB</p>
													</div>
												</el-col>
											</el-row>
										</div>
									</div>
								</el-tab-pane>
								<el-tab-pane label="Network" lazy>
									<div class="server-item-info">
										<div class="title">
											<label>Network</label>
											<span>Intel(R) Ethernet Connection (6) 1219-V</span>
										</div>
										<div class="chart" style="border-color: #a74f01;background: rgba(167,79,1,0.05);">
											<scEcharts ref="network" height="100%" :option="option.network"></scEcharts>
										</div>
									</div>
								</el-tab-pane>
							</el-tabs>
						</el-card>
					</el-main>
				</el-tab-pane>
				<el-tab-pane label="报警管理" lazy>
					<el-main>
						<el-card shadow="never" header="Event">
							<scTable ref="table" :data="event" stripe>
								<el-table-column label="#" type="index" width="50"></el-table-column>
								<el-table-column label="事件" prop="title" width="150"></el-table-column>
								<el-table-column label="等级" prop="type" width="150"></el-table-column>
								<el-table-column label="通知" prop="push" ></el-table-column>
								<el-table-column label="触发时间" prop="time" width="150"></el-table-column>
							</scTable>
						</el-card>
						<el-card shadow="never" header="Rule" style="margin-top: 15px;">
							<el-table :data="rule" stripe>
								<el-table-column label="规则名称" prop="name" width="150"></el-table-column>
								<el-table-column label="描述" prop="title" width="150"></el-table-column>
								<el-table-column label="告警类型" prop="type" width="150"></el-table-column>
								<el-table-column label="通知" prop="push" width="150"></el-table-column>
								<el-table-column></el-table-column>
								<el-table-column label="操作" width="150" align="right">
									<el-dropdown>
										<el-button type="text" size="mini" icon="el-icon-more"></el-button>
										<template #dropdown>
											<el-dropdown-menu>
												<el-dropdown-item>编辑</el-dropdown-item>
												<el-dropdown-item divided>删除</el-dropdown-item>
											</el-dropdown-menu>
										</template>
									</el-dropdown>
								</el-table-column>
							</el-table>
							<el-button type="primary" icon="el-icon-plus" style="margin-top: 20px;"></el-button>
						</el-card>
					</el-main>
				</el-tab-pane>
			</el-tabs>
		</el-main>
	</el-container>
</template>

<script>
	import scEcharts from '@/components/scEcharts';

	export default {
		name: 'server',
		components: {
			scEcharts
		},
		data() {
			return {
				groupFilterText: '',
				group: [
					{
						label: "SQL Server",
						icon: "el-icon-coin",
						code: "1",

					}, {
						label: "Web Server",
						icon: "el-icon-monitor",
						code: "2",
					}, {
						label: "Api Server",
						icon: "el-icon-monitor",
						code: "3",
					}, {
						label: "Nginx Server",
						icon: "el-icon-guide",
						code: "4",
					}
				],
				colors: [{
						color: '#409EFF',
						percentage: 60
					},
					{
						color: '#E6A23C',
						percentage: 80
					},
					{
						color: '#F56C6C',
						percentage: 100
					}
				],
				event: [
					{
						title: 'Disk 大于 90%',
						type: '告警事件',
						push: '短信',
						time: '2021-10-09 21:25:19'
					},
					{
						title: 'Disk 大于 90%',
						type: '致命事件',
						push: '短信',
						time: '2021-10-09 21:25:19'
					}
				],
				rule: [
					{
						name: 'test_cpu',
						title: '测试CPU报警',
						type: 'CPU',
						push: '短信'
					},
					{
						name: 'test_cpu',
						title: '测试CPU报警',
						type: 'CPU',
						push: '短信'
					}
				],
				option: {
					cpu: {
						tooltip: {
							trigger: 'axis'
						},
						grid: {
							top: '0',
							bottom: '0',
							left: '0',
							right: '0'
						},
						animation: false,
						xAxis: {
							type: 'category',
							boundaryGap: false,
							data: (function() {
								var now = new Date();
								var res = [];
								var len = 60;
								while (len--) {
									res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
									now = new Date(now - 2000);
								}
								return res;
							})(),
							splitLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								show: false
							}
						},
						yAxis: {
							type: 'value',
							min: 0,
							max: 100,
							splitLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								show: false
							}
						},
						series: [{
							data: (function() {
								var res = [];
								var len = 60;
								while (len--) {
									res.push(Math.round(Math.random() * 0));
								}
								return res;
							})(),
							type: 'line',
							symbol: 'none',
							lineStyle: {
								width: 1,
								color: '#409EFF'
							},
							areaStyle: {
								opacity: 0.1,
								color: '#409EFF'
							},
						}]
					},
					memory: {
						tooltip: {
							trigger: 'axis'
						},
						grid: {
							top: '0',
							bottom: '0',
							left: '0',
							right: '0'
						},
						animation: false,
						xAxis: {
							type: 'category',
							boundaryGap: false,
							data: (function() {
								var now = new Date();
								var res = [];
								var len = 60;
								while (len--) {
									res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
									now = new Date(now - 2000);
								}
								return res;
							})(),
							splitLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								show: false
							}
						},
						yAxis: {
							type: 'value',
							min: 0,
							max: 100,
							splitLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								show: false
							}
						},
						series: [{
							data: (function() {
								var res = [];
								var len = 60;
								while (len--) {
									res.push(Math.round(Math.random() * 0));
								}
								return res;
							})(),
							type: 'line',
							symbol: 'none',
							lineStyle: {
								width: 1,
								color: '#8b12ae'
							},
							areaStyle: {
								opacity: 0.1,
								color: '#8b12ae'
							},
						}]
					},
					network: {
						tooltip: {
							trigger: 'axis'
						},
						grid: {
							top: '0',
							bottom: '0',
							left: '0',
							right: '0'
						},
						animation: false,
						legend: {
							data: ['接收 Kbps', '发送 Kbps'],
							top: '10px',
							right: '10px',
							itemStyle: {
								opacity: 0
							}
						},
						xAxis: {
							type: 'category',
							boundaryGap: false,
							data: (function() {
								var now = new Date();
								var res = [];
								var len = 60;
								while (len--) {
									res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
									now = new Date(now - 2000);
								}
								return res;
							})(),
							splitLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								show: false
							}
						},
						yAxis: {
							type: 'value',
							min: 0,
							max: 100,
							splitLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								show: false
							}
						},
						series: [{
							name: '接收 Kbps',
							data: (function() {
								var res = [];
								var len = 60;
								while (len--) {
									res.push(Math.round(Math.random() * 0));
								}
								return res;
							})(),
							type: 'line',
							symbol: 'none',
							lineStyle: {
								width: 1,
								color: '#a74f01'
							},
							areaStyle: {
								opacity: 0.1,
								color: '#a74f01'
							},
						}, {
							name: '发送 Kbps',
							data: (function() {
								var res = [];
								var len = 60;
								while (len--) {
									res.push(Math.round(Math.random() * 0));
								}
								return res;
							})(),
							type: 'line',
							smooth: false,
							symbol: 'none',
							lineStyle: {
								width: 1,
								type: 'dashed',
								color: '#a74f01'
							}
						}]
					}
				}
			}
		},
		watch: {
			groupFilterText(val) {
				this.$refs.group.filter(val);
			}
		},
		mounted() {
			setInterval(() => {
				this.option.cpu.series[0].data.shift()
				this.option.cpu.series[0].data.push(Math.round(Math.random() * 100));
				this.option.cpu.xAxis.data.shift();
				this.option.cpu.xAxis.data.push((new Date()).toLocaleTimeString().replace(/^\D*/, ''));

				this.option.memory.series[0].data.shift()
				this.option.memory.series[0].data.push(Math.round(Math.random() * 50));
				this.option.memory.xAxis.data.shift();
				this.option.memory.xAxis.data.push((new Date()).toLocaleTimeString().replace(/^\D*/, ''));

				this.option.network.series[0].data.shift()
				this.option.network.series[0].data.push(Math.round(Math.random() * 20));
				this.option.network.series[1].data.shift()
				this.option.network.series[1].data.push(Math.round(Math.random() * 10));
				this.option.network.xAxis.data.shift();
				this.option.network.xAxis.data.push((new Date()).toLocaleTimeString().replace(/^\D*/, ''));
			}, 1000)
		},
		methods: {
			//树过滤
			groupFilterNode(value, data){
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			tabClick(tab) {
				this.$nextTick(() => {
					if(tab.props.label == 'CPU' && this.$refs.cpu.myChart){
						this.$refs.cpu.myChart.resize()
					}
					if(tab.props.label == 'Memory' && this.$refs.memory.myChart){
						this.$refs.memory.myChart.resize()
					}
					if(tab.props.label == 'Network' && this.$refs.network.myChart){
						this.$refs.network.myChart.resize()
					}
				})
			}
		}
	}
</script>

<style>
	.tabs-pages {display: flex;flex-flow: column;flex-shrink: 0;height: 100%;}
	.tabs-pages > .el-tabs__header {background: #fff;margin: 0;}
	.tabs-pages > .el-tabs__header .el-tabs__nav-wrap {display: flex;justify-content:center;}
	.tabs-pages > .el-tabs__header .el-tabs__item {height:60px;line-height: 60px;font-size: 14px;}
	.tabs-pages > .el-tabs__content {overflow-x: hidden;overflow: auto;}
	[data-theme="dark"] .tabs-pages > .el-tabs__header {background: #2b2b2b;}
</style>

<style scoped>

	.server-top-item {
		text-align: center;
	}

	.server-top-item .percentage-value {
		display: block;
		font-size: 24px;
		font-weight: bold;
	}

	.server-top-item .percentage-value em {
		font-size: 14px;
		font-style: normal;
		margin-left: 5px;
		font-weight: normal;
	}

	.server-top-item .percentage-label {
		display: block;
		font-size: 12px;
		margin-top: 10px;
	}

	.server-item-info {}

	.server-item-info .title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
	}

	.server-item-info .title label {
		font-size: 26px;
	}

	.server-item-info .title span {
		font-size: 14px;
	}

	.server-item-info .chart {
		height: 250px;
		border: 1px solid #eee;
	}

	.server-item-info .data {
		margin-top: 20px;
	}

	.disk-list-item {
		margin: 10px 0;
	}

	.disk-list-item h2 {
		font-weight: normal;
		font-size: 12px;
	}

	.disk-list-item .el-progress {
		margin: 5px 0;
	}

	.disk-list-item p {
		color: #999;
		font-size: 12px;
	}
</style>
