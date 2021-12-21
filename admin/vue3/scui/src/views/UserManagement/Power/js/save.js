import scIconSelect from "@/components/scIconSelect";
export default {
	components: {
		scIconSelect,
	},
	props: {
		menu: { type: Object, default: () => {} },
	},
	data() {
		return {
			form: {
				id: "",
				api: "",
				path: "",
				active: "",
				redirect_url: "",
				view: "",
				icon: "",
				color: "",
				title: "",
				pid: 0,
				type: 1,
				is_hidden: false,
				is_hidden_breadcrumb: false,
				is_full_page: false,
				is_affix: false,
				sort: 5,
			},
			menuOptions: [],
			menuProps: {
				value: "id",
				label: "title",
				checkStrictly: true,
			},
			rules: {
				title: [
					{
						required: true,
						message: this.$t("login.userError"),
						trigger: "blur",
					},
				],
				pid: [
					{
						required: true,
						message: this.$t("login.userError"),
						trigger: "change",
					},
				],
				type: [
					{
						required: true,
						message: this.$t("login.userError"),
						trigger: "change",
					},
				],
				api: [
					{
						required: true,
						message: this.$t("login.userError"),
						triggeblurr: "blur",
					},
				],
			},
			predefineColors: [
				"#ff4500",
				"#ff8c00",
				"#ffd700",
				"#67C23A",
				"#00ced1",
				"#409EFF",
				"#c71585",
			],
			loading: false,
		};
	},
	watch: {
		menu: {
			handler() {
				this.menuOptions = this.treeToMap(this.menu);
			},
			deep: true,
		},
	},
	mounted() {},
	methods: {
		//简单化菜单
		treeToMap(tree) {
			const map = [];
			tree.forEach((item) => {
				var obj = {
					id: item.id,
					pid: item.pid,
					title: item.title,
					children:
						item.children && item.children.length > 0
							? this.treeToMap(item.children)
							: null,
				};
				map.push(obj);
			});
			return map;
		},
		//保存
		async save() {
			this.loading = true;
			try {
				const data = await this.$API.power.edit.post(this.form);
				if (data) {
					this.$message.success(this.$t("general.saveSuccessfully"));
				}
			} finally {
				this.loading = false;
			}
		},
		//表单注入数据
		setData(data, pid) {
			this.form = data;
			this.form.pid = pid ?? 0;
		},
	},
};
