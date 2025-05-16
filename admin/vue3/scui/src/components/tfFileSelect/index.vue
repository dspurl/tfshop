<!--
 * @Descripttion: 资源文件选择器
 * @version: 1.0
 * @Author: dspurl
 * @Date: 2024年12月04日16:01:40
-->
<template>
	<div>
		<ul ref="imageList" class="el-upload-list el-upload-list--picture-card">
			<li v-if="!multiple && value" class="el-upload-list__item is-success"
				:style="{ width: width, height: height }">
				<template v-if="_isImg(value)">
					<el-image preview-teleported class="image" :src="value">
						<template #placeholder>
							<div class="sc-upload__img-slot">Loading...</div>
						</template>
					</el-image>
					<span class="el-upload-list__item-actions">
						<span>
							<el-icon @click="handleImage(0)"><el-icon-ZoomIn /></el-icon>
						</span>
						<span>
							<el-icon @click="handleRemove(0)"><el-icon-delete /></el-icon>
						</span>
					</span>
				</template>
				<template v-else>
					<tf-video v-if="_isVideo(value)" :sources="{ src: value }"></tf-video>
					<el-image v-else-if="_isWord(value)" :src="require('@/assets/file/WORD.png')" fit="scale-down"
						lazy></el-image>
					<el-image v-else-if="_isPdf(value)" :src="require('@/assets/file/PDF.png')" fit="scale-down"
						lazy></el-image>
					<el-image v-else-if="_isExcl(value)" :src="require('@/assets/file/ECEL.png')" fit="scale-down"
						lazy></el-image>
					<el-image v-else-if="_isTxt(value)" :src="require('@/assets/file/TXT.png')" fit="scale-down"
						lazy></el-image>
					<el-image v-else-if="_getPackage(value)" :src="require('@/assets/file/ZIP.png')" fit="scale-down"
						lazy></el-image>
					<div v-else class="item-file item-file-doc">
						<i v-if="files[_getExt(value)]" :class="files[_getExt(value)].icon" :style="{
							color: files[_getExt(value)].color,
						}"></i>
						<i v-else class="sc-icon-file-list-fill" style="color: #999"></i>
					</div>
					<div class="remove" @click="handleRemove(0)">
						<el-icon>
							<el-icon-close color="#ffffff" />
						</el-icon>
					</div>
				</template>
			</li>
			<li v-else-if="value" v-for="(item, index) in value" :key="item" class="el-upload-list__item is-success"
				:style="{ width: width, height: height }">
				<el-image class="image" :src="item">
					<template #placeholder>
						<div class="sc-upload__img-slot">Loading...</div>
					</template>
				</el-image>
				<span class="el-upload-list__item-actions">
					<span>
						<el-icon @click="handleImage(index)"><el-icon-ZoomIn /></el-icon>
					</span>
					<span>
						<el-icon @click="handleRemove(index)"><el-icon-delete /></el-icon>
					</span>
				</span>
			</li>
			<div @click="handleDialog()"
				v-if="(!multiple && !value) || multiple && (value ? (value.length < limit) : true)"
				:style="{ width: width, height: height }" class="el-upload el-upload--picture-card">
				<el-icon>
					<el-icon-plus />
				</el-icon>
			</div>
		</ul>
		<el-image-viewer teleported v-if="show" :urlList="multiple ? value : [value]" :initialIndex="valueIndex"
			@close="show = false" />
		<sc-dialog v-model="visible" :width="900" :append-to-body="true" destroy-on-close>
			<div class="adminui-main">
				<sc-file-select v-model="value" :isSelect="true" :uuid="uuid" :limit="limit" :multiple="multiple"
					:maxSize="maxSize" @submit="handleSubmit"></sc-file-select>
			</div>
		</sc-dialog>
	</div>
</template>

<script>
import scFileSelect from "@/components/scFileSelect";
import config from "@/config/fileSelect";
import Sortable from 'sortablejs'
export default {
	components: {
		scFileSelect,
	},
	props: {
		modelValue: null,
		uuid: { type: String, default: "" },
		height: { type: String, default: "75px" },
		width: { type: String, default: "75px" },
		multiple: { type: Boolean, default: false },
		draggable: { type: Boolean, default: false },
		maxSize: { type: Number, default: config.maxSize },
		limit: { type: Number, default: config.limit },
	},
	data() {
		return {
			visible: false,
			show: false,
			value: null,
			valueIndex: 0,
			files: config.files,
		};
	},
	watch: {
		modelValue: {
			handler() {
				this.value = this.modelValue;
			},
			deep: true,
		},
	},
	mounted() {
		// 如果传过来的是undefined，则设置空
		this.value = this.modelValue ? this.modelValue : "";
		if (this.draggable) {
			this.rowDrop()
		}
	},
	methods: {
		//内置函数
		_isImg(fileUrl) {
			const ext = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."));
			return ext.indexOf(fileExt) != -1;
		},
		_isPdf(fileUrl) {
			const ext = [".pdf"];
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."));
			return ext.indexOf(fileExt) != -1;
		},
		_isVideo(fileUrl) {
			const ext = [".mp4", ".rmvb", ".mkv", ".avi"];
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."));
			return ext.indexOf(fileExt) != -1;
		},
		_isWord(fileUrl) {
			const ext = [".doc", ".docx"];
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."));
			return ext.indexOf(fileExt) != -1;
		},
		_isExcl(fileUrl) {
			const ext = [".xls", ".xlsx", ".csv"];
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."));
			return ext.indexOf(fileExt) != -1;
		},
		_isTxt(fileUrl) {
			const ext = [".txt"];
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."));
			return ext.indexOf(fileExt) != -1;
		},
		_getExt(fileUrl) {
			return fileUrl.substring(fileUrl.lastIndexOf(".") + 1);
		},
		_getPackage(fileUrl) {
			const ext = [".zip", ".tar.gz", ".7z"];
			const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."));
			return ext.indexOf(fileExt) != -1;
		},
		//拖拽
		rowDrop() {
			const _this = this
			const el = this.$refs.imageList;
			if (el) {
				Sortable.create(el, {
					handle: ".el-upload-list__item",
					animation: 200,
					ghostClass: "ghost",
					onEnd: ({ newIndex, oldIndex }) => {
						const tableData = _this.value
						const currRow = tableData.splice(oldIndex, 1)[0]
						tableData.splice(newIndex, 0, currRow)
					}
				})
			}

		},
		handleSubmit(row) {
			this.$emit("update:modelValue", row);
			this.visible = false;
		},
		handleImage(index) {
			if (this.multiple) {
				this.valueIndex = index;
			}
			this.show = true;
		},
		handleRemove(index) {
			if (this.multiple) {
				this.value.splice(index, 1);
			} else {
				this.value = "";
			}
			this.$emit("update:modelValue", this.value);
		},
		handleDialog() {
			this.visible = true;
		},
	},
};
</script>

<style scoped lang="scss">
.remove {
	position: absolute;
	right: 0;
	top: 0;
	z-index: 10;
	background-color: #000000;
	width: 30px;
	height: 30px;
	text-align: center;
	border-bottom-left-radius: 5px;
	cursor: pointer;
}
</style>
