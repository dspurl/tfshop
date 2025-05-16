import saveDialog from "../save";
import passwordDialog from "../password";

export default {
	name: "Member",
	components: {
		saveDialog,
		passwordDialog,
	},
	data() {
		return {
			dialog: {
				save: false,
				password: false,
			},
			apiObj: this.$API.member.list,
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
					label: '头像',
					prop: "portrait",
					width: "80",
					columnKey: "filterPortrait",
					filters: [
						{
							text: '已上传',
							value: 1,
						},
						{
							text: '未上传',
							value: 0,
						},
					],
				},
				{
					label: '账号',
					prop: "name",
					width: "150",
				},
				{
					label: '昵称',
					prop: "nickname",
					width: "150",
				},
				{
					label: this.$t("admin.form.email.name"),
					prop: "email",
					width: "150",
				},
				{
					label: this.$t("admin.form.cellphone.name"),
					prop: "cellphone",
					width: "150",
				},
				{
					label: '金额',
					prop: "money",
					width: "150",
					sortable: true,
				},
				{
					label: '是否注销',
					prop: "unsubscribe",
					width: "100",
					columnKey: "filterState",
					filters: [
						{
							text: '已注销',
							value: 1,
						},
						{
							text: '未注销',
							value: 0,
						},
					],
				},
				{
					label: this.$t("admin.form.state.name"),
					prop: "state",
					width: "80",
					columnKey: "filterState",
					filters: [
						{
							text: this.$t("admin.form.state.label.normal"),
							value: 1,
						},
						{
							text: this.$t("admin.form.state.label.forbid"),
							value: 2,
						},
					],
				},
				{
					label: this.$t("admin.form.created_at.name"),
					prop: "created_at",
					width: "150",
					sortable: true,
				},
				{
					label: this.$t("admin.form.updated_at.name"),
					prop: "updated_at",
					width: "150",
					sortable: true,
				},
			],
			params: {
				filter: null,
				limit: 20,
			},
			options: [
				{
					label: "ID",
					value: "id",
					type: "text",
				},
				{
					label: '头像',
					value: "portrait",
					type: "select",
					extend: {
						multiple: true,
						data: [
							{
								label: '已上传',
								value: 1,
							},
							{
								label: '未上传',
								value: 0,
							},
						],
					},
				},
				{
					label: '昵称',
					value: "nickname",
					type: "text",
				},
				{
					label: this.$t("admin.form.email.name"),
					value: "email",
					type: "text",
				},
				{
					label: this.$t("admin.form.cellphone.name"),
					value: "cellphone",
					type: "text",
				},
				{
					label: '金额',
					value: "money",
					type: "text",
				},
				{
					label: '是否注销',
					value: "unsubscribe",
					type: "select",
					extend: {
						multiple: true,
						data: [
							{
								label: '已注销',
								value: 1,
							},
							{
								label: '未注销',
								value: 0,
							},
						],
					},
				},
				{
					label: this.$t("admin.form.state.name"),
					value: "state",
					type: "select",
					extend: {
						multiple: true,
						data: [
							{
								label: this.$t("admin.form.state.label.normal"),
								value: 1,
							},
							{
								label: this.$t("admin.form.state.label.forbid"),
								value: 2,
							},
						],
					},
				},
				{
					label: this.$t("admin.form.created_at.name"),
					value: "created_at",
					type: "daterange",
				},
				{
					label: this.$t("admin.form.updated_at.name"),
					value: "updated_at",
					type: "daterange",
				},
			],
		};
	},
	watch: {
	},
	mounted() {
		
	},
	methods: {
		//添加
		add() {
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.saveDialog.open();
			});
		},
		//修改密码
		password() {
			this.dialog.password = true;
			this.$nextTick(() => {
				this.$refs.passwordDialog.open().setData(this.selection[0]);
			});
		},
		//编辑
		table_edit(row) {
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.saveDialog
					.open("edit")
					.setData(row);
			});
		},
		//查看
		table_show(row) {
			this.dialog.save = true;
			this.$nextTick(() => {
				this.$refs.saveDialog
					.open("show")
					.setData(row);
			});
		},
		//表格选择后回调事件
		selectionChange(selection) {
			this.selection = selection;
		},
		//本地更新数据
		handleSuccess(data, mode) {
			if (mode == "add") {
				this.$refs.table.upData();
			} else if (mode == "edit") {
				this.$refs.table.upData();
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
	},
};
