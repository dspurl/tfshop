<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button v-auth="['RoleCreate']" type="primary" icon="el-icon-plus" @click="add"></el-button>
				<el-button v-auth="['RoleDestroy']" type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del"></el-button>
				<el-button v-auth="['PermissionEdit']" type="primary" plain :disabled="selection.length!=1" @click="permission">权限设置</el-button>
			</div>
			<div class="right-panel">
				<div class="right-panel-search" @keyup.enter="login">
					<el-input v-model="params.keyword" placeholder="角色名称" clearable></el-input>
					<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
				</div>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable ref="table" :apiObj="apiObj" :params="params" :column="column" row-key="id" @selection-change="selectionChange">
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="#" type="index" width="50"></el-table-column>
				<el-table-column label="操作" fixed="right" align="right" width="140">
					<template #default="scope">
						<el-button v-auth="['RoleView']" type="text" size="small" @click="table_show(scope.row, scope.$index)">查看</el-button>
						<el-divider v-auth="['RoleView']" direction="vertical"></el-divider>
						<el-button v-auth="['RoleEdit']" type="text" size="small" @click="table_edit(scope.row, scope.$index)">编辑</el-button>
						<el-divider v-auth="['RoleEdit']" direction="vertical"></el-divider>
						<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
							<template #reference>
								<el-button v-auth="['RoleDestroy']" type="text" size="small">删除</el-button>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>

			</scTable>
		</el-main>
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSaveSuccess" @closed="dialog.save=false"></save-dialog>

	<permission-dialog v-if="dialog.permission" ref="permissionDialog" @closed="dialog.permission=false"></permission-dialog>

</template>
<style lang='scss' scoped>
  @import "./scss/index.scss";
</style>

<script>
import js from './js/index'
export default js
</script>
