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
			label-width="120px"
			label-position="left"
		>
			<el-form-item :label="$t('resource_type.form.name.name')" prop="name">
				<el-input v-model="form.name" maxlength="20" clearable></el-input>
			</el-form-item>
			<el-form-item :label="$t('resource_type.form.alias.name')" prop="alias">
				<el-input v-model="form.alias" maxlength="20" clearable></el-input>
				<div class="el-form-item-msg">{{ $t('resource_type.form.alias.msg') }}</div>
			</el-form-item>
			<el-form-item :label="$t('resource_type.form.icon.name')" prop="icon">
				<sc-icon-select v-model="form.icon" clearable></sc-icon-select>
			</el-form-item>
			<el-form-item :label="$t('resource_type.form.size.name')" prop="size">
				<el-input type="number" v-model.number="form.size" maxlength="10" clearable></el-input>
				<div class="el-form-item-msg">{{ $t('resource_type.form.size.msg') }}</div>
			</el-form-item>
			<el-form-item :label="$t('resource_type.form.extension.name')" prop="extension">
				<ds-tag v-model="form.extension"></ds-tag>
				<div class="el-form-item-msg">{{ $t('resource_type.form.extension.msg') }}</div>
			</el-form-item>
			<el-form-item :label="$t('resource_type.form.specification.name')" prop="extension">
				<ds-tag v-model="form.specification"></ds-tag>
				<div class="el-form-item-msg">{{ $t('resource_type.form.specification.msg') }}</div>
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
