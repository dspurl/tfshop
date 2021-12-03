<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="left">
			<el-form-item label="上级角色" prop="parentId">
				<el-cascader v-model="form.parentId" :options="groups" :props="groupsProps" :show-all-levels="false" clearable style="width: 100%;"></el-cascader>
			</el-form-item>
			<el-form-item label="角色名称" prop="label">
				<el-input v-model="form.label" clearable></el-input>
			</el-form-item>
			<el-form-item label="角色别名" prop="alias">
				<el-input v-model="form.alias" clearable></el-input>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input-number v-model="form.sort" controls-position="right" :min="1" style="width: 100%;"></el-input-number>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button v-if="mode!='show'" type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>
<style lang='scss' scoped>
  @import "./scss/save.scss";
</style>

<script>
import js from './js/save'
export default js
</script>
