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
					<template v-if="scope.row.user_id">{{ scope.row.user.name }}</template>
					<template>{{ $t("general.nothing") }}</template>
				</template>
			</scTable>
		</el-main>
	</el-container>

	<el-drawer v-model="infoDrawer" :title="$t('adminLog.infoName')" :size="600" destroy-on-close>
		<info v-auths="['AdminLogView']" ref="info"></info>
	</el-drawer>
</template>
<style lang='scss' scoped>
@use "./scss/index.scss" as *;
</style>

<script>
import js from './js/index'
export default js
</script>
