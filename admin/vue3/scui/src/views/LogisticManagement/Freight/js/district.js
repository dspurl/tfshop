export default {
	emits: ["success", "closed"],
	data() {
		return {
			visible: false,
			isSaveing: false,
			mode: "add",
			titleMap: {
				add: "新增不包邮配送区域",
				edit: "编辑不包邮配送区域",
			},
			//表单数据
			form: {
				location: [],
				location_name: [],
				first_piece: "",
				first_cost: "",
				add_piece: "",
				add_cost: "",
			},
			//验证规则
			rules: {
				location: [
					{
						required: true,
						message: "请选择包邮地区",
					},
				],
				first_piece: [
					{
						required: true,
						message: "请输入首件数量",
					},
				],
				first_cost: [
					{
						required: true,
						message: "请输入首件费用",
					},
				],
				add_piece: [
					{
						required: true,
						message: "请输入续件数量",
					},
				],
				add_cost: [
					{
						required: true,
						message: "请输入续件费用",
					},
				],
			},
			region: [],
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
					this.$emit("success", this.form, this.mode, this.region);
					this.visible = false;
				} else {
					return false;
				}
			});
		},
		// 选择地区
		handleRegion(index) {
			this.region[index].on = !this.region[index].on;
			this.region[index].hide = !this.region[index].hide;
			const indexs = this.form.location.findIndex(
				(item) => item === this.region[index].id
			);
			// 选中添加到location中
			if (this.region[index].on) {
				if (indexs === -1) {
					this.form.location.push(this.region[index].id);
					this.form.location_name.push(this.region[index].name);
				}
			} else {
				// 未选中则删除location中对应的ID
				if (indexs !== -1) {
					this.form.location.splice(indexs, 1);
					this.form.location_name.splice(indexs, 1);
				}
			}
		},
		// 设置地区
		setRegion(data) {
			this.region = this.$TOOL.objCopy(data);
			return this;
		},
		//表单注入数据
		setData(data = null) {
			if (data) {
				Object.assign(this.form, data);
			}
			this.region = this.region.map((element) => {
				element.on = this.form.location.includes(element.id);
				return element;
			});
			console.log("this.region", this.region);
		},
	},
};
