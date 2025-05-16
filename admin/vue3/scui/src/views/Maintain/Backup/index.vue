<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button :loading="isSaveing" v-auths="['BackupCreate']" type="primary" @click="add">备份</el-button>
				<el-button
					v-auths="['RoleDestroy']"
					type="danger"
					plain
					icon="el-icon-delete"
					:disabled="selection.length == 0"
					@click="batch_del"
				></el-button>
			</div>
			<div class="right-panel">
			</div>
		</el-header>
		<el-main>
			<el-card shadow="never">
				<el-tabs v-model="params.type" @tab-click="refreshTable">
					<el-tab-pane label="数据库备份" name="db">
						<div class="el-form-item-msg">
							<p>数据库备份可通过配置中进行定期备份</p>
						</div>
					</el-tab-pane>
					<el-tab-pane label="系统备份" name="file">
						<div class="el-form-item-msg">
							<p>文件备份可通过配置中进行定期备份</p>
							<p>系统备份耗时较大，所以采用队列形式处理，备份成功提示后并不会时时同步备份数据，建议过个几分钟后再进行查看</p>
							<p>系统备份无法在线还原，请自行手动进行还原，备份位于:项目根目录/storage/app/dsshop目录下，不以”db-“命名</p>
						</div>
					</el-tab-pane>
				</el-tabs>
				<scTable
					ref="table"
					:apiObj="apiObj"
					:params="params"
					:column="column"
					stripe
					remoteSort
					highlightCurrentRow
					hidePagination
					row-key="id"
					@selection-change="selectionChange"
				>
					<el-table-column type="selection" width="50"></el-table-column>
					<el-table-column label="#" type="index" width="50"></el-table-column>
					<el-table-column :label="$t('general.operation')" fixed="right" align="right">
						<template #default="scope">
							<el-button-group>
								<el-button
									:loading="isSaveing"
									v-if="params.type === 'db'"
									v-auths="['BackupEdit']"
									link
									type="primary"
									size="small"
									@click="table_edit(scope.row, scope.$index)"
								>还原</el-button>
								<el-popconfirm
									:title="$t('general.sureDelete')"
									@confirm="table_del(scope.row, scope.$index)"
								>
									<template #reference>
										<el-button :loading="isSaveing" v-auths="['BackupDestroy']" link type="primary" size="small">{{ $t('general.delete') }}</el-button>
									</template>
								</el-popconfirm>
							</el-button-group>
						</template>
					</el-table-column>
				</scTable>
			</el-card>
		</el-main>
	</el-container>
</template>
<style lang='scss' scoped>

</style>

<script>
import js from './js/index'

export default js
</script>
