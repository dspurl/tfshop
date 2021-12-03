<!--
 * @Descripttion: 图像剪裁组件演示文件
 * @version: 1.0
 * @Author: sakuya
 * @Date: 2021年7月24日20:58:51
 * @LastEditors:
 * @LastEditTime:
-->

<template>
	<el-main>
		<el-row :gutter="15">
			<el-col :lg="14">
				<el-card shadow="never">
					<sc-cropper :src="cropperImg" :compress="compress" :aspectRatio="aspectRatio" ref="cropper"></sc-cropper>
				</el-card>
				<el-card shadow="never" header="参数和方法">
					<el-form label-width="100px">
						<el-form-item label="aspectRatio">
						    <el-select v-model="aspectRatio" placeholder="请选择">
								<el-option label="自由" :value="0"></el-option>
								<el-option label="1:1" :value="1/1"></el-option>
								<el-option label="4:3" :value="4/3"></el-option>
								<el-option label="16:9" :value="16/9"></el-option>
							</el-select>
							<div class="el-form-item-msg">固定选区或者不固定</div>
						</el-form-item>
						<el-form-item label="compress">
						    <el-select v-model="compress" placeholder="请选择">
								<el-option label="0.1" :value="0.1"></el-option>
								<el-option label="0.5" :value="0.5"></el-option>
								<el-option label="1" :value="1"></el-option>
							</el-select>
							<div class="el-form-item-msg">图像压缩率，值为：0.1-1</div>
						</el-form-item>
					</el-form>
					<el-button type="primary" plain @click="getBase64">Base64</el-button>
					<el-button type="primary" plain @click="getBlob">Blob</el-button>
					<el-button type="primary" plain @click="getFile">File</el-button>
				</el-card>
				<el-card shadow="never" header="方法结果">
					<img :src="imgData" />
				</el-card>
			</el-col>
			<el-col :lg="10">
				<el-card shadow="never" header="已内置剪裁的上传组件">
					<el-alert title="设置cropper就可以开启上传前剪裁, 并已封装compress和aspectRatio, 打开F12查看网络请求" type="success" style="margin-bottom:20px;"></el-alert>
					<sc-upload v-model="uploadImg" title="开启剪裁" :cropper="true" :compress="1" :aspectRatio="1/1"></sc-upload>
				</el-card>
			</el-col>
		</el-row>
	</el-main>


</template>

<script>
	import scCropper from '@/components/scCropper'

	export default {
		name: 'cropper',
		components: {
			scCropper
		},
		data() {
			return {
				cropperImg: 'img/avatar.jpg',
				compress: 0.5,
				aspectRatio: 0,
				uploadImg: '',
				imgData: ''
			}
		},
		methods: {
			getBase64(){
				this.$refs.cropper.getCropData(data=>{
					this.imgData = data
				})
			},
			getBlob(){
				this.$refs.cropper.getCropBlob(blob=>{
					this.imgData = URL.createObjectURL(blob)
				})
			},
			getFile(){
				this.$refs.cropper.getCropFile(file=>{
					let aTag = document.createElement('a')
					aTag.download = file.name;
					aTag.href = URL.createObjectURL(file)
					aTag.click()
				}, 'fileName.jpg', 'image/jpeg')
			}
		}
	}
</script>

<style>
</style>
