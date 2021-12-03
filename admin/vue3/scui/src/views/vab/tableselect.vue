<!--
 * @Descripttion: 表格选择器组件演示
 * @version: 1.0
 * @Author: sakya
 * @Date: 2021年6月8日09:29:14
 * @LastEditors: sakya
 * @LastEditTime: 2021年6月8日09:29:14
-->

<template>
	<el-main>
		<el-alert title="select深度改造的表格选择器, 非常适用于大量数据选择的场景" type="success" style="margin-bottom:20px;"></el-alert>
		<el-card shadow="never" header="单选">
			<sc-table-select v-model="value2" :apiObj="apiObj" :params="params" :table-width="600" :props="props">
				<el-table-column prop="id" label="ID" width="150"></el-table-column>
				<el-table-column prop="user" label="姓名"></el-table-column>
			</sc-table-select>
		</el-card>
		<div style="height:15px"></div>
		<el-card shadow="never" header="多选">
			<sc-table-select v-model="value" :apiObj="apiObj" :table-width="700" multiple :props="props">
				<template #header="{form, submit}">
					<el-form :inline="true" :model="form">
						<el-form-item>
							<el-select v-model="form.sex" placeholder="性别" clearable :popper-append-to-body="false">
								<el-option label="男" value="1"></el-option>
								<el-option label="女" value="2"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-date-picker v-model="form.date" value-format="YYYY-MM-DD" type="date" placeholder="注册时间" :append-to-body="false"></el-date-picker>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="submit">查询</el-button>
						</el-form-item>
					</el-form>
					<el-alert title="自定义FORM插糟 传递了form对象和提交方法" type="info" />
				</template>
				<el-table-column prop="id" label="ID" width="150"></el-table-column>
				<el-table-column prop="user" label="姓名" width="100"></el-table-column>
				<el-table-column prop="cip" label="最后请求IP" width="150"></el-table-column>
				<el-table-column prop="time" label="注册时间"></el-table-column>
			</sc-table-select>
		</el-card>
	</el-main>
</template>

<script>
	export default {
		name: 'tableselect',
		data() {
			return {
				apiObj: this.$API.demo.page,
				params: {
					name: 'demoName'
				},
				value: [
					{
						id: "410000199512025445",
						user: "魏磊"
					},
					{
						id: "520000198407304275",
						user: "史平"
					}
				],
				value2: {
					id: "520000198407304275",
					user: "史平"
				},
				props: {
					label: 'user',
					value: 'id',
					keyword: "keyword"
				}
			}
		},
		computed: {

		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style scoped>
</style>
