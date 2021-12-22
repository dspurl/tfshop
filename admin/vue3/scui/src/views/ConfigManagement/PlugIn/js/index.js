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
				var res = await this.$API.plugin.list.get(this.search);
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
		add() {},
		handlePublish() {},
		handleDownload() {},
		handleDelete() {},
		handleInstall() {},
		handleUninstall() {},
		handleUpdatePack() {},
		getDiff() {},
	},
};
