<template>
	<el-container>
		<el-aside width="200px" v-loading="showGrouploading">
			<el-container>
				<el-header>
					<el-input placeholder="输入关键字进行过滤" v-model="groupFilterText" clearable></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree
						ref="group"
						class="menu"
						node-key="id"
						:data="group"
						:current-node-key="''"
						:props="props"
						:highlight-current="true"
						:expand-on-click-node="false"
						:filter-node-method="groupFilterNode"
						@node-click="groupClick"
					></el-tree>
				</el-main>
			</el-container>
		</el-aside>
		<el-container>
			<el-header>
				<div class="left-panel">
					<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
					<el-button
						type="danger"
						plain
						icon="el-icon-delete"
						:disabled="selection.length == 0"
						@click="batch_del"
					></el-button>
					<el-button type="primary" plain :disabled="selection.length !== 1">密码重置</el-button>
					<scFilterBar style="margin-left:10px;" :options="options" @filterChange="change"></scFilterBar>
				</div>
				<div class="right-panel">
					<div class="right-panel-search">
						<el-input v-model="search.name" placeholder="账号 / 真实姓名 / 手机" clearable></el-input>
						<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
					</div>
				</div>
			</el-header>
			<el-main class="nopadding">
				<scTable
					ref="table"
					:apiObj="apiObj"
					:column="column"
					:params="params"
					@selection-change="selectionChange"
					stripe
					remoteSort
					remoteFilter
					highlightCurrentRow
				>
					<el-table-column type="selection" width="50"></el-table-column>
					<template #portrait="scope">
						<template v-if="scope.row.name">
							<el-avatar v-if="scope.row.portrait" :icon="scope.row.portrait" size="small"></el-avatar>
							<el-avatar v-else size="small">{{ scope.row.name.substring(0, 1) }}</el-avatar>
						</template>
					</template>
					<template #auth_group="scope">
						<template
							v-if="scope.row.auth_group"
						>{{ scope.row.auth_group.map((item) => item.introduction).join(",") }}</template>
					</template>
					<template #state="scope">
						<template v-if="scope.row.state">
							<sc-status-indicator v-if="scope.row.state == '1'" pulse type="primary"></sc-status-indicator>
							<sc-status-indicator v-if="scope.row.state == '2'" pulse type="danger"></sc-status-indicator>
						</template>
					</template>
					<el-table-column label="操作" fixed="right" align="right" width="150">
						<template #default="scope">
							<el-button type="text" size="small" @click="table_show(scope.row, scope.$index)">查看</el-button>
							<el-button type="text" size="small" @click="table_edit(scope.row, scope.$index)">编辑</el-button>
							<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
								<template #reference>
									<el-button type="text" size="small">删除</el-button>
								</template>
							</el-popconfirm>
						</template>
					</el-table-column>
				</scTable>
			</el-main>
		</el-container>
	</el-container>

	<save-dialog
		v-if="dialog.save"
		ref="saveDialog"
		@success="handleSuccess"
		@closed="dialog.save = false"
		:close-on-click-modal="false"
	></save-dialog>
</template>
<style lang='scss' scoped>
@import "./scss/index.scss";
</style>

<script>
import js from './js/index'
export default js
</script>
