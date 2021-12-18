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
					{ required: true, message: this.$t('form.password.title') },
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
					{ required: true, message: this.$t('form.password.title2') },
					{
						validator: (rule, value, callback) => {
							if (value !== this.form.password) {
								callback(new Error(this.$t('form.password.inconformity')));
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
