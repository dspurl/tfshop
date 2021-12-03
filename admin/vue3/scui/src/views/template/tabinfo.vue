<!--
 * @Descripttion: 分栏明细模板
 * @version: 1.0
 * @Author: sakuya
 * @Date: 2021年7月26日08:59:14
 * @LastEditors:
 * @LastEditTime:
-->

<template>
	<el-container>
		<el-main ref="printMain">
			<div class="innerPage">
				<el-row :gutter="15">
					<el-col :lg="8">
						<el-card shadow="never" class="top-state">
							<h2>OID<b>2000832</b><span>复制</span></h2>
							<p>当前状态：物流配送中</p>
						</el-card>
					</el-col>
					<el-col :lg="16">
						<el-card shadow="never">
							<el-row :gutter="15">
								<el-col :lg="8">
									<sc-statistic title="订单量" value="6400" suffix="Kg" groupSeparator></sc-statistic>
								</el-col>
								<el-col :lg="8">
									<sc-statistic title="发货量" value="1568.873" suffix="Kg" groupSeparator></sc-statistic>
								</el-col>
								<el-col :lg="8">
									<sc-statistic title="订单金额" value="1920000" prefix="¥" groupSeparator></sc-statistic>
								</el-col>
							</el-row>
						</el-card>
					</el-col>
				</el-row>
				<el-card shadow="never" header="进程">
					<el-steps :active="2" finish-status="success">
						<el-step title="创建" description="创建人 Sakuya"></el-step>
						<el-step title="分配" description="承运商 SCUI logistics"></el-step>
						<el-step title="配送" description="3 条物流记录"></el-step>
						<el-step title="完成"></el-step>
					</el-steps>
				</el-card>
				<el-card shadow="never" style="margin-top: 15px;">
					<el-tabs>
						<el-tab-pane label="基础信息">
							<el-descriptions :column="3" border size="small">
								<el-descriptions-item label="订单号">2000832</el-descriptions-item>
								<el-descriptions-item label="创建人">sakuya</el-descriptions-item>
								<el-descriptions-item label="创建时间">2021-07-21 13:10:00</el-descriptions-item>
								<el-descriptions-item label="客户编号">0000017</el-descriptions-item>
								<el-descriptions-item label="客户名称">上海红谷物流有限公司</el-descriptions-item>
								<el-descriptions-item label="客户评级">
									<el-rate v-model="rate" disabled>
									</el-rate>
								</el-descriptions-item>
							</el-descriptions>
						</el-tab-pane>
						<el-tab-pane label="物流记录" lazy>
							<scTable ref="table" :data="list" stripe hideDo>
								<el-table-column label="ID" prop="id" width="80" sortable></el-table-column>
								<el-table-column label="载具" prop="vehicle" width="120"></el-table-column>
								<el-table-column label="驾驶员" prop="driver" width="120"></el-table-column>
								<el-table-column label="状态" prop="state" width="120"></el-table-column>
								<el-table-column label="载量" prop="quantity" width="120" sortable></el-table-column>
							</scTable>
						</el-tab-pane>
						<el-tab-pane label="操作日志" lazy>
							<el-timeline style="padding:15px;">
								<el-timeline-item v-for="(item, index) in logs" :key="index" :timestamp="item.timestamp">
									{{item.content}}
								</el-timeline-item>
							  </el-timeline>
						</el-tab-pane>
					</el-tabs>
				</el-card>
			</div>
		</el-main>
		<el-aside width="300px" style="border-left: 1px solid #e6e6e6;border-right: 0;padding:15px;">
			<div class="side-item">
				<div class="header">操作</div>
				<div class="content">
					<el-button type="primary" size="small" @click="print">打印</el-button>
					<el-button size="small">次要操作</el-button>
				</div>
			</div>
			<div class="side-item">
				<div class="header">状态</div>
				<div class="content">
					<p>进行中</p>
				</div>
			</div>
			<div class="side-item">
				<div class="header">标记</div>
				<div class="content">
					<el-tag>重要</el-tag>
					<el-tag type="danger">紧急</el-tag>
				</div>
			</div>
			<div class="side-item">
				<div class="header">指数</div>
				<div class="content">
					<scEcharts height="200px" :option="radarsOption"></scEcharts>
				</div>
			</div>
		</el-aside>
	</el-container>
</template>

<script>
	import scStatistic from '@/components/scStatistic'
	import scEcharts from '@/components/scEcharts'
	import print from '@/utils/print'

	export default {
		name: 'tabinfo',
		components: {
			scStatistic,
			scEcharts
		},
		data() {
			return {
				rate: 3.7,
				logs: [
					{
						content: 'sakuya 创建了物流记录 1',
						timestamp: '2018-04-17'
					},
					{
						content: 'sakuya 维护了客户信息',
						timestamp: '2018-04-15'
					},
					{
						content: 'sakuya 创建订单',
						timestamp: '2018-04-15'
					}
				],
				list: [
					{
						id: 1,
						vehicle: '沪A88808',
						driver: '刘翔',
						state: '0',
						quantity: '29.654'
					},
					{
						id: 2,
						vehicle: '沪A88808',
						driver: '刘翔',
						state: '0',
						quantity: '28.850'
					},
					{
						id: 3,
						vehicle: '沪A3B88D',
						driver: '刘翔',
						state: '0',
						quantity: '28.159'
					}
				],
				radarsOption: {
					radar: {
						radius: 60,
						center: ['50%', '50%'],
						indicator: [
							{ name: '人员', max: 100},
							{ name: '设备', max: 100},
							{ name: '产品', max: 100},
							{ name: '服务', max: 100},
							{ name: '耗时', max: 100}
						]
					},
					series: [{
						name: "SCUI",
						type: 'radar',
						areaStyle: {},
						data: [
							{
								value: [50, 28, 89, 70, 10],
							}
						]
					}]
				}
			}
		},
		mounted() {

		},
		methods: {
			print(){
				print(this.$refs.printMain)
			}
		}
	}
</script>

<style scoped>
	.innerPage {width: 1000px;margin:0 auto;}
	.top-state {background: #409EFF;color: #fff;}
	.top-state h2 {font-size: 17px;font-weight: normal;}
	.top-state h2 b {margin-left: 10px;}
	.top-state h2 span {font-size: 12px;margin-left: 15px;}
	.top-state p {opacity: 0.8;margin-top: 15px;}

	.side-item {border-bottom: 1px solid #eee;margin-bottom: 30px;}
	.side-item .header {font-size: 14px;margin-bottom: 15px;font-weight: bold;}
	.side-item .content {padding-bottom:15px;}

	@media (max-width: 1610px){
	.innerPage {width: 100%;}
	}

</style>
