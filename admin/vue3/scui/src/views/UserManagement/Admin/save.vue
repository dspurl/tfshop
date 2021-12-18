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
			<el-form-item :label="$t('admin.form.name.name')" prop="name">
				<el-input
					v-model="form.name"
					:placeholder="$t('admin.form.name.placeholder')"
					clearable
					:disabled="mode !== 'add'"
				></el-input>
				<div class="el-form-item-msg">{{ $t('admin.form.name.msg') }}</div>
			</el-form-item>
			<el-form-item :label="$t('admin.form.portrait.name')" prop="portrait">
				<sc-icon-select v-model="form.portrait" clearable></sc-icon-select>
			</el-form-item>
			<el-form-item :label="$t('admin.form.real_name.name')" prop="real_name">
				<el-input
					v-model="form.real_name"
					:placeholder="$t('admin.form.real_name.placeholder')"
					clearable
					maxlength="75"
				></el-input>
			</el-form-item>
			<el-form-item :label="$t('admin.form.email.name')" prop="email">
				<el-input
					v-model="form.email"
					:placeholder="$t('admin.form.email.placeholder')"
					clearable
					maxlength="255"
				></el-input>
			</el-form-item>
			<el-form-item :label="$t('admin.form.cellphone.name')" prop="cellphone">
				<el-input
					v-model="form.cellphone"
					:placeholder="$t('admin.form.cellphone.placeholder')"
					clearable
					maxlength="11"
				></el-input>
			</el-form-item>
			<template v-if="mode == 'add'">
				<el-form-item :label="$t('admin.form.password.name')" prop="password">
					<el-input type="password" v-model="form.password" clearable show-password></el-input>
				</el-form-item>
				<el-form-item :label="$t('admin.form.password2.name')" prop="password2">
					<el-input type="password" v-model="form.password2" clearable show-password></el-input>
				</el-form-item>
			</template>
			<el-form-item :label="$t('admin.form.auth_group.name')" prop="auth_group">
				<el-select v-model="form.auth_group" multiple style="width: 100%;">
					<el-option v-for="item in groups" :key="item.id" :label="item.introduction" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item :label="$t('admin.form.state.name')" prop="state">
				<el-radio-group v-model="form.state">
					<el-radio :label="1">{{ $t('admin.form.state.label.normal') }}</el-radio>
					<el-radio :label="2">{{ $t('admin.form.state.label.forbid') }}</el-radio>
				</el-radio-group>
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