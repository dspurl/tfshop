export default {
	emits: ["success", "closed"],
	data() {
		return {
			mode: "add",
			titleMap: {
				add: "新增快递公司",
				edit: "编辑快递公司",
				show: "查看快递公司",
			},
			visible: false,
			isSaveing: false,
			hasChildren: false,
			//表单数据
			form: {
				id: "",
				name: "",
				abbreviation: "",
				img: "",
				is_default: 0,
				state: 0,
				sort: 5,
			},
			regionList: [],
			//验证规则
			rules: {
				name: [
					{
						required: true,
						message: "请输入快递公司名称",
					},
				],
			},
		};
	},
	mounted() {},
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
							const res = await this.$API.dhl.edit.post(
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
							const res = await this.$API.dhl.create.post(
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
			const targetOption = this.options.find(
				(option) => option.label === this.form.type
			);
			this.form.type = targetOption.value;
			this.form.state = data.state === "显示" ? 0 : 1;
		},
	},
};
