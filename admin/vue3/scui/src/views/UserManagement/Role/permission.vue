<template>
	<sc-dialog
		:title="$t('role.rolePermissionSettings')"
		v-model="visible"
		:width="500"
		destroy-on-close
		@closed="$emit('closed')"
	>
		<el-tabs tab-position="top">
			<el-tab-pane :label="$t('role.menuPermissions')">
				<div class="treeMain">
					<el-tree
						ref="menu"
						node-key="id"
						:data="menu.list"
						:default-checked-keys="menu.checked"
						:props="menu.props"
						show-checkbox
					></el-tree>
				</div>
			</el-tab-pane>
			<el-tab-pane label="控制台">
				<el-form label-width="100px" label-position="left">
					<el-form-item label="控制台视图">
						<el-select v-model="dashboard" placeholder="请选择">
							<el-option
								v-for="item in dashboardOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
								<span style="float: left">{{ item.label }}</span>
								<span style="float: right; color: #8492a6; font-size: 12px">{{ item.views }}</span>
							</el-option>
						</el-select>
						<div class="el-form-item-msg">用于控制角色登录后控制台的视图</div>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
		<template #footer>
			<el-button @click="visible = false">{{ $t('general.cancel') }}</el-button>
			<el-button type="primary" :loading="isSaveing" @click="submit()">{{ $t('general.save') }}</el-button>
		</template>
	</sc-dialog>
</template>
<style lang='scss' scoped>
@import "./scss/permission.scss";
</style>

<script>
import js from './js/permission'
export default js
</script>
