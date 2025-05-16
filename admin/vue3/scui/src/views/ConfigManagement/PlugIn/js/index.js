import saveDialog from "../save";

export default {
	name: "PlugIn",
	components: {
		saveDialog,
	},
	data() {
		return {
			dialog: {
				save: false,
			},
			hidePagination: true,
			butLoading: false,
			formLoading: false,
			showGrouploading: false,
			listLoading: false,
			paginationLayout: "total, prev, pager, next, jumper",
			category: ["插件"],
			total: 0,
			list: [],
			search: {
				activeIndex: "1",
				page: 1,
				limit: 20,
				sort: "+id",
			},
		};
	},
	watch: {},
	mounted() {
		this.getList();
	},
	methods: {
		async getList() {
			this.listLoading = true;
			try {
				const res = await this.$API.plugin.list.get(this.search);
				this.list = res.message.data;
				this.hidePagination = !res.message.total;
				this.total = res.message.total;
			} finally {
				this.listLoading = false;
			}
		},
		//分页点击
		paginationChange(e) {
			this.search.page = e;
			this.getList();
		},
		handleSelect(key) {
			this.search.activeIndex = key;
			this.handleFilter();
		},
		handleFilter() {
			this.hidePagination = true;
			this.search.page = 1;
			this.total = 0;
			this.list = [];
			this.getList();
		},
		add() {
			this.$router.push({
				path: `/ConfigManagement/PlugIn/save`,
			});
		},
		edit(row) {
			this.$router.push({
				path: `/ConfigManagement/PlugIn/save`,
				query: {
					name: row.abbreviation,
				},
			});
		},
		async handlePublish(name) {
			this.butLoading = true;
			this.formLoading = true;
			try {
				const res = await this.$API.plugin.publish.post(name);
				if (res) {
					this.getList();
					this.$message.success("发布成功");
				}
			} finally {
				this.butLoading = false;
				this.formLoading = false;
			}
		},
		handleDownload(name) {
			window.open(
				process.env.VUE_APP_API_URL + "/plugin/download/" + name
			);
		},
		async handleDelete(name) {
			this.butLoading = true;
			this.formLoading = true;
			try {
				const res = await this.$API.plugin.destroy.post(name);
				if (res) {
					this.getList();
					this.$message.success(
						this.$t("general.deleteSuccessfully")
					);
				}
			} finally {
				this.butLoading = false;
				this.formLoading = false;
			}
		},
		async handleInstall(name, type) {
			this.butLoading = true;
			this.formLoading = true;
			try {
				const res = await this.$API.plugin.install.post(name);
				if (res) {
					this.getList();
					if (type === 1) {
						this.$message.success("更新成功");
					} else {
						this.$message.success("安装成功");
					}
				}
			} finally {
				this.butLoading = false;
				this.formLoading = false;
			}
		},
		handleUninstall(name) {
			this.$confirm(
				`存在冲突的插件卸载后相关文件也会被删除哦，是否确认卸载?`,
				"提示",
				{
					type: "warning",
				}
			)
				.then(async () => {
					this.butLoading = true;
					this.formLoading = true;
					try {
						const res = await this.$API.plugin.uninstall.post(name);
						if (res) {
							this.getList();
							this.$message.success("已成功卸载");
						}
					} finally {
						this.butLoading = false;
						this.formLoading = false;
					}
				})
				.catch(() => {});
		},
		async handleUpdatePack(item, suffix = 0) {
			this.butLoading = true;
			this.formLoading = true;
			try {
				const res = await this.$API.plugin.updatePack.post(item.code, {
					suffix: suffix,
					img: item.img,
					author: item.author,
					author_url: item.author_url,
					portrait: item.portrait,
					category: item.category,
				});
				if (res) {
					this.getList();
					this.$message.success("下载成功");
				}
			} finally {
				this.butLoading = false;
				this.formLoading = false;
			}
		},
		getDiff() {},
	},
};
