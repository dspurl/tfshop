<template>
	<el-container>
		<el-container>
			<el-header>
				<div class="left-panel">
					<el-button v-auths="['CategoryCreate']" type="primary" icon="el-icon-plus" @click="add"></el-button>
					<el-button
						v-auths="['CategoryDestroy']"
						type="danger"
						plain
						icon="el-icon-delete"
						:disabled="selection.length == 0"
						@click="batch_del"
					></el-button>
					<el-alert style="margin-left:10px;" title="删除类目时请确保无子级，不然子级无法编辑！" type="warning" />
				</div>
				<div class="right-panel">
					<div class="right-panel-search">
						<el-input v-model="search.keyword" placeholder="地区名称/地区编码" clearable></el-input>
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
					:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
					@selection-change="selectionChange"
					stripe
					lazy
					hidePagination
					row-key="id"
					remoteSort
					remoteFilter
					highlightCurrentRow
				>
					<el-table-column type="selection" width="50"></el-table-column>
					<template #img="scope">
						<el-image :preview-src-list="[scope.row.img]" preview-teleported v-if="scope.row.img" :src="scope.row.img" />
					</template>
					<template #state="scope">
						<template v-if="scope.row.state">
							<sc-status-indicator v-if="scope.row.state === 1" pulse type="primary"></sc-status-indicator>
							<sc-status-indicator v-if="scope.row.state === 2" pulse type="danger"></sc-status-indicator>
						</template>
					</template>
					<el-table-column :label="$t('general.operation')" fixed="right" align="right" min-width="150">
						<template #default="scope">
							<el-button-group>
								<el-button
									link
									type="primary"
									size="small"
									v-auths="['CategoryCreate']"
									@click="table_show(scope.row, scope.$index)"
								>添加子分类</el-button>
								<el-button
									link
									type="primary"
									size="small"
									v-auths="['CategoryEdit']"
									@click="table_edit(scope.row, scope.$index)"
								>{{ $t('general.edit') }}</el-button>
								<el-popconfirm
									title="$t('general.sureDelete')"
									@confirm="table_del(scope.row, scope.$index)"
								>
									<template #reference>
										<el-button v-auths="['CategoryDestroy']" link type="primary" size="small">{{ $t('general.delete') }}</el-button>
									</template>
								</el-popconfirm>
							</el-button-group>
						</template>
					</el-table-column>
				</scTable>
			</el-main>
		</el-container>
	</el-container>

	<save-dialog
		v-auths="['CategoryCreate', 'CategoryEdit']"
		v-if="dialog.save"
		ref="saveDialog"
		@success="handleSuccess"
		@closed="dialog.save = false"
		:close-on-click-modal="false"
	></save-dialog>
</template>
<style lang='scss' scoped>
@use "./scss/index.scss" as *;
</style>

<script>
import js from './js/index'
export default js
</script>
