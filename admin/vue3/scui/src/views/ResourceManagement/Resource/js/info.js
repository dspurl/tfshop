export default {
	name: "ResourceInfo",
	data() {
		return {
			form: {},
			loading: true
		};
	},
	mounted() {},
	methods: {
		//表单注入数据
		setData(data) {
			this.loading = true
			Object.assign(this.form, data);
			this.loading = false
			// console.log("this.form", this.form);
		},
	},
};
