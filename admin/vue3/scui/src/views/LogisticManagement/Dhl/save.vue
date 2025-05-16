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
			label-position="right"
		>
			<el-form-item label="快递公司名称" prop="name">
				<el-input
					v-model="form.name"
					placeholder="请输入快递公司名称"
					clearable
					maxlength="30"
				></el-input>
			</el-form-item>
			<el-form-item label="英文缩写" prop="abbreviation">
				<el-input
					v-model="form.abbreviation"
					placeholder="请输入快递公司英文缩写"
					clearable
					maxlength="80"
				></el-input>
			</el-form-item>
			<el-form-item label="快递公司LOGO" prop="img">
				<tf-file-select
					v-model="form.img"
					uuid="c5b8ffd0-5892-11ec-a943-3fd5d59f340c"
				></tf-file-select>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input
					v-model="form.sort"
					placeholder="请输入排序"
					clearable
					maxlength="11"
				></el-input>
			</el-form-item>
			<el-form-item label="是否默认" prop="is_default">
				<el-radio-group v-model="form.is_default">
					<el-radio value="0">否</el-radio>
					<el-radio value="1">是</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="状态" prop="state">
				<el-radio-group v-model="form.state">
					<el-radio value="0">显示</el-radio>
					<el-radio value="1">隐藏</el-radio>
				</el-radio-group>
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
