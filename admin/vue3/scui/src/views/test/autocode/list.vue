<template>
	<el-container>
		<el-main>
			<el-card shadow="never">
				<el-tabs tab-position="top" >
				    <el-tab-pane label="列配置">
						<sc-form-table v-model="column" :addTemplate="addTemplate" placeholder="请添加列数据">
							<el-table-column prop="label" label="显示名称" width="180">
								<template #default="scope">
									<el-input v-model="scope.row.label" placeholder="请输入内容"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="prop" label="字段名" width="180">
								<template #default="scope">
									<el-input v-model="scope.row.prop" placeholder="请输入内容"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="width" label="宽度" width="180">
								<template #default="scope">
									<el-input v-model="scope.row.width" placeholder="请输入内容"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="isEdit" label="加入编辑" width="80" align="center">
								<template #default="scope">
									<el-checkbox v-model="scope.row.isEdit"></el-checkbox>
								</template>
							</el-table-column>
							<el-table-column prop="isSearch" label="加入搜索" width="80" align="center">
								<template #default="scope">
									<el-checkbox v-model="scope.row.isSearch"></el-checkbox>
								</template>
							</el-table-column>
						</sc-form-table>
					</el-tab-pane>
				    <el-tab-pane label="基础配置">
						<el-row>
							<el-col :xl="12" :lg="8">
								<el-form :model="base" label-width="80px">
									<el-form-item label="name">
										<el-input v-model="base.name"></el-input>
										<div class="el-form-item-msg">系统唯一且与路由别名一致，否则导致缓存失效。</div>
									</el-form-item>
									<el-form-item label="rowKey">
										<el-input v-model="base.rowKey"></el-input>
										<div class="el-form-item-msg">表格唯一标识，编辑保存和删除将传递rowKey</div>
									</el-form-item>
								</el-form>
							</el-col>
						</el-row>
					</el-tab-pane>
				    <el-tab-pane label="API路径配置">
						<el-alert title="$API 映射文件: @/api/index.js 统一接口管理器, 所以需提前配置好API对象." type="warning" style="margin:0 0 20px 0;"></el-alert>
						<el-row>
							<el-col :xl="12" :lg="8">
								<el-form :model="api" label-width="80px">
									<el-form-item label="获取列表">
										<el-input v-model="api.list">
											<template #prepend>$API.</template>
										</el-input>
									</el-form-item>
									<el-form-item label="新增">
										<el-input v-model="api.add">
											<template #prepend>$API.</template>
										</el-input>
									</el-form-item>
									<el-form-item label="保存">
										<el-input v-model="api.save">
											<template #prepend>$API.</template>
										</el-input>
									</el-form-item>
									<el-form-item label="查询详细">
										<el-input v-model="api.show">
											<template #prepend>$API.</template>
										</el-input>
									</el-form-item>
									<el-form-item label="删除">
										<el-input v-model="api.del">
											<template #prepend>$API.</template>
										</el-input>
									</el-form-item>
								</el-form>
							</el-col>
						</el-row>
					</el-tab-pane>
				</el-tabs>
			</el-card>
			<pre style="margin-top: 50px;display: none;">{{ code }}</pre>
		</el-main>
		<el-footer>
			<el-dropdown style="margin-right: 15px;">
				<el-button type="primary" icon="el-icon-download" :loading="downloadcodeLoading">下载VUE文件</el-button>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click="downloadListCode">下载 index.vue</el-dropdown-item>
						<el-dropdown-item @click="downloadSaveCode">下载 save.vue</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
			<el-dropdown>
				<el-button type="primary" plain icon="el-icon-top-right" :loading="showcodeLoading">预览代码</el-button>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click="showListCode">预览 index.vue</el-dropdown-item>
						<el-dropdown-item @click="showSaveCode">预览 save.vue</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</el-footer>
	</el-container>


	<el-dialog title="代码预览" v-model="codeVisible" width="60%" append-to-body destroy-on-close>
		<el-alert title="需将VUE文件放置views文件夹,路由匹配组件的路径下,如文件名为index.vue可不需要写文件名" type="success" show-icon style="margin-bottom: 20px;"></el-alert>
		<pre contenteditable class="code">{{ code }}</pre>
		<template #footer>
			<el-button type="primary" @click="codeVisible = false">确 定</el-button>
		</template>
	</el-dialog>

</template>

<script>
	import template from '@/utils/template.js'

	export default {
		name: 'autocode-list',
		data() {
			return {
				codeVisible: false,
				showcodeLoading: false,
				downloadcodeLoading: false,
				code: '',
				base: {
					name: "",
					rowKey: "id"
				},
				api: {
					list: '',
					add: '',
					save: '',
					show: '',
					del: ''
				},
				column: [],
				addTemplate: {
					label: "",
					prop: "",
					width: "100",
					isSearch: false,
					isEdit: false
				}
			}
		},
		mounted(){

		},
		methods: {
			//列表预览
			async showListCode(){
				this.showcodeLoading = true;
				await this.getListTpl()
				this.showcodeLoading = false;
				this.codeVisible=true;
			},
			//获取列表模板文件
			async getListTpl(){
				var data = {
					createDate:new Date().toLocaleString(),
					base: this.base,
					column: this.column,
					api: this.api
				}
				var tpl = await this.$HTTP.get('code/list/index.vue')
				this.code = template(tpl, data)
			},
			//详细预览
			async showSaveCode(){
				this.showcodeLoading = true;
				await this.getSaveTpl()
				this.showcodeLoading = false;
				this.codeVisible=true;
			},
			//获取详细模板文件
			async getSaveTpl(){
				var data = {
					createDate:new Date().toLocaleString(),
					base: this.base,
					column: this.column.filter(item => item.isEdit===true),
					api: this.api
				}
				var tpl = await this.$HTTP.get('code/list/save.vue')
				this.code = template(tpl, data)
			},
			async downloadListCode(){
				this.downloadcodeLoading = true;
				await this.getListTpl()
				this.downloadcodeLoading = false;
				this.createFile(this.code, 'index.vue')
			},
			async downloadSaveCode(){
				this.downloadcodeLoading = true;
				await this.getSaveTpl()
				this.downloadcodeLoading = false;
				this.createFile(this.code, 'save.vue')
			},
			//创建文件并下载
			createFile(row, name){
				const element = document.createElement('a')
				element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(row))
				element.setAttribute('download', name)
				element.style.display = 'none'
				element.click()
			}
		}
	}
</script>

<style scoped>
	.code {height:400px;overflow: auto;background: #333;color: #999;padding:20px;font-size: 14px;font-family: "consolas";line-height: 1.5;}
</style>
