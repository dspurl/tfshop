export default {
	emits: ["success", "closed"],
	data() {
		return {
			visible: false,
			isSaveing: false,
			//表单数据
			form: {
				id: "",
				password: "",
			},
			//验证规则
			rules: {
				password: [
					{ required: true, message: "请输入登录密码" },
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
					{ required: true, message: "请再次输入密码" },
					{
						validator: (rule, value, callback) => {
							if (value !== this.form.password) {
								callback(new Error("两次输入密码不一致!"));
							} else {
								callback();
							}
						},
					},
				],
			},
		};
	},
	mounted() {
	},
	methods: {
		//显示
		open() {
			this.visible = true;
			return this;
		},
		//表单提交方法
		submit() {
			this.$refs.dialogForm.validate(async (valid) => {
				if (valid) {
					this.isSaveing = true;
					try {
						await this.$API.admin.password.post(this.form);
						this.visible = false;
						this.$message.success(
							this.$t("general.operateSuccessfully")
						);
					} finally {
						this.isSaveing = false;
					}
				} else {
					return false;
				}
			});
		},
		//表单注入数据
		setData(data) {
			this.form.id = data.id;
		},
	},
};
