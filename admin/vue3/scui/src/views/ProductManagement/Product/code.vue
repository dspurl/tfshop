<template>
	<sc-dialog :title="titleMap[mode]" v-model="visible" :width="1000" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode == 'show'" ref="dialogForm" label-width="120px"
			label-position="right">
			<el-form-item label="卡密类型" prop="code_type">
				<el-radio-group v-model="form.code_type" @change="handleCode">
					<el-radio :value="0">卡密</el-radio>
					<el-radio :value="1">网盘</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="是否固定卡密" prop="is_fixed" @change="handleCode">
				<el-radio-group v-model="form.is_fixed">
					<el-radio :value="0">否</el-radio>
					<el-radio :value="1">是</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="数据" prop="good_code">
				<sc-form-table ref="goodCodeTable" v-model="form.good_code"
					:hideAdd="form.is_fixed === 1 && form.good_code.length > 0 ? true : false"
					:addTemplate="addTemplate" drag-sort placeholder="暂无数据">
					<el-table-column prop="name" :label="form.code_type === 0 ? `卡号` : `网盘地址`" min-width="300">
						<template #default="scope">
							<el-input v-model="scope.row.name"
								:placeholder="form.code_type === 0 ? `请输入卡号(非必填)` : `请输入网盘地址`" clearable show-word-limit
								maxlength="255"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="code" :label="form.code_type === 0 ? `卡密` : `提取码`" min-width="300">
						<template #default="scope">
							<el-input v-model="scope.row.code" :placeholder="form.code_type === 0 ? `请输入卡密` : `请输入提取码`"
								clearable show-word-limit maxlength="255"></el-input>
						</template>
					</el-table-column>
				</sc-form-table>
				<el-button v-if="form.is_fixed === 0" @click="handleUpload" style="margin-top:5px;">导入{{ form.code_type
					=== 0 ? `卡密` :
					`网盘`
					}}</el-button>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">{{
				$t("general.cancel")
			}}</el-button>
			<el-button v-if="mode != 'show'" type="primary" :loading="isSaveing" @click="submit()">{{ $t("general.save")
				}}</el-button>
		</template>
	</sc-dialog>
</template>
<style lang="scss" scoped></style>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
	emits: ["success", "closed"],
	data() {
		return {
			mode: "add",
			titleMap: {
				add: "新增卡密",
				ddit: "编辑卡密",
			},
			visible: false,
			isSaveing: false,
			//表单数据
			form: {
				code_type: 0,
				is_fixed: 1,
				good_code: [],
			},
			addTemplate: {
				name: '',
				code: '',
				state: 0,
			},
			index: 0,
			//验证规则
			rules: {
				code_type: [
					{
						required: true,
						message: "请选择卡密类型",
					},
				],
				is_fixed: [
					{
						required: true,
						message: "请选择是否固定卡密",
					},
				],
				good_code: [
					{
						required: true,
						message: "请添加卡密/网盘数据",
					},
				],
			},
		};
	},
	mounted() {
	},
	computed: {
	},
	methods: {
		// 切换卡密和网盘
		handleCode() {
			this.form.good_code = []
		},
		// 上传卡密
		handleUpload() {
			ElMessageBox.prompt(this.form.code_type === 0 ? `卡密` : `网盘`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputType: 'textarea',
				inputPlaceholder: this.form.code_type === 0 ? `每行一条卡密，第行格式：卡号1:卡密1` : `每行一条网盘数据，第行格式：网盘地址1:提取码1`
			})
				.then(({ value }) => {
					const data = value.split(/[(\r\n)\r\n]+/)
					let line = null
					for (const dataKey in data) {
						line = data[dataKey].split(':')
						if (line.length < 2) {
							ElMessage({
								type: 'info',
								message: `卡密格式有误`,
							})
							return false
						}
						this.form.good_code.push({
							name: line[0],
							code: line[1]
						})
					}
				})
				.catch(() => { })
		},
		//表单提交方法
		submit() {
			this.$refs.dialogForm.validate(async (valid) => {
				if (valid) {
					this.isSaveing = true;
					this.$emit("success", this.form, this.index);
					this.visible = false;
				} else {
					return false;
				}
			});
		},
		//显示
		open(mode = "add", index) {
			this.mode = mode;
			this.index = index
			this.visible = true;
			return this;
		},
		//表单注入数据
		setData(data) {
			Object.assign(this.form, data);
		},
	},
};
</script>
