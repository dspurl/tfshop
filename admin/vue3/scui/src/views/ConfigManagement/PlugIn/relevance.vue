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
			<el-form-item label="文件" prop="file">
				<el-input
					v-model="form.file"
					class="min-input"
					placeholder="请输入文件完整路径"
					maxlength="255"
					clearable
				/>
				<div
					class="el-form-item-msg"
				>在发行时会对文件进行校验，如不存在将无法完成发行，格式：/api/app/Providers/AppServiceProvider.php</div>
			</el-form-item>
			<el-form-item label="说明" prop="explain">
				<el-input
					v-model="form.explain"
					class="min-input"
					placeholder="请输入说明"
					type="textarea"
					maxlength="200"
					clearable
				/>
				<div class="el-form-item-msg">说明下该文件的作用</div>
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
				file: '',
				explain: ''
			},
			rules: {
				file: [
					{ required: true, message: '请输入文件完整路径' }
				],
				explain: [
					{ required: true, message: '请输入说明' }
				]
			}
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
				file: '',
				explain: ''
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