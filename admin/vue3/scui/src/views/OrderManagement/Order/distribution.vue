<template>
	<sc-dialog :title="titleMap[mode]" v-model="visible" :width="1000" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode == 'show'" ref="dialogForm" label-width="120px"
			label-position="right">
			<el-form-item label="运费">
				<span v-if="form.carriage">{{ $TOOL.groupSeparator(form.carriage) }}元</span>
				<span v-else>免运费</span>
			</el-form-item>
			<el-form-item label="物流公司" prop="dhl_id">
				<div v-if="form.dhl">{{ form.dhl.name }}</div>
				<el-select v-else v-model="form.dhl_id" placeholder="请选择" clearable>
					<el-option v-for="(item, index) in dhlList" :key="index" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="运单号" prop="odd">
				<div v-if="form.odd">{{ form.odd }}</div>
				<el-input v-else ref="odd" v-model="form.odd" maxlength="255" clearable />
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
export default {
	emits: ["success", "closed"],
	components: {

	},
	data() {
		return {
			mode: "add",
			titleMap: {
				add: "新增商品",
				edit: "编辑商品",
				show: "查看商品",
			},
			//表单数据
			form: {

			},

			//验证规则
			rules: {
				download: [
					{
						required: true,
						message: "请上传下载文件",
					},
				],
			},
		};
	},
	mounted() {
		this.getDhl()

	},
	computed: {

	},
	methods: {
		//显示
		open(mode = "add") {
			this.mode = mode;
			this.visible = true;
			return this;
		},
		async getDhl() {
			const response = await this.$API.dhl.list.get({ all: true, state: 0 });
			this.dhlList = response.message;
		},

		//表单提交方法
		submit() {
			this.$refs.dialogForm.validate(async (valid) => {
				if (valid) {
					this.isSaveing = true;
					if (this.form.id) {
						try {
							const res = await this.$API.product.edit.post(
								this.form
							);
							if (!res) {
								return false;
							}
							this.$emit("success", this.form, this.mode);
							this.visible = false;
							this.$message.success(
								this.$t("general.operateSuccessfully")
							);
						} finally {
							this.isSaveing = false;
						}
					} else {
						try {
							const res = await this.$API.product.create.post(
								this.form
							);
							if (!res) {
								return false;
							}
							this.$emit("success", this.form, this.mode);
							this.visible = false;
							this.$message.success(
								this.$t("general.operateSuccessfully")
							);
						} finally {
							this.isSaveing = false;
						}
					}
				} else {
					return false;
				}
			});
		},
		//表单注入数据
		setData(data) {
			Object.assign(this.form, data);
		}
	},
};

</script>
