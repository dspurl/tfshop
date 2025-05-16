export default {
	name: "Config",
	components: { },
	data() {
		return {
			loading: false,
			isSaveing: false,
			activeName: '',
			listLoading: false,
			list: []
		};
	},
	mounted() {
		this.getList();
	},
	methods: {
		//加载树数据
		async getList() {
			this.loading = true;
			const res = await this.$API.config.list.get();
			if (!res) {
				return false;
			}
			this.list = res.message
			this.activeName = 'tab' + this.list[0].id
			this.loading = false;
		},
		//表单提交方法
		submit(formName, form) {
			this.$refs[formName][0].validate(async (valid) => {
				if (valid) {
					this.isSaveing = true;
					try {
						const res = await this.$API.config.edit.post(form);
						if (!res) {
							return false;
						}
						this.$message.success(
							this.$t("general.operateSuccessfully")
						);
					} finally {
						this.isSaveing = false;
					}
				} else {
					return false;
				}
			});
		},
	},
};
