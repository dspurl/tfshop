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
			<el-form-item label="类目名称" prop="name">
				<el-input
					v-model="form.name"
					placeholder="请输入类目名称"
					clearable
					maxlength="75"
				></el-input>
			</el-form-item>
			<el-form-item label="上级分类" prop="parent_id">
				<el-cascader
					v-model="form.parent_id"
					:options="categoryList"
					:disabled="isChildren"
					:filterable="true"
					:props="{ checkStrictly: true, value: 'id', label: 'name' }"
				/>
			</el-form-item>
			<el-form-item label="分类图标" prop="img">
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
			<el-form-item label="状态" prop="state">
				<el-radio-group v-model="form.state">
					<el-radio value="0">显示</el-radio>
					<el-radio value="1">隐藏</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="首页推荐" prop="is_recommend">
				<el-radio-group v-model="form.is_recommend">
					<el-radio value="0">不推荐</el-radio>
					<el-radio value="1">推荐</el-radio>
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
