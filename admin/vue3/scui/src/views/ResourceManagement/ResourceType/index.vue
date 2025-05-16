<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button
					v-auths="['RoleCreate']"
					type="primary"
					icon="el-icon-plus"
					@click="add"
				></el-button>
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
				<div class="right-panel-search" @keyup.enter="login">
					<el-input
						v-model="params.keyword"
						:placeholder="$t('resource_type.keyword')"
						clearable
					></el-input>
					<el-button
						type="primary"
						icon="el-icon-search"
						@click="upsearch"
					></el-button>
				</div>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable
				ref="table"
				:apiObj="apiObj"
				:params="params"
				:column="column"
				:stripe="true"
				:highlightCurrentRow="true"
				row-key="id"
				@selection-change="selectionChange"
			>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column
					label="#"
					type="index"
					width="50"
				></el-table-column>
				<template #uuid="scope">
					<span>{{ scope.row.uuid }}</span>
					<el-icon class="copy" v-copy="scope.row.uuid">
						<component :is="'el-icon-copy-document'" />
					</el-icon>
				</template>
				<template #alias="scope">
					<span>{{ scope.row.alias }}</span>
					<el-icon class="copy" v-copy="scope.row.alias">
						<component :is="'el-icon-copy-document'" />
					</el-icon>
				</template>
				<template #icon="scope">
					<el-icon>
						<component :is="scope.row.icon" />
					</el-icon>
				</template>
				<el-table-column
					:label="$t('general.operation')"
					fixed="right"
					align="right"
					width="160"
				>
					<template #default="scope">
						<el-button-group>
							<el-button
								v-auths="['ResourceTypeView']"
								text
								type="primary"
								size="small"
								@click="table_show(scope.row, scope.$index)"
								>{{ $t("general.view") }}</el-button
							>
							<el-button
								v-auths="['ResourceTypeEdit']"
								text
								type="primary"
								size="small"
								@click="table_edit(scope.row, scope.$index)"
								>{{ $t("general.edit") }}</el-button
							>
							<el-button
								v-auths="['ResourceTypeDestroy']"
								text
								type="primary"
								size="small"
								@click="table_del(scope.row, scope.$index)"
								>{{ $t("general.delete") }}</el-button
							>
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
</template>
<style lang="scss" scoped>
@use "./scss/index.scss" as *;
</style>

<script>
import js from "./js/index";
export default js;
</script>
