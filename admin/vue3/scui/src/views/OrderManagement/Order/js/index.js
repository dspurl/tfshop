
import distributionDialog from "../distribution";
export default {
	name: "Order",
	components: {
		distributionDialog,
	},
	data() {
		return {
			dialog: {
				distribution: false
			},
			drawer: {
				detail: false,
			},
			detail: {},
			apiObj: this.$API.order.list,
			selection: [],
			search: {
				keyword: null,
			},
			state: [{
				label: '待付款',
				value: 1
			}, {
				label: '待发货',
				value: 2
			}, {
				label: '待收货',
				value: 3
			}, {
				label: '已失效',
				value: 4
			}, {
				label: '已完成',
				value: 5
			}, {
				label: '已取消',
				value: 6
			}, {
				label: '已退款',
				value: 7
			}, {
				label: '退款处理中',
				value: 8
			}, {
				label: '退款失败',
				value: 9
			}],
			column: [
				{
					label: "订单号",
					prop: "identification",
					width: "180",
					sortable: true,
				},
				{
					label: "商品信息",
					prop: "goods_list",
					width: "300",
				},
				{
					label: "运费",
					prop: "carriage",
					width: "100",
				},
				{
					label: "订单状态",
					prop: "state",
					width: "120",
					align: "center",
					columnKey: "filterPortrait",
					filters: [
						{
							text: '待付款',
							value: 1
						}, {
							text: '待发货',
							value: 2
						}, {
							text: '待收货',
							value: 3
						}, {
							text: '已失效',
							value: 4
						}, {
							text: '已完成',
							value: 5
						}, {
							text: '已取消',
							value: 6
						}, {
							text: '已退款',
							value: 7
						}, {
							text: '退款处理中',
							value: 8
						}, {
							text: '退款失败',
							value: 9
						}
					],
				},
				{
					label: "订单总额",
					prop: "total",
					width: "100",
				},
				{
					label: "支付方式",
					prop: "pay_way",
					width: "100",
				},
				{
					label: '支付时间',
					prop: "pay_time",
					width: "150",
					sortable: true,
				}
			],
			params: {
				filter: null,
				limit: 20,
			},
		};
	},
	watch: {},
	mounted() { },
	methods: {
		getSummaries(param) {
			const { columns, data } = param
			const sums = []
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '总价'
					return
				} else if (index === 1 || index === 2 || index === 3) {
					return
				} else if (index === 6) {
					if (data.length > 0) {
						sums[index] = data.reduce((prev, curr) => {
							const value = Number(curr['number'])
							if (!isNaN(value)) {
								return prev + curr['number']
							} else {
								return prev
							}
						}, 0)
						sums[index] += ' 件'
					}
				} else if (index === 7) {
					if (data.length > 0) {
						sums[index] = data.reduce((prev, curr) => {
							const value = Number(curr['price'])
							if (!isNaN(value)) {
								return prev + curr['number'] * curr['price'] * 100
							} else {
								return prev
							}
						}, 0)
						sums[index] = sums[index] / 100 + ' 元'
					}
				}
			})
			return sums
		},
		combineNames(category) {
			let result = category.name;
			let current = category.fathers;
			while (current) {
				result = current.name + ' > ' + result;
				current = current.fathers;
			}
			return result;
		},
		//添加
		add() {
			this.dialog.distribution = true;
			this.$nextTick(() => {
				this.$refs.distribution.open();
			});
		},
		//编辑
		table_edit(row) {
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.distribution.open("edit").setData(row);
			});
		},
		//发货
		distribution_show(row) {
			this.dialog.distribution = true;
			this.$nextTick(() => {
				console.log(1111)
				this.$refs.distribution.open('show').setData(row);
			});
		},
		handleTranslate(value, item) {
			if (value) {
				this.table_edit(value);
			} else {
				this.add(item);
			}
		},
		// 更多
		handleCommand(command, row) {
			const data = row.attrs.data
			this.detail = data
			if (command == 1) {
				this.drawer.detail = true;
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
				.catch(() => { });
		},
	},
};
