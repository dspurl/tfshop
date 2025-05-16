import saveDialog from "../save";
export default {
	name: "Product",
	components: {
		saveDialog,
	},
	data() {
		return {
			dialog: {
				save: false,
				password: false,
			},
			apiObj: this.$API.product.list,
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
					label: "商品信息",
					prop: "name",
					width: "200",
				},
				{
					label: "运费方式",
					prop: "freight_type",
					width: "120",
					align: "center",
					columnKey: "filterPortrait",
					filters: [
						{
							text: "固定邮费",
							value: 0,
						},
						{
							text: "运费模板",
							value: 1,
						},
					],
				},
				{
					label: "减库存方式",
					prop: "is_inventory",
					width: "120",
					align: "center",
					columnKey: "filterPortrait",
					filters: [
						{
							text: "拍下减库存",
							value: 0,
						},
						{
							text: "付款减库存",
							value: 1,
						},
					],
				},
				{
					label: "库存",
					prop: "inventory",
					width: "80",
					align: "center",
					sortable: true,
				},
				{
					label: "销量",
					prop: "sales",
					width: "80",
					align: "center",
					sortable: true,
				},
				{
					label: "是否上架",
					prop: "is_show",
					width: "120",
					align: "center",
					columnKey: "filterPortrait",
					filters: [
						{
							text: "仓库中",
							value: 0,
						},
						{
							text: "已上架",
							value: 1,
						},
						{
							text: "定时上架",
							value: 2,
						},
					],
				},
				{
					label: "是否推荐",
					prop: "is_recommend",
					width: "120",
					align: "center",
					columnKey: "filterPortrait",
					filters: [
						{
							text: "否",
							value: 0,
						},
						{
							text: "是",
							value: 1,
						},
					],
				},
				{
					label: "排序",
					prop: "sort",
					width: "80",
					align: "center",
					sortable: true,
				},
				{
					label: '上架时间',
					prop: "timing",
					width: "150",
					sortable: true,
				},
				{
					label: this.$t("admin.form.created_at.name"),
					prop: "created_at",
					width: "150",
					sortable: true,
				},
				{
					label: '最后更新时间',
					prop: "updated_at",
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
		combineNames(category) {
			let result = category.name;
			let current = category.fathers;
			while (current) {
				result = current.name +' > '+ result;
				current = current.fathers;
			}
			return result;
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
				const res = await this.$API.product.destroy.post(row.id);
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
						const res = await this.$API.product.destroy.post(0, {
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
