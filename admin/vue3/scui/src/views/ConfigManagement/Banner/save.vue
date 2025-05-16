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
			<el-form-item label="轮播名称" prop="name">
				<el-input
					v-model="form.name"
					placeholder="请输入轮播名称"
					clearable
					maxlength="30"
				></el-input>
			</el-form-item>
			<el-form-item label="轮播类型" prop="type">
				<el-select
					v-model="form.type"
					size="large"
					>
					<el-option
					v-for="item in options"
					:key="item.value"
					:label="item.label"
					:value="item.value"
					/>
					</el-select>
			</el-form-item>
			<el-form-item label="轮播图片" prop="img">
				<tf-file-select
					v-model="form.img"
					uuid="c5b8ffd0-5892-11ec-a943-3fd5d59f340c"
				></tf-file-select>
			</el-form-item>
			<el-form-item label="轮播地址" prop="url">
				<el-input
					v-model="form.url"
					placeholder="请输入地区名称"
					clearable
					maxlength="255"
				></el-input>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input
					v-model="form.sort"
					placeholder="请输入排序"
					clearable
					maxlength="11"
				></el-input>
			</el-form-item>
			<el-form-item :label="$t('admin.form.state.name')" prop="state">
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
