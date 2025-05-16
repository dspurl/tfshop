<template>
	<sc-dialog
		:title="titleMap[mode]"
		v-model="visible"
		:width="800"
		destroy-on-close
		@closed="$emit('closed')"
	>
		<el-form
			:model="form"
			:rules="rules"
			:disabled="mode == 'show'"
			ref="dialogForm"
			label-width="100px"
		>
			<el-form-item label="表名" prop="name">
				<el-input class="min-input" v-model="form.name" maxlength="60" clearable placeholder="请输入表名"></el-input>
				<div class="el-form-item-msg">表名在没有特殊情况下，请在表最后加上s</div>
			</el-form-item>
			<el-form-item label="表注释" prop="annotation">
				<el-input
					class="min-input"
					v-model="form.annotation"
					maxlength="60"
					clearable
					placeholder="请输入表注释"
				></el-input>
			</el-form-item>
			<el-form-item label="属性" prop="attribute">
				<sc-form-table
					style="width:100%;"
					v-model="form.attribute"
					:addTemplate="addTemplate"
					drag-sort
					placeholder="暂无数据"
					height="200"
				>
					<el-table-column prop="name" label="名字" width="180">
						<template #default="scope">
							<el-form-item
								:rules="{
									required: true, message: '属性名字不能为空', trigger: 'blur'
								}"
								:prop="'attribute.' + scope.$index + '.name'"
							>
								<el-input v-model="scope.row.name" clearable />
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="type" label="类型" width="180">
						<template #default="scope">
							<el-form-item
								:rules="{
									required: true, message: '请选择类型', trigger: 'change'
								}"
								:prop="'attribute.' + scope.$index + '.type'"
							>
								<el-select v-model="scope.row.type" placeholder="请选择" filterable clearable>
									<el-option-group v-for="group in db.type" :key="group.label" :label="group.label">
										<el-option
											v-for="item in group.options"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-option-group>
								</el-select>
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="length" label="长度/值" width="120">
						<template #default="scope">
							<el-form-item :prop="'attribute.' + scope.$index + '.length'">
								<el-input v-model="scope.row.length" clearable />
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="default" label="默认值" width="180">
						<template #default="scope">
							<el-form :model="scope.row">
								<el-form-item prop="default">
									<el-input v-model="scope.row.default" clearable />
								</el-form-item>
							</el-form>
						</template>
					</el-table-column>
					<el-table-column prop="attribute" label="属性" width="180">
						<template #default="scope">
							<el-form :model="scope.row">
								<el-form-item prop="attribute">
									<el-select v-model="scope.row.attribute" placeholder="请选择" filterable clearable>
										<el-option
											v-for="item in db.attribute"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</el-form-item>
							</el-form>
						</template>
					</el-table-column>
					<el-table-column prop="is_empty" label="空" width="45">
						<template #default="scope">
							<el-form :model="scope.row">
								<el-form-item prop="is_empty">
									<el-checkbox v-model="scope.row.is_empty" />
								</el-form-item>
							</el-form>
						</template>
					</el-table-column>
					<el-table-column prop="AUTO_INCREMENT" label="A_I" width="60">
						<template #default="scope">
							<el-form :model="scope.row">
								<el-form-item prop="AUTO_INCREMENT">
									<el-checkbox v-model="scope.row.AUTO_INCREMENT" />
								</el-form-item>
							</el-form>
						</template>
					</el-table-column>
					<el-table-column prop="annotation" label="注释" width="200">
						<template #default="scope">
							<el-form :model="scope.row">
								<el-form-item prop="annotation">
									<el-input v-model="scope.row.annotation" clearable />
								</el-form-item>
							</el-form>
						</template>
					</el-table-column>
				</sc-form-table>
				<div class="el-form-item-msg">
					<p>1、表注释如果有参数说明的话，请以下面的格式进行编写[说明:值=值含义-英文简写]，如[是否隐藏:0=否-no,1=是-yes]</p>
					<p>2、表注释的英文简写如果包含多个英文单词的话，请用下划线连接，如full_reduction</p>
					<p>3、名字如果是ID的话，将自动设置主键自增类型</p>
					<p>4、支持拖拽排序</p>
					<p>5、如果字段非必填，请设为空</p>
					<p>6、后台代码：控制器、验证器；数据库代码：数据库迁移文件、模型；客户端代码：client;权限代码：权限分配</p>
				</div>
			</el-form-item>
			<el-form-item label="软删除" prop="softDeletes">
				<el-radio-group v-model="form.softDeletes">
					<el-radio value="1">支持</el-radio>
					<el-radio value="0">不支持</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="timestamps" prop="timestamps">
				<el-radio-group v-model="form.timestamps">
					<el-radio value="1">支持</el-radio>
					<el-radio value="0">不支持</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">{{ $t('general.cancel') }}</el-button>
			<el-button
				v-if="mode != 'show'"
				type="primary"
				:loading="isSaveing"
				@click="submit()"
			>{{ $t('general.save') }}</el-button>
		</template>
	</sc-dialog>
</template>

<style lang='scss' scoped>
.el-form-item-msg {
	width: 100%;
	p {
		line-height: 25px;
	}
}
.min-input {
	width: 200px;
}
</style>

<script>
export default {
	data() {
		return {
			mode: "add",
			index: '',
			titleMap: {
				add: this.$t("general.add"),
				edit: this.$t("general.edit"),
				show: this.$t("general.view"),
			},
			visible: false,
			isSaveing: false,
			form: {
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
			addTemplate: {
				name: '',
				type: '',
				length: '',
				default: '',
				attribute: '',
				is_empty: false,
				AUTO_INCREMENT: false,
				annotation: ''
			},
			//验证规则
			rules: {
				name: [
					{ required: true, message: '请输入表名' }
				],
				annotation: [
					{ required: true, message: '请输入表注释' }
				]
			},
			db: {
				sort: [
					{
						value: "utf8_general_ci",
						label: "utf8_general_ci",
					},
					{
						value: "utf8mb4_unicode_ci",
						label: "utf8mb4_unicode_ci",
					},
				],
				attribute: [
					{
						value: "BINARY",
						label: "BINARY",
					},
					{
						value: "UNSIGNED",
						label: "UNSIGNED",
					},
				],
				path: [],
				type: [
					{
						label: "数字",
						options: [
							{
								value: "tinyInteger",
								label: "TINYINT",
							},
							{
								value: "smallInteger",
								label: "SMALLINT",
							},
							{
								value: "mediumInteger",
								label: "MEDIUMINT",
							},
							{
								value: "integer",
								label: "INT",
							},
							{
								value: "bigInteger",
								label: "BIGINT",
							},
						],
					},
					{
						label: "日期与时间",
						options: [
							{
								value: "timestamp",
								label: "TIMESTAMP",
							},
						],
					},
					{
						label: "文本",
						options: [
							{
								value: "char",
								label: "CHAR",
							},
							{
								value: "string",
								label: "VARCHAR",
							},
							{
								value: "text",
								label: "TEXT",
							},
							{
								value: "mediumText",
								label: "MEDIUMTEXT",
							},
							{
								value: "longText",
								label: "LONGTEXT",
							},
						],
					},
					{
						label: "JSON",
						options: [
							{
								value: "json",
								label: "JSON",
							},
						],
					},
				],
			},
		};
	},
	props: {
		modelValue: { type: Array, default: () => [] },
	},
	watch: {

	},
	mounted() {

	},
	computed: {
	},
	methods: {
		//显示
		open(mode = "add") {
			this.mode = mode;
			this.visible = true;
			this.form = {
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
			}
			return this;
		},
		//表单提交方法
		submit() {
			this.$refs.dialogForm.validate(async (valid) => {
				if (valid) {
					let modelValue = this.modelValue
					// 新增
					if (this.mode === 'add') {
						modelValue.push(this.form)
					} else {
						modelValue[this.index] = this.form
					}
					this.visible = false;
					this.$emit('update:modelValue', modelValue)
				}
			});
		},
		//表单注入数据
		setData(data, index) {
			this.index = index
			Object.assign(this.form, data);
		},
	},
};
</script>