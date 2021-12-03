<template>
	<el-main>
		<el-row :gutter="15">
			<el-col :lg="18">
				<el-card shadow="never">
					<sc-file-select v-model="file" :multiple="multiple" :hideUpload="hideUpload" :max="99" @submit="submit">
						<template #do>
							<el-button>自定义插槽</el-button>
						</template>
					</sc-file-select>
				</el-card>
				<el-card shadow="never" header="已集成的上传组件">
					<p>
						<sc-upload v-model="upload" title="单选" file-select></sc-upload>
					</p>
					<p style="margin-top: 15px;">
						<sc-upload-multiple v-model="upload2" title="多选" file-select></sc-upload-multiple>
					</p>
				</el-card>
			</el-col>
			<el-col :lg="6">
				<el-card shadow="never" header="参数和方法">
					<el-button type="primary" @click="multiple = !multiple">切换multiple</el-button>
					<el-button type="primary" @click="hideUpload = !hideUpload">切换hideUpload</el-button>
				</el-card>
			</el-col>
		</el-row>
	</el-main>
</template>

<script>
	import scFileSelect from '@/components/scFileSelect'

	export default {
		name: 'fileselect',
		components: {
			scFileSelect
		},
		data() {
			return {
				file: '',
				multiple: false,
				hideUpload: false,
				upload: '',
				upload2: ''
			}
		},
		mounted() {

		},
		methods: {
			submit(value){
				console.log(value)
				this.$message("返回值请查看F12控制台console.log()")
			}
		}
	}
</script>

<style scoped>

</style>
