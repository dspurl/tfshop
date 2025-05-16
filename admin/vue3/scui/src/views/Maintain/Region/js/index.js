import saveDialog from "../save";
export default {
	name: "Region",
	components: {
		saveDialog,
	},
	data() {
		return {
			dialog: {
				save: false,
				password: false,
			},
			apiObj: this.$API.region.list,
			selection: [],
			search: {
				keyword: null,
			},
			column: [
				{
					label: "ID",
					prop: "id",
					width: "200",
					sortable: true,
				},
				{
					label: "地区名称",
					prop: "name",
					width: "150",
				},
				{
					label: "编码",
					prop: "value",
					width: "150",
				},
				{
					label: "上级名称",
					prop: "parent",
					width: "150",
				},
			],
			params: {
				parent_id: 1,
				limit: 999,
			},
			regionList: [],
		};
	},
	watch: {},
	mounted() {
		this.getRegion();
	},
	methods: {
		//添加
		add() {
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.saveDialog.open().setRegion(this.regionList);
			});
		},
		//编辑
		table_edit(row) {
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.saveDialog
					.open("edit")
					.setRegion(this.regionList)
					.setData(row);
			});
		},
		//添加子地区
		table_show(row) {
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.saveDialog
					.open()
					.setRegion(this.regionList)
					.setData({parent_id: row.id, isChildren: true});
			});
		},
		// 获取全部地区列表
		async getRegion() {
			const response = await this.$API.region.list.get({ all: true });
			this.regionList = response.message;
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
				const res = await this.$API.region.destroy.post(row.id);
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
						const res = await this.$API.region.destroy.post(0, {
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
