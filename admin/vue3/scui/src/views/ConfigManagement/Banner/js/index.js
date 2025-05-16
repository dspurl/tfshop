import saveDialog from "../save";
export default {
	name: "Banner",
	components: {
		saveDialog,
	},
	data() {
		return {
			dialog: {
				save: false,
				password: false,
			},
			apiObj: this.$API.banner.list,
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
					label: "轮播类型",
					prop: "type",
					width: "150",
					columnKey: "filterState",
					filters: [
						{
							text: "首页轮播",
							value: 0,
						},
						{
							text: "首页广告",
							value: 1,
						},
						{
							text: "登录页广告",
							value: 2,
						},
						{
							text: "友情链接",
							value: 3,
						},
					],
				},
				{
					label: "轮播图片",
					prop: "img",
					width: "200",
				},
				{
					label: "轮播名称",
					prop: "name",
					width: "200",
				},
				{
					label: "轮播地址",
					prop: "url",
					width: "200",
				},
				{
					label: "排序",
					prop: "sort",
					width: "50",
					align: "center",
				},
				{
					label: "状态",
					prop: "state",
					width: "80",
					columnKey: "filterState",
					filters: [
						{
							text: "显示",
							value: 0,
						},
						{
							text: "隐藏",
							value: 1,
						},
					],
				},
				{
					label: this.$t("admin.form.created_at.name"),
					prop: "created_at",
					width: "150",
					sortable: true,
				},
			],
			params: {
				filter: null,
				limit: 20,
			},
		};
	},
	watch: {},
	mounted() {},
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
				this.$refs.saveDialog.open('show').setData(row);
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
				const res = await this.$API.banner.destroy.post(row.id);
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
						const res = await this.$API.banner.destroy.post(0, {
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
