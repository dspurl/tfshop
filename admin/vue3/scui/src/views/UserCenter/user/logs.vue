<template>
	<el-card shadow="never" header="近7天操作记录">
		<scTable ref="table" :data="data" height="auto" paginationLayout="total, prev, pager, next" hideDo>
			<sc-table-column label="序号" type="index"></sc-table-column>
			<sc-table-column label="业务名称" prop="title" min-width="240"></sc-table-column>
			<sc-table-column label="IP" prop="ip" width="150"></sc-table-column>
			<sc-table-column label="结果" prop="code" width="150">
				<el-tag type="success">成功</el-tag>
			</sc-table-column>
			<sc-table-column label="操作时间" prop="time" width="150"></sc-table-column>

		</scTable>
	</el-card>
</template>

<script>
	export default {
		data() {
			return {
				data: [
					{
						title: "修改用户 lolowan",
						ip: "211.187.11.18",
						code: "成功",
						time: "2022-10-10 08:41:17"
					},
					{
						title: "用户登录",
						ip: "211.187.11.18",
						code: "成功",
						time: "2022-10-10 08:21:51"
					}
				]
			}
		}
	}
</script>

<style>
</style>
