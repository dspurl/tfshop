<template>
	<el-main>

		<el-card shadow="never" header="基础示例">
			<sc-upload v-model="imgurl"></sc-upload>
			<sc-upload v-model="imgurl2" title="自定义标题" icon="el-icon-picture"></sc-upload>
			<sc-upload v-model="imgurl3" :apiObj="uploadApi" accept=".xls,.xlsx" :on-success="success" :width="220">
				<div class="custom-empty">
					<el-icon><el-icon-upload /></el-icon>
					<p>自定义插槽</p>
				</div>
			</sc-upload>
			<sc-upload v-model="imgurl4" title="开启剪裁" :cropper="true" :compress="1" :aspectRatio="1/1"></sc-upload>
		</el-card>

		<el-card shadow="never" header="在验证表单中使用">
			<el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="身份证" class="imglist" required>
					<el-col>
						<el-form-item prop="img1">
							<sc-upload v-model="form.img1" title="人像面"></sc-upload>
						</el-form-item>
					</el-col>
					<el-col>
						<el-form-item prop="img2">
							<sc-upload v-model="form.img2" title="国徽面"></sc-upload>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item label="其他凭证" prop="img3">
					<sc-upload-multiple v-model="form.img3"></sc-upload-multiple>
				</el-form-item>
				<el-form-item label="日期" prop="date">
					<el-date-picker type="date" placeholder="选择日期" v-model="form.date"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm">保存</el-button>
				    <el-button @click="resetForm">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>

	</el-main>
</template>

<script>
	export default {
		name: 'upload',
		data() {
			return {
				uploadApi: this.$API.common.upload,
				imgurl: "img/avatar.jpg",
				imgurl2: "",
				imgurl3: "",
				imgurl4: "",
				form: {
					img1: "",
					img2: "",
					img3: "",
					date: ""
				},
				rules: {
					img1: [
						{required: true, message: '请上传', trigger: 'change'}
					],
					img2: [
						{required: true, message: '请上传', trigger: 'change'}
					],
					img3: [
						{required: true, message: '请上传', trigger: 'change'}
					],
					date: [
						{required: true, message: '请选择日期', trigger: 'change'}
					]
				}
			}
		},
		methods: {
			success(response){
				this.$alert(`success函数钩子，return false后阻止后续执行，回调参数打开控制台查看`, {
					title: "提示",
					type: "success"
				})
				console.log(response);
				return false;
			},
			submitForm(){
				this.$refs.ruleForm.validate((valid) => {
					if (valid) {
						alert('请看控制台输出');
						console.log(this.form);
					}else{
						return false;
					}
				})
			},
			resetForm(){
				this.$refs.ruleForm.resetFields();
			}
		}
	}
</script>

<style scoped>
	.el-card+.el-card {margin-top: 15px;}

	.imglist {margin-bottom:0;}
	.imglist .el-col+.el-col {margin-left: 10px;}
	.custom-empty {width: 100%;height: 100%;line-height: 1;display: flex;flex-direction: column;align-items: center;justify-content: center;}
	.custom-empty i {font-size: 30px;color: #8c939d;}
	.custom-empty p {font-size: 12px;font-weight: normal;color: #8c939d;margin-top: 10px;}
</style>
