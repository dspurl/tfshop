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
			<el-form-item label="手机" prop="cellphone">
				<el-input
					v-model="form.cellphone"
					placeholder="请输入手机号"
					clearable
					maxlength="11"
					:disabled="mode !== 'add'"
				></el-input>
			</el-form-item>
			<el-form-item label="头像" prop="portrait">
				<tf-file-select
					v-model="form.portrait"
					uuid="c5b8ffd0-5892-11ec-a943-3fd5d59f340c"
				></tf-file-select>
			</el-form-item>
			<el-form-item label="昵称" prop="real_name">
				<el-input
					v-model="form.nickname"
					placeholder="请输入昵称"
					clearable
					maxlength="75"
				></el-input>
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input
					v-model="form.email"
					placeholder="请输入邮箱"
					clearable
					maxlength="255"
				></el-input>
			</el-form-item>
			<template v-if="mode == 'add'">
				<el-form-item label="密码" prop="password">
					<el-input
						type="password"
						v-model="form.password"
						clearable
						show-password
					></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="password2">
					<el-input
						type="password"
						v-model="form.password2"
						clearable
						show-password
					></el-input>
				</el-form-item>
			</template>
			<el-form-item label="金额" prop="money">
				<el-input
					v-model="form.money"
					placeholder="请输入金额"
					clearable
					maxlength="255"
				></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="state">
				<el-radio-group v-model="form.state">
					<el-radio value="1">允许访问</el-radio>
					<el-radio value="2">禁止访问</el-radio>
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
