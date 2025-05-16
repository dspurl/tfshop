<template>
	<el-container>
		<el-container>
			<el-header>
				<div class="left-panel">
					<el-button v-auths="['ProductCreate']" type="primary" icon="el-icon-plus" @click="add"></el-button>
					<el-button v-auths="['ProductDestroy']" type="danger" plain icon="el-icon-delete"
						:disabled="selection.length == 0" @click="batch_del"></el-button>
				</div>
				<div class="right-panel">
					<div class="right-panel-search">
						<el-input v-model="search.keyword" placeholder="商品名称" clearable></el-input>
						<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
					</div>
				</div>
			</el-header>
			<el-main class="nopadding">
				<scTable ref="table" :apiObj="apiObj" :column="column" :params="params"
					@selection-change="selectionChange" stripe row-key="id" remoteSort remoteFilter highlightCurrentRow>
					<el-table-column type="selection" width="50"></el-table-column>
					<template #time="scope">
						{{ scope.row.time ? scope.row.time : scope.row.is_show === "定时上架" ? scope.row.timing : '未上架' }}
					</template>
					<template #name="scope">
						<el-carousel height="180px">
							<el-carousel-item v-for="(item, index) in scope.row.img" :key="item">
								<el-image preview-teleported :preview-src-list="scope.row.img" :initial-index="index"
									:src="item" fit="cover" />
							</el-carousel-item>
						</el-carousel>
						<p class="price"><span style="font-size: 12px;">¥</span>{{ $TOOL.groupSeparator(scope.row.price) }}元</p>
						<p class="name" :title="scope.row.name">{{ scope.row.name }}</p>
						<p>商品类型：{{ scope.row.type }}</p>
						<p class="category">
							<el-popover placement="top-start" :width="200" trigger="hover"
								:content="combineNames(scope.row.category)">
								<template #reference>
									类目: {{ scope.row.category?.name }}
								</template>
							</el-popover>
						</p>
						<p class="number">标识: {{ scope.row.identification }}</p>
						<p class="number">货号：{{ scope.row.number ? scope.row.number : '未设置' }}</p>
					</template>
					<template #unsubscribe="scope">
						<sc-status-indicator v-if="scope.row.unsubscribe === 0" pulse
							type="primary"></sc-status-indicator>
						<sc-status-indicator v-if="scope.row.unsubscribe === 1" pulse
							type="danger"></sc-status-indicator>
					</template>
					<template #money="scope">
						{{ $TOOL.groupSeparator(scope.row.money) }}
					</template>
					<template #state="scope">
						<template v-if="scope.row.state">
							<sc-status-indicator v-if="scope.row.state === 1" pulse
								type="primary"></sc-status-indicator>
							<sc-status-indicator v-if="scope.row.state === 2" pulse type="danger"></sc-status-indicator>
						</template>
					</template>
					<el-table-column :label="$t('general.operation')" fixed="right" align="right" min-width="120">
						<template #default="scope">
							<el-button-group>
								<el-button link type="primary" size="small" v-auths="['ProductView']"
									@click="table_show(scope.row, scope.$index)">查看</el-button>
								<el-button link type="primary" size="small" v-auths="['ProductEdit']"
									@click="table_edit(scope.row, scope.$index)">{{ $t('general.edit') }}</el-button>
								<el-popconfirm :title="$t('general.sureDelete')"
									@confirm="table_del(scope.row, scope.$index)">
									<template #reference>
										<el-button v-auths="['ProductDestroy']" link type="primary" size="small">{{
											$t('general.delete') }}</el-button>
									</template>
								</el-popconfirm>
							</el-button-group>
						</template>
					</el-table-column>
				</scTable>
			</el-main>
		</el-container>
	</el-container>

	<save-dialog v-auths="['ProductCreate', 'ProductEdit']" v-if="dialog.save" ref="saveDialog" @success="handleSuccess"
		@closed="dialog.save = false" :close-on-click-modal="false"></save-dialog>
</template>
<style lang='scss' scoped>
@use "./scss/index.scss" as *;
</style>

<script>
import js from './js/index'
export default js
</script>
