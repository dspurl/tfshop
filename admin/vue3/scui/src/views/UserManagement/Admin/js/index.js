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
					width: "80",
					sortable: true,
				},
				{
					label: this.$t('admin.form.portrait.name'),
					prop: "portrait",
					width: "80",
					columnKey: "filterPortrait",
					filters: [
						{ text: this.$t('admin.form.portrait.label.already'), value: 1 },
						{ text: this.$t('admin.form.portrait.label.no'), value: 0 },
					],
				},
				{
					label: this.$t('admin.form.name.name'),
					prop: "name",
					width: "150",
				},
				{
					label: this.$t('admin.form.relevance.name'),
					prop: "user_id",
					width: "150",
				},
				{
					label: this.$t('admin.form.real_name.name'),
					prop: "real_name",
					width: "150",
				},
				{
					label: this.$t('admin.form.auth_group.name'),
					prop: "auth_group",
					width: "150",
				},
				{
					label: this.$t('admin.form.email.name'),
					prop: "email",
					width: "150",
				},
				{
					label: this.$t('admin.form.cellphone.name'),
					prop: "cellphone",
					width: "150",
				},
				{
					label: this.$t('admin.form.state.name'),
					prop: "state",
					width: "60",
					columnKey: "filterState",
					filters: [
						{ text: this.$t('admin.form.state.label.normal'), value: 1 },
						{ text: this.$t('admin.form.state.label.forbid'), value: 2 },
					],
				},
				{
					label: this.$t('admin.form.created_at.name'),
					prop: "created_at",
					width: "150",
					sortable: true,
				},
				{
					label: this.$t('admin.form.login_at.name'),
					prop: "updated_at",
					width: "150",
					sortable: true,
				},
				{
					label: this.$t('admin.form.updated_at.name'),
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
					label: this.$t('admin.form.portrait.name'),
					value: "portrait",
					type: "select",
					extend: {
						multiple: true,
						data: [
							{
								label: this.$t('admin.form.portrait.label.already'),
								value: 1,
							},
							{
								label: this.$t('admin.form.portrait.label.no'),
								value: 0,
							},
						],
					},
				},
				{
					label: this.$t('admin.form.name.name'),
					value: "name",
					type: "text",
				},
				{
					label: this.$t('admin.form.real_name.name'),
					value: "real_name",
					type: "text",
				},
				{
					label: this.$t('admin.form.auth_group.name'),
					value: "auth_group",
					type: "select",
					extend: {
						multiple: true,
						data: [],
					},
				},
				{
					label: this.$t('admin.form.email.name'),
					value: "email",
					type: "text",
				},
				{
					label: this.$t('admin.form.cellphone.name'),
					value: "cellphone",
					type: "text",
				},
				{
					label: this.$t('admin.form.state.name'),
					value: "state",
					type: "select",
					extend: {
						multiple: true,
						data: [
							{
								label: this.$t('admin.form.state.label.normal'),
								value: 1,
							},
							{
								label: this.$t('admin.form.state.label.forbid'),
								value: 2,
							},
						],
					},
				},
				{
					label: this.$t('admin.form.created_at.name'),
					value: "created_at",
					type: "daterange",
				},
				{
					label: this.$t('admin.form.login_at.name'),
					value: "updated_at",
					type: "daterange",
				},
				{
					label: this.$t('admin.form.updated_at.name'),
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
				this.$message.success(this.$t('general.deleteSuccessfully'));
			} else {
				this.$alert(res.message, this.$t('general.hint'), { type: "error" });
			}
		},
		//批量删除
		async batch_del() {
			this.$confirm(
				this.$t('general.confirmDeleteProject',{length:this.selection.length}),
				this.$t('general.hint'),
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
					this.$message.success(this.$t('general.operateSuccessfully'));
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
			var allNode = { id: "", introduction: this.$t('general.all') };
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
