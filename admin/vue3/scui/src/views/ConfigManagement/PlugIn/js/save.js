import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import databaseDialog from "../database";
import observerDialog from "../observer";
import relyOnDialog from "../relyOn";
import relevanceDialog from "../relevance";
export default {
	name: "PlugInDetail",
	components: {
		mavonEditor,
		databaseDialog,
		observerDialog,
		relyOnDialog,
		relevanceDialog,
	},
	data() {
		const validateObserverName = (rule, value, callback) => {
			if (!/^(?!_)([A-Za-z ]+)$/.test(value)) {
				callback(new Error("观察者名称格式有误"));
			} else {
				callback();
			}
		};
		return {
			name: this.$route.query.name,
			loading: false,
			isSaveing: false,
			adminTemplate: [],
			serverTemplate: [],
			template: [],
			dialog: {
				database: false,
				observer: false,
				relyOn: false,
				relevance: false,
			},
			ruleForm: {
				clientTemplate: [],
				adminTemplate: [],
				serverTemplate: [],
				name: "",
				abbreviation: "",
				old_abbreviation: "",
				instructions: "",
				author: "",
				db: [],
				observer: [],
				describe: "",
				versions: "",
				relevance: [],
				packagingJurisdiction: [],
				routes: false,
				relyOn: [],
			},
			rules: {
				name: [
					{
						required: true,
						message: "请输入插件名称",
						trigger: "blur",
					},
				],
				abbreviation: [
					{
						required: true,
						message: "请输入插件标识",
						trigger: "blur",
					},
				],
				author: [
					{ required: true, message: "请输入作者", trigger: "blur" },
				],
				describe: [
					{
						required: true,
						message: "请输入插件简介",
						trigger: "blur",
					},
				],
				versions: [
					{
						required: true,
						message: "请输入插件版本",
						trigger: "blur",
					},
				],
			},
			dataTableRules: {
				name: [
					{ required: true, message: "请输入表名", trigger: "blur" },
				],
				annotation: [
					{
						required: true,
						message: "请输入表注释",
						trigger: "blur",
					},
				],
			},
			indexesRules: {
				name: [
					{ required: true, message: "请输入表名", trigger: "blur" },
				],
				type: [
					{
						required: true,
						message: "请选择索引类型",
						trigger: "change",
					},
				],
				field: [
					{
						required: true,
						message: "请选择字段",
						trigger: "change",
					},
				],
			},
			observerRules: {
				name: [
					{
						required: true,
						message: "请输入观察者名称",
						trigger: "blur",
					},
					{ validator: validateObserverName, trigger: "blur" },
				],
				models: [
					{
						required: true,
						message: "请选择依赖模型",
						trigger: "change",
					},
				],
				path: [
					{
						required: false,
						message: "请选择可执行路由",
						trigger: "change",
					},
				],
				explain: [
					{ required: true, message: "请输入说明", trigger: "blur" },
				],
			},
			relevanceRules: {
				file: [
					{
						required: true,
						message: "请输入文件完整路径",
						trigger: "blur",
					},
				],
				explain: [
					{ required: true, message: "请输入说明", trigger: "blur" },
				],
			},
			relyOnRules: {
				name: [
					{ required: true, message: "请选择插件", trigger: "blur" },
				],
			},
			indexesType: [
				{
					value: "INDEX",
					label: "INDEX",
				},
				{
					value: "UNIQUE",
					label: "UNIQUE",
				},
				{
					value: "SPATIAL",
					label: "SPATIAL",
				},
			],
			temp: {
				fullScreen: false,
				name: "",
				annotation: "",
				indexes: [],
				attribute: [],
				softDeletes: 0,
				timestamps: 1,
				after_end: true,
				backstage: true,
				data_table: true,
				jurisdiction: true,
				client: true,
				reset: true,
			},
			markdownOption: {
				bold: true, // 粗体
				italic: true, // 斜体
				header: true, // 标题
				// underline: true, // 下划线
				// strikethrough: true, // 中划线
				// mark: true, // 标记
				// superscript: true, // 上角标
				// subscript: true, // 下角标
				quote: true, // 引用
				ol: true, // 有序列表
				ul: true, // 无序列表
				link: true, // 链接
				// imagelink: true, // 图片链接
				code: true, // code
				table: true, // 表格
				fullscreen: true, // 全屏编辑
				readmodel: true, // 沉浸式阅读
				htmlcode: true, // 展示html源码
				help: true, // 帮助
				/* 1.3.5 */
				undo: true, // 上一步
				redo: true, // 下一步
				// trash: true, // 清空
				// save: true, // 保存（触发events中的save事件）
				/* 1.4.2 */
				navigation: true, // 导航目录
				/* 2.1.8 */
				alignleft: true, // 左对齐
				aligncenter: true, // 居中
				alignright: true, // 右对齐
				/* 2.2.1 */
				subfield: true, // 单双栏模式
				preview: true, // 预览
			},
			xssOptions: {
				whiteList: {
					img: ["src", "alt", "width", "height"],
				},
				stripIgnoreTagBody: true,
			},
			fromData: [],
			oldFromData: [],
			toData: [],
			mode: "transfer",
		};
	},
	mounted() {
		if (this.name) {
			//更改tag标签
			this.$store.commit("updateViewTagsTitle", `插件名称:${this.name}`);
			this.details();
		} else {
			this.getJurisdiction();
		}

		this.getTemplate("client");
		this.getTemplate("admin");
		this.getTemplate("server");
	},
	methods: {
		// 获取客户端模板列表
		async getTemplate(name) {
			const res = await this.$API.plugin.template.get(name);
			if (!res) {
				return false
			}
			if (name === "admin") {
				this.adminTemplate = res.message;
			} else if (name === "server") {
				this.serverTemplate = res.message;
			} else {
				this.template = res.message;
			}
		},

		// 获取所有权限
		async getJurisdiction() {
			const packagingJurisdiction = this.ruleForm.packagingJurisdiction
				? this.ruleForm.packagingJurisdiction
				: [];
			const res = await this.$API.plugin.jurisdiction.post({
				packagingJurisdiction: packagingJurisdiction,
			});
			if (!res) {
				return false
			}
			this.fromData = res.message;
		},
		// 获取插件信息
		async details() {
			const res = await this.$API.plugin.details.get(this.name);
			if (!res) {
				return false
			}
			this.ruleForm = res.message;
			this.ruleForm.db.forEach((item) => {
				if (item.reset) {
					item.reset = false;
				}
			});
			this.ruleForm.observer.forEach((item) => {
				if (item.reset) {
					item.reset = false;
				}
			});
			this.ruleForm.instructions = this.ruleForm.instructions
				? this.ruleForm.instructions
				: "";
			this.ruleForm.packagingJurisdiction = this.ruleForm
				.packagingJurisdiction
				? this.ruleForm.packagingJurisdiction
				: [];
			this.ruleForm.relyOn = this.ruleForm.relyOn
				? this.ruleForm.relyOn
				: [];
			this.toData = this.ruleForm.packagingJurisdiction;
			this.ruleForm.routes = false;
			this.versions = res.message.versions;
			this.ruleForm.old_abbreviation = JSON.parse(
				JSON.stringify(this.ruleForm.abbreviation)
			);
			this.getJurisdiction();
		},
		// 添加数据表
		addDataTable() {
			this.dialog.databaseDialog = true;
			this.$nextTick(() => {
				this.$refs.databaseDialog.open();
			});
		},
		// 编辑数据表
		editDataTable(row, index) {
			this.$nextTick(() => {
				this.$refs.databaseDialog.open("edit").setData(row, index);
			});
		},
		// 删除数据表
		deleteDataTable(index) {
			this.$confirm("确认删除数据表？", "提示", {
				type: "warning",
				confirmButtonText: "确认",
				confirmButtonClass: "el-button--danger",
			}).then(async () => {
				this.ruleForm.db.splice(index, 1);
				this.$message.success(this.$t("general.deleteSuccessfully"));
			});
		},
		// 添加观察者
		addObserverTable() {
			this.dialog.observerDialog = true;
			this.$nextTick(() => {
				this.$refs.observerDialog.open();
			});
		},
		// 编辑观察者
		editObserverTable(row, index) {
			this.$nextTick(() => {
				this.$refs.observerDialog.open("edit").setData(row, index);
			});
		},
		// 删除观察者
		deleteObserverTable(index) {
			this.$confirm("确认删除观察者？", "提示", {
				type: "warning",
				confirmButtonText: "确认",
				confirmButtonClass: "el-button--danger",
			}).then(async () => {
				this.ruleForm.observer.splice(index, 1);
				this.$message.success(this.$t("general.deleteSuccessfully"));
			});
		},
		// 添加依赖插件
		addRelyOnTable() {
			this.dialog.relyOnDialog = true;
			this.$nextTick(() => {
				this.$refs.relyOnDialog.open();
			});
		},
		// 编辑依赖插件
		editRelyOnTable(row, index) {
			this.$nextTick(() => {
				this.$refs.relyOnDialog.open("edit").setData(row, index);
			});
		},
		// 删除依赖插件
		deleteRelyOnTable(index) {
			this.$confirm("确认删除依赖插件？", "提示", {
				type: "warning",
				confirmButtonText: "确认",
				confirmButtonClass: "el-button--danger",
			}).then(async () => {
				this.ruleForm.relyOn.splice(index, 1);
				this.$message.success(this.$t("general.deleteSuccessfully"));
			});
		},
		// 添加关联文件
		addRelevanceTable() {
			this.dialog.relevanceDialog = true;
			this.$nextTick(() => {
				this.$refs.relevanceDialog.open();
			});
		},
		// 编辑关联文件
		editRelevanceTable(row, index) {
			this.$nextTick(() => {
				this.$refs.relevanceDialog.open("edit").setData(row, index);
			});
		},
		// 删除关联文件
		deleteRelevanceTable(index) {
			this.$confirm("确认删除关联文件？", "提示", {
				type: "warning",
				confirmButtonText: "确认",
				confirmButtonClass: "el-button--danger",
			}).then(async () => {
				this.ruleForm.relevance.splice(index, 1);
				this.$message.success(this.$t("general.deleteSuccessfully"));
			});
		},
		//提交
		async submit() {
			this.$refs.ruleForm.validate(async (valid) => {
				if (valid) {
					this.isSaveing = true;
					if (this.name) {
						try {
							const res = await this.$API.plugin.edit.post(
								this.ruleForm
							);
							if (!res) {
								return false
							}
							this.$message.success(
								this.$t("general.operateSuccessfully")
							);
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
					} else {
						try {
							const res = await this.$API.plugin.create.post(
								this.ruleForm
							);
							if (!res) {
								return false
							}
							this.$message.success(
								this.$t("general.operateSuccessfully")
							);
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
					}
				}
			});
		},
	},
};
