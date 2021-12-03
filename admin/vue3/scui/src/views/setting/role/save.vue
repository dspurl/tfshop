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

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				mode: "add",
				titleMap: {
					add: '新增',
					edit: '编辑',
					show: '查看'
				},
				visible: false,
				isSaveing: false,
				//表单数据
				form: {
					id:"",
					label: "",
					alias: "",
					sort: 1,
					parentId: ""
				},
				//验证规则
				rules: {
					sort: [
						{required: true, message: '请输入排序', trigger: 'change'}
					],
					label: [
						{required: true, message: '请输入角色名称'}
					],
					alias: [
						{required: true, message: '请输入角色别名'}
					]
				},
				//所需数据选项
				groups: [],
				groupsProps: {
					value: "id",
					emitPath: false,
					checkStrictly: true
				}
			}
		},
		mounted() {
			this.getGroup()
		},
		methods: {
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this
			},
			//加载树数据
			async getGroup(){
				var res = await this.$API.system.role.list.get();
				this.groups = res.data;
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaveing = true;
						var res = await this.$API.demo.post.post(this.form);
						this.isSaveing = false;
						if(res.code == 200){
							this.$emit('success', this.form, this.mode)
							this.visible = false;
							this.$message.success("操作成功")
						}else{
							this.$alert(res.message, "提示", {type: 'error'})
						}
					}
				})
			},
			//表单注入数据
			setData(data){
				this.form.id = data.id
				this.form.label = data.label
				this.form.alias = data.alias
				this.form.sort = data.sort
				this.form.parentId = data.parentId

				//可以和上面一样单个注入，也可以像下面一样直接合并进去
				//Object.assign(this.form, data)
			}
		}
	}
</script>

<style>
</style>
