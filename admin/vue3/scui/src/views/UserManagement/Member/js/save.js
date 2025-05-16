export default {
	emits: ["success", "closed"],
	data() {
		return {
			mode: "add",
			titleMap: {
				add: '新增用户',
				edit: '编辑用户',
				show: '查看用户',
			},
			visible: false,
			isSaveing: false,
			//表单数据
			form: {
				id: "",
				name: "",
				password: "",
				state: 1,
				nickname: "",
				money: "",
				email: "",
				cellphone: "",
				portrait: ""
			},
			//验证规则
			rules: {
				cellphone: [
					{
						required: true,
						message: '请输入手机号',
					},
				],
				password: [
					{
						required: true,
						message: this.$t("general.pleaseInput", {
							msg: this.$t("admin.form.password.name"),
						}),
					},
					{
						validator: (rule, value, callback) => {
							if (this.form.password2 !== "") {
								this.$refs.dialogForm.validateField(
									"password2"
								);
							}
							callback();
						},
					},
				],
				password2: [
					{
						required: true,
						message: this.$t("form.password.title2"),
					},
					{
						validator: (rule, value, callback) => {
							if (value !== this.form.password) {
								callback(
									new Error(
										this.$t("form.password.inconformity")
									)
								);
							} else {
								callback();
							}
						},
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
							const res = await this.$API.member.edit.post(
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
							const res = await this.$API.member.create.post(
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
		cover() {
			console.log('e', this.form.portrait)
		},
		coverDel() {
			this.form.portrait = ''
		},
		//表单注入数据
		setData(data) {
			Object.assign(this.form, data);
		},
	},
};
