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
			label-position="right"
		>
			<el-form-item label="上级地区" prop="parent_id">
				<el-cascader
					v-model="form.parent_id"
					:options="regionList"
					:disabled="isChildren"
					:filterable="true"
					:props="{ checkStrictly: true, value: 'id', label: 'name' }"
				/>
			</el-form-item>
			<el-form-item label="地区名称" prop="name">
				<el-input
					v-model="form.name"
					placeholder="请输入地区名称"
					clearable
					maxlength="75"
				></el-input>
			</el-form-item>
			<el-form-item label="编码" prop="value">
				<el-input
					v-model="form.value"
					placeholder="请输入编码"
					clearable
					maxlength="75"
				></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">{{
				$t("general.cancel")
			}}</el-button>
			<el-button
				v-if="mode != 'show'"
				type="primary"
				:loading="isSaveing"
				@click="submit()"
				>{{ $t("general.save") }}</el-button
			>
		</template>
	</sc-dialog>
</template>
<style lang="scss" scoped>
@use "./scss/save.scss" as *;
</style>

<script>
import js from "./js/save";
export default js;
</script>
