<template>
	<sc-dialog
		:title="titleMap[mode]"
		v-model="visible"
		:width="600"
		destroy-on-close
		@closed="$emit('closed')"
	>
		<el-form
			:model="form"
			:rules="rules"
			ref="dialogForm"
			label-width="120px"
			label-position="right"
		>
			<el-form-item label="配送区域" prop="location">
				<template v-for="(item, index) in region">
					<el-tag
						v-if="!item.hide || item.on"
						:key="item.name"
						:effect="item.on ? 'dark' : 'plain'"
						class="distribution-tag"
						@click.stop="handleRegion(index)"
					>
						{{ item.name }}
					</el-tag>
				</template>
			</el-form-item>
			<el-form-item label="首件" prop="first_piece">
				<el-input
					v-model="form.first_piece"
					placeholder="请输入首件数量"
					clearable
					maxlength="11"
				></el-input>
			</el-form-item>
			<el-form-item label="首费" prop="first_cost">
				<el-input
					v-model="form.first_cost"
					placeholder="请输入首件费用"
					clearable
					maxlength="11"
				></el-input>
			</el-form-item>
			<el-form-item label="续件" prop="add_piece">
				<el-input
					v-model="form.add_piece"
					placeholder="请输入续件数量"
					clearable
					maxlength="11"
				></el-input>
			</el-form-item>
			<el-form-item label="续件" prop="add_cost">
				<el-input
					v-model="form.add_cost"
					placeholder="请输入续件费用"
					clearable
					maxlength="11"
				></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">{{
				$t("general.cancel")
			}}</el-button>
			<el-button type="primary" :loading="isSaveing" @click="submit()">{{
				$t("general.save")
			}}</el-button>
		</template>
	</sc-dialog>
</template>
<style lang="scss" scoped>
.distribution-tag {
	margin-right: 5px;
	margin-bottom: 10px;
	cursor: pointer;
}
</style>

<script>
import js from "./js/district";
export default js;
</script>
