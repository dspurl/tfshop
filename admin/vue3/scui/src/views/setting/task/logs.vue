<!--
 * @Descripttion: 系统计划任务配置
 * @version: 1.0
 * @Author: sakuya
 * @Date: 2021年7月7日09:28:32
 * @LastEditors:
 * @LastEditTime:
-->

<template>
	<el-container>
		<el-main  style="padding:0 20px;">
			<scTable ref="table" :data="data" stripe>
				<el-table-column label="执行时间" prop="time" width="200"></el-table-column>
				<el-table-column label="执行结果" prop="state" width="100">
					<template #default="scope">
						<span v-if="scope.row.state==200" style="color: #67C23A;"><el-icon><el-icon-success-filled /></el-icon></span>
						<span v-else style="color: #F56C6C;"><el-icon><el-icon-circle-close-filled /></el-icon></span>
					</template>
				</el-table-column>
				<el-table-column label="执行日志" prop="logs" width="100" fixed="right">
					<template #default="scope">
						<el-button size="mini" @click="show(scope.row)" type="text">日志</el-button>
					</template>
				</el-table-column>
			</scTable>
		</el-main>
	</el-container>

	<el-drawer title="日志" v-model="logsVisible" :size="500" direction="rtl" destroy-on-close>
		<el-main  style="padding:0 20px 20px 20px;">
			<pre style="font-size: 12px;color: #999;padding:20px;background: #333;font-family: consolas;line-height: 1.5;overflow: auto;">{{demoLog}}</pre>
		</el-main>
	</el-drawer>
</template>

<script>
	export default {
		data() {
			return {
				logsVisible: false,
				demoLog: `2021-07-07 12:35:00 [com.xxl.job.core.thread.JobThread#run]-[124]-[Thread-308]
----------- xxl-job job execute start -----------
----------- Param:
2021-07-07 12:35:00 [com.heronshn.reservation.jobhandler.AqshMasterDataSendHandler#execute]-[31]-[Thread-308] aqshMasterDataSendHandler start
2021-07-07 12:35:00 [com.heronshn.reservation.data.service.impl.AqshVehicleServiceImpl#send]-[42]-[Thread-308] send 45
2021-07-07 12:35:00 [com.heronshn.reservation.data.service.impl.AqshVehicleServiceImpl#send]-[45]-[Thread-308] webapi http://127.0.0.1:48080
2021-07-07 12:35:00 [com.heronshn.reservation.jobhandler.AqshMasterDataSendHandler#execute]-[33]-[Thread-308] aqshMasterDataSendHandler vehicle end
2021-07-07 12:35:00 [com.heronshn.reservation.jobhandler.AqshMasterDataSendHandler#execute]-[35]-[Thread-308] aqshMasterDataSendHandler stop
2021-07-07 12:35:00 [com.xxl.job.core.thread.JobThread#run]-[158]-[Thread-308]
----------- xxl-job job execute end(finish) -----------
----------- ReturnT:ReturnT [code=200, msg=null, content=null]
2021-07-07 12:35:00 [com.xxl.job.core.thread.TriggerCallbackThread#callbackLog]-[176]-[Thread-10]
----------- xxl-job job callback finish.

[Load Log Finish]`,
				data: [
					{
						time: "2021-07-07 00:00:00",
						state: "500",
						logs: ""
					},
					{
						time: "2021-07-06 00:00:00",
						state: "200",
						logs: ""
					},
					{
						time: "2021-07-05 00:00:00",
						state: "200",
						logs: ""
					},
					{
						time: "2021-07-04 00:00:00",
						state: "200",
						logs: ""
					},
					{
						time: "2021-07-03 00:00:00",
						state: "200",
						logs: ""
					},
					{
						time: "2021-07-02 00:00:00",
						state: "200",
						logs: ""
					},
					{
						time: "2021-07-01 00:00:00",
						state: "200",
						logs: ""
					}
				]
			}
		},
		mounted() {

		},
		methods: {
			show(){
				this.logsVisible = true;
			}
		}
	}
</script>

<style>
</style>
