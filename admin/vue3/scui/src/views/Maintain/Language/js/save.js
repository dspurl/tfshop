export default {
	emits: ["success", "closed"],
	data() {
		return {
			mode: "add",
			titleMap: {
				add: "新增语言",
				edit: "编辑语言",
				show: "查看语言",
			},
			visible: false,
			isSaveing: false,
			//表单数据
			form: {
				id: "",
				name: "",
				code: ""
			},
			//验证规则
			rules: {
				name: [
					{
						required: true,
						message: "请输入语言名称",
					},
				],
				code: [
					{
						required: true,
						message: "请输入编码",
					},
				],
			},
		};
	},
	mounted() {
	},
	methods: {
		//显示
		open(mode = "add") {
			this.mode = mode;
			this.visible = true;
			return this;
		},
		//表单提交方法
		submit() {
			this.$refs.dialogForm.validate(async (valid) => {
				if (valid) {
					this.isSaveing = true;
					if (this.form.id) {
						try {
							const res = await this.$API.language.edit.post(
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
							const res = await this.$API.language.create.post(
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
