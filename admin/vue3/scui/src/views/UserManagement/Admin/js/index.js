import saveDialog from "../save";

export default {
	name: "Admin",
	components: {
		saveDialog,
	},
	data() {
		return {
			dialog: {
				save: false,
			},
			showGrouploading: false,
			props: {
				label: "introduction",
			},
			groupFilterText: "",
			group: [],
			apiObj: this.$API.admin.list,
			selection: [],
			search: {
				name: null,
			},
			column: [
				{
					label: "ID",
					prop: "id",
					width: "100",
					sortable: true,
				},
				{
					label: "头像",
					prop: "portrait",
					width: "80",
					columnKey: "filterPortrait",
					filters: [
						{ text: "已上传", value: "1" },
						{ text: "未上传", value: "0" },
					],
				},
				{
					label: "账号",
					prop: "name",
					width: "150",
				},
				{
					label: "真实姓名",
					prop: "real_name",
					width: "150",
				},
				{
					label: "所属角色",
					prop: "real_name",
					width: "150",
				},
				{
					label: "邮箱",
					prop: "email",
					width: "150",
				},
				{
					label: "手机",
					prop: "cellphone",
					width: "150",
				},
				{
					label: "加入时间",
					prop: "created_at",
					width: "150",
					sortable: true,
				},
				{
					label: "最后登录时间",
					prop: "updated_at",
					width: "150",
					sortable: true,
				},
				{
					label: "最后操作时间",
					prop: "updated_at",
					width: "150",
					sortable: true,
				},
			],
		};
	},
	watch: {
		groupFilterText(val) {
			this.$refs.group.filter(val);
		},
	},
	mounted() {
		this.getGroup();
	},
	methods: {
		//添加
		add() {
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.saveDialog.open();
			});
		},
		//编辑
		table_edit(row) {
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.saveDialog.open("edit").setData(row);
			});
		},
		//查看
		table_show(row) {
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.saveDialog.open("show").setData(row);
			});
		},
		//删除
		async table_del(row, index) {
			var reqData = { id: row.id };
			var res = await this.$API.demo.post.post(reqData);
			if (res.code == 200) {
				//这里选择刷新整个表格 OR 插入/编辑现有表格数据
				this.$refs.table.tableData.splice(index, 1);
				this.$message.success("删除成功");
			} else {
				this.$alert(res.message, "提示", { type: "error" });
			}
		},
		//批量删除
		async batch_del() {
			this.$confirm(
				`确定删除选中的 ${this.selection.length} 项吗？`,
				"提示",
				{
					type: "warning",
				}
			)
				.then(() => {
					const loading = this.$loading();
					this.selection.forEach((item) => {
						this.$refs.table.tableData.forEach((itemI, indexI) => {
							if (item.id === itemI.id) {
								this.$refs.table.tableData.splice(indexI, 1);
							}
						});
					});
					loading.close();
					this.$message.success("操作成功");
				})
				.catch(() => {});
		},
		//表格选择后回调事件
		selectionChange(selection) {
			this.selection = selection;
		},
		//加载树数据
		async getGroup() {
			this.showGrouploading = true;
			var res = await this.$API.role.list.get();
			this.showGrouploading = false;
			var allNode = { id: "", introduction: "所有" };
			res.message.data.unshift(allNode);
			this.group = res.message.data;
		},
		//树过滤
		groupFilterNode(value, data) {
			if (!value) return true;
			return data.label.indexOf(value) !== -1;
		},
		//树点击事件
		groupClick(data) {
			var params = {
				groupId: data.id,
			};
			this.$refs.table.reload(params);
		},
		//搜索
		upsearch() {
			this.$refs.table.upData(this.search);
		},
		//本地更新数据
		handleSuccess(data, mode) {
			if (mode == "add") {
				data.id = new Date().getTime();
				this.$refs.table.tableData.unshift(data);
			} else if (mode == "edit") {
				this.$refs.table.tableData
					.filter((item) => item.id === data.id)
					.forEach((item) => {
						Object.assign(item, data);
					});
			}
		},
	},
};
