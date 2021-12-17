import saveDialog from "../save";
import passwordDialog from "../password";

export default {
	name: "Admin",
	components: {
		saveDialog,
		passwordDialog
	},
	data() {
		return {
			dialog: {
				save: false,
				password: false
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
				keyword: null,
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
						{ text: "已上传", value: 1 },
						{ text: "未上传", value: 0 },
					],
				},
				{
					label: "账号",
					prop: "name",
					width: "150",
				},
				{
					label: "关联用户",
					prop: "user_id",
					width: "150",
				},
				{
					label: "真实姓名",
					prop: "real_name",
					width: "150",
				},
				{
					label: "所属角色",
					prop: "auth_group",
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
					label: "状态",
					prop: "state",
					width: "60",
					columnKey: "filterState",
					filters: [
						{ text: "允许访问", value: 1 },
						{ text: "禁止访问", value: 2 },
					],
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
			params: {
				filter: null,
				limit: 10,
			},
			options: [
				{
					label: "ID",
					value: "id",
					type: "text",
				},
				{
					label: "头像",
					value: "portrait",
					type: "select",
					extend: {
						multiple: true,
						data: [
							{
								label: "已上传",
								value: 1,
							},
							{
								label: "未上传",
								value: 0,
							},
						],
					},
				},
				{
					label: "账号",
					value: "name",
					type: "text",
				},
				{
					label: "真实姓名",
					value: "real_name",
					type: "text",
				},
				{
					label: "所属角色",
					value: "auth_group",
					type: "select",
					extend: {
						multiple: true,
						data: [],
					},
				},
				{
					label: "邮箱",
					value: "email",
					type: "text",
				},
				{
					label: "手机",
					value: "cellphone",
					type: "text",
				},
				{
					label: "状态",
					value: "state",
					type: "select",
					extend: {
						multiple: true,
						data: [
							{
								label: "允许访问",
								value: 1,
							},
							{
								label: "禁止访问",
								value: 2,
							},
						],
					},
				},
				{
					label: "加入时间",
					value: "created_at",
					type: "daterange",
				},
				{
					label: "最后登录时间",
					value: "updated_at",
					type: "daterange",
				},
				{
					label: "最后操作时间",
					value: "updated_at",
					type: "daterange",
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
				this.$refs.saveDialog.open().getGroup(this.group);
			});
		},
		//修改密码
		password(){
			this.dialog.password = true;
			this.$nextTick(() => {
				this.$refs.passwordDialog.open().setData(this.selection[0]);
			});
		},
		//编辑
		table_edit(row) {
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.saveDialog
					.open("edit")
					.getGroup(this.group)
					.setData(row);
			});
		},
		//查看
		table_show(row) {
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.saveDialog
					.open("show")
					.getGroup(this.group)
					.setData(row);
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
			var res = await this.$API.role.list.get({ all: true });
			this.showGrouploading = false;
			var allNode = { id: "", introduction: "所有" };
			res.message.unshift(allNode);
			this.group = res.message;
			this.options[4].extend.data = [];
			res.message.forEach((item) => {
				if(item.id){
					this.options[4].extend.data.push({
						label: item.introduction,
						value: item.id
					});
				}
			});
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
				this.$refs.table.upData();
			} else if (mode == "edit") {
				this.$refs.table.upData();
			}
		},
		//过滤
		change(data) {
			this.params.filter = data
			this.$refs.table.refresh();
		},
	},
};
