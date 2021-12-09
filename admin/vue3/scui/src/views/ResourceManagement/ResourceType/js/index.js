import saveDialog from "../save";
export default {
    name: 'ResourceType',
    components: {
        saveDialog
    },
    data() {
		return {
			dialog: {
				save: false,
				permission: false,
			},
			apiObj: this.$API.resourceType.list,
			selection: [],
			params: {
				keyword: null,
			},
			power: [],
			column: [
				{
					label: "ID",
					prop: "id",
					width: "100",
					sortable: true,
					hide: true,
				},
				{
					label: "UUID",
					prop: "uuid",
					width: "200"
				},
				{
					label: this.$t("resource_type.form.name.name"),
					prop: "name",
					width: "100",
				},
				{
					label: this.$t("resource_type.form.alias.name"),
					prop: "alias",
					width: "200",
				},
                {
					label: this.$t("resource_type.form.icon.name"),
					prop: "icon",
					width: "100",
				},
                {
					label: this.$t("resource_type.form.extension.name"),
					prop: "extension",
					width: "200",
				},
				{
					label: this.$t("resource_type.form.createdAt.name"),
					prop: "created_at",
					width: "200",
					sortable: true,
				},
				{
					label: this.$t("resource_type.form.updatedAt.name"),
					prop: "updated_at",
					width: "300",
					sortable: true,
				},
			],
		};
	},
    mounted() {
		this.getPower();
	},
	methods: {
		//获取权限列表
		async getPower() {
			const res = await this.$API.resourceType.list.get();
			this.power = res.message;
		},
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
		//权限设置
		permission() {
			this.dialog.permission = true;
			this.$nextTick(() => {
				this.$refs.permissionDialog
					.open(
						this.selection[0].id,
						this.selection[0].auth_rule.map((item) => item.id)
					)
					.setData(this.power);
			});
		},
		//删除
		async table_del(row) {
			const loading = this.$loading();
			try {
				await this.$API.resourceType.destroy.post(row.id);
				this.$refs.table.refresh();
				this.$message.success(this.$t("general.deleteSuccessfully"));
			} finally {
				loading.close();
			}
		},
		//批量删除
		async batch_del() {
			this.$confirm(
				this.$t("general.deleteSelectedAndChild", {
					Number: this.selection.length,
				}),
				this.$t("general.hint"),
				{
					type: "warning",
				}
			).then(async () => {
				const loading = this.$loading();
				try {
					await this.$API.resourceType.destroy.post(0, {
						ids: this.selection.map((item) => item.id),
					});
					this.$refs.table.refresh();
					this.$message.success(
						this.$t("general.operateSuccessfully")
					);
				} finally {
					loading.close();
				}
			});
		},
		//表格选择后回调事件
		selectionChange(selection) {
			this.selection = selection;
		},
		//搜索
		upsearch() {
			this.$refs.table.refresh();
		},
		//根据ID获取树结构
		filterTree(id) {
			var target = null;
			function filter(tree) {
				tree.forEach((item) => {
					if (item.id == id) {
						target = item;
					}
					if (item.children) {
						filter(item.children);
					}
				});
			}
			filter(this.$refs.table.tableData);
			return target;
		},
		//本地更新数据
		handleSaveSuccess(data, mode) {
			if (mode == "add") {
				this.$refs.table.refresh();
			} else if (mode == "edit") {
				this.$refs.table.refresh();
			}
		},
	},
}