<template>
	<el-main style="padding:0 20px;" v-loading="loading">
		<el-card v-if="data.url" shadow="never" style="margin-bottom: 20px;">
			<el-image v-if="_isImg(data.url)" :src="data.url" fit="scale-down" lazy></el-image>
			<ds-video v-else-if="_isVideo(data.url)" :sources="{ type: data.info.type, src: data.url }"></ds-video>
			<div v-if="!_isImg(data.url)" v-auth="['ResourceCover']" class="img-box">
				<sc-upload
					@del="coverDel"
					@succeed="cover"
					uuid="c5b8ffd0-5892-11ec-a943-3fd5d59f340c"
					v-model="data.resource.url"
					title="设置封面"
					file-select
				></sc-upload>
			</div>
		</el-card>
		<el-card shadow="never" style="margin-bottom: 20px;">
			<el-descriptions title="基础信息" size="mini" direction="vertical" :column="1">
				<el-descriptions-item label="资源名称：">{{ data.name }}</el-descriptions-item>
				<el-descriptions-item label="资源别名：">
					{{ data.depict ? data.depict : '无' }}
					<el-button
						v-auth="['ResourceDepict']"
						style="margin-left: 10px;"
						size="mini"
						type="primary"
						icon="el-icon-edit"
						circle
						@click="open"
					></el-button>
				</el-descriptions-item>
				<el-descriptions-item label="资源类型：">{{ data.resource_type_id }}</el-descriptions-item>
				<el-descriptions-item label="资源分组：">{{ data.resource_group_id }}</el-descriptions-item>
				<el-descriptions-item label="资源地址：">{{ data.url }}</el-descriptions-item>
			</el-descriptions>
			<el-descriptions title="资源信息" size="mini" direction="vertical" :column="1">
				<el-descriptions-item label="资源后缀：">{{ data.info.extension }}</el-descriptions-item>
				<el-descriptions-item label="资源原始名称：">{{ data.info.originalName }}</el-descriptions-item>
				<el-descriptions-item label="资源类型：">{{ data.info.type }}</el-descriptions-item>
				<el-descriptions-item label="资源大小(B)：">{{ data.info.size }}</el-descriptions-item>
			</el-descriptions>
		</el-card>
	</el-main>
</template>
<style lang='scss' scoped>
@import "./scss/info.scss";
</style>

<script>
import js from './js/info'
export default js
</script>