<template>
	<sc-dialog
		:title="titleMap[mode]"
		v-model="visible"
		:width="500"
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
			<el-form-item label="插件" prop="name">
				<el-select v-model="form.name" clearable placeholder="请选择">
					<el-option v-for="(item, index) in relyOn" :key="index" :label="item.name" :value="item.name" />
				</el-select>
			</el-form-item>
			<el-form-item label="是否必须" prop="must">
				<el-switch v-model="form.must" active-text="是" inactive-text="否" />
				<div class="el-form-item-msg">设为必须后，使用者必须先安装依赖插件才允许继续操作</div>
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
				name: '',
				must: false
			},
			rules: {
				name: [
					{ required: true, message: '请选择插件' }
				]
			},
			relyOn: [],
		};
	},
	props: {
		modelValue: { type: Array, default: () => [] },
	},
	watch: {

	},
	mounted() {
		this.getInstallList();
	},
	computed: {
	},
	methods: {
		//显示
		open(mode = "add") {
			this.mode = mode;
			this.visible = true;
			this.form = {
				name: '',
				must: false
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
		// 获取安装的插件列表
		async getInstallList() {
			const res = await this.$API.plugin.installList.get();
			this.relyOn = res.message;
		},
	},
};
</script>