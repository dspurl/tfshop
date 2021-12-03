<template>
	<el-container>
		<el-header>
			<el-page-header :content="data.name"></el-page-header>
			<div class="do">
				<el-button type="primary" @click="exportJson">export JSON</el-button>
			</div>
		</el-header>
		<el-main>
			<sc-workflow v-model="data.nodeConfig"></sc-workflow>
		</el-main>
	</el-container>
</template>

<script>
	import scWorkflow from '@/components/scWorkflow'

	export default {
		name: 'workflow',
		components: {
			scWorkflow
		},
		data() {
			return {
				data: {
					"id": 1,
					"name": "请假审批",
					"nodeConfig": {
						"nodeName": "发起人",
						"type": 0,
						"nodeRoleList": [],
						"childNode": {
							"nodeName": "条件路由",
							"type": 4,
							"conditionNodes": [{
									"nodeName": "长期",
									"type": 3,
									"priorityLevel": 1,
									"conditionMode": 1,
									"conditionList": [{
										"label": "请假天数",
										"field": "day",
										"operator": ">",
										"value": "7"
									}],
									"childNode": {
										"nodeName": "领导审批",
										"type": 1,
										"setType": 1,
										"nodeUserList": [{
											"id": "360000197302144442",
											"name": "何敏"
										}],
										"nodeRoleList": [],
										"examineLevel": 1,
										"directorLevel": 1,
										"selectMode": 1,
										"termAuto": false,
										"term": 0,
										"termMode": 1,
										"examineMode": 1,
										"directorMode": 0
									}
								},
								{
									"nodeName": "短期",
									"type": 3,
									"priorityLevel": 2,
									"conditionMode": 1,
									"conditionList": [],
									"childNode": {
										"nodeName": "直接主管审批",
										"type": 1,
										"setType": 2,
										"nodeUserList": [],
										"nodeRoleList": [],
										"examineLevel": 1,
										"directorLevel": 1,
										"selectMode": 1,
										"termAuto": false,
										"term": 0,
										"termMode": 1,
										"examineMode": 1,
										"directorMode": 0
									}
								}
							],
							"childNode": {
								"nodeName": "抄送人",
								"type": 2,
								"userSelectFlag": true,
								"nodeUserList": [{
									"id": "220000200908305857",
									"name": "何秀英"
								}]
							}
						}
					}
				}
			}
		},
		mounted() {

		},
		methods: {
			exportJson() {
				this.$message("返回值请查看F12控制台console.log()")
				console.log(this.data)
			}
		}
	}
</script>

<style></style>
