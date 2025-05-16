import districtDialog from "../district";
export default {
	emits: ["success", "closed"],
	components: {
		districtDialog,
	},
	data() {
		return {
			dialog: false,
			mode: "add",
			titleMap: {
				add: "新增运费模板",
				edit: "编辑运费模板",
				show: "查看运费模板",
			},
			visible: false,
			isSaveing: false,
			hasChildren: false,
			//表单数据
			form: {
				id: "",
				name: "",
				location: [],
				pinkage: [],
				pinkage_name: [],
				valuation: 0,
				freight_way: [],
			},
			regionList: [],
			//验证规则
			rules: {
				name: [
					{
						required: true,
						message: "请输入运费模板标题",
					},
				],
				location: [
					{
						required: true,
						message: "请选择商品地址",
					},
				],
			},
			region: [],
			regionAll: [],
		};
	},
	mounted() {},
	watch: {
		region: {
			handler(newValue) {
				const result = newValue.filter((item) => item.hide !== true);
				this.form.pinkage = result.map((item) => item.id);
				this.form.pinkage_name = result.map((item) => item.name);
			},
			deep: true,
		},
	},
	methods: {
		//显示
		open(mode = "add") {
			this.mode = mode;
			this.visible = true;
			return this;
		},
		//选择不包邮地区
		table_show() {
			this.dialog = true;
			this.$nextTick(() => {
				this.$refs.dialog.open().setRegion(this.region).setData();
			});
		},
		//编辑不包邮地区
		table_edit(row) {
			this.dialog = true;
			this.$nextTick(() => {
				this.$refs.dialog
					.open("edit")
					.setRegion(this.region)
					.setData(row);
			});
		},
		// 删除不包邮地区
		table_delete(index) {
			this.region = this.region.map((element) => {
				if (
					this.form.freight_way[index].location.includes(element.id)
				) {
					element.on = false;
					element.hide = false;
				}
				return element;
			});
			this.form.freight_way.splice(index, 1);
		},
		//选择不包邮地区后触发
		handleSuccess(data, mode, region) {
			this.region = region;
			if (mode === "add") {
				this.form.freight_way.push({
					...data,
					index: this.form.freight_way.length,
				});
			} else {
				this.form.freight_way.splice(data.index, 1, data);
			}
		},
		//表单提交方法
		submit() {
			this.$refs.dialogForm.validate(async (valid) => {
				if (valid) {
					this.isSaveing = true;
					if (this.form.id) {
						try {
							const res = await this.$API.freight.edit.post(
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
							const res = await this.$API.freight.create.post(
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
		// 设置地区
		setRegion(data) {
			this.region = data;
			return this;
		},
		// 设置商品地址选项
		setRegionAll(data) {
			this.regionAll = data;
			return this;
		},
		//表单注入数据
		setData(data) {
			Object.assign(this.form, data);
			this.$nextTick(() => {
				const matchedElements = data.pinkage.map((idValue) => this.region.filter((element) => element.id === idValue));
				this.form.pinkage_name = [].concat(...matchedElements).map((element) => element.name);
				this.form.freight_way = this.form.freight_way.map((item, index) => {
					const location_name = item.location.map(locationId => {
						const matchedItem = this.region.find(bItem => bItem.id === locationId);
						return matchedItem? matchedItem.name : null;
					});
					return {
					  ...item,
						location_name,
						index
					};
				});
				this.region = this.region.map(item => {
					if (!data.pinkage.includes(item.id)) {
						return {
						 ...item,
							hide: true
						};
					}
					return item;
				});
			})
			
		},
	},
};
