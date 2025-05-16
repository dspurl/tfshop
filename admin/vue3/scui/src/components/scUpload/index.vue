<template>
	<div
		class="sc-upload"
		:class="{'sc-upload-round':round}"
		:style="style"
	>
		<div v-if="file && file.status != 'success'" class="sc-upload__uploading">
			<div class="sc-upload__progress">
				<el-progress :percentage="file.percentage" :text-inside="true" :stroke-width="16"/>
			</div>
			<el-image class="image" :src="file.tempFile" fit="cover"></el-image>
		</div>
		<div v-if="file && file.status=='success'" class="sc-upload__img">
			<el-image class="image" :src="file.url" :preview-src-list="[file.url]" fit="cover" hide-on-click-modal
					  append-to-body :z-index="9999">
				<template #placeholder>
					<div class="sc-upload__img-slot">
						Loading...
					</div>
				</template>
			</el-image>
			<div class="sc-upload__img-actions" v-if="!disabled">
				<span class="del" @click="handleRemove()"><el-icon><el-icon-delete/></el-icon></span>
			</div>
		</div>
		<el-upload v-if="!file" class="uploader" ref="uploader"
				   :auto-upload="cropper?false:autoUpload"
				   :disabled="disabled"
				   :show-file-list="showFileList"
				   :action="action"
				   :name="name"
				   :data="data"
				   :accept="accept"
				   :limit="1"
				   :http-request="request"
				   :on-change="change"
				   :before-upload="before"
				   :on-success="success"
				   :on-error="error"
				   :on-exceed="handleExceed">
			<slot>
				<div class="el-upload--picture-card">
					<div class="file-empty">
						<el-icon>
							<component :is="icon"/>
						</el-icon>
						<h4 v-if="title">{{ title }}</h4>
					</div>
				</div>
			</slot>
		</el-upload>
		<span style="display:none!important"><el-input v-model="value"></el-input></span>
		<el-dialog title="剪裁" draggable v-model="cropperDialogVisible" :width="580" @closed="cropperClosed"
				   destroy-on-close>
			<sc-cropper :src="cropperFile.tempCropperFile" :compress="compress" :aspectRatio="aspectRatio"
						ref="cropper"></sc-cropper>
			<template #footer>
				<el-button @click="cropperDialogVisible=false">取 消</el-button>
				<el-button type="primary" @click="cropperSave">确 定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import {defineAsyncComponent} from 'vue'
import {genFileId} from 'element-plus'

const scCropper = defineAsyncComponent(() => import('@/components/scCropper'))
import config from "@/config/upload"

export default {
	props: {
		modelValue: {type: String, default: ""},
		height: {type: Number, default: 148},
		width: {type: Number, default: 148},
		title: {type: String, default: ""},
		icon: {type: String, default: "el-icon-plus"},
		action: {type: String, default: ""},
		apiObj: {
			type: Object, default: () => {
			}
		},
		name: {type: String, default: config.filename},
		data: {
			type: Object, default: () => {
			}
		},
		accept: {type: String, default: "image/gif, image/jpeg, image/png"},
		maxSize: {type: Number, default: config.maxSizeFile},
		limit: {type: Number, default: 1},
		autoUpload: {type: Boolean, default: true},
		showFileList: {type: Boolean, default: false},
		disabled: {type: Boolean, default: false},
		round: {type: Boolean, default: false},
		onSuccess: {
			type: Function, default: () => {
				return true
			}
		},

		cropper: {type: Boolean, default: false},
		compress: {type: Number, default: 1},
		aspectRatio: {type: Number, default: NaN}
	},
	components: {
		scCropper
	},
	data() {
		return {
			value: "",
			file: null,
			style: {
				width: this.width + "px",
				height: this.height + "px"
			},
			cropperDialogVisible: false,
			cropperFile: null
		}
	},
	watch: {
		modelValue(val) {
			this.value = val
			this.newFile(val)
		},
		value(val) {
			this.$emit('update:modelValue', val)
		}
	},
	mounted() {
		this.value = this.modelValue
		this.newFile(this.modelValue)
	},
	methods: {
		newFile(url) {
			if (url) {
				this.file = {
					status: "success",
					url: url
				}
			} else {
				this.file = null
			}
		},
		cropperSave() {
			this.$refs.cropper.getCropFile(file => {

				file.uid = this.cropperFile.uid
				this.cropperFile.raw = file

				this.file = this.cropperFile
				this.file.tempFile = URL.createObjectURL(this.file.raw)
				this.$refs.uploader.submit()

			}, this.cropperFile.name, this.cropperFile.type)
			this.cropperDialogVisible = false
		},
		cropperClosed() {
			URL.revokeObjectURL(this.cropperFile.tempCropperFile)
			delete this.cropperFile.tempCropperFile
		},
		handleRemove() {
			this.clearFiles()
		},
		clearFiles() {
			URL.revokeObjectURL(this.file.tempFile)
			this.value = ""
			this.file = null
			this.$nextTick(() => {
				this.$refs.uploader.clearFiles()
			})
		},
		change(file,files){
			if(files.length > 1){
				files.splice(0, 1)
			}
			if (this.cropper && file.status == 'ready') {
				const acceptIncludes = ["image/gif", "image/jpeg", "image/png"].includes(file.raw.type)
				if (!acceptIncludes) {
					this.$notify.warning({
						title: '上传文件警告',
						message: '选择的文件非图像类文件'
					})
					return false
				}
				this.cropperFile = file
				this.cropperFile.tempCropperFile = URL.createObjectURL(file.raw)
				this.cropperDialogVisible = true
				return false
			}
			this.file = file
			if (file.status == 'ready') {
				file.tempFile = URL.createObjectURL(file.raw)
			}
		},
		before(file) {
			const acceptIncludes = this.accept.replace(/\s/g, "").split(",").includes(file.type)
			if (!acceptIncludes) {
				this.$notify.warning({
					title: '上传文件警告',
					message: '选择的文件非图像类文件'
				})
				this.clearFiles()
				return false
			}
			const maxSize = file.size / 1024 / 1024 < this.maxSize;
			if (!maxSize) {
				this.$message.warning(`上传文件大小不能超过 ${this.maxSize}MB!`);
				this.clearFiles()
				return false
			}
		},
		handleExceed(files) {
			const file = files[0]
			file.uid = genFileId()
			this.$refs.uploader.handleStart(file)
		},
		success(res, file) {
			//释放内存删除blob
			URL.revokeObjectURL(file.tempFile)
			delete file.tempFile
			var os = this.onSuccess(res, file)
			if (os != undefined && os == false) {
				this.$nextTick(() => {
					this.file = null
					this.value = ""
				})
				return false
			}
			var response = config.parseData(res)
			file.url = response.src
			this.value = file.url
		},
		error(err) {
			this.$nextTick(() => {
				this.clearFiles()
			})
			this.$notify.error({
				title: '上传文件未成功',
				message: err
			})
		},
		request(param) {
			var apiObj = config.apiObj;
			if (this.apiObj) {
				apiObj = this.apiObj;
			}
			const data = new FormData();
			data.append(param.filename, param.file);
			for (const key in param.data) {
				data.append(key, param.data[key]);
			}
			apiObj.post(data, {
				onUploadProgress: e => {
					const complete = parseInt(((e.loaded / e.total) * 100) | 0, 10)
					param.onProgress({percent: complete})
				}
			}).then(res => {
				var response = config.parseData(res);
				if (response.code == config.successCode) {
					param.onSuccess(res)
				} else {
					param.onError(response.msg || "未知错误")
				}
			}).catch(err => {
				param.onError(err)
			})
		}
	}
}
</script>

<style scoped>
.el-form-item.is-error .sc-upload .el-upload--picture-card {
	border-color: var(--el-color-danger);
}

.sc-upload .el-upload--picture-card {
	border-radius: 0;
}

.sc-upload .uploader, .sc-upload:deep(.el-upload) {
	width: 100%;
	height: 100%;
}

.sc-upload__img {
	width: 100%;
	height: 100%;
	position: relative;
}

.sc-upload__img .image {
	width: 100%;
	height: 100%;
}

.sc-upload__img-actions {
	position: absolute;
	top: 0;
	right: 0;
	display: none;
}

.sc-upload__img-actions span {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 25px;
	height: 25px;
	cursor: pointer;
	color: #fff;
}

.sc-upload__img-actions span i {
	font-size: 12px;
}

.sc-upload__img-actions .del {
	background: #F56C6C;
}

.sc-upload__img:hover .sc-upload__img-actions {
	display: block;
}

.sc-upload__img-slot {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	font-size: 12px;
	background-color: var(--el-fill-color-lighter);
}

.sc-upload__uploading {
	width: 100%;
	height: 100%;
	position: relative;
}

.sc-upload__progress {
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: var(--el-overlay-color-lighter);
	z-index: 1;
	padding: 10px;
}

.sc-upload__progress .el-progress {
	width: 100%;
}

.sc-upload__uploading .image {
	width: 100%;
	height: 100%;
}

.sc-upload .file-empty {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

.sc-upload .file-empty i {
	font-size: 28px;
}

.sc-upload .file-empty h4 {
	font-size: 12px;
	font-weight: normal;
	color: #8c939d;
	margin-top: 8px;
}

.sc-upload.sc-upload-round {
	border-radius: 50%;
	overflow: hidden;
}

.sc-upload.sc-upload-round .el-upload--picture-card {
	border-radius: 50%;
}

.sc-upload.sc-upload-round .sc-upload__img-actions {
	top: auto;
	left: 0;
	right: 0;
	bottom: 0;
}

.sc-upload.sc-upload-round .sc-upload__img-actions span {
	width: 100%;
}
</style>
