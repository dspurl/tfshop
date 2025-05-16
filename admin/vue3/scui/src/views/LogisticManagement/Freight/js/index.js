import saveDialog from "../save";
export default {
	name: "Freight",
	components: {
		saveDialog,
	},
	data() {
		return {
			dialog: {
				save: false,
			},
			apiObj: this.$API.freight.list,
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
					label: "模板名称",
					prop: "name",
					width: "200",
				},
				{
					label: this.$t("admin.form.created_at.name"),
					prop: "created_at",
					width: "150",
					sortable: true,
				},
				{
					label: "最后更新时间",
					prop: "updated_at",
					width: "150",
					sortable: true,
				},
			],
			params: {
				filter: null,
				limit: 20,
			},
			region: [],
			regionAll: [],
		};
	},
	watch: {},
	mounted() {
		this.getRegion()
	},
	methods: {
		// 获取省份
		async getRegion() {
			const response = await this.$API.region.list.get({ parent_id: 1 });
			this.region = response.message;
			const responses = await this.$API.region.list.get({ all: 1 });
			this.regionAll = responses.message;
		},
		//添加
		add() {
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.saveDialog.open().setRegion(this.region).setRegionAll(this.regionAll);
			});
		},
		//编辑
		table_edit(row) {
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.saveDialog.open("edit").setRegion(this.region).setRegionAll(this.regionAll).setData(row);
			});
		},
		//查看
		table_show(row) {
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.saveDialog.open('show').setRegion(this.region).setRegionAll(this.regionAll).setData(row);
			});
		},
		handleTranslate(value, item) {
			if (value) {
				this.table_edit(value);
			} else {
				this.add(item);
			}
		},
		//表格选择后回调事件
		selectionChange(selection) {
			this.selection = selection;
		},
		//本地更新数据
		handleSuccess(data, mode) {
			if (mode == "add") {
				this.$refs.table.refresh();
			} else if (mode == "edit") {
				this.$refs.table.refresh();
			}
		},
		//搜索
		upsearch() {
			this.$refs.table.upData(this.search);
		},
		//过滤
		change(data) {
			this.params.filter = data;
			this.$refs.table.refresh();
		},
		//删除
		async table_del(row) {
			try {
				const res = await this.$API.freight.destroy.post(row.id);
				if (!res) {
					return false;
				}
				this.$refs.table.refresh();
				this.$message.success(this.$t("general.deleteSuccessfully"));
			} finally {
				this.butLoading = false;
				this.formLoading = false;
			}
		},
		//批量删除
		async batch_del() {
			this.$confirm(
				this.$t("general.confirmDeleteProject", {
					length: this.selection.length,
				}),
				this.$t("general.hint"),
				{
					type: "warning",
				}
			)
				.then(async () => {
					const loading = this.$loading();
					try {
						const res = await this.$API.freight.destroy.post(0, {
							ids: this.selection.map((item) => item.id),
						});
						if (!res) {
							return false;
						}
						this.$refs.table.refresh();
						this.$message.success(
							this.$t("general.operateSuccessfully")
						);
					} finally {
						loading.close();
					}
				})
				.catch(() => {});
		},
	},
};
