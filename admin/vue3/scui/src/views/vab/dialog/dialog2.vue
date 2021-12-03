<template>
	<sc-dialog v-model="visible" title="提示" @closed="$emit('closed')">
		内容2
		<template #footer>
			<el-button @click="visible = false">取 消</el-button>
			<el-button type="primary" @click="visible = false">确 定</el-button>
		</template>
	</sc-dialog>
</template>

<script>
	export default {
		data() {
			return {
				visible: true
			}
		},
		mounted() {
			console.log("加载./dialog2组件完成")
		},
		methods: {

		}
	}
</script>

<style>
</style>
