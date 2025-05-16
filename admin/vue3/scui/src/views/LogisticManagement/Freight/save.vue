<template>
	<sc-dialog
		:title="titleMap[mode]"
		v-model="visible"
		:width="800"
		destroy-on-close
		@closed="$emit('closed')"
	>
		<el-form
			:model="form"
			:rules="rules"
			:disabled="mode == 'show'"
			ref="dialogForm"
			label-width="120px"
			label-position="right"
		>
			<el-form-item label="模板名称" prop="name">
				<el-input
					v-model="form.name"
					placeholder="请输入模板名称"
					clearable
					maxlength="60"
				></el-input>
			</el-form-item>
			<el-form-item label="商品地址" prop="location">
				<el-cascader
					v-model="form.location"
					:options="regionAll"
					:filterable="true"
					:props="{ value: 'id', label: 'name' }"
				/>
			</el-form-item>
			<el-form-item label="计价方式" prop="valuation">
				<el-radio-group v-model="form.valuation">
					<el-radio value="0">按件数</el-radio>
					<el-radio value="1">按重量</el-radio>
					<el-radio value="2">按体积</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="不包邮地区" prop="freight_way">
				<el-table
					:data="form.freight_way"
					border
					style="width: 100%; padding-bottom: 10px"
				>
					<el-table-column
						label="运送到"
						prop="location_name"
						width="180"
					>
						<template #location_name="scope">
							<span>{{ scope.row.location_name.join(",") }}</span>
						</template>
					</el-table-column>
					<el-table-column
						label="首件"
						prop="first_piece"
						width="180"
					/>
					<el-table-column label="首费" prop="first_cost" />
					<el-table-column label="续件" prop="add_piece" />
					<el-table-column label="续费" prop="add_cost" />
					<el-table-column label="操作" width="120">
						<template #default="scope">
							<el-tooltip
								content="编辑"
								class="item"
								effect="dark"
								placement="top-start"
							>
								<el-button
									type="primary"
									icon="el-icon-edit"
									circle
									@click="table_edit(scope.row)"
								/>
							</el-tooltip>
							<el-tooltip
								content="删除"
								class="item"
								effect="dark"
								placement="top-start"
							>
								<el-button
									type="danger"
									icon="el-icon-delete"
									circle
									@click="table_delete(scope.$index)"
								/>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<el-alert type="info" show-icon :closable="false">
					<p>不在“不包邮配送区域”的，都按包邮处理</p>
				</el-alert>
				<div>
					<el-button
						type="warning"
						style="margin-top: 10px"
						round
						:disabled="form.pinkage_name.length === 0"
						@click="table_show()"
						>添加可配送区域和运费</el-button
					>
				</div>
			</el-form-item>
			<el-form-item label="包邮地区" prop="pinkage_name">
				{{form.pinkage_name.length ? form.pinkage_name.join(",") : ''}}
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">{{
				$t("general.cancel")
			}}</el-button>
			<el-button
				v-if="mode != 'show'"
				type="primary"
				:loading="isSaveing"
				@click="submit()"
				>{{ $t("general.save") }}</el-button
			>
		</template>
		<district-dialog
			v-if="dialog"
			ref="dialog"
			@success="handleSuccess"
			@closed="dialog = false"
			:close-on-click-modal="false"
		></district-dialog>
	</sc-dialog>
</template>
<style lang="scss" scoped>
@use "./scss/save.scss" as *;
</style>

<script>
import js from "./js/save";
export default js;
</script>
