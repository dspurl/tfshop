<template>
	<el-card shadow="never" header="事务待办">
		<el-form ref="form" label-width="180px" label-position="left" style="margin-top:20px;">
			<el-form-item label="有新的待办">
				<el-checkbox v-model="form.new">短信推送</el-checkbox>
				<el-checkbox v-model="form.new_wx">微信推送</el-checkbox>
			</el-form-item>
			<el-form-item label="待办有效时剩24小时">
				<el-checkbox v-model="form.timeout">短信推送</el-checkbox>
				<el-checkbox v-model="form.timeout_wx">微信推送</el-checkbox>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					new: true,
					timeout: true
				}
			}
		}
	}
</script>

<style>
</style>
