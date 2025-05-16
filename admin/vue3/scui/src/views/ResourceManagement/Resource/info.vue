<template>
	<el-main style="padding:0 20px;" v-loading="loading">
		<el-card v-if="data.url" shadow="never" style="margin-bottom: 20px;">
			<el-image v-if="_isImg(data.url)" :src="data.url" fit="scale-down" lazy></el-image>
			<tf-video v-else-if="_isVideo(data.url)" :sources="{ type: data.info.type, src: data.url }"></tf-video>
			<div v-if="!_isImg(data.url)" v-auths="['ResourceCover']" class="img-box">
				<sc-upload @del="coverDel" @succeed="cover" uuid="c5b8ffd0-5892-11ec-a943-3fd5d59f340c"
					v-model="data.resource.url" :title="$t('resource.uploadTitle')" file-select></sc-upload>
			</div>
		</el-card>
		<el-card shadow="never" style="margin-bottom: 20px;">
			<el-descriptions :title="$t('resource.descriptionsBasic')" size="small" direction="vertical" :column="1"
				class="descriptions">
				<el-descriptions-item :label="$t('resource.descriptionsItemName')">{{ data.name
					}}</el-descriptions-item>
				<el-descriptions-item :label="$t('resource.descriptionsItemDepict')">
					{{ data.depict ? data.depict : $t('general.nothing') }}
					<el-button v-auths="['ResourceDepict']" style="margin-left: 10px;" size="small" type="primary"
						icon="el-icon-edit" circle @click="open"></el-button>
				</el-descriptions-item>
				<el-descriptions-item :label="$t('resource.descriptionsItemType')">{{ data.resource_type_id ?
					data.resource_type.name : ''
					}}</el-descriptions-item>
				<el-descriptions-item :label="$t('resource.descriptionsItemGroup')">{{ data.resource_group_id ?
					data.resource_group.name : '未分组' }}</el-descriptions-item>
				<el-descriptions-item :label="$t('resource.descriptionsItemUrl')"><a class="a" :href="data.url"
						:title="data.url" target="_blank">{{ data.url }}</a></el-descriptions-item>
				<el-descriptions-item v-if="data.resource_type && _isImg(data.url)"
					:label="$t('resource.descriptionsItemSpecification')">{{ data.resource_type.specification
					}}</el-descriptions-item>
			</el-descriptions>
			<el-descriptions :title="$t('resource.descriptionsResource')" size="small" direction="vertical" :column="1"
				class="descriptions">
				<el-descriptions-item :label="$t('resource.descriptionsItemExtension')">{{ data.info.extension
					}}</el-descriptions-item>
				<el-descriptions-item :label="$t('resource.descriptionsItemOriginalName')">{{ data.info.originalName
					}}</el-descriptions-item>
				<el-descriptions-item :label="$t('resource.descriptionsItemOriginalType')">{{ data.info.type
					}}</el-descriptions-item>
				<el-descriptions-item :label="$t('resource.descriptionsItemSize') + '(B)'">{{ data.info.size
					}}</el-descriptions-item>
			</el-descriptions>
		</el-card>
	</el-main>
</template>
<style lang='scss' scoped>
@use "./scss/info.scss" as *;
</style>

<script>
import js from './js/info'
export default js
</script>
