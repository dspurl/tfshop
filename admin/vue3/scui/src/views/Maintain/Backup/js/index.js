export default {
	name: "Backup",
	components: {},
	data() {
		return {
			dialog: {
				save: false,
				password: false,
			},
			isSaveing: false,
			showGrouploading: false,
			props: {
				label: "introduction",
			},
			groupFilterText: "",
			group: [],
			apiObj: this.$API.backup.list,
			selection: [],
			search: {
				keyword: null,
			},
			column: [
				{
					label: "文件名",
					prop: "name",
					width: "300"
				},
				{
					label: "文件大小",
					prop: "size",
					width: "150"
				},
				{
					label: "备份时间",
					prop: "time",
					width: "300",
					sortable: true,
				}
			],
			params: {
				type: 'db'
			}
		};
	},
	watch: {
	},
	mounted() {
	},
	methods: {
		//添加
		async add() {
			this.isSaveing = true
			try {
				const res = await this.$API.backup.create.post(
					this.params
				);
				if (!res) {
					return false;
				}
				this.$message.success(
					'备份成功'
				);
				this.$refs.table.upData();
			} finally {
				this.isSaveing = false;
			}
		},
		//编辑
		async table_edit(row) {
			this.isSaveing = true
			try {
				const res = await this.$API.backup.edit.post(
					row
				);
				if (!res) {
					return false;
				}
				this.$message.success(
					'还原成功'
				);
				this.$refs.table.upData();
			} finally {
				this.isSaveing = false;
			}
		},
		//删除
		async table_del(row) {
			try {
				const res = await this.$API.backup.destroy.post(1, row);
				if (!res) {
					return false;
				}
				this.$refs.table.upData();
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
						const res = await this.$API.backup.destroy.post(0, this.selection);
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
		//表格选择后回调事件
		selectionChange(selection) {
			this.selection = selection;
		},
		//过滤
		change(data) {
			this.params.filter = data;
			this.$refs.table.refresh();
		},
		refreshTable(row){
			this.params.type = row.paneName
			this.$refs.table.refresh();
		}
	},
};
