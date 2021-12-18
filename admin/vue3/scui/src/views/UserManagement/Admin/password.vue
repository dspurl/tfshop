<template>
	<sc-dialog
		:title="$t('admin.passwordName')"
		v-model="visible"
		:width="500"
		destroy-on-close
		@closed="$emit('closed')"
	>
		<el-form
			:model="form"
			:rules="rules"
			ref="dialogForm"
			label-width="100px"
			label-position="right"
		>
			<el-form-item :label="$t('admin.password')" prop="password">
				<el-input type="password" v-model="form.password" clearable show-password></el-input>
			</el-form-item>
			<el-form-item :label="$t('admin.password2')" prop="password2">
				<el-input type="password" v-model="form.password2" clearable show-password></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">{{$t('general.cancel')}}</el-button>
			<el-button type="primary" :loading="isSaveing" @click="submit()">{{$t('general.save')}}</el-button>
		</template>
	</sc-dialog>
</template>
<style lang='scss' scoped>
@import "./scss/password.scss";
</style>

<script>
import js from './js/password'
export default js
</script>