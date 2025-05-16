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
			<el-form-item label="观察者名称" prop="name">
				<el-input class="min-input" v-model="form.name" maxlength="60" clearable placeholder="请输入观察者名称"></el-input>
				<div class="el-form-item-msg">观察者名称仅支持英文和空格，最终会解析成类名</div>
			</el-form-item>
			<el-form-item label="依赖模型" prop="models">
				<el-select v-model="form.models" placeholder="请选择" clearable filterable>
					<el-option v-for="(item, index) in models" :key="index" :label="item" :value="item" />
				</el-select>
			</el-form-item>
			<el-form-item label="可执行路由" prop="path">
				<el-select v-model="form.path" placeholder="请选择" clearable filterable multiple>
					<el-option v-for="(item, index) in path" :key="index" :label="item.uri" :value="item.uri">
						<span style="float: left">{{ item.uri }}</span>
						<span
							style="float: right; color: #8492a6; font-size: 13px"
						>{{ item.explain }}[{{ item.path }}]</span>
					</el-option>
				</el-select>
				<div class="el-form-item-msg">为空即不允许路由执行</div>
			</el-form-item>
			<el-form-item label="说明" prop="explain">
				<el-input
					class="min-input"
					type="textarea"
					v-model="form.explain"
					maxlength="200"
					clearable
					placeholder="请输入说明"
				></el-input>
				<div class="el-form-item-msg">说明下该观察者的作用</div>
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
		const validateObserverName = (rule, value, callback) => {
			if (!(/^(?!_)([A-Za-z ]+)$/.test(value))) {
				callback(new Error('观察者名称格式有误'))
			} else {
				callback()
			}
		}
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
				models: '',
				path: '',
				explain: ''
			},
			rules: {
				name: [
					{ required: true, message: '请输入观察者名称' },
					{ validator: validateObserverName }
				],
				models: [
					{ required: true, message: '请选择依赖模型' }
				],
				path: [
					{ required: false, message: '请选择可执行路由' }
				],
				explain: [
					{ required: true, message: '请输入说明' }
				]
			},
			path: [],
			models: [],
		};
	},
	props: {
		modelValue: { type: Array, default: () => [] },
	},
	watch: {

	},
	mounted() {
		this.getModels();
		this.getRoutes();
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
				models: '',
				path: '',
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
		// 获取模型列表
		async getModels() {
			const res = await this.$API.plugin.models.get();
			this.models = res.message;
		},
		// 获取可执行路由
		async getRoutes() {
			const res = await this.$API.plugin.routes.get();
			this.path = res.message;
		},
	},
};
</script>