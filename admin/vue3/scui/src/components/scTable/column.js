import { h, resolveComponent } from 'vue'

export default {
	render() {
		return h (
			resolveComponent("el-table-column"),
			{
				index: this.index,
				...this.$attrs
			},
			this.$slots
		)
	},
	methods: {
		index(index){
			if(this.$attrs.type=="index"){
				let page = this.$parent.$parent.currentPage
				let pageSize = this.$parent.$parent.pageSize
				return (page - 1) * pageSize + index + 1
			}
		}
	}
}
