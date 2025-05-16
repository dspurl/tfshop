<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button v-auths="['RoleCreate']" type="primary" icon="el-icon-plus" @click="add"></el-button>
				<el-button
					v-auths="['RoleDestroy']"
					type="danger"
					plain
					icon="el-icon-delete"
					:disabled="selection.length == 0"
					@click="batch_del"
				></el-button>
				<el-button
					v-auths="['PermissionEdit']"
					type="primary"
					:disabled="selection.length != 1"
					@click="permission"
				>{{ $t('role.permissionSetting') }}</el-button>
			</div>
			<div class="right-panel">
				<div class="right-panel-search" @keyup.enter="login">
					<el-input v-model="params.keyword" :placeholder="$t('role.roleName')" clearable></el-input>
					<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
				</div>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable
				ref="table"
				:apiObj="apiObj"
				:params="params"
				:column="column"
				stripe
				remoteSort
				highlightCurrentRow
				row-key="id"
				@selection-change="selectionChange"
			>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="#" type="index" width="50"></el-table-column>
				<el-table-column :label="$t('general.operation')" fixed="right" align="right" width="180">
					<template #default="scope">
						<el-button-group>
							<el-button
								v-auths="['RoleView']"
								link
								type="primary"
								size="small"
								@click="table_show(scope.row, scope.$index)"
							>{{ $t('general.view') }}</el-button>
							<el-button
								v-auths="['RoleEdit']"
								link
								type="primary"
								size="small"
								@click="table_edit(scope.row, scope.$index)"
							>{{ $t('general.edit') }}</el-button>
							<el-popconfirm
								:title="$t('general.sureDelete')"
								@confirm="table_del(scope.row, scope.$index)"
							>
								<template #reference>
									<el-button v-auths="['RoleDestroy']" link type="primary" size="small">{{ $t('general.delete') }}</el-button>
								</template>
							</el-popconfirm>
						</el-button-group>
					</template>
				</el-table-column>
			</scTable>
		</el-main>
	</el-container>

	<save-dialog
		v-if="dialog.save"
		ref="saveDialog"
		@success="handleSaveSuccess"
		@closed="dialog.save = false"
		:close-on-click-modal="false"
	></save-dialog>

	<permission-dialog
		v-if="dialog.permission"
		ref="permissionDialog"
		@closed="dialog.permission = false"
		:close-on-click-modal="false"
	></permission-dialog>
</template>
<style lang='scss' scoped>
@use "./scss/index.scss" as *;
</style>

<script>
import js from './js/index'
export default js
</script>
