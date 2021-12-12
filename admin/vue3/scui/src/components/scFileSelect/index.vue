<!--
 * @Descripttion: 资源文件选择器
 * @version: 1.0
 * @Author: sakuya
 * @Date: 2021年10月11日16:01:40
 * @LastEditors:
 * @LastEditTime:
-->

<template>
	<el-aside width="300px" v-loading="menuLoading">
		<el-container>
			<!-- <el-header>
					<el-input :placeholder="$t('general.keywordFiltering')" v-model="menuFilterText" clearable></el-input>
			</el-header>-->
			<el-main style="min-height: 200px;">
				<el-tree
					ref="group"
					class="menu"
					:data="menu"
					:node-key="treeProps.key"
					:props="treeProps"
					:current-node-key="menu.length > 0 ? menu[0][treeProps.key] : ''"
					highlight-current
					@node-click="groupClick"
				>
					<template #default="{ node }">
						<span class="el-tree-node__label">
							<el-icon class="icon">
								<el-icon-folder />
							</el-icon>
							{{ node.label }}
						</span>
					</template>
				</el-tree>
			</el-main>
			<!-- <el-footer style="height:51px;">
					<el-button
						v-auth="['PowerCreate']"
						type="primary"
						size="mini"
						icon="el-icon-plus"
						@click="add()"
					></el-button>
					<el-button
						v-auth="['PowerDestroy']"
						type="danger"
						size="mini"
						plain
						icon="el-icon-delete"
						@click="delMenu"
					></el-button>
					<el-button
						size="mini"
						plain
						@click="refreshMenu"
						icon="el-icon-refresh-right"
					>{{ $t('general.refreshMenu') }}</el-button>
			</el-footer>-->
		</el-container>
	</el-aside>
	<el-container>
		<el-main class="sc-file-select__files" v-loading="listLoading">
			<el-row class="sc-file-select__top">
				<el-col class="upload" v-if="!hideUpload" :lg="18">
					<el-upload
						class="sc-file-select__upload"
						action
						multiple
						:show-file-list="false"
						:accept="accept"
						:on-change="uploadChange"
						:before-upload="uploadBefore"
						:on-progress="uploadProcess"
						:on-success="uploadSuccess"
						:on-error="uploadError"
						:http-request="uploadRequest"
					>
						<el-button type="primary" icon="el-icon-upload">本地上传</el-button>
					</el-upload>
					<span class="tips">
						<el-icon>
							<el-icon-warning />
						</el-icon>
						大小不超过{{ maxSize }}MB
					</span>
				</el-col>
				<el-col :lg="6" class="keyword">
					<el-input
						v-model="keyword"
						prefix-icon="el-icon-search"
						placeholder="文件名搜索"
						clearable
						@keyup.enter="search"
						@clear="search"
					></el-input>
				</el-col>
			</el-row>
			<div class="sc-file-select__list">
				<el-scrollbar ref="scrollbar">
					<el-empty v-if="fileList.length == 0 && data.length == 0" description="无数据" :image-size="80"></el-empty>
					<div v-for="(file, index) in fileList" :key="index" class="sc-file-select__item">
						<div class="sc-file-select__item__file">
							<div class="sc-file-select__item__upload">
								<el-progress type="circle" :percentage="file.progress" :width="70"></el-progress>
							</div>
							<el-image :src="file.tempImg" fit="contain"></el-image>
						</div>
						<p>{{ file.name }}</p>
					</div>
					<div
						v-for="(item,index) in data"
						:key="item[fileProps.key]"
						class="sc-file-select__item"
						:class="{ active: value.includes(item[fileProps.url]) }"
						@click="select(item)"
						v-loading="itemLoading"
					>
						<div class="sc-file-select__item__file">
							<template v-if="isSelect">
								<div class="sc-file-select__item__checkbox" v-if="multiple">
									<el-icon>
										<el-icon-check />
									</el-icon>
								</div>
								<div class="sc-file-select__item__select" v-else>
									<el-icon>
										<el-icon-check />
									</el-icon>
								</div>
								<div class="sc-file-select__item__box"></div>
							</template>
							<div v-else class="operation-box">
								<el-icon class="icon" @click="view(item)">
									<el-icon-view color="#FFFFFF" />
								</el-icon>
								<el-popconfirm :title="$t('general.sureDelete')" @confirm="del(item, index)">
									<template #reference>
										<el-icon class="icon">
											<el-icon-delete color="#FFFFFF" />
										</el-icon>
									</template>
								</el-popconfirm>
							</div>
							<el-image v-if="_isImg(item[fileProps.url])" :src="item[fileProps.url]" fit="contain" lazy></el-image>
							<el-image
								v-else-if="_isWord(item[fileProps.url])"
								:src="require('@/assets/file/WORD.png')"
								fit="scale-down"
								lazy
							></el-image>
							<el-image
								v-else-if="_isPdf(item[fileProps.url])"
								:src="require('@/assets/file/PDF.png')"
								fit="scale-down"
								lazy
							></el-image>
							<el-image
								v-else-if="_isExcl(item[fileProps.url])"
								:src="require('@/assets/file/ECEL.png')"
								fit="scale-down"
								lazy
							></el-image>
							<el-image
								v-else-if="_isTxt(item[fileProps.url])"
								:src="require('@/assets/file/TXT.png')"
								fit="scale-down"
								lazy
							></el-image>
							<el-image
								v-else-if="_isVideo(item[fileProps.url])"
								:src="require('@/assets/file/VIDEO.png')"
								fit="scale-down"
								lazy
							></el-image>
							<div v-else class="item-file item-file-doc">
								<i
									v-if="files[_getExt(item[fileProps.url])]"
									:class="files[_getExt(item[fileProps.url])].icon"
									:style="{ color: files[_getExt(item[fileProps.url])].color }"
								></i>
								<i v-else class="sc-icon-file-list-fill" style="color: #999;"></i>
							</div>
						</div>
						<p :title="item[fileProps.fileName]">{{ item[fileProps.fileName] }}</p>
					</div>
				</el-scrollbar>
			</div>
			<div class="sc-file-select__pagination">
				<el-pagination
					small
					background
					layout="prev, pager, next"
					:total="total"
					:page-size="pageSize"
					v-model:currentPage="currentPage"
					@current-change="reload"
				></el-pagination>
			</div>
			<div class="sc-file-select__do">
				<slot name="do"></slot>
				<el-button
					v-if="isSelect"
					type="primary"
					:disabled="value.length <= 0"
					@click="submit(item)"
				>确 定</el-button>
			</div>
		</el-main>
	</el-container>
</template>

<script>
import config from "@/config/fileSelect"

export default {
	props: {
		modelValue: null,
		hideUpload: { type: Boolean, default: false },
		uuid: { type: String, default: '' },
		multiple: { type: Boolean, default: false },
		max: { type: Number, default: config.max },
		onlyImage: { type: Boolean, default: false },
		maxSize: { type: Number, default: config.maxSize },
		isSelect: { type: Boolean, default: false }
	},
	data() {
		return {
			keyword: null,
			pageSize: 20,
			total: 0,
			currentPage: 1,
			data: [],
			menu: [],
			menuId: '',
			value: this.multiple ? [] : '',
			itemData: this.multiple ? [] : {},
			fileList: [],
			accept: this.onlyImage ? "image/gif, image/jpeg, image/png" : "",
			listLoading: false,
			menuLoading: false,
			itemLoading: false,
			treeProps: config.menuProps,
			fileProps: config.fileProps,
			files: config.files
		}
	},
	watch: {
		multiple() {
			this.value = this.multiple ? [] : ''
			this.$emit('update:modelValue', JSON.parse(JSON.stringify(this.value)));
		}
	},
	mounted() {
		this.getMenu()
		this.getData()
	},
	methods: {
		//获取分类数据
		async getMenu() {
			this.menuLoading = true
			var res = await config.menuApiObj.get()
			this.menu = res.message
			this.menu.unshift({
				name: '未分组',
				id: 0
			})
			this.menuLoading = false
		},
		//获取列表数据
		async getData() {
			this.listLoading = true
			var reqData = {
				[config.request.menuKey]: this.menuId,
				[config.request.page]: this.currentPage,
				[config.request.pageSize]: this.pageSize,
				[config.request.keyword]: this.keyword
			}
			if (this.onlyImage) {
				reqData.type = 'image'
			}
			reqData.uuid = this.uuid
			var res = await config.listApiObj.get(reqData)
			var parseData = config.listParseData(res)
			this.data = parseData.rows
			this.total = parseData.total
			this.listLoading = false
			this.$refs.scrollbar.setScrollTop(0)
		},
		//树点击事件
		groupClick(data) {
			this.menuId = data.id
			this.currentPage = 1
			this.keyword = null
			this.getData()
		},
		//分页刷新表格
		reload() {
			this.getData()
		},
		search() {
			this.currentPage = 1
			this.getData()
		},
		select(item) {
			const itemUrl = item[this.fileProps.url]
			if (this.multiple) {
				if (this.value.includes(itemUrl)) {
					const index = this.value.findIndex(f => f == itemUrl)
					this.value.splice(index, 1)
					this.itemData.splice(index, 1)
				} else {
					this.value.push(itemUrl)
					this.itemData.push(item)
				}
			} else {
				if (this.value.includes(itemUrl)) {
					this.value = ''
					this.itemData = {}
				} else {
					this.value = itemUrl
					this.itemData = item
				}

			}
		},
		submit() {
			const value = JSON.parse(JSON.stringify(this.value))
			this.$emit('update:modelValue', value);
			this.$emit('submit', value);
			this.$emit('succeed', this.itemData);
		},
		//上传处理
		uploadChange(file, fileList) {
			file.tempImg = URL.createObjectURL(file.raw);
			this.fileList = fileList
		},
		uploadBefore(file) {
			const maxSize = file.size / 1024 / 1024 < this.maxSize;
			if (!maxSize) {
				this.$message.warning(`上传文件大小不能超过 ${this.maxSize}MB!`);
				return false;
			}
		},
		uploadRequest(param) {
			var apiObj = config.apiObj;
			const data = new FormData();
			data.append("file", param.file);
			data.append([config.request.menuKey], this.menuId);
			data.append('uuid', this.uuid);
			apiObj.post(data, {
				onUploadProgress: e => {
					param.onProgress(e)
				}
			}).then(res => {
				param.onSuccess(res)
			}).catch(err => {
				param.onError(err)
			})
		},
		uploadProcess(event, file) {
			file.progress = Number((event.loaded / event.total * 100).toFixed(2))
		},
		uploadSuccess(res, file) {
			this.fileList.splice(this.fileList.findIndex(f => f.uid == file.uid), 1)
			const response = config.uploadParseData(res);
			console.log('response', response)
			this.data.unshift({
				[this.fileProps.key]: response.id,
				[this.fileProps.fileName]: response.fileName,
				[this.fileProps.url]: response.url
			})
			if (!this.multiple) {
				this.value = response.url
			}
		},
		uploadError(err) {
			this.$notify.error({
				title: '上传文件错误',
				message: err
			})
		},
		//内置函数
		_isImg(fileUrl) {
			const ext = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."))
			return ext.indexOf(fileExt) != -1
		},
		_isPdf(fileUrl) {
			const ext = ['.pdf']
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."))
			return ext.indexOf(fileExt) != -1
		},
		_isVideo(fileUrl) {
			const ext = ['.mp4', '.rmvb', '.mkv', '.avi']
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."))
			return ext.indexOf(fileExt) != -1
		},
		_isWord(fileUrl) {
			const ext = ['.doc', '.docx']
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."))
			return ext.indexOf(fileExt) != -1
		},
		_isExcl(fileUrl) {
			const ext = ['.xls', '.xlsx']
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."))
			return ext.indexOf(fileExt) != -1
		},
		_isTxt(fileUrl) {
			const ext = ['.txt']
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."))
			return ext.indexOf(fileExt) != -1
		},
		_getExt(fileUrl) {
			return fileUrl.substring(fileUrl.lastIndexOf(".") + 1)
		},
		view(item) {
			this.$emit('view', item);
		},
		async del(item, index) {
			this.itemLoading = true
			try {
				await this.$API.resource.destroy.post(item.id);
				this.$message.success(this.$t("general.deleteSuccessfully"));
				this.data.splice(index, 1)
			} finally {
				this.itemLoading = false
			}
		}
	}
}
</script>

<style scoped lang="scss">
.sc-file-select {
	display: flex;
}
.sc-file-select__files {
	flex: 1;
	background: #fff;
}

.sc-file-select__list {
	height: 400px;
}
.operation-box {
	background: rgba(0, 0, 0, 0.6);
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 2;
	display: none;
	align-items: center;
	justify-content: center;
	.icon {
		margin: 0 5px;
		font-size: 18px;
	}
}
.sc-file-select__item {
	display: inline-block;
	float: left;
	margin: 0 15px 25px 0;
	width: 110px;
	cursor: pointer;
	&:hover {
		.operation-box {
			display: flex;
		}
	}
}
.sc-file-select__item__file {
	width: 110px;
	height: 110px;
	position: relative;
}
.sc-file-select__item__file .el-image {
	width: 110px;
	height: 110px;
}
.sc-file-select__item__box {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	border: 2px solid var(--el-color-success);
	z-index: 1;
	display: none;
}
.sc-file-select__item__box::before {
	content: "";
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: var(--el-color-success);
	opacity: 0.2;
	display: none;
}
.sc-file-select__item:hover .sc-file-select__item__box {
	display: block;
}
.sc-file-select__item.active .sc-file-select__item__box {
	display: block;
}
.sc-file-select__item.active .sc-file-select__item__box::before {
	display: block;
}
.sc-file-select__item p {
	margin-top: 10px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	-webkit-text-overflow: ellipsis;
	text-align: center;
}
.sc-file-select__item__checkbox {
	position: absolute;
	width: 20px;
	height: 20px;
	top: 7px;
	right: 7px;
	z-index: 2;
	background: rgba(0, 0, 0, 0.2);
	border: 1px solid #fff;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.sc-file-select__item__checkbox i {
	font-size: 14px;
	color: #fff;
	font-weight: bold;
	display: none;
}
.sc-file-select__item__select {
	position: absolute;
	width: 20px;
	height: 20px;
	top: 0px;
	right: 0px;
	z-index: 2;
	background: var(--el-color-success);
	display: none;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.sc-file-select__item__select i {
	font-size: 14px;
	color: #fff;
	font-weight: bold;
}
.sc-file-select__item.active .sc-file-select__item__checkbox {
	background: var(--el-color-success);
}
.sc-file-select__item.active .sc-file-select__item__checkbox i {
	display: block;
}
.sc-file-select__item.active .sc-file-select__item__select {
	display: flex;
}
.sc-file-select__item__file .item-file {
	width: 110px;
	height: 110px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.sc-file-select__item__file .item-file i {
	font-size: 40px;
}
.sc-file-select__item__file .item-file.item-file-doc {
	color: #409eff;
}

.sc-file-select__item__upload {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 1;
	background: rgba(255, 255, 255, 0.7);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.sc-file-select__side {
	width: 200px;
	margin-right: 15px;
	border-right: 1px solid rgba(128, 128, 128, 0.2);
	display: flex;
	flex-flow: column;
}
.sc-file-select__side-menu {
	flex: 1;
}
.sc-file-select__side-msg {
	height: 32px;
	line-height: 32px;
}

.sc-file-select__top {
	margin-bottom: 15px;
	display: flex;
	justify-content: space-between;
	.upload {
		margin-bottom: 10px;
	}
}
.sc-file-select__upload {
	display: inline-block;
}
.sc-file-select__top .tips {
	font-size: 12px;
	margin-left: 10px;
	color: #999;
}
.sc-file-select__top .tips i {
	font-size: 14px;
	margin-right: 5px;
	position: relative;
	bottom: -0.125em;
}
.sc-file-select__pagination {
	margin: 15px 0;
}

.sc-file-select__do {
	text-align: right;
}
</style>
