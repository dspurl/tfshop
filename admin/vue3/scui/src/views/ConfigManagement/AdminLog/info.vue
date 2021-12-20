<template>
	<el-main style="padding:0 20px;">
		<el-descriptions :column="1" border direction="vertical" size="small">
			<el-descriptions-item :label="$t('adminLog.form.name.name')">{{ data.name }}</el-descriptions-item>
			<el-descriptions-item :label="$t('adminLog.form.admin.name')">
				<template v-if="data.admin_id">{{ data.admin.name }}</template>
				<template>{{ $t("general.nothing") }}</template>
			</el-descriptions-item>
			<el-descriptions-item :label="$t('adminLog.form.path.name')">{{ data.path }}</el-descriptions-item>
			<el-descriptions-item :label="$t('adminLog.form.url.name')">{{ data.url }}</el-descriptions-item>
			<el-descriptions-item :label="$t('adminLog.form.method.name')">{{ data.method }}</el-descriptions-item>
			<el-descriptions-item :label="$t('adminLog.form.ip.name')">{{ data.ip }}</el-descriptions-item>
			<el-descriptions-item :label="$t('adminLog.form.created_at.name')">{{ data.created_at }}</el-descriptions-item>
		</el-descriptions>
		<el-collapse v-model="activeNames" style="margin-top: 20px;">
			<el-collapse-item :title="$t('adminLog.form.header.name')" name="1">
				<json-viewer boxed sort v-if="data.header" :value="data.header" :copyable="copyable"></json-viewer>
			</el-collapse-item>
			<el-collapse-item :title="$t('adminLog.form.param.name')" name="2">
				<json-viewer boxed sort v-if="data.param" :value="data.param" :copyable="copyable"></json-viewer>
			</el-collapse-item>
		</el-collapse>
	</el-main>
</template>
<style lang='scss' scoped>
@import "./scss/info.scss";
</style>
<script>
import js from './js/info'
export default js
</script>