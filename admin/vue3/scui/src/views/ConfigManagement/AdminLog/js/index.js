import info from "../info";
export default {
	name: "AdminLog",
	components: {
		info,
	},
	data() {
		return {
			infoDrawer: false,
			apiObj: this.$API.adminLog.list,
			selection: [],
			column: [
				{
					label: "ID",
					prop: "id",
					width: "80",
					sortable: true,
				},
				{
					label: this.$t("adminLog.form.admin.name"),
					prop: "admin_id",
					width: "100",
					sortable: true,
				},
				{
					label: this.$t("adminLog.form.name.name"),
					prop: "name",
					width: "150",
				},
				{
					label: this.$t("adminLog.form.path.name"),
					prop: "path",
					width: "200",
				},
				{
					label: this.$t("adminLog.form.url.name"),
					prop: "url",
				},
				{
					label: this.$t("adminLog.form.method.name"),
					prop: "method",
					width: "150",
					columnKey: "filterMethod",
					filters: [
						{
							text: this.$t("adminLog.form.method.label.get"),
							value: "GET",
						},
						{
							text: this.$t("adminLog.form.method.label.post"),
							value: "POST",
						},
					],
				},
				{
					label: this.$t("adminLog.form.ip.name"),
					prop: "ip",
					width: "150",
				},
				{
					label: this.$t("adminLog.form.created_at.name"),
					prop: "created_at",
					width: "150",
					sortable: true,
				},

			],
			params: {
				sort: "-id",
				limit: 20,
			},
			options: [
				{
					label: "ID",
					value: "id",
					type: "text",
				},
				{
					label: this.$t("adminLog.form.admin.name"),
					value: "Admin.name",
					type: "text",
				},
				{
					label: this.$t("adminLog.form.name.name"),
					value: "name",
					type: "text",
				},
				{
					label: this.$t("adminLog.form.path.name"),
					value: "path",
					type: "text",
				},
				{
					label: this.$t("adminLog.form.url.name"),
					value: "url",
					type: "text",
				},
				{
					label: this.$t("adminLog.form.method.name"),
					value: "method",
					type: "select",
					extend: {
						multiple: true,
						data: [
							{
								label: this.$t("adminLog.form.method.label.get"),
								value: "GET",
							},
							{
								label: this.$t("adminLog.form.method.label.post"),
								value: "POST",
							},
						],
					},
				},
				{
					label: this.$t("adminLog.form.ip.name"),
					value: "ip",
					type: "text",
				},
				{
					label: this.$t("adminLog.form.created_at.name"),
					value: "created_at",
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
		//表格选择后回调事件
		selectionChange(selection) {
			this.selection = selection;
		},
		//过滤
		change(data) {
			this.params.filter = data;
			this.$refs.table.refresh();
		},
		//详情
		rowClick(row){
			if(this.$AUTH('AdminLogView')){
				this.infoDrawer = true
				this.$nextTick(() => {
					this.$refs.info.setData(row)
				})
			}
			
		}
	},
};
