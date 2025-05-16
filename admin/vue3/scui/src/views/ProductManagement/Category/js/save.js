export default {
	emits: ["success", "closed"],
	data() {
		return {
			mode: "add",
			titleMap: {
				add: "新增商品分类",
				edit: "编辑商品分类",
				show: "查看商品分类",
			},
			visible: false,
			isSaveing: false,
			isChildren: false,
			//表单数据
			form: {
				id: "",
				img: "",
				name: "",
				parent_id: "",
				sort: 5,
				state: 0,
				is_recommend: 0,
			},
			categoryList: [],
			//验证规则
			rules: {
				name: [
					{
						required: true,
						message: "请输入地区名称",
					},
				],
				parent_id: [
					{
						required: true,
						message: "请选择上级地区",
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
					this.form.parent_id = Array.isArray(this.form.parent_id)
						? this.form.parent_id[this.form.parent_id.length - 1]
						: this.form.parent_id;
					if (this.form.id) {
						try {
							const res = await this.$API.category.edit.post(
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
							const res = await this.$API.category.create.post(
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
			console.log("data", data);
			if (data.isChildren) {
				this.isChildren = true;
			}
			Object.assign(this.form, data);
			this.form.state = data.state === "显示" ? 0 : 1;
			this.form.is_recommend = data.is_recommend === "推荐" ? 1 : 0;
		},
		setCategory(data) {
			this.categoryList = data;
			return this;
		},
	},
};
