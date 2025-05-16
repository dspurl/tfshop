<template>
	<div class="sc-upload-multiple">
		<el-upload ref="uploader" list-type="picture-card"
			:auto-upload="autoUpload"
			:disabled="disabled"
			:action="action"
			:name="name"
			:data="data"
			:http-request="request"
			v-model:file-list="defaultFileList"
			:show-file-list="showFileList"
			:accept="accept"
			:multiple="multiple"
			:limit="limit"
			:before-upload="before"
			:on-success="success"
			:on-error="error"
			:on-preview="handlePreview"
			:on-exceed="handleExceed">
			<slot>
				<el-icon><el-icon-plus/></el-icon>
			</slot>
			<template #tip>
				<div v-if="tip" class="el-upload__tip">{{tip}}</div>
			</template>
			<template #file="{ file }">
				<div class="sc-upload-list-item">
					<el-image class="el-upload-list__item-thumbnail" :src="file.url" fit="cover" :preview-src-list="preview" :initial-index="preview.findIndex(n=>n==file.url)" hide-on-click-modal append-to-body :z-index="9999">
						<template #placeholder>
							<div class="sc-upload-multiple-image-slot">
								Loading...
							</div>
						</template>
					</el-image>
					<div v-if="!disabled && file.status=='success'" class="sc-upload__item-actions">
						<span class="del" @click="handleRemove(file)"><el-icon><el-icon-delete /></el-icon></span>
					</div>
					<div v-if="file.status=='ready' || file.status=='uploading'" class="sc-upload__item-progress">
						<el-progress :percentage="file.percentage" :text-inside="true" :stroke-width="16"/>
					</div>
				</div>
			</template>
		</el-upload>
		<span style="display:none!important"><el-input v-model="value"></el-input></span>
	</div>
</template>

<script>
	import config from "@/config/upload"
	import Sortable from 'sortablejs'

	export default {
		props: {
			modelValue: { type: [String, Array], default: "" },
			tip: { type: String, default: "" },
			action: { type: String, default: "" },
			apiObj: { type: Object, default: () => {} },
			name: { type: String, default: config.filename },
			data: { type: Object, default: () => {} },
			accept: { type: String, default: "image/gif, image/jpeg, image/png" },
			maxSize: { type: Number, default: config.maxSizeFile },
			limit: { type: Number, default: 0 },
			autoUpload: { type: Boolean, default: true },
			showFileList: { type: Boolean, default: true },
			multiple: { type: Boolean, default: true },
			disabled: { type: Boolean, default: false },
			draggable: { type: Boolean, default: false },
			onSuccess: { type: Function, default: () => { return true } }
		},
		data(){
			return {
				value: "",
				defaultFileList: []
			}
		},
		watch:{
			modelValue(val){
				if(Array.isArray(val)){
					if (JSON.stringify(val) != JSON.stringify(this.formatArr(this.defaultFileList))) {
						this.defaultFileList = val
						this.value = val
					}
				}else{
					if (val != this.toStr(this.defaultFileList)) {
						this.defaultFileList = this.toArr(val)
						this.value = val
					}
				}
			},
			defaultFileList: {
				handler(val){
					this.$emit('update:modelValue', Array.isArray(this.modelValue) ? this.formatArr(val) : this.toStr(val))
					this.value = this.toStr(val)
				},
				deep: true
			}
		},
		computed: {
			preview(){
				return this.defaultFileList.map(v => v.url)
			}
		},
		mounted() {
			this.defaultFileList = Array.isArray(this.modelValue) ? this.modelValue : this.toArr(this.modelValue)
			this.value = this.modelValue
			if(!this.disabled && this.draggable){
				this.rowDrop()
			}
		},
		methods: {
			//默认值转换为数组
			toArr(str){
				var _arr = [];
				var arr = str.split(",");
				arr.forEach(item => {
					if(item){
						var urlArr = item.split('/');
						var fileName = urlArr[urlArr.length - 1]
						_arr.push({
							name: fileName,
							url: item
						})
					}
				})
				return _arr;
			},
			//数组转换为原始值
			toStr(arr){
				return arr.map(v => v.url).join(",")
			},
			//格式化数组值
			formatArr(arr){
				var _arr = []
				arr.forEach(item => {
					if(item){
						_arr.push({
							name: item.name,
							url: item.url
						})
					}
				})
				return _arr
			},
			//拖拽
			rowDrop(){
				const _this = this
				const itemBox = this.$refs.uploader.$el.querySelector('.el-upload-list')
				Sortable.create(itemBox, {
					handle: ".el-upload-list__item",
					animation: 200,
					ghostClass: "ghost",
					onEnd({ newIndex, oldIndex }) {
						const tableData = _this.defaultFileList
						const currRow = tableData.splice(oldIndex, 1)[0]
						tableData.splice(newIndex, 0, currRow)
					}
				})
			},
			before(file){
				if(!['image/jpeg','image/png','image/gif'].includes(file.type)){
					this.$message.warning(`选择的文件类型 ${file.type} 非图像类文件`);
					return false;
				}
				const maxSize = file.size / 1024 / 1024 < this.maxSize;
				if (!maxSize) {
					this.$message.warning(`上传文件大小不能超过 ${this.maxSize}MB!`);
					return false;
				}
			},
			success(res, file){
				var os = this.onSuccess(res, file)
				if(os!=undefined && os==false){
					return false
				}
				var response = config.parseData(res)
				file.name = response.fileName
				file.url = response.src
			},
			error(err){
				this.$notify.error({
					title: '上传文件未成功',
					message: err
				})
			},
			beforeRemove(uploadFile){
				return this.$confirm(`是否移除 ${uploadFile.name} ?`, '提示', {
					type: 'warning',
				}).then(() => {
					return true
				}).catch(() => {
					return false
				})
			},
			handleRemove(file){
				this.$refs.uploader.handleRemove(file)
				//this.defaultFileList.splice(this.defaultFileList.findIndex(item => item.uid===file.uid), 1)
			},
			handleExceed(){
				this.$message.warning(`当前设置最多上传 ${this.limit} 个文件，请移除后上传!`)
			},
			handlePreview(uploadFile){
				window.open(uploadFile.url)
			},
			request(param){
				var apiObj = config.apiObj;
				if(this.apiObj){
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
					if(response.code == config.successCode){
						param.onSuccess(res)
					}else{
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
	.el-form-item.is-error .sc-upload-multiple:deep(.el-upload--picture-card) {border-color: var(--el-color-danger);}
	:deep(.el-upload-list__item) {transition:none;border-radius: 0;}
	.sc-upload-multiple:deep(.el-upload-list__item.el-list-leave-active) {position: static!important;}
	.sc-upload-multiple:deep(.el-upload--picture-card) {border-radius: 0;}
	.sc-upload-list-item {width: 100%;height: 100%;position: relative;}
	.sc-upload-multiple .el-image {display: block;}
	.sc-upload-multiple .el-image:deep(img) {-webkit-user-drag: none;}
	.sc-upload-multiple-image-slot {display: flex;justify-content: center;align-items: center;width: 100%;height: 100%;font-size: 12px;}
	.sc-upload-multiple .el-upload-list__item:hover .sc-upload__item-actions{display: block;}
	.sc-upload__item-actions {position: absolute;top:0;right: 0;display: none;}
	.sc-upload__item-actions span {display: flex;justify-content: center;align-items: center;;width: 25px;height:25px;cursor: pointer;color: #fff;}
	.sc-upload__item-actions span i {font-size: 12px;}
	.sc-upload__item-actions .del {background: #F56C6C;}
	.sc-upload__item-progress {position: absolute;width: 100%;height: 100%;top: 0;left: 0;background-color: var(--el-overlay-color-lighter);}
</style>
