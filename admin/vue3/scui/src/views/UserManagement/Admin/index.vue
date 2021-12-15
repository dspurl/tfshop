<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button v-auth="['RoleCreate']" type="primary" icon="el-icon-plus" @click="add"></el-button>
				<el-button
					v-auth="['RoleDestroy']"
					type="danger"
					plain
					icon="el-icon-delete"
					:disabled="selection.length == 0"
					@click="batch_del"
				></el-button>
				<el-button
					v-auth="['PermissionEdit']"
					type="primary"
					plain
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
				:stripe=true
				:remoteSort=true
				:highlightCurrentRow=true
				row-key="id"
				@selection-change="selectionChange"
			>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="#" type="index" width="50"></el-table-column>
				<el-table-column :label="$t('general.operation')" fixed="right" align="right" width="140">
					<template #default="scope">
						<el-button
							v-auth="['RoleView']"
							type="text"
							size="small"
							@click="table_show(scope.row, scope.$index)"
						>{{ $t('general.view') }}</el-button>
						<el-divider v-auth="['RoleView']" direction="vertical"></el-divider>
						<el-button
							v-auth="['RoleEdit']"
							type="text"
							size="small"
							@click="table_edit(scope.row, scope.$index)"
						>{{ $t('general.edit') }}</el-button>
						<el-divider v-auth="['RoleEdit']" direction="vertical"></el-divider>
						<el-popconfirm
							:title="$t('general.sureDelete')"
							@confirm="table_del(scope.row, scope.$index)"
						>
							<template #reference>
								<el-button v-auth="['RoleDestroy']" type="text" size="small">{{ $t('general.delete') }}</el-button>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
			</scTable>
		</el-main>
	</el-container>
</template>
<style lang='scss' scoped>
@import "./scss/index.scss";
</style>

<script>
import js from './js/index'
export default js
</script>
