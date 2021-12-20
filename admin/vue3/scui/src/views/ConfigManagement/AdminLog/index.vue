<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<scFilterBar
					style="margin-left:10px;"
					:filterName="$t('adminLog.FilterBarName')"
					filterAuthRule="Admin"
					:options="options"
					@filterChange="change"
				></scFilterBar>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable
				ref="table"
				:apiObj="apiObj"
				:column="column"
				:params="params"
				@selection-change="selectionChange"
				@row-click="rowClick"
				stripe
				remoteSort
				remoteFilter
				highlightCurrentRow
			>
				<el-table-column type="selection" width="50"></el-table-column>
				<template #admin_id="scope">
					<template v-if="scope.row.admin_id">{{ scope.row.admin.name }}</template>
					<template>{{ $t("general.nothing") }}</template>
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
			</scTable>
		</el-main>
	</el-container>

	<el-drawer v-auth="['AdminLogView']" v-model="infoDrawer" :title="$t('adminLog.infoName')" :size="600" destroy-on-close>
		<info ref="info"></info>
	</el-drawer>
</template>
<style lang='scss' scoped>
@import "./scss/index.scss";
</style>

<script>
import js from './js/index'
export default js
</script>
