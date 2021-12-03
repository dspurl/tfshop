<template>
	<el-main>
		<el-card shadow="never">
			<el-tabs tab-position="top">

				<el-tab-pane label="系统设置">
					<el-form ref="form" :model="sys" label-width="100px" style="margin-top: 20px;">
						<el-form-item label="系统名称">
							<el-input v-model="sys.name"></el-input>
						</el-form-item>
						<el-form-item label="LogoUrl">
							<el-input v-model="sys.logoUrl"></el-input>
						</el-form-item>
						<el-form-item label="登录开关">
							<el-switch v-model="sys.login"></el-switch>
							<div class="el-form-item-msg" data-v-b33b3cf8="">关闭后普通用户无法登录，仅允许管理员角色登录</div>
						</el-form-item>
						<el-form-item label="密码验证规则">
							<el-input v-model="sys.passwordRules"></el-input>
						</el-form-item>
						<el-form-item label="版权信息">
							<el-input type="textarea" :autosize="{minRows: 4}" v-model="sys.copyright"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary">保存</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>

				<el-tab-pane label="短信配置">
					<el-form ref="form" :model="msg" label-width="100px" style="margin-top: 20px;">
						<el-form-item label="短信开关">
							<el-switch v-model="msg.open"></el-switch>
							<div class="el-form-item-msg" data-v-b33b3cf8="">关闭后用户无法收到短信，但日志中将记录</div>
						</el-form-item>
						<el-form-item label="appKey">
							<el-input v-model="msg.appKey"></el-input>
						</el-form-item>
						<el-form-item label="secretKey">
							<el-input v-model="msg.secretKey"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary">保存</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>

				<el-tab-pane label="扩展配置">
					<el-alert title="扩展配置为系统业务所有的配置，应该由系统管理员操作，如需用户配置应另起业务配置页面。" type="warning" style="margin-bottom: 15px;"></el-alert>

					<el-table :data="setting" stripe>
						<el-table-column label="#" type="index" width="50"></el-table-column>
						<el-table-column label="KEY" prop="key" width="150">
							<template #default="scope">
								<el-input v-if="scope.row.isSet" v-model="scope.row.key" placeholder="请输入内容"></el-input>
								<span v-else>{{scope.row.key}}</span>
							</template>
						</el-table-column>
						<el-table-column label="VALUE" prop="value" width="350">
							<template #default="scope">
								<template v-if="scope.row.isSet">
									<el-switch v-if="typeof scope.row.value==='boolean'" v-model="scope.row.value"></el-switch>
									<el-input v-else v-model="scope.row.value" placeholder="请输入内容"></el-input>
								</template>
								<span v-else>{{scope.row.value}}</span>
							</template>
						</el-table-column>
						<el-table-column label="CATEGORY" prop="category" width="150">
							<template #default="scope">
								<el-input v-if="scope.row.isSet" v-model="scope.row.category" placeholder="请输入内容"></el-input>
								<span v-else>{{scope.row.category}}</span>
							</template>
						</el-table-column>
						<el-table-column label="TITLE" prop="title" width="350">
							<template #default="scope">
								<el-input v-if="scope.row.isSet" v-model="scope.row.title" placeholder="请输入内容"></el-input>
								<span v-else>{{scope.row.title}}</span>
							</template>
						</el-table-column>
						<el-table-column min-width="1"></el-table-column>
						<el-table-column label="操作" fixed="right" width="100">
							<template #default="scope">
								<el-button @click="table_edit(scope.row, scope.$index)" type="text" size="small">{{scope.row.isSet?'保存':"修改"}}</el-button>
								<el-button v-if="scope.row.isSet" @click="scope.row.isSet=false" type="text" size="small">取消</el-button>
								<el-popconfirm v-if="!scope.row.isSet" title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
									<template #reference>
										<el-button type="text" size="small">删除</el-button>
									</template>
								</el-popconfirm>
							</template>
						</el-table-column>
					</el-table>
					<el-button type="primary" icon="el-icon-plus" @click="table_add" style="margin-top: 20px;"></el-button>
				</el-tab-pane>

			</el-tabs>
		</el-card>
	</el-main>
</template>

<script>
	export default {
		name: 'system',
		data() {
			return {
				sys: {
					name: "SCUI",
					logoUrl: "",
					login: true,
					passwordRules: "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$",
					copyright: "@SCUI"
				},
				msg: {
					open: true,
					appKey: "",
					secretKey: ""
				},
				setting: [
					{
						key: "file_serve",
						value: "https://file.scui.com",
						category: "url",
						title: "文件服务器地址"
					},
					{
						key: "cloud_url",
						value: "-",
						category: "url",
						title: "客户端地址"
					},
					{
						key: "crm_url",
						value: "-",
						category: "url",
						title: "CRM地址"
					},
					{
						key: "autoSwitch",
						value: true,
						category: "user",
						title: "自动判断boolean类型"
					}
				]
			}
		},
		methods: {
			table_add(){
				var newRow = {
					key: "",
					value: "",
					title: "",
					isSet: true
				}
				this.setting.push(newRow)
			},
			table_edit(row){
				if(row.isSet){
					row.isSet = false
				}else{
					row.isSet = true
				}
			},
			table_del(row, index){
				this.setting.splice(index, 1)
			},
		}
	}
</script>

<style>
</style>
