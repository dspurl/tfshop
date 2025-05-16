export default {
	emits: ["success", "closed"],
	data() {
		return {
			visible: false,
			isSaveing: false,
			id: 0,
			menu: {
				list: [],
				checked: [],
				props: {
					label: (data) => {
						return data.title;
					},
				},
			},
			group: {
				list: [],
				checked: [],
				props: {},
			},
			type: {
				list: [],
				checked: [],
				props: {},
			},
			dashboard: "0",
			dashboardOptions: [
				{
					value: "0",
					label: "数据统计",
					views: "stats",
				},
				{
					value: "1",
					label: "工作台",
					views: "work",
				},
			],
		};
	},
	mounted() {},
	methods: {
		//获取权限列表
		async getPower() {
			const res = await this.$API.power.list.get();
			if (!res) {
				return false;
			}
			this.menu.list = res.message;
		},
		open(id, checked = []) {
			this.visible = true;
			this.id = id;
			this.menu.checked = checked;
			this.getPower()
			return this;
		},
		async submit() {
			this.isSaveing = true;
			try {
				const res = await this.$API.role.permission.post(this.id, {
					ids: this.$refs.menu
						.getCheckedKeys()
						.concat(this.$refs.menu.getHalfCheckedKeys()),
				});
				if (!res) {
					return false;
				}
				this.visible = false;
				this.$message.success(this.$t("general.operateSuccessfully"));
				this.$emit("success");
				const loading = this.$loading({
					lock: true,
					text: this.$t("general.retrieveMenu"),
					background: "rgba(255, 255, 255, 0.7)",
				});
				const getUserInfo = await this.$API.auth.getUserInfo.get();
				if (!getUserInfo) {
					return false;
				}
				this.$TOOL.data.set("USER_INFO", getUserInfo.message.userInfo);
				this.$TOOL.data.set("MENU", getUserInfo.message.menu);
				this.$TOOL.data.set(
					"PERMISSIONS",
					getUserInfo.message.permissions
				);
				this.$router.go(0);
				loading.close();
			} finally {
				this.isSaveing = false;
			}
		},
	},
};
