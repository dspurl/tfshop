export default {
	emits: ["success", "closed"],
	data() {
		return {
			mode: "add",
			titleMap: {
				add: "新增轮播",
				edit: "编辑轮播",
				show: "查看轮播",
			},
			visible: false,
			isSaveing: false,
			hasChildren: false,
			//表单数据
			form: {
				id: "",
				img: "",
				type: 0,
				name: "",
				url: "",
				sort: 5,
				state: 0,
			},
			options: [
				{
					value: 0,
					label: "首页轮播",
				},
				{
					value: 1,
					label: "首页广告",
				},
				{
					value: 2,
					label: "登录页广告",
				},
				{
					value: 3,
					label: "友情链接",
				},
			],
			regionList: [],
			//验证规则
			rules: {
				name: [
					{
						required: true,
						message: "请输入地区名称",
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
							const res = await this.$API.banner.edit.post(
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
							const res = await this.$API.banner.create.post(
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
