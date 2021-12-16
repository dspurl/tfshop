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
			<el-form-item label="账号" prop="name">
				<el-input v-model="form.name" placeholder="用于登录系统" clearable :disabled="mode !== 'add'"></el-input>
				<div class="el-form-item-msg">账号创建后无法修改</div>
			</el-form-item>
			<el-form-item label="头像" prop="portrait">
				<sc-icon-select v-model="form.portrait" clearable></sc-icon-select>
			</el-form-item>
			<el-form-item label="真实姓名" prop="real_name">
				<el-input v-model="form.real_name" placeholder="请输入完整的真实姓名" clearable maxlength="75"></el-input>
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="form.email" placeholder="用于接收邮件通知" clearable maxlength="255"></el-input>
			</el-form-item>
			<el-form-item label="手机" prop="cellphone">
				<el-input v-model="form.cellphone" placeholder="用于接收短信通知" clearable maxlength="11"></el-input>
			</el-form-item>
			<template v-if="mode == 'add'">
				<el-form-item label="登录密码" prop="password">
					<el-input type="password" v-model="form.password" clearable show-password></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="password2">
					<el-input type="password" v-model="form.password2" clearable show-password></el-input>
				</el-form-item>
			</template>
			<el-form-item label="所属角色" prop="auth_group">
				<el-select v-model="form.auth_group" multiple style="width: 100%;">
					<el-option v-for="item in groups" :key="item.id" :label="item.introduction" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="状态" prop="state">
				<el-radio-group v-model="form.state">
					<el-radio :label="1">允许访问</el-radio>
					<el-radio :label="2">禁止访问</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取 消</el-button>
			<el-button v-if="mode != 'show'" type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
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