<!--
 * @Descripttion: 此文件由SCUI生成，典型的VUE增删改列表页面组件
 * @version: 1.0
 * @Author: SCUI AutoCode 模板版本 1.0.0-beta.1
 * @Date: <%= createDate %>
 * @LastEditors: (最后更新作者)
 * @LastEditTime: (最后更新时间)
-->

<template>
	<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="left">
		<% column.forEach(function(item, index){ %>
		<el-form-item label="<%= item.label %>" prop="<%= item.prop %>">
			<el-input v-model="form.<%= item.prop %>" clearable></el-input>
		</el-form-item>
		<% })%>
	</el-form>
</template>

<script>
	export default {
		props: {
			mode: { type: String, default: "add" }
		},
		data() {
			return {
				//表单数据
				form: {
					<%= base.rowKey %>:"",
					<% column.forEach(function(item, index){ %>
					<%= item.prop %>: "",
					<% })%>
				},
				//验证规则
				rules: {
					<% column.forEach(function(item, index){ %>
					<%= item.prop %>: [
						{required: true, message: '请输入<%= item.label %>'}
					],
					<% })%>
				},
			}
		},
		mounted(){

		},
		methods: {
			//表单提交方法
			submit(callback){
				this.$refs.dialogForm.validate((valid) => {
					if (valid) {
						callback(this.form)
					}else{
						return false;
					}
				})
			},
			//表单注入数据
			setData(data){
				this.form.<%= base.rowKey %> = data.<%= base.rowKey %>
				<% column.forEach(function(item, index){ %>
				this.form.<%= item.prop %> = data.<%= item.prop %>
				<% })%>
				//可以和上面一样单个注入，也可以像下面一样直接合并进去
				//Object.assign(this.form, data)
			}
		}
	}
</script>

<style>
</style>
