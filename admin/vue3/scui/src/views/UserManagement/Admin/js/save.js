import scIconSelect from "@/components/scIconSelect";
export default {
	components: {
		scIconSelect,
	},
	emits: ["success", "closed"],
	data() {
		return {
			mode: "add",
			titleMap: {
				add: "新增用户",
				edit: "编辑用户",
				show: "查看",
			},
			visible: false,
			isSaveing: false,
			//表单数据
			form: {
				id: "",
				real_name: "",
				portrait: "",
				name: "",
				state: 1,
				auth_group: [],
			},
			//验证规则
			rules: {
				name: [{ required: true, message: "请输入登录账号" }],
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
			//所需数据选项
			groups: [],
			groupsProps: {
				value: "id",
				label: "introduction",
				multiple: true,
			},
		};
	},
	mounted() {
		// this.getGroup();
	},
	methods: {
		//显示
		open(mode = "add") {
			this.mode = mode;
			this.visible = true;
			return this;
		},
		//加载树数据
		getGroup(data) {
			// var res = await this.$API.role.list.get({ all: true });
			this.groups = data.filter((x) => {
				return x.id;
			});
			return this;
		},
		//表单提交方法
		submit() {
			this.$refs.dialogForm.validate(async (valid) => {
				if (valid) {
					this.isSaveing = true;
					if (this.form.id) {
						try {
							await this.$API.admin.edit.post(this.form);
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
							await this.$API.admin.create.post(this.form);
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
			this.form.auth_group = data.auth_group.map((item) => item.id);
		},
	},
};
