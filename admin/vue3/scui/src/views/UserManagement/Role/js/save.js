export default {
	emits: ["success", "closed"],
	data() {
		return {
			mode: "add",
			titleMap: {
				add: this.$t("general.add"),
				edit: this.$t("general.edit"),
				show: this.$t("general.view"),
			},
			visible: false,
			isSaveing: false,
			//表单数据
			form: {
				id: "",
				roles: "",
				introduction: "",
			},
			//验证规则
			rules: {
				introduction: [
					{
						required: true,
						message:
							this.$t("general.pleaseInput") +
							this.$t("role.form.introduction.name"),
					},
				],
				roles: [
					{
						required: true,
						message:
							this.$t("general.pleaseInput") +
							this.$t("role.form.roles.name"),
					},
				],
			},
			//所需数据选项
			groups: [],
			groupsProps: {
				value: "id",
				emitPath: false,
				checkStrictly: true,
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
							await this.$API.role.edit.post(this.form);
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
							await this.$API.role.create.post(this.form);
							this.$emit("success", this.form, this.mode);
							this.visible = false;
							this.$message.success(
								this.$t("general.operateSuccessfully")
							);
						} finally {
							this.isSaveing = false;
						}
					}
				}
			});
		},
		//表单注入数据
		setData(data) {
			this.form.id = data.id;
			this.form.roles = data.roles;
			this.form.introduction = data.introduction;
		},
	},
};
