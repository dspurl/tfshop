<template>
	<sc-dialog
		:title="titleMap[mode]"
		v-model="visible"
		:width="500"
		destroy-on-close
		@closed="$emit('closed')"
	>
		<el-form
			:model="form"
			:rules="rules"
			:disabled="mode == 'show'"
			ref="dialogForm"
			label-width="100px"
			label-position="left"
		>
			<el-form-item :label="$t('role.form.introduction.name')" prop="introduction">
				<el-input v-model="form.introduction" maxlength="30" clearable></el-input>
			</el-form-item>
			<el-form-item :label="$t('role.form.roles.name')" prop="roles">
				<el-input v-model="form.roles" maxlength="80" clearable></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">{{ $t('general.cancel') }}</el-button>
			<el-button
				v-if="mode != 'show'"
				type="primary"
				:loading="isSaveing"
				@click="submit()"
			>{{ $t('general.save') }}</el-button>
		</template>
	</sc-dialog>
</template>
<style lang='scss' scoped>
@import "./scss/save.scss";
</style>

<script>
import js from './js/save'
export default js
</script>
