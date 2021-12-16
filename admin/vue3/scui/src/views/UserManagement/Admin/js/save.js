export default {
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
				userName: "",
				avatar: "",
				name: "",
				group: "",
			},
			//验证规则
			rules: {
				avatar: [{ required: true, message: "请上传头像" }],
				userName: [{ required: true, message: "请输入登录账号" }],
				name: [{ required: true, message: "请输入真实姓名" }],
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
				group: [{ required: true, message: "请选择所属角色" }],
			},
			//所需数据选项
			groups: [],
			groupsProps: {
				value: "id",
				multiple: true,
				checkStrictly: true,
			},
		};
	},
	mounted() {
		this.getGroup();
	},
	methods: {
		//显示
		open(mode = "add") {
			this.mode = mode;
			this.visible = true;
			return this;
		},
		//加载树数据
		async getGroup() {
			var res = await this.$API.system.role.list.get();
			this.groups = res.data;
		},
		//表单提交方法
		submit() {
			this.$refs.dialogForm.validate(async (valid) => {
				if (valid) {
					this.isSaveing = true;
					var res = await this.$API.demo.post.post(this.form);
					this.isSaveing = false;
					if (res.code == 200) {
						this.$emit("success", this.form, this.mode);
						this.visible = false;
						this.$message.success("操作成功");
					} else {
						this.$alert(res.message, "提示", { type: "error" });
					}
				} else {
					return false;
				}
			});
		},
		//表单注入数据
		setData(data) {
			this.form.id = data.id;
			this.form.userName = data.userName;
			this.form.avatar = data.avatar;
			this.form.name = data.name;
			this.form.group = data.group;

			//可以和上面一样单个注入，也可以像下面一样直接合并进去
			//Object.assign(this.form, data)
		},
	},
};
