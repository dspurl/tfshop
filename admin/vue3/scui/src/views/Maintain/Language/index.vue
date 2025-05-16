<template>
	<el-container>
		<el-container>
			<el-header>
				<div class="left-panel">
					<el-button v-auths="['LanguageCreate']" type="primary" icon="el-icon-plus" @click="add"></el-button>
					<el-button
						v-auths="['LanguageDestroy']"
						type="danger"
						plain
						icon="el-icon-delete"
						:disabled="selection.length == 0"
						@click="batch_del"
					></el-button>
				</div>
				<div class="right-panel">
					<div class="right-panel-search">
						<el-input v-model="search.keyword" placeholder="语言名称/编码" clearable></el-input>
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
					hidePagination
					row-key="id"
					remoteSort
					remoteFilter
					highlightCurrentRow
				>
					<el-table-column type="selection" width="50"></el-table-column>
					<template #portrait="scope">
						<template v-if="scope.row.name">

							<el-avatar :size="30" v-if="scope.row.portrait" style="padding: 2px;">
								<template #default>
									<el-icon :size="26">
										<component :is="scope.row.portrait" />
									</el-icon>
								</template>
							</el-avatar>
							<el-avatar :size="30" v-else>{{ scope.row.cellphone.substring(0, 1) }}</el-avatar>
						</template>
					</template>
					<template #unsubscribe="scope">
						<sc-status-indicator v-if="scope.row.unsubscribe === 0" pulse type="primary"></sc-status-indicator>
							<sc-status-indicator v-if="scope.row.unsubscribe === 1" pulse type="danger"></sc-status-indicator>
					</template>
					<template #money="scope">
						{{ $TOOL.groupSeparator(scope.row.money) }}
					</template>
					<template #state="scope">
						<template v-if="scope.row.state">
							<sc-status-indicator v-if="scope.row.state === 1" pulse type="primary"></sc-status-indicator>
							<sc-status-indicator v-if="scope.row.state === 2" pulse type="danger"></sc-status-indicator>
						</template>
					</template>
					<el-table-column :label="$t('general.operation')" fixed="right" align="right" min-width="120">
						<template #default="scope">
							<el-button-group>
								<el-button
									link
									type="primary"
									size="small"
									v-auths="['LanguageEdit']"
									@click="table_edit(scope.row, scope.$index)"
								>{{ $t('general.edit') }}</el-button>
								<el-popconfirm
									:title="$t('general.sureDelete')"
									@confirm="table_del(scope.row, scope.$index)"
								>
									<template #reference>
										<el-button v-auths="['LanguageDestroy']" link type="primary" size="small">{{ $t('general.delete') }}</el-button>
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
		v-auths="['LanguageCreate', 'LanguageEdit']"
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
