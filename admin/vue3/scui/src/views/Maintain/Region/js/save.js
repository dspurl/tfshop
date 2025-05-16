export default {
	emits: ["success", "closed"],
	data() {
		return {
			mode: "add",
			titleMap: {
				add: "新增地区",
				edit: "编辑地区",
				show: "查看地区",
			},
			visible: false,
			isSaveing: false,
			isChildren: false,
			//表单数据
			form: {
				id: "",
				name: "",
				parent_id: "",
				value: "",
			},
			regionList: [],
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
							const res = await this.$API.region.edit.post(
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
							const res = await this.$API.region.create.post(
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
			if(data.isChildren){
				this.isChildren = true
			}
			Object.assign(this.form, data);
			
		},
		setRegion(data){
			this.regionList = data
			return this;
		}
	},
};
