import scIconSelect from "@/components/scIconSelect";
import dsTag from "@/components/dsTag";
export default {
	emits: ["success", "closed"],
	components: {
		scIconSelect,
		dsTag
	},
	data() {
		return {
			mode: "add",
			titleMap: {
				add: this.$t("general.add"),
				edit: this.$t("general.edit"),
				show: this.$t("general.view"),
			},
			visible: false,
			isSaveing: false,
			//表单数据
			form: {
				id: "",
				uuid: "",
				name: "",
				alias: "",
				icon: "",
				extension: [],
				specification: []
			},
			//验证规则
			rules: {
				name: [
					{
						required: true,
						message:
							this.$t("general.pleaseInput") +
							this.$t("resource_type.form.name.name"),
					},
				],
				alias: [
					{
						required: true,
						message:
							this.$t("general.pleaseInput") +
							this.$t("resource_type.form.alias.name"),
					},
				],
				icon: [
					{
						required: true,
						message:
							this.$t("general.pleaseSelect") +
							this.$t("resource_type.form.icon.name"),
					},
				],
				size: [
					{
						required: false,
						type: 'integer',
						message:
							this.$t("general.formatWrong") +
							this.$t("resource_type.form.size.name"),
					},
				]
			}
		};
	},
	mounted() {},
	methods: {
		//显示
		open(mode = "add") {
			this.mode = mode;
			this.visible = true;
			return this;
		},
		//表单提交方法
		submit() {
			this.$refs.dialogForm.validate(async (valid) => {
				if (valid) {
					this.isSaveing = true;
					if (this.form.id) {
						try {
							await this.$API.resourceType.edit.post(this.form);
							this.$emit("success", this.form, this.mode);
							this.visible = false;
							this.$message.success(
								this.$t("general.operateSuccessfully")
							);
						} finally {
							this.isSaveing = false;
						}
					} else {
						try {
							await this.$API.resourceType.create.post(this.form);
							this.$emit("success", this.form, this.mode);
							this.visible = false;
							this.$message.success(
								this.$t("general.operateSuccessfully")
							);
						} finally {
							this.isSaveing = false;
						}
					}
				}
			});
		},
		//表单注入数据
		setData(data) {
			this.form.id = data.id;
			this.form.name = data.name;
			this.form.alias = data.alias;
			this.form.icon = data.icon;
			this.form.extension = data.extension;
			this.form.specification = data.specification;
			this.form.size = data.size;
		}
	},
};
