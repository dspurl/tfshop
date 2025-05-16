export default {
	props: {
		id: {},
		modelValue: {},
		value: {},
		label: {
			type: String,
		},
		options: {
			type: Object,
			default: () => {
			}
		}
	},

	data() {
		return {
			mValue: '',
			defaultOptions: {}      // 如有默认options配置，则在调用组件重新定义此变量
		};
	},
	created() {
	},
	computed: {
		mOptions() {
			return {...this.defaultOptions, ...this.options}
		}
	},

	watch: {
		modelValue: {
			immediate: true,
			deep: true,
			handler() {
				this.mValue = this.modelValue;
			},
		},
		// value: {
		// 	immediate: true,
		// 	deep: true,
		// 	handler() {
		// 		this.mValue = this.value;
		// 	},
		// },
		mValue: {
			handler() {
				this.$emit('update:modelValue', this.mValue)
				this.$emit("input", this.mValue);
				this.$emit("change", this.mValue);
			},
		},
	},
}
