<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="left">
			<el-form-item label="角色名称" prop="introduction">
				<el-input v-model="form.introduction" clearable></el-input>
			</el-form-item>
			<el-form-item label="角色别名" prop="roles">
				<el-input v-model="form.roles" clearable></el-input>
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
