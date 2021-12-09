<template>
	<el-main>
		<el-row :gutter="15">
			<el-col :lg="24">
				<el-card shadow="never">
					<sc-file-select v-model="file" :multiple="multiple" :hideUpload="hideUpload" :max="99" @submit="submit">
						<template #do>
							<el-button>自定义插槽</el-button>
						</template>
					</sc-file-select>
				</el-card>
			</el-col>
		</el-row>
	</el-main>
</template>
<style lang='scss' scoped>
@import "./scss/index.scss";
</style>

<script>
import js from './js/index'
export default js
</script>
