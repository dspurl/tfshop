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
					:title="$t('resource.uploadTitle')"
					file-select
				></sc-upload>
			</div>
		</el-card>
		<el-card shadow="never" style="margin-bottom: 20px;">
			<el-descriptions
				:title="$t('resource.descriptionsBasic')"
				size="mini"
				direction="vertical"
				:column="1"
				class="descriptions"
			>
				<el-descriptions-item :label="$t('resource.descriptionsItemName')">{{ data.name }}</el-descriptions-item>
				<el-descriptions-item :label="$t('resource.descriptionsItemDepict')">
					{{ data.depict ? data.depict : $t('general.nothing') }}
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
				<el-descriptions-item :label="$t('resource.descriptionsItemType')">{{ data.resource_type_id }}</el-descriptions-item>
				<el-descriptions-item :label="$t('resource.descriptionsItemGroup')">{{ data.resource_group_id }}</el-descriptions-item>
				<el-descriptions-item :label="$t('resource.descriptionsItemUrl')">{{ data.url }}</el-descriptions-item>
				<el-descriptions-item
					v-if="data.resource_type && _isImg(data.url)"
					:label="$t('resource.descriptionsItemSpecification')"
				>{{ data.resource_type.specification }}</el-descriptions-item>
			</el-descriptions>
			<el-descriptions
				:title="$t('resource.descriptionsResource')"
				size="mini"
				direction="vertical"
				:column="1"
				class="descriptions"
			>
				<el-descriptions-item
					:label="$t('resource.descriptionsItemExtension')"
				>{{ data.info.extension }}</el-descriptions-item>
				<el-descriptions-item
					:label="$t('resource.descriptionsItemOriginalName')"
				>{{ data.info.originalName }}</el-descriptions-item>
				<el-descriptions-item :label="$t('resource.descriptionsItemOriginalType')">{{ data.info.type }}</el-descriptions-item>
				<el-descriptions-item :label="$t('resource.descriptionsItemSize') + '(B)'">{{ data.info.size }}</el-descriptions-item>
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