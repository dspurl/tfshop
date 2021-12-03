<template>
	<el-main>
		<el-card shadow="never">
			<sc-editor v-model="html" placeholder="请输入" :height="400"></sc-editor>
		</el-card>
	</el-main>
</template>

<script>
	import { defineAsyncComponent } from 'vue';
	const scEditor = defineAsyncComponent(() => import('@/components/scEditor'));

	export default {
		name: "editor",
		components: {
			scEditor
		},
		data(){
			return {
				html: ''
			}
		}
	}
</script>

<style>
</style>
